import { useState } from 'react';
import { C } from '../styles/styles';

// example
{
  /* <ToggleSwitch
  leftLabel="Average"
  rightLabel="Dominant"
  defaultValue="left"
  onChange={(value) => {
    console.log('Selected:', value); // left | right
  }}
/> */
}

type ToggleSwitchProps = {
  leftLabel: string;
  rightLabel: string;
  defaultValue?: 'left' | 'right';
  onChange?: (value: 'left' | 'right') => void;
};

export default function ToggleSwitch({
  leftLabel,
  rightLabel,
  defaultValue = 'left',
  onChange,
}: ToggleSwitchProps) {
  const [value, setValue] = useState<'left' | 'right'>(defaultValue);

  const toggle = () => {
    setValue((prev) => {
      const next = prev === 'left' ? 'right' : 'left';
      onChange?.(next);
      return next;
    });
  };

  const isLeft = value === 'left';

  return (
    <div className="flex items-center gap-3">
      <span
        style={{
          fontSize: '13px',
          color: isLeft ? C.navy : C.faint,
        }}
      >
        {leftLabel}
      </span>

      {/* switch */}
      <div
        onClick={toggle}
        className="relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors duration-200"
        style={{
          backgroundColor: isLeft ? C.roseQuartz : C.serenity,
        }}
      >
        <div
          className="absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
          style={{
            transform: isLeft ? 'translateX(2px)' : 'translateX(26px)',
          }}
        />
      </div>

      <span
        style={{
          fontSize: '13px',
          color: !isLeft ? C.navy : C.faint,
        }}
      >
        {rightLabel}
      </span>
    </div>
  );
}
