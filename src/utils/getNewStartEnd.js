import { formatDate } from './formatDate';
import { calc1Month } from './calcMonth';

export const getNewStartEnd = (period) => {
  let end;
  const start = formatDate(
    new Date(document.querySelector('.chosen-start-date').value)
  );

  if (+period !== 168) {
    end = formatDate(
      new Date(document.querySelector('.chosen-start-date').value)
    );
  } else {
    end = formatDate(calc1Month(new Date(start), 'after'));
  }

  return [start, end];
};
