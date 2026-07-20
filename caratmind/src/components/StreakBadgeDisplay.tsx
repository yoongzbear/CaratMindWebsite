export function StreakBadgeDisplay({
  badges,
  fetching,
}: {
  badges: string[];
  fetching: boolean;
}) {
  if (fetching) {
    return (
      <p
        className="mt-1 text-[clamp(0.875rem,1.5vw,1rem)]"
        style={{ color: 'var(--muted)' }}
      >
        Loading badges...
      </p>
    );
  }

  if (badges.length === 0) {
    return (
      <p
        className="mt-1 text-[clamp(0.875rem,1.5vw,1rem)]"
        style={{ color: 'var(--muted)' }}
      >
        No badges earned yet.
      </p>
    );
  }

  return (
    <div className="mt-1 flex flex-wrap gap-3">
      {badges.map((badgeId) => {
        const [type, milestone] = badgeId.split('_');
        const label = `${milestone} Days ${type === 'exercise' ? 'Coping Exercise' : 'Journal'} Streak`;

        return (
          <div key={badgeId} className="group relative">
            <img
              src={`/assets/badge/${badgeId}.png`}
              alt={badgeId}
              className="h-20 w-20 rounded-lg"
            />
            <div
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg p-1.5 text-[clamp(0.7rem,1.5vw,0.85rem)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10"
              style={{
                backgroundColor: 'var(--text)',
                color: 'var(--bg-div)',
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
