const db = require('./src/config/database');
const emailService = require('./src/services/emailService');
const User = require('./src/models/User');

async function testSmtpAndDb() {
  console.log('--- Testing DB Connection ---');
  await db.connectDb();
  console.log('isPgConnected:', db.getIsPgConnected());

  console.log('\n--- Testing User Persistence in DB ---');
  const testUser = await User.create({
    email: 'persistence_test@example.com',
    password_hash: 'hash123',
    role: 'trainee',
    full_name: 'Persistence Test',
    email_verified: true,
  });
  console.log('Created user ID:', testUser.id);

  const foundUser = await User.findByEmail('persistence_test@example.com');
  console.log('Found user by email:', foundUser ? foundUser.email : 'NOT FOUND');

  console.log('\n--- Testing SMTP Delivery to jagendra.spats@gmail.com ---');
  const res = await emailService.sendVerificationOTP({
    email: 'jagendra.spats@gmail.com',
    otp: '123456',
    purpose: 'email_verification',
  });
  console.log('SMTP Send Result:', res);
  process.exit(0);
}

testSmtpAndDb().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
