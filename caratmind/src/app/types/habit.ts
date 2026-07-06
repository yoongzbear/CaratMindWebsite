export type Habit = {
  hab_id: string;
  hab_question: string;
  hab_actions: string[];
};

export type UserHabit = {
  uhab_id: string;
  hab_id: string;
  uhab_action: string;
  uhab_created_at: string;
  uhab_updated_at: string;
  uhab_status: string;
  user_id: string;
};
