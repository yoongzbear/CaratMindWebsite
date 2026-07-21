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
    description: "Remind me if I haven't journaled today",
  },
  {
    key: 'exercise_reminder',
    label: 'Exercise reminders',
    description:
      "Remind me if I journaled today but haven't done my coping exercise",
  },
  {
    key: 'mood_helpline',
    label: 'Emergency Helpline',
    description:
      'Send emergency helpline if I had negative mood for 3 days or more',
  },
  {
    key: 'habit_reminder',
    label: 'Habit reminders',
    description: "Remind me if I haven't tracked a habit today",
  },
  {
    key: 'habit_summary',
    label: 'Weekly habit summary',
    description: 'Send me a weekly summary of my habit tracking',
  },
  {
    key: 'new_badge',
    label: 'Badge notifications',
    description: 'Let me know when I unlock a new streak badge',
  },
];
