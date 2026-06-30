import { format, parseISO, subDays } from 'date-fns';
import { DateRangeValue } from '../components/chart/DateRangeSelector';

// calculate start and end dates
export function getRangeLabel(range: DateRangeValue): string {
  if (range.mode === 'range') {
    return `${format(parseISO(range.startDate), 'd MMM')} - ${format(parseISO(range.endDate), 'd MMM yyyy')}`;
  }
  const end = new Date();
  const start = subDays(end, range.days - 1);
  return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
}
