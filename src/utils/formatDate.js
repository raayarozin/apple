export const formatDate = (date, formatType = 'US-format') => {
  if (formatType === 'str-format') {
    const data = String(new Date(date)).split(' ');
    return `${data[1]} ${data[2]}, ${data[3]}`;
  }
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
