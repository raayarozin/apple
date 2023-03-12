import './Tabs.css';
import { useState } from 'react';
import Overview from './Overview';
import History from './History';

function Tabs() {
  const [toggleState, setToggleState] = useState(1);

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
            <Overview />
          </div>
        </div>

        <div
          className={toggleState === 2 ? 'content  active-content' : 'content'}
        >
          <div>
            <History />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tabs;
