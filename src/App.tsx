import React, { useEffect, useState } from 'react';
import { ApiClient } from './ApiClient';
import './App.css';
import AppHeader from './AppHeader/AppHeader';
import { AppUtils } from './AppUtils';
import DateLine from './DateLine/DateLine';
import { EnumPeriod } from './lib/EnumPeriod';
import TLBody from './TLBody/TLBody';
import TLHeader from './TLHeader/TLHeader';

const AuthContext = React.createContext({});
const IntervalContext = React.createContext({});

function App() {
  const [authInfo, setAuthInfo] = useState({});
  const [period, setPeriod] = useState(EnumPeriod.century);
  const [mainLine, setMainLine] = useState(AppUtils.InitMainLine(AppUtils.GetFirstInit(period), period));

  ApiClient.getInstance()
    .TestToken()
    .then((value) => {
      const jwtToken = localStorage.getItem('tokenTL');
      const user = localStorage.getItem('userTL');
      if (jwtToken && user) {
        setAuthInfo({ jwtToken: jwtToken, user: user });
      }
    })
    .catch((err: Error) => { console.log(err.message) });

  useEffect(() => {
    window.onresize = () => {
      setMainLine(AppUtils.InitMainLine(AppUtils.GetFirstInit(period), period));
    }
  }, [period]);

  return (
    <AuthContext.Provider value={[authInfo, setAuthInfo]}>
      <AppHeader>
        <IntervalContext.Provider value={[period, setPeriod]}>
          <DateLine colCount={mainLine.length}>
            {/* {a.map((b) => {
              return (
              <TimeLine>
                <TLHeader>
                  {b.map((c) => {
                    return (<TLRow />)
                  })}
                </TLHeader>
              </TimeLine>)
            })} */}
          </DateLine>
        </IntervalContext.Provider>
      </AppHeader>
    </AuthContext.Provider>
  );
}

export default App;
