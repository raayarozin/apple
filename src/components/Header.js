import './Header.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import ClipLoader from 'react-spinners/ClipLoader';

const ws = new WebSocket('wss://wstest.fxempire.com?token=btctothemoon');
const apiCall = JSON.stringify({ type: 'SUBSCRIBE', instruments: ['s-aapl'] });
const Header = () => {
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
  const [change, setChange] = useState(clipLoader);
  const [pctChange, setPctChange] = useState(clipLoader);
  const [lastUpdate, setLastUpdate] = useState(clipLoader);

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
            setPrice(`${data.last}$`);
            setChange(data.change);
            setPctChange(`${data.percentChange}%`);
            setLastUpdate(formatDate(data.lastUpdate, 'str-format'));
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
    <div className='header'>
      <div
        className='header-detail'
        onMouseEnter={(e) => {
          e.target.classList.add('header-detail-hover');
        }}
        onMouseLeave={(e) => {
          e.target.classList.remove('header-detail-hover');
        }}
      >
        Price: <span className='header-detail-bold'>{price}</span>
      </div>
      <div
        className='header-detail'
        onMouseEnter={(e) => {
          e.target.classList.add('header-detail-hover');
        }}
        onMouseLeave={(e) => {
          e.target.classList.remove('header-detail-hover');
        }}
      >
        Change:<span className='header-detail-bold'> {change}</span>
      </div>
      <div
        className='header-detail'
        onMouseEnter={(e) => {
          e.target.classList.add('header-detail-hover');
        }}
        onMouseLeave={(e) => {
          e.target.classList.remove('header-detail-hover');
        }}
      >
        Percent Change:{' '}
        <span
          className={`header-detail-bold ${
            pctChange > 0 ? 'positive-value' : 'negative-value'
          }`}
        >
          {pctChange}
        </span>
      </div>
      <div
        className='header-detail'
        onMouseEnter={(e) => {
          e.target.classList.add('header-detail-hover');
        }}
        onMouseLeave={(e) => {
          e.target.classList.remove('header-detail-hover');
        }}
      >
        Last Update:<span className='header-detail-bold'> {lastUpdate}</span>
      </div>
    </div>
  );
};
export default Header;
