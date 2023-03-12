import calendar from '../assets/calendar.png';
import Popup from 'reactjs-popup';

const Calendar = (props) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <Popup
      trigger={<img src={calendar} alt='' className='history-calendar'></img>}
      modal
      nested
    >
      {(close) => (
        <div className='modal'>
          <button className='close' onClick={close}>
            &times;
          </button>
          <div className='modal-header'> Choose Dates </div>
          <form className='history-popup-form'>
            <div className='modal-label-input-container'>
              <label>Start date</label>
              <input
                type='date'
                className='history-chosen-start-date'
                max={today.toISOString().split('T')[0]}
              ></input>
            </div>
            <div className='modal-label-input-container'>
              <label>End date</label>
              <input
                type='date'
                className='history-chosen-end-date'
                max={today.toISOString().split('T')[0]}
              ></input>
            </div>
            <button
              type='button'
              className='history-popup-apply-btn'
              onClick={() => {
                props.onClick();
                close();
              }}
            >
              Apply
            </button>
          </form>
        </div>
      )}
    </Popup>
  );
};
export default Calendar;
