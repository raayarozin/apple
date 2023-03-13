import Calendar from './Calendar';

const FrequencyButtons = (props) => {
  const WEEK = 168;
  return (
    <div className='overview-time-btns-container'>
      <button data-period='1' data-precision='Minutes' onClick={props.onClick}>
        1 minute
      </button>
      <button data-period='5' data-precision='Minutes' onClick={props.onClick}>
        5 minutes
      </button>
      <button data-period='1' data-precision='Hours' onClick={props.onClick}>
        1 hour
      </button>
      <button data-period={WEEK} data-precision='Hours' onClick={props.onClick}>
        1 week
      </button>
      <Calendar onClick={props.calendar} />
    </div>
  );
};
export default FrequencyButtons;
