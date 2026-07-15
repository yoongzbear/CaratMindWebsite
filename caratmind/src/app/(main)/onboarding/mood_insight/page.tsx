// preview page for mood insights

// fixture, not real data
const fixtureJournal = {
  jrnl_created_at: new Date().toISOString(),
  entryText:
    "Had a pretty good day overall. Finished a project I've been stuck on for a while and it felt great to finally get it working.",
};

const fixtureMood = {
  mood_name: 'joy',
  mood_confidence: '0.86',
  mood_explain:
    'The entry expresses relief and satisfaction after completing a difficult task, which points to a positive, upbeat mood.',
};

const fixtureExercise = {
  exc_name: 'Gratitude Journaling',
  exc_type: 'reflective',
  exc_mood: ['joy', 'calm'],
  exc_desc:
    'Write down three things that went well today and why. Reinforcing positive moments helps build a lasting sense of wellbeing.',
};
