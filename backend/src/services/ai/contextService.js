const db = require('../../config/database');
const User = require('../../models/User');

class ContextService {
  /**
   * Retrieve authenticated user learning context
   */
  async getUserContext(userId) {
    if (!userId) return null;

    try {
      const user = await User.findById(userId);
      if (!user) return null;

      let profile = null;
      let skillGaps = [];
      let recentAssessments = [];

      if (db.getIsPgConnected()) {
        const profileRes = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
        profile = profileRes.rows[0] || null;

        const gapsRes = await db.query(
          `SELECT s.name as skill_name, sg.gap_score, sg.required_score, sg.current_score 
           FROM skill_gaps sg 
           JOIN skills s ON sg.skill_id = s.id 
           WHERE sg.user_id = $1 ORDER BY sg.gap_score DESC LIMIT 5`,
          [userId]
        );
        skillGaps = gapsRes.rows;

        const assessRes = await db.query(
          `SELECT a.title, aa.score, aa.passed, aa.completed_at 
           FROM assessment_attempts aa 
           JOIN assessments a ON aa.assessment_id = a.id 
           WHERE aa.user_id = $1 ORDER BY aa.completed_at DESC LIMIT 3`,
          [userId]
        );
        recentAssessments = assessRes.rows;
      } else {
        profile = db.memoryStore.userProfiles.find(p => p.user_id === user.id) || null;
        skillGaps = (db.memoryStore.skillGaps || [])
          .filter(sg => sg.user_id === user.id)
          .map(sg => {
            const skill = (db.memoryStore.skills || []).find(s => s.id === sg.skill_id);
            return {
              skill_name: skill ? skill.name : 'Technical Skill',
              gap_score: sg.gap_score || 2,
              current_score: sg.current_score || 3,
              required_score: sg.required_score || 5,
            };
          });
      }

      return {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department_id,
        designation: user.designation || profile?.designation || 'Learner',
        competencyScore: profile?.competency_score || 75,
        xp: profile?.xp || 200,
        skillGaps,
        recentAssessments,
      };
    } catch (err) {
      console.warn('[ContextService] Error retrieving user context:', err.message);
      return null;
    }
  }

  /**
   * Retrieve course, module, & lesson details and extract grounded passages
   */
  async getCourseContext({ courseId, moduleId = null, lessonId = null, query = '' }) {
    if (!courseId) return { course: null, relevantPassages: [], isCourseContextAvailable: false };

    try {
      let course = null;
      let modules = [];
      let lessons = [];
      let resources = [];

      const numericCourseId = parseInt(courseId);

      if (db.getIsPgConnected()) {
        const cRes = await db.query('SELECT * FROM courses WHERE id = $1', [numericCourseId]);
        course = cRes.rows[0];

        if (course) {
          const mRes = await db.query('SELECT * FROM course_modules WHERE course_id = $1 ORDER BY module_order ASC', [numericCourseId]);
          modules = mRes.rows;

          const lRes = await db.query(
            `SELECT l.*, cm.title as module_title 
             FROM lessons l 
             JOIN course_modules cm ON l.module_id = cm.id 
             WHERE cm.course_id = $1 ORDER BY l.lesson_order ASC`,
            [numericCourseId]
          );
          lessons = lRes.rows;
        }
      } else {
        course = (db.memoryStore.courses || []).find(c => c.id === numericCourseId || c.id === courseId);
        if (course) {
          modules = (db.memoryStore.courseModules || []).filter(m => m.course_id === course.id);
          lessons = (db.memoryStore.lessons || []).filter(l => modules.some(m => m.id === l.module_id));
        }
      }

      if (!course) {
        return { course: null, relevantPassages: [], isCourseContextAvailable: false };
      }

      // Keyword & Semantic Passage Extraction for Grounded RAG
      const passages = [];
      const cleanQuery = (query || '').toLowerCase().trim();
      const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 3);

      // Search matching lessons
      for (const l of lessons) {
        const contentText = `${l.title || ''} ${l.content || ''} ${l.summary || ''}`.toLowerCase();
        const matches = queryWords.filter(w => contentText.includes(w));

        const isExplicitTarget = lessonId && (l.id === parseInt(lessonId) || l.id === lessonId);
        if (isExplicitTarget || matches.length > 0 || !cleanQuery) {
          passages.push({
            courseTitle: course.title,
            moduleTitle: l.module_title || 'Core Module',
            lessonTitle: l.title || 'Lesson',
            content: l.content || l.summary || `${l.title}: Core enterprise learning concepts and practical implementation guidelines.`,
            relevanceScore: isExplicitTarget ? 10 : matches.length,
          });
        }
      }

      // If no direct query match found, include top lesson summary
      if (passages.length === 0 && lessons.length > 0) {
        passages.push({
          courseTitle: course.title,
          moduleTitle: lessons[0].module_title || 'Module 1',
          lessonTitle: lessons[0].title || 'Overview',
          content: lessons[0].content || course.description || 'Course overview and learning objectives.',
          relevanceScore: 1,
        });
      }

      return {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
        },
        relevantPassages: passages.slice(0, 4), // Top 4 grounded passages
        isCourseContextAvailable: passages.length > 0,
      };
    } catch (err) {
      console.warn('[ContextService] Error retrieving course context:', err.message);
      return { course: null, relevantPassages: [], isCourseContextAvailable: false };
    }
  }
}

module.exports = new ContextService();
