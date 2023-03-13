export const formatDate = (
  date,
  formatType = 'US-format',
  withHour = false
) => {
  if (formatType === 'str-format') {
    const time = new Date(date);
    let hours = '';
    if (withHour) {
      let minutes = time.getMinutes();
      minutes = ('0' + minutes).slice(-2);

      hours = `${time.getHours()}:${minutes} UTC`;
    }
    const data = String(new Date(date)).split(' ');
    return `${data[1]} ${data[2]}, ${data[3]} ${hours}`;
  }
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
