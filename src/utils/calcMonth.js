export const calc1Month = (date, direction = 'before') => {
  var d = date.getDate();
  direction === 'before'
    ? date.setMonth(date.getMonth() - 1)
    : date.setMonth(date.getMonth() + 1);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date;
};
