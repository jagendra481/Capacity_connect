const authService = require('./src/services/authService');
const User = require('./src/models/User');
const db = require('./src/config/database');

async function runTests() {
  await db.connectDb();
  console.log('=== STARTING AUTHENTICATION & SECURITY AUDIT TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // --- TEST 1: Public Admin Signup Security (HTTP 403) ---
  console.log('--- Test 1: Public Admin Signup Protection ---');
  try {
    await authService.register({
      email: 'hacker_admin@test.com',
      password: 'Password123!',
      full_name: 'Fake Admin',
      selectedRole: 'administrator',
    });
    assert(false, 'Should have blocked public password admin signup');
  } catch (err) {
    assert(err.statusCode === 403, 'Blocked public password admin signup with HTTP 403');
    assert(err.message.includes('Administrator accounts require authorization'), 'Correct error message for admin signup');
  }

  try {
    await authService.googleAuth({
      email: 'hacker_google_admin@test.com',
      sub: 'google_admin_sub',
      mode: 'signup',
      selectedRole: 'administrator',
    });
    assert(false, 'Should have blocked public Google admin signup');
  } catch (err) {
    assert(err.statusCode === 403, 'Blocked public Google admin signup with HTTP 403');
    assert(err.message.includes('Administrator accounts require authorization'), 'Correct error message for Google admin signup');
  }

  // --- TEST 2: Google Signup -> Google Login Flow (Problem 1) ---
  console.log('\n--- Test 2: Google Signup -> Google Login Flow ---');
  const testGoogleId = `sub_google_${Date.now()}`;
  const testGoogleEmail = `googlesignup_${Date.now()}@gmail.com`;

  try {
    const signupRes = await authService.googleAuth({
      email: testGoogleEmail,
      name: 'Google Learner',
      sub: testGoogleId,
      mode: 'signup',
      selectedRole: 'trainee',
    });
    assert(signupRes.user && signupRes.user.role === 'trainee', 'Google Signup created trainee user');
    assert(signupRes.user.google_id === testGoogleId, 'Google Signup stored google_id correctly');
    assert(signupRes.user.email_verified === true, 'Google Signup marked email as verified');
  } catch (err) {
    assert(false, `Google Signup failed: ${err.message}`);
  }

  try {
    const loginRes = await authService.googleAuth({
      email: testGoogleEmail,
      sub: testGoogleId,
      mode: 'login',
      selectedRole: 'trainee',
    });
    assert(loginRes.user && loginRes.token, 'Future Google Login succeeded with same Google account');
    assert(loginRes.user.email === testGoogleEmail, 'Logged in user email matches');
  } catch (err) {
    assert(false, `Google Login failed: ${err.message}`);
  }

  // --- TEST 3: Google Login with Unknown Account (HTTP 404) ---
  console.log('\n--- Test 3: Google Login with Unknown Account ---');
  try {
    await authService.googleAuth({
      email: `unknown_account_${Date.now()}@gmail.com`,
      sub: `sub_unknown_${Date.now()}`,
      mode: 'login',
      selectedRole: 'trainee',
    });
    assert(false, 'Should not allow login for non-existent Google account');
  } catch (err) {
    assert(err.statusCode === 404, 'Returned HTTP 404 for unknown Google login');
    assert(err.accountNotFound === true, 'Set accountNotFound flag');
    assert(err.message.includes('No Capacity Connect account was found'), 'Correct account not found message');
  }

  // --- TEST 4: Google Signup with Existing Account (HTTP 400) ---
  console.log('\n--- Test 4: Google Signup with Existing Account ---');
  try {
    await authService.googleAuth({
      email: testGoogleEmail,
      sub: testGoogleId,
      mode: 'signup',
      selectedRole: 'trainee',
    });
    assert(false, 'Should block duplicate signup for existing Google account');
  } catch (err) {
    assert(err.statusCode === 400, 'Returned HTTP 400 for existing Google signup');
    assert(err.accountExists === true, 'Set accountExists flag');
    assert(err.message.includes('An account already exists'), 'Correct account exists message');
  }

  // --- TEST 5: Mandatory Role Mismatch Protection (Problem 2) ---
  console.log('\n--- Test 5: Role Mismatch Protection ---');
  try {
    await authService.googleAuth({
      email: testGoogleEmail,
      sub: testGoogleId,
      mode: 'login',
      selectedRole: 'trainer', // Actual role is trainee!
    });
    assert(false, 'Should block Google login when selectedRole mismatch');
  } catch (err) {
    assert(err.statusCode === 400, 'Blocked Google login role mismatch with HTTP 400');
    assert(err.roleMismatch === true, 'Set roleMismatch flag');
    assert(err.message.includes('This account is registered as Trainee'), 'Correct role mismatch message (Trainee)');
  }

  try {
    await authService.login({
      email: 'trainee@capacityconnect.com',
      password: 'Password123!',
      selectedRole: 'trainer', // Actual role is trainee!
    });
    assert(false, 'Should block password login when selectedRole mismatch');
  } catch (err) {
    assert(err.statusCode === 400, 'Blocked password login role mismatch with HTTP 400');
    assert(err.message.includes('This account is registered as Trainee'), 'Correct password login mismatch message');
  }

  // --- TEST 6: Existing Email User Google Linking ---
  console.log('\n--- Test 6: Existing Email/Password User Google Linking ---');
  const legacyEmail = `legacy_trainer_${Date.now()}@capacityconnect.com`;
  const legacyGoogleSub = `sub_legacy_${Date.now()}`;

  try {
    // 1. Create email/password trainer user directly
    const createdUser = await User.create({
      email: legacyEmail,
      password_hash: 'hashed',
      role: 'trainer',
      full_name: 'Legacy Trainer',
      email_verified: true,
    });
    assert(createdUser.google_id === null, 'Initial user has no google_id');

    // 2. Perform Google Login with same email
    const linkedLoginRes = await authService.googleAuth({
      email: legacyEmail,
      sub: legacyGoogleSub,
      mode: 'login',
      selectedRole: 'trainer',
    });
    assert(linkedLoginRes.user.google_id === legacyGoogleSub, 'Google Login linked google_id to existing account');

    // 3. Perform subsequent Google Login by google_id
    const subsequentLogin = await authService.googleAuth({
      email: legacyEmail,
      sub: legacyGoogleSub,
      mode: 'login',
      selectedRole: 'trainer',
    });
    assert(subsequentLogin.user.id === createdUser.id, 'Subsequent login by google_id returned same user');
  } catch (err) {
    assert(false, `Email linking test failed: ${err.message}`);
  }

  // --- TEST 7: Admin Account Login Enforcement ---
  console.log('\n--- Test 7: Admin Account Role Matching ---');
  try {
    await authService.login({
      email: 'admin@capacityconnect.com',
      password: 'Password123!',
      selectedRole: 'trainee', // Actual role is administrator
    });
    assert(false, 'Should block admin from logging in as trainee');
  } catch (err) {
    assert(err.statusCode === 400, 'Blocked admin login as trainee with HTTP 400');
    assert(err.message.includes('This account is registered as Administrator'), 'Correct admin role mismatch message');
  }

  try {
    const adminLogin = await authService.login({
      email: 'admin@capacityconnect.com',
      password: 'Password123!',
      selectedRole: 'administrator',
    });
    assert(adminLogin.user && adminLogin.user.role === 'administrator', 'Admin login succeeded when administrator selected');
  } catch (err) {
    assert(false, `Admin login failed: ${err.message}`);
  }

  console.log(`\n=== AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
