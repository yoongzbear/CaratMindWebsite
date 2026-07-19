export function toTitleCase(text?: string): string {
  return text
    ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : '';
}

// streak badge
const STREAK_MILESTONES = [7, 30, 60, 100] as const;

export function getBadgeMilestone(streak: number): number | null {
  return STREAK_MILESTONES.find((milestone) => streak >= milestone) ?? null;
}
