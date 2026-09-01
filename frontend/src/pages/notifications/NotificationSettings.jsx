import React, { useState } from 'react';
import { Bell, Sliders } from 'lucide-react';

export const NotificationSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [courseRecs, setCourseRecs] = useState(true);
  const [workshopReminders, setWorkshopReminders] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-brand-400" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">Email Alerts & Activity Digests</p>
              <p className="text-[11px] text-slate-400">Receive email notifications for important system events</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">AI Course Recommendations</p>
              <p className="text-[11px] text-slate-400">Notify when new course recommendations match your skill gaps</p>
            </div>
            <input
              type="checkbox"
              checked={courseRecs}
              onChange={(e) => setCourseRecs(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">Live Workshop Reminders</p>
              <p className="text-[11px] text-slate-400">Get notified 1 hour before RSVPed workshops start</p>
            </div>
            <input
              type="checkbox"
              checked={workshopReminders}
              onChange={(e) => setWorkshopReminders(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded bg-slate-900 border-slate-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
