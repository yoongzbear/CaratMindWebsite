export type Habit = {
  hab_id: string;
  hab_question: string;
  hab_actions: HabitAction[];
};

export type HabitAction = {
  action: string;
  status: HabitStatus; // the status for each action
};

export type HabitStatus = 'completed' | 'incomplete' | 'ongoing';

// action and its message
export const habitMessage: Record<HabitStatus, string> = {
  completed: 'Good job! Continue the habit for tomorrow.',
  incomplete: 'Start the habit for your well-being improvement!',
  ongoing: 'Keep going for today!',
};

export type UserHabit = {
  uhab_id: string;
  hab_id: string;
  uhab_action: string;
  uhab_created_at: string;
  uhab_updated_at: string;
  uhab_status: HabitStatus;
  user_id: string;
};
