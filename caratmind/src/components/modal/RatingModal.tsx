// for exercise rating

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Star } from 'lucide-react';
import { toastError } from '@/utils/toast';
import { buttonGradient } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/styles/themes';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => Promise<void>;
};

export default function RatingModal({ open, onClose, onSubmit }: Props) {
  const { theme } = useTheme();
  const t = themes[theme];
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) {
      toastError('Please enter rating before submitting.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(rating);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={900}
      title="Did the exercise help you?"
      footer={
        <div className="flex justify-center">
          <button
            className={buttonGradient(theme)}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      }
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <p
          className="text-[clamp(1.15rem,4vw,1.65rem)] hidden md:flex font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Did not help
        </p>
        <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled =
              hoverRating > 0 ? star <= hoverRating : star <= rating;
            // const fillColor = hoverRating > 0 ? 'var(--muted)' : '#facc15';

            // for gradient stars
            const factor = (star - 1) / 4;
            const gradientColor = interpolateColor(
              t.secondColor,
              t.firstColor,
              factor,
            );
            const fillColor = hoverRating > 0 ? t.muted : gradientColor;

            return (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
              >
                <Star
                  size={48}
                  style={{ color: 'var(--text)' }}
                  fill={isFilled ? fillColor : 'none'}
                />
              </button>
            );
          })}
        </div>

        <p
          className="text-[clamp(1.15rem,4vw,1.65rem)] hidden md:flex font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Helped a lot
        </p>
      </div>
    </Modal>
  );
}

// simple hex color interpolator
function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = color1.replace('#', '');
  const c2 = color2.replace('#', '');

  const r1 = parseInt(c1.substring(0, 2), 16);
  const g1 = parseInt(c1.substring(2, 4), 16);
  const b1 = parseInt(c1.substring(4, 6), 16);

  const r2 = parseInt(c2.substring(0, 2), 16);
  const g2 = parseInt(c2.substring(2, 4), 16);
  const b2 = parseInt(c2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}
