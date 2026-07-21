export type EmailPreference = {
  journal_reminder: boolean;
  exercise_reminder: boolean;
  mood_helpline: boolean;
  habit_reminder: boolean;
  habit_summary: boolean;
  new_badge: boolean;
};

export const EMAIL_OPTIONS: {
  key: keyof EmailPreference;
  label: string;
  description: string;
}[] = [
  {
    key: 'journal_reminder',
    label: 'Journal reminders',
    description: "Nudge me if I haven't journaled today",
  },
  {
    key: 'exercise_reminder',
    label: 'Exercise reminders',
    description: "Nudge me if I journaled but haven't done my coping exercise",
  },
  {
    key: 'mood_helpline',
    label: 'Mood check-ins',
    description: 'Notify me if I\u2019ve had a difficult stretch of days',
  },
  {
    key: 'habit_reminder',
    label: 'Habit reminders',
    description: "Nudge me if I haven't tracked a habit today",
  },
  {
    key: 'habit_summary',
    label: 'Weekly habit summary',
    description: 'Send me a weekly recap of my habit tracking',
  },
  {
    key: 'new_badge',
    label: 'Badge notifications',
    description: 'Let me know when I unlock a new streak badge',
  },
];
