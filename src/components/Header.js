import './Header.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import ClipLoader from 'react-spinners/ClipLoader';
import positiveValue from '../assets/positive-value.png';
import negativeValue from '../assets/negative-value.png';

const Header = () => {
  const ws = new WebSocket('wss://wstest.fxempire.com?token=btctothemoon');
  const apiCall = JSON.stringify({
    type: 'SUBSCRIBE',
    instruments: ['s-aapl'],
  });
  const clipLoader = (
    <ClipLoader
      loading={true}
      color='rgb(88, 147, 241)'
      size={20}
      aria-label='Loading Spinner'
      data-testid='loader'
    />
  );
  const [price, setPrice] = useState(clipLoader);
  const [change, setChange] = useState('');
  const [pctChange, setPctChange] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    ws.onopen = () => {
      ws.send(apiCall);
    };
    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);

      try {
        if ((json.event = 'data')) {
          const data = json['s-aapl'];
          if (data.last) {
            setPrice(data.last);
            setChange(data.change);
            setPctChange(`(${data.percentChange}%)`);
            setLastUpdate(
              `As of ${formatDate(data.lastUpdate, 'str-format', true)}`
            );

            if (data.change > 0) {
              setIcon(positiveValue);
            } else {
              setIcon(negativeValue);
            }
          } else {
            setPrice('not found');
            setChange('not found');
            setPctChange('not found');
            setLastUpdate('not found');
          }
        }
      } catch (err) {
        console.log(err);
        alert('Something went wrong, try again later');
      }
    };
  }, []);

  return (
    <div className='header-wrapper'>
      <div className='header'>
        <div className='apple-inc-header'>
          Apple Inc
          <div className='header-date'>{lastUpdate}</div>
        </div>
        <div>
          <div>
            <div className='header-price'>
              <img className='hedaer-icon' src={icon} alt=''></img>
              {price}
            </div>
            <div className='header-pct-change-container'>
              <div className={change < 0 ? 'negative-value' : 'positive-value'}>
                {change}
              </div>
              <div className={change < 0 ? 'negative-value' : 'positive-value'}>
                {pctChange}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
