import './History.css';
import { useEffect, useState } from 'react';
import { calc1MonthAgo } from '../utils/calcMonth';
import { formatDate } from '../utils/formatDate';
import Calendar from './Calendar';
import axios from 'axios';

const History = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [historyData, setHistoryData] = useState('');
  const [empty, setEmpty] = useState(false);
  const [chosenPeriod, setChosenPeriod] = useState(168);
  const [chosenPrecision, setChosenPrecision] = useState('Hours');
  const [startTime, setStartTime] = useState(
    formatDate(calc1MonthAgo(new Date(today)))
  );
  const [endTime, setEndTime] = useState(formatDate(today));

  const getData = async (period, precision, startTime, endTime) => {
    const fetchedData = [];
    try {
      await axios
        .get(
          `https://test.fxempire.com/api/v1/en/stocks/chart/candles?Identifier=AAPL.XNAS&IdentifierType=Symbol&AdjustmentMethod=All&IncludeExtended=False&period=${period}&Precision=${precision}&StartTime=${startTime}&EndTime=${endTime}%2023:59&_fields=ChartBars.StartDate,ChartBars.High,ChartBars.Low,ChartBars.StartTime,ChartBars.Open,ChartBars.Close,ChartBars.Volume`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setEmpty(false);
            for (const [i, detail] of Object.entries(res.data)) {
              fetchedData.push(
                <tr key={i}>
                  <td className='history-table-row-td'>{detail.StartDate}</td>
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

  const getDataByFrequency = () => {
    if (
      document.getElementById('select-selected-frequency').value !== 'Frequency'
    ) {
      const [period, precision] = document
        .getElementById('select-selected-frequency')
        .value.split(' ');

      setChosenPeriod(period);
      setChosenPrecision(precision);
    }
  };

  const setNewDates = () => {
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
      <div className='hisotry-wrapper'>
        <div className='history-select-container'>
          <select
            className='select-selected-frequency'
            id='select-selected-frequency'
            onChange={() => {
              getDataByFrequency();
            }}
          >
            <option>Frequency</option>
            <option value='1 Minutes'>1 Minute</option>
            <option value='5 Minutes'>5 Minutes</option>
            <option value='1 Hours'>1 Hour</option>
            <option value='168 Hours'>1 Week</option>
          </select>
          <Calendar onClick={setNewDates} />
          <div>
            From {formatDate(startTime, 'str-format')} to{' '}
            {formatDate(endTime, 'str-format')}
          </div>
        </div>
      </div>

      {empty ? (
        <div className='no-data-found-msg'>
          No data was found for these dates
        </div>
      ) : (
        <table className='history-table'>
          <tbody>
            <tr className='history-table-tr-main'>
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
