const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const db = require('./src/config/database');
const authService = require('./src/services/authService');

async function seedAdmin() {
  await db.connectDb();

  const adminEmail = 'capacityadmin@gmail.com';
  const adminPassword = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash(adminPassword, salt);

  // Check if admin exists in memoryStore
  let adminUser = db.memoryStore.users.find(u => u.email && u.email.toLowerCase() === adminEmail);

  if (adminUser) {
    adminUser.password_hash = adminHash;
    adminUser.role = 'administrator';
    adminUser.email_verified = true;
    adminUser.full_name = 'Capacity Administrator';
    console.log('[SEED] Updated existing capacityadmin@gmail.com user in memoryStore.');
  } else {
    const newId = db.memoryStore.users.length + 1;
    adminUser = {
      id: newId,
      email: adminEmail,
      password_hash: adminHash,
      role: 'administrator',
      department_id: 4,
      full_name: 'Capacity Administrator',
      email_verified: true,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
    db.memoryStore.users.push(adminUser);

    db.memoryStore.userProfiles.push({
      user_id: newId,
      designation: 'Chief Platform Administrator',
      bio: 'System Administrator for Capacity Connect.',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=capacityadmin',
      xp: 0,
      streak_days: 0,
      competency_score: 0
    });
    console.log('[SEED] Created new capacityadmin@gmail.com user in memoryStore.');
  }

  // Persist memoryStore to disk
  if (db.saveMemoryStore) db.saveMemoryStore();

  // Test login with created admin account
  try {
    const loginResult = await authService.login({
      email: adminEmail,
      password: adminPassword,
      selectedRole: 'administrator',
    });
    console.log('[SUCCESS] Successfully verified login for capacityadmin@gmail.com / admin123!');
    console.log('User Role:', loginResult.user.role);
    console.log('User Token Issued:', loginResult.token ? 'YES' : 'NO');
  } catch (err) {
    console.error('[ERROR] Login verification failed:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('Error seeding admin:', err);
  process.exit(1);
});
