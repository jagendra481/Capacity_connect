const db = require('../config/database');

class UserProfile {
  static async getByUserId(userId) {
    const numericId = parseInt(userId);

    const defaultProfile = {
      user_id: numericId,
      designation: 'MEMBER',
      bio: 'Ministry of Earth Sciences - Capacity Building Member',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      qualifications: 'B.Tech / M.Sc Meteorological Sciences',
      work_experience: '3 Years Enterprise & Systems Experience',
      interests: 'Meteorological Data Analysis, Climate Modeling, AI/ML',
      skills: 'Python, GIS, Data Visualization, Microservices',
      certificates: 'MOES-2026-7B9A2F1C',
      xp: 0,
      streak_days: 0,
      competency_score: 0,
    };

    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [numericId]);
      return res.rows[0] ? { ...defaultProfile, ...res.rows[0] } : defaultProfile;
    }

    const profile = db.memoryStore.userProfiles.find(p => p.user_id === numericId);
    return profile ? { ...defaultProfile, ...profile } : defaultProfile;
  }

  static async update(userId, data) {
    const numericId = parseInt(userId);
    const { designation, bio, avatar_url, qualifications, work_experience, interests, skills, certificates, xp, streak_days, competency_score } = data;

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `UPDATE user_profiles 
         SET designation = COALESCE($1, designation),
             bio = COALESCE($2, bio),
             avatar_url = COALESCE($3, avatar_url),
             qualifications = COALESCE($4, qualifications),
             work_experience = COALESCE($5, work_experience),
             interests = COALESCE($6, interests),
             skills = COALESCE($7, skills),
             certificates = COALESCE($8, certificates),
             xp = COALESCE($9, xp),
             streak_days = COALESCE($10, streak_days),
             competency_score = COALESCE($11, competency_score)
         WHERE user_id = $12
         RETURNING *`,
        [designation, bio, avatar_url, qualifications, work_experience, interests, skills, certificates, xp, streak_days, competency_score, numericId]
      );
      return res.rows[0] || await this.getByUserId(numericId);
    }

    let profile = db.memoryStore.userProfiles.find(p => p.user_id === numericId);
    if (!profile) {
      profile = {
        user_id: numericId,
        designation: designation || 'MEMBER',
        bio: bio || 'Ministry of Earth Sciences Member',
        avatar_url: avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        qualifications: qualifications || 'B.Tech / M.Sc Meteorological Sciences',
        work_experience: work_experience || '3 Years Enterprise & Systems Experience',
        interests: interests || 'Meteorological Data Analysis, Climate Modeling, AI/ML',
        skills: skills || 'Python, GIS, Data Visualization, Microservices',
        certificates: certificates || 'MOES-2026-7B9A2F1C',
        xp: xp ?? 0,
        streak_days: streak_days ?? 0,
        competency_score: competency_score ?? 0
      };
      db.memoryStore.userProfiles.push(profile);
    } else {
      if (designation !== undefined) profile.designation = designation;
      if (bio !== undefined) profile.bio = bio;
      if (avatar_url !== undefined) profile.avatar_url = avatar_url;
      if (qualifications !== undefined) profile.qualifications = qualifications;
      if (work_experience !== undefined) profile.work_experience = work_experience;
      if (interests !== undefined) profile.interests = interests;
      if (skills !== undefined) profile.skills = skills;
      if (certificates !== undefined) profile.certificates = certificates;
      if (xp !== undefined) profile.xp = xp;
      if (streak_days !== undefined) profile.streak_days = streak_days;
      if (competency_score !== undefined) profile.competency_score = competency_score;
    }
    if (db.saveMemoryStore) db.saveMemoryStore();
    return profile;
  }
}

module.exports = UserProfile;
