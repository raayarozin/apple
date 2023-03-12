import './Overview.css';
import { formatDate } from '../utils/formatDate';
import { calc1MonthAgo } from '../utils/calcMonth';
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
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const oneMonthAgo = formatDate(calc1MonthAgo(new Date(today)));

  const [overviewChart, setOverviewChart] = useState('');
  const [startTime, setStartTime] = useState(oneMonthAgo);
  const [endTime, setEndTime] = useState(formatDate(today));
  const [chosenPeriod, setChosenPeriod] = useState(168);
  const [chosenPrecision, setChosenPrecision] = useState('Hours');
  const [displayedPrecision, setDisplayedPrecision] = useState('Weekly');
  const [xAxisDataKey, setXAxisDataKey] = useState('startDate');
  const [datesChanged, setDatesChanged] = useState(false);

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

            setOverviewChart(
              <AreaChart
                width={1250}
                height={400}
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
            setOverviewChart(
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

  const handlePeriodPrecision = (e) => {
    if (e.target.dataset.precision === 'Minutes') {
      setXAxisDataKey('startTime');
      setDisplayedPrecision('by Minutes');
    } else if (
      +e.target.dataset.period === 1 &&
      e.target.dataset.precision === 'Hours'
    ) {
      setXAxisDataKey('startTime');
      setDisplayedPrecision('Hourly');
    } else {
      setXAxisDataKey('startDate');
      setDisplayedPrecision('Weekly');
    }
    setChosenPeriod(e.target.dataset.period);
    setChosenPrecision(e.target.dataset.precision);

    if (!datesChanged) {
      setStartTime(e.target.dataset.start);
      setEndTime(e.target.dataset.end);
    }
  };

  const setNewDates = () => {
    setDatesChanged(true);
    setStartTime(
      formatDate(
        new Date(document.querySelector('.history-chosen-start-date').value)
      )
    );
    setEndTime(
      formatDate(
        new Date(document.querySelector('.history-chosen-end-date').value)
      )
    );
  };

  useEffect(() => {
    getData(chosenPeriod, chosenPrecision, startTime, endTime);
  }, [chosenPeriod, chosenPrecision, startTime, endTime]);

  return (
    <div>
      <div className='overview-time-btns-container'>
        <button
          data-period='1'
          data-precision='Minutes'
          data-start={formatDate(yesterday)}
          data-end={formatDate(today)}
          onClick={(e) => {
            handlePeriodPrecision(e);
          }}
        >
          1M
        </button>
        <button
          data-period='5'
          data-precision='Minutes'
          data-start={formatDate(yesterday)}
          data-end={formatDate(today)}
          onClick={(e) => {
            handlePeriodPrecision(e);
          }}
        >
          5M
        </button>
        <button
          data-period='1'
          data-precision='Hours'
          data-start={formatDate(yesterday)}
          data-end={formatDate(today)}
          onClick={(e) => {
            handlePeriodPrecision(e);
          }}
        >
          1H
        </button>
        <button
          data-period='168'
          data-precision='Hours'
          data-start={oneMonthAgo}
          data-end={formatDate(today)}
          onClick={(e) => {
            handlePeriodPrecision(e);
          }}
        >
          1W
        </button>
        <Calendar onClick={setNewDates} />
      </div>
      <div>
        From {formatDate(startTime, 'str-format')} to{' '}
        {formatDate(endTime, 'str-format')} ({displayedPrecision})
      </div>
      <div>{overviewChart}</div>
    </div>
  );
};
export default Overview;
