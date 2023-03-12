import './Calendar.css';
import { useState } from 'react';
import calendar from '../assets/calendar.png';
import Popup from 'reactjs-popup';

const Calendar = (props) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [invalidDates, setInvalidDates] = useState(true);

  const validateDates = () => {
    const start = document.querySelector('.chosen-start-date').value;
    const end = document.querySelector('.chosen-end-date').value;
    if (new Date(start) <= new Date(end)) {
      setInvalidDates(false);
    } else {
      setInvalidDates(true);
    }
  };

  return (
    <Popup
      trigger={<img src={calendar} alt='' className='calendar'></img>}
      modal
      nested
    >
      {(close) => (
        <div className='modal'>
          <button className='close' onClick={close}>
            &times;
          </button>
          <div className='modal-header'> Choose Dates </div>
          <form className='popup-form'>
            <div className='modal-label-input-container'>
              <label>Start date</label>
              <input
                type='date'
                onChange={() => {
                  validateDates();
                }}
                className='chosen-start-date'
                max={today.toISOString().split('T')[0]}
              ></input>
            </div>
            <div className='modal-label-input-container'>
              <label>End date</label>
              <input
                type='date'
                onChange={() => {
                  validateDates();
                }}
                className='chosen-end-date'
                max={today.toISOString().split('T')[0]}
              ></input>
            </div>
            <button
              type='button'
              disabled={invalidDates}
              className='popup-apply-btn'
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
