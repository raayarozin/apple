import './History.css';
import { useEffect, useState } from 'react';
import { calc1Month } from '../utils/calcMonth';
import { formatDate } from '../utils/formatDate';
import Calendar from './Calendar';
import axios from 'axios';

const History = () => {
  const TODAY = new Date();
  const YESTERDAY = new Date(TODAY);
  YESTERDAY.setDate(YESTERDAY.getDate() - 1);
  const WEEK = 168;

  const [historyData, setHistoryData] = useState('');
  const [empty, setEmpty] = useState(false);
  const [period, setPeriod] = useState(WEEK);
  const [precision, setPrecision] = useState('Hours');
  const [displayedPrecision, setDisplayedPrecision] = useState('Weekly');
  const [start, setStart] = useState(formatDate(calc1Month(new Date(TODAY))));
  const [end, setEnd] = useState(formatDate(TODAY));

  const getData = async (period, precision, start, end) => {
    const fetchedData = [];
    try {
      await axios
        .get(
          `https://test.fxempire.com/api/v1/en/stocks/chart/candles?Identifier=AAPL.XNAS&IdentifierType=Symbol&AdjustmentMethod=All&IncludeExtended=False&period=${period}&Precision=${precision}&StartTime=${start}&EndTime=${end}%2023:59&_fields=ChartBars.StartDate,ChartBars.High,ChartBars.Low,ChartBars.StartTime,ChartBars.Open,ChartBars.Close,ChartBars.Volume`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setEmpty(false);
            for (const [i, detail] of Object.entries(res.data)) {
              fetchedData.push(
                <tr key={i}>
                  <td className='history-table-row-td'>{detail.StartTime}</td>
                  <td className='history-table-row-td'>
                    {formatDate(detail.StartDate, 'str-format')}
                  </td>
                  <td className='history-table-row-td'>
                    {detail.High.toFixed(2)}
                  </td>
                  <td className='history-table-row-td'>
                    {detail.Low.toFixed(2)}
                  </td>
                  <td className='history-table-row-td'>
                    {detail.Open.toFixed(2)}
                  </td>
                  <td className='history-table-row-td'>
                    {detail.Close.toFixed(2)}
                  </td>
                  <td
                    className={`history-table-row-td ${
                      detail.Close - detail.Open > 0
                        ? 'positive-value'
                        : 'negative-value'
                    }`}
                  >
                    {(detail.Close - detail.Open).toFixed(2)}%
                  </td>
                </tr>
              );
            }
            setHistoryData(fetchedData);
          } else {
            setEmpty(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getDataByFrequency = (e) => {
    const { precision, period } = e.target.dataset;
    if (precision === 'Minutes') {
      setDisplayedPrecision('by Minutes');
      setEnd(start);
    } else if (+period === 1 && precision === 'Hours') {
      setDisplayedPrecision('Hourly');
      setEnd(start);
    } else if (+period === WEEK) {
      setDisplayedPrecision('Weekly');
      setEnd(formatDate(calc1Month(new Date(start), 'after')));
    }

    setPeriod(period);
    setPrecision(precision);
  };

  const setNewStart = () => {
    const newDate = formatDate(
      new Date(document.querySelector('.chosen-start-date').value)
    );
    setStart(newDate);

    if (+period !== WEEK) {
      setEnd(newDate);
    } else {
      setEnd(formatDate(calc1Month(new Date(newDate), 'after')));
    }
  };

  useEffect(() => {
    getData(period, precision, start, end);
  }, [period, precision, start, end]);

  return (
    <div>
      <div className='overview-time-btns-container'>
        <button
          data-period='1'
          data-precision='Minutes'
          onClick={(e) => {
            getDataByFrequency(e);
          }}
        >
          1 minute
        </button>
        <button
          data-period='5'
          data-precision='Minutes'
          onClick={(e) => {
            getDataByFrequency(e);
          }}
        >
          5 minutes
        </button>
        <button
          data-period='1'
          data-precision='Hours'
          onClick={(e) => {
            getDataByFrequency(e);
          }}
        >
          1 hour
        </button>
        <button
          data-period={WEEK}
          data-precision='Hours'
          onClick={(e) => {
            getDataByFrequency(e);
          }}
        >
          1 week
        </button>
        <Calendar onClick={setNewStart} />
      </div>
      <div>
        From {formatDate(start, 'str-format')} to{' '}
        {formatDate(end, 'str-format')}({displayedPrecision})
      </div>

      {empty ? (
        <div className='no-data-found-msg'>
          No data was found for these dates
        </div>
      ) : (
        <table className='history-table'>
          <tbody>
            <tr className='history-table-tr-main'>
              <td>Time</td>
              <td>Date</td>
              <td>High</td>
              <td>Low</td>
              <td>Open</td>
              <td>Close</td>
              <td>% Change</td>
            </tr>
            {historyData}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default History;
