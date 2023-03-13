import './Tabs.css';
import { useState } from 'react';
import Overview from './Overview';
import History from './History';
import { formatDate } from '../utils/formatDate';
import { calc1Month } from '../utils/calcMonth';

const Tabs = () => {
  const [toggleState, setToggleState] = useState(1);

  const TODAY = new Date();
  const YESTERDAY = new Date(TODAY);
  YESTERDAY.setDate(YESTERDAY.getDate() - 1);
  const ONE_MONTH_AGO = formatDate(calc1Month(new Date(TODAY)));
  const WEEK = 168;

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className='tabs-container'>
      <div className='bloc-tabs'>
        <button
          className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(1)}
        >
          Overview
        </button>
        <button
          className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(2)}
        >
          History
        </button>
      </div>

      <div className='content-tabs'>
        <div
          className={toggleState === 1 ? 'content  active-content' : 'content'}
        >
          <div>
            <Overview oneMonthAgo={ONE_MONTH_AGO} today={TODAY} week={WEEK} />
          </div>
        </div>

        <div
          className={toggleState === 2 ? 'content  active-content' : 'content'}
        >
          <div>
            <History oneMonthAgo={ONE_MONTH_AGO} today={TODAY} week={WEEK} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
