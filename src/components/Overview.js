import './Overview.css';
import { formatDate } from '../utils/formatDate';
import { calc1Month } from '../utils/calcMonth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Calendar from './Calendar';

const Overview = () => {
  const TODAY = new Date();
  const YESTERDAY = new Date(TODAY);
  YESTERDAY.setDate(YESTERDAY.getDate() - 1);
  const ONE_MONTH_AGO = formatDate(calc1Month(new Date(TODAY)));
  const WEEK = 168;

  const [displayedData, setDisplayedData] = useState('');
  const [start, setStart] = useState(ONE_MONTH_AGO);
  const [end, setEnd] = useState(formatDate(TODAY));
  const [period, setPeriod] = useState(WEEK);
  const [precision, setPrecision] = useState('Hours');
  const [displayedPrecision, setDisplayedPrecision] = useState('Weekly');
  const [xAxisDataKey, setXAxisDataKey] = useState('startDate');

  const getData = async (period, precision, startTime, endTime) => {
    const fetchedData = [];
    try {
      await axios
        .get(
          `https://test.fxempire.com/api/v1/en/stocks/chart/candles?Identifier=AAPL.XNAS&IdentifierType=Symbol&AdjustmentMethod=All&IncludeExtended=False&period=${period}&Precision=${precision}&StartTime=${startTime}&EndTime=${endTime}%2023:59&_fields=ChartBars.StartDate,ChartBars.High,ChartBars.Low,ChartBars.StartTime,ChartBars.Open,ChartBars.Close,ChartBars.Volume`
        )
        .then((res) => {
          if (res.data.length > 0) {
            for (const stock of Object.values(res.data)) {
              fetchedData.push({
                startDate: stock.StartDate,
                startTime: stock.StartTime,
                close: stock.Close,
              });
            }

            setDisplayedData(
              <AreaChart
                width={1250}
                height={350}
                data={fetchedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey={xAxisDataKey} />
                <YAxis domain={['auto', 'auto']} />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='close'
                  stroke='#8884d8'
                  fillOpacity={1}
                  fill='url(#colorUv)'
                />
              </AreaChart>
            );
          } else {
            setDisplayedData(
              <div className='no-data-found-msg'>
                No data was found for these dates
              </div>
            );
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
      setXAxisDataKey('startTime');
      setDisplayedPrecision('by Minutes');
      setEnd(start);
    } else if (+period === 1 && precision === 'Hours') {
      setXAxisDataKey('startTime');
      setDisplayedPrecision('Hourly');
      setEnd(start);
    } else if (+period === WEEK) {
      setXAxisDataKey('startDate');
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
        {formatDate(end, 'str-format')} ({displayedPrecision})
      </div>
      <div>{displayedData}</div>
    </div>
  );
};
export default Overview;
