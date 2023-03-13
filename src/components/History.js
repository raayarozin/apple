import './History.css';
import { useEffect, useState } from 'react';
import { calc1Month } from '../utils/calcMonth';
import { formatDate } from '../utils/formatDate';
import { getNewStartEnd } from '../utils/getNewStartEnd';
import { getDataByFrequency } from '../utils/getDataByFrequency';

import axios from 'axios';
import FrequencyButtons from './FrequencyButtons';

const History = (props) => {
  const [historyData, setHistoryData] = useState('');
  const [empty, setEmpty] = useState(false);
  const [period, setPeriod] = useState(props.week);
  const [precision, setPrecision] = useState('Hours');
  const [displayedPrecision, setDisplayedPrecision] = useState('Weekly');
  const [start, setStart] = useState(
    formatDate(calc1Month(new Date(props.today)))
  );
  const [end, setEnd] = useState(formatDate(props.today));

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

  const setDataByFrequency = (e) => {
    const [newDisplayedPrecision, newEnd, newPeriod, newPrecision] =
      getDataByFrequency(e, start, 'History');

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
