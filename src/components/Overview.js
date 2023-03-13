import './Overview.css';
import { formatDate } from '../utils/formatDate';
import { getNewStartEnd } from '../utils/getNewStartEnd';
import { getDataByFrequency } from '../utils/getDataByFrequency';
import FrequencyButtons from './FrequencyButtons';
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

const Overview = (props) => {
  const [displayedData, setDisplayedData] = useState('');
  const [start, setStart] = useState(props.oneMonthAgo);
  const [end, setEnd] = useState(formatDate(props.today));
  const [period, setPeriod] = useState(props.week);
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
                <YAxis domain={['auto', 'auto']} allowDecimals={false} />
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

  const setDataByFrequency = (e) => {
    const [
      newXAxisDataKey,
      newDisplayedPrecision,
      newEnd,
      newPeriod,
      newPrecision,
    ] = getDataByFrequency(e, start, 'Overview');

    setXAxisDataKey(newXAxisDataKey);
    setDisplayedPrecision(newDisplayedPrecision);
    setEnd(newEnd);
    setPeriod(newPeriod);
    setPrecision(newPrecision);
  };

  const setNewStartEnd = () => {
    const [newStart, newEnd] = getNewStartEnd(period);
    setStart(newStart);
    setEnd(newEnd);
  };

  useEffect(() => {
    getData(period, precision, start, end);
  }, [period, precision, start, end]);

  return (
    <div>
      <FrequencyButtons
        onClick={(e) => {
          setDataByFrequency(e);
        }}
        calendar={setNewStartEnd}
      />

      <div>
        From {formatDate(start, 'str-format')} to{' '}
        {formatDate(end, 'str-format')} ({displayedPrecision})
      </div>
      <div>{displayedData}</div>
    </div>
  );
};
export default Overview;
