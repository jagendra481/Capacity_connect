const db = require('../config/database');

class UserProfile {
  static async getByUserId(userId) {
    const numericId = parseInt(userId);

    const defaultProfile = {
      user_id: numericId,
      designation: 'MEMBER',
      bio: 'Capacity Connect Enterprise Trainee',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      xp: 100,
      streak_days: 1,
      competency_score: 50,
    };

    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [numericId]);
      return res.rows[0] || defaultProfile;
    }

    const profile = db.memoryStore.userProfiles.find(p => p.user_id === numericId);
    return profile || defaultProfile;
  }

  static async update(userId, data) {
    const numericId = parseInt(userId);
    const { designation, bio, avatar_url } = data;

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `UPDATE user_profiles 
         SET designation = COALESCE($1, designation),
             bio = COALESCE($2, bio),
             avatar_url = COALESCE($3, avatar_url)
         WHERE user_id = $4
         RETURNING *`,
        [designation, bio, avatar_url, numericId]
      );
      return res.rows[0] || await this.getByUserId(numericId);
    }

    let profile = db.memoryStore.userProfiles.find(p => p.user_id === numericId);
    if (!profile) {
      profile = {
        user_id: numericId,
        designation: designation || 'MEMBER',
        bio: bio || 'Capacity Connect Member',
        avatar_url: avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        xp: 100,
        streak_days: 1,
        competency_score: 50
      };
      db.memoryStore.userProfiles.push(profile);
    } else {
      if (designation !== undefined) profile.designation = designation;
      if (bio !== undefined) profile.bio = bio;
      if (avatar_url !== undefined) profile.avatar_url = avatar_url;
    }
    return profile;
  }
}

module.exports = UserProfile;
