require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/database');
const User = require('./src/models/User');
const OTP = require('./src/models/OTP');
const authService = require('./src/services/authService');

const testAuthPipeline = async () => {
  console.log('=== STARTING 12-POINT E2E AUTHENTICATION TEST SUITE ===\n');

  if (db.initializeDatabase) {
    try {
      await db.initializeDatabase();
    } catch (err) {
      console.log('Database init fallback to memory store');
    }
  }

  const testEmail = `authtest_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testFullName = 'Integration Test User';

  let testPassed = 0;
  let testFailed = 0;

  const assert = (condition, title, details = '') => {
    if (condition) {
      console.log(`[PASS] ${title}`);
      testPassed++;
    } else {
      console.error(`[FAIL] ${title} - ${details}`);
      testFailed++;
    }
  };

  try {
    // 1. Signup New Trainee Account
    console.log('--- 1. Testing Signup New Trainee ---');
    const signupRes = await authService.signup({
      full_name: testFullName,
      email: testEmail,
      password: testPassword,
      role: 'trainee',
    });
    assert(
      signupRes.requiresEmailVerification === true && signupRes.email === testEmail,
      'Signup creates unverified user and returns requiresEmailVerification: true'
    );

    const userInDb = await User.findByEmail(testEmail);
    assert(userInDb && userInDb.role === 'trainee' && !userInDb.email_verified, 'User saved in DB with role trainee and unverified state');

    // 2. Login with Non-Existent Account (Strict 404 Rejection)
    console.log('\n--- 2. Testing Login Non-Existent Email (Strict 404 Rejection) ---');
    try {
      await authService.login(`unknown_${Date.now()}@domain.org`, testPassword);
      assert(false, 'Login non-existent email should throw 404 accountNotFound');
    } catch (err) {
      assert(err.statusCode === 404 && err.accountNotFound === true, 'Login non-existent email returns HTTP 404 accountNotFound');
    }

    // 3. Login with Wrong Password
    console.log('\n--- 3. Testing Login Wrong Password ---');
    try {
      await authService.login(testEmail, 'WrongPassword999!');
      assert(false, 'Login with wrong password should fail');
    } catch (err) {
      assert(err.statusCode === 401, 'Login wrong password returns HTTP 401 Invalid credentials');
    }

    // 4. Verify Email with Wrong OTP Code
    console.log('\n--- 4. Testing Invalid OTP Rejection ---');
    try {
      await authService.verifyEmailOTP(testEmail, '000000');
      assert(false, 'Invalid OTP should fail verification');
    } catch (err) {
      assert(err.statusCode === 400, 'Invalid OTP code returns HTTP 400');
    }

    // 5. Test Resend OTP Cooldown (< 30s)
    console.log('\n--- 5. Testing Resend OTP Rate Limit (< 30s) ---');
    try {
      await authService.resendOTP(testEmail);
      assert(false, 'Immediate resend should trigger HTTP 429 cooldown');
    } catch (err) {
      assert(err.statusCode === 429, 'Immediate OTP resend triggers HTTP 429 Cooldown rate limit');
    }

    // 6. Verify Email with Valid OTP Code
    console.log('\n--- 6. Testing Valid OTP Verification ---');
    let validOtpCode = null;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT * FROM email_verification_otps WHERE LOWER(email) = LOWER($1) AND purpose = $2 ORDER BY id DESC LIMIT 1',
        [testEmail, 'email_verification']
      );
      if (res.rows[0]) {
        // Find matching 6-digit code for hashed DB entry
        const inputHashTarget = res.rows[0].otp_hash;
        for (let code = 100000; code <= 999999; code++) {
          const codeStr = String(code);
          if (OTP.hashOTP(codeStr) === inputHashTarget) {
            validOtpCode = codeStr;
            break;
          }
        }
      }
    } else {
      const record = (db.memoryStore.otps || []).find(o => o.email === testEmail.toLowerCase() && o.purpose === 'email_verification');
      if (record) validOtpCode = record.otp_code;
    }

    assert(validOtpCode !== null, 'Retrieved valid cryptographic 6-digit OTP code');

    const verifyRes = await authService.verifyEmailOTP(testEmail, validOtpCode);
    assert(verifyRes.token && verifyRes.user?.email_verified === true, 'Valid OTP verifies user email and issues JWT token');

    // 7. Login with Verified Account
    console.log('\n--- 7. Testing Valid Login ---');
    const loginRes = await authService.login(testEmail, testPassword);
    assert(loginRes.token && loginRes.user?.email === testEmail, 'Login with correct credentials succeeds and returns JWT token');

    // 8. Google OAuth Mode Login Non-Existent Account Rejection
    console.log('\n--- 8. Testing Google OAuth Mode Login Rejection for Unknown User ---');
    try {
      const mockPayload = { email: `google_unknown_${Date.now()}@gmail.com`, sub: `google_${Date.now()}`, name: 'Google Unknown' };
      await authService.googleAuth(mockPayload, 'login');
      assert(false, 'Google mode login for unknown user should throw 404 accountNotFound');
    } catch (err) {
      assert(err.statusCode === 404 && err.accountNotFound === true, 'Google mode login for unknown account returns HTTP 404 accountNotFound without creating account');
    }

    // 9. Google OAuth Mode Signup New User
    console.log('\n--- 9. Testing Google OAuth Mode Signup ---');
    const googleSignupEmail = `google_signup_${Date.now()}@gmail.com`;
    const googleSignupRes = await authService.googleAuth(
      { email: googleSignupEmail, sub: `google_${Date.now()}`, name: 'Google New User', picture: 'https://example.com/pic.jpg' },
      'signup'
    );
    assert(googleSignupRes.token && googleSignupRes.user?.role === 'trainee', 'Google mode signup creates user with role trainee and returns token');

    // 10. Forgot Password Request
    console.log('\n--- 10. Testing Forgot Password OTP Generation ---');
    const forgotRes = await authService.forgotPassword(testEmail);
    assert(forgotRes.success === true, 'Forgot password initiates OTP generation');

    // 11. Reset Password with Invalid OTP
    console.log('\n--- 11. Testing Reset Password Invalid OTP ---');
    try {
      await authService.resetPassword(testEmail, '999999', 'NewPassword123!');
      assert(false, 'Reset password with bad OTP should fail');
    } catch (err) {
      assert(err.statusCode === 400, 'Reset password with bad OTP returns HTTP 400');
    }

    // 12. Reset Password with Valid OTP & Login with New Password
    console.log('\n--- 12. Testing Reset Password Success & Login ---');
    let validResetOtp = null;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT * FROM email_verification_otps WHERE LOWER(email) = LOWER($1) AND purpose = $2 ORDER BY id DESC LIMIT 1',
        [testEmail, 'password_reset']
      );
      if (res.rows[0]) {
        const inputHashTarget = res.rows[0].otp_hash;
        for (let code = 100000; code <= 999999; code++) {
          const codeStr = String(code);
          if (OTP.hashOTP(codeStr) === inputHashTarget) {
            validResetOtp = codeStr;
            break;
          }
        }
      }
    } else {
      const record = (db.memoryStore.otps || []).find(o => o.email === testEmail.toLowerCase() && o.purpose === 'password_reset');
      if (record) validResetOtp = record.otp_code;
    }

    assert(validResetOtp !== null, 'Found valid reset OTP code');

    const resetRes = await authService.resetPassword(testEmail, validResetOtp, 'NewPassword123!');
    assert(resetRes.success === true, 'Reset password succeeds with valid OTP');

    const newPasswordLoginRes = await authService.login(testEmail, 'NewPassword123!');
    assert(newPasswordLoginRes.token !== undefined, 'Login succeeds using newly set password');

    console.log('\n==================================================');
    console.log(`E2E AUTHENTICATION SUITE COMPLETED: ${testPassed} PASSED, ${testFailed} FAILED`);
    console.log('==================================================');
  } catch (error) {
    console.error('Fatal test error:', error);
  } finally {
    process.exit(testFailed === 0 ? 0 : 1);
  }
};

testAuthPipeline();
