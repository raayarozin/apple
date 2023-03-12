export const calc1MonthAgo = (date) => {
  var d = date.getDate();
  date.setMonth(date.getMonth() - 1);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date;
};
