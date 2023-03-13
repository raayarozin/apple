import { formatDate } from '../utils/formatDate';
import { calc1Month } from '../utils/calcMonth';

export const getDataByFrequency = (e, startDate, type) => {
  let xAxisDataKey, displayedPrecision, end, newPeriod, newPrecision;

  const { precision, period } = e.target.dataset;

  if (precision === 'Minutes') {
    xAxisDataKey = 'startTime';
    displayedPrecision = 'by Minutes';
    end = startDate;
  } else if (+period === 1 && precision === 'Hours') {
    xAxisDataKey = 'startTime';
    displayedPrecision = 'Hourly';
    end = startDate;
  } else if (+period === 168) {
    xAxisDataKey = 'startDate';
    displayedPrecision = 'Weekly';
    end = formatDate(calc1Month(new Date(startDate), 'after'));
  }

  newPeriod = period;
  newPrecision = precision;
  if (type === 'Overview') {
    return [xAxisDataKey, displayedPrecision, end, newPeriod, newPrecision];
  } else {
    return [displayedPrecision, end, newPeriod, newPrecision];
  }
};
