import { format, parseISO, subDays } from 'date-fns';
import { DateRangeValue } from '../components/chart/DateRangeSelector';

// calculate start and end dates
export function getRangeLabel(range: DateRangeValue): string {
  if (range.mode === 'range') {
    return `${format(parseISO(range.startDate), 'dd/MM/yyyy')} - ${format(parseISO(range.endDate), 'dd/MM/yyyy')}`;
  }
  const end = new Date();
  const start = subDays(end, range.days - 1);
  return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
}

// calculate into local timestamp
export function resolveLocalDateRange(range: DateRangeValue): {
  startDate: string;
  endDate: string;
} {
  if (range.mode === 'range') {
    return { startDate: range.startDate, endDate: range.endDate };
  }
  const today = new Date();
  return {
    startDate: format(subDays(today, range.days - 1), 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
  };
}
