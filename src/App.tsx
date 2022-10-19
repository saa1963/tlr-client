import React, { useEffect, useState } from 'react';
import { ApiClient } from './ApiClient';
import './App.css';
import AppHeader from './AppHeader/AppHeader';
import { AppUtils } from './AppUtils';
import { AuthContext, IntervalContext } from './Contexts';
import DateLine from './DateLine/DateLine';
import DateUtils from './lib/dateutils';
import { EnumPeriod } from './lib/EnumPeriod';
import TLBody from './TLBody/TLBody';
import TLHeader from './TLHeader/TLHeader';

function App() {
  const [authInfo, setAuthInfo] = useState({});
  const [period, setPeriod] = useState(EnumPeriod.decade);
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

  const OnScaleBack = (idx: number) => {
    const value = mainLine[idx].ValueEvent;
    let init: number;
    switch (period) {
      case EnumPeriod.day:
        init = DateUtils.getMonthFromYMD(DateUtils.YMDFromAD(value)!);
        setPeriod(EnumPeriod.month);
        break;
      case EnumPeriod.month:
        init = DateUtils.getYearFromYMD(DateUtils.getYMDFromMonth(value));
        setPeriod(EnumPeriod.year);
        break;
      case EnumPeriod.year:
        init = DateUtils.getDecadeFromYMD(DateUtils.getYMDFromYear(value));
        setPeriod(EnumPeriod.decade);
        break;
      case EnumPeriod.decade:
        init = DateUtils.getCenturyFromYMD(DateUtils.getYMDFromDecade(value));
        setPeriod(EnumPeriod.century);
        break;
      case EnumPeriod.century:
        init = DateUtils.getDayFromYMD(DateUtils.getYMDFromCentury(value));
        setPeriod(EnumPeriod.day);
        break;
    }
    setMainLine(AppUtils.InitMainLine(init, period));
  }

  const OnScaleForward = (idx: number) => {
    const value = mainLine[idx].ValueEvent;
    let init: number;
    switch (period) {
      case EnumPeriod.day:
        init = DateUtils.getCenturyFromYMD(DateUtils.YMDFromAD(value)!);
        setPeriod(EnumPeriod.century);
        break;
      case EnumPeriod.month:
        init = DateUtils.getDayFromYMD(DateUtils.YMDFromAD(DateUtils.FirstDayOfMonth(value))!);
        setPeriod(EnumPeriod.day);
        break;
      case EnumPeriod.year:
        init = DateUtils.getMonthFromYMD(DateUtils.YMDFromAD(DateUtils.FirstDayOfYear(value))!);
        setPeriod(EnumPeriod.month);
        break;
      case EnumPeriod.decade:
        init = DateUtils.YMDFromAD(DateUtils.FirstDayOfDecade(value))!.year;
        setPeriod(EnumPeriod.year);
        break;
      case EnumPeriod.century:
        init = DateUtils.getDecadeFromYMD(DateUtils.YMDFromAD(DateUtils.FirstDayOfCentury(value))!);
        setPeriod(EnumPeriod.decade);
        break;
    }
    setMainLine(AppUtils.InitMainLine(init, period));
  }

  const OnPrevPeriod = () => {
    const i = mainLine[0].ValueEvent - 1;
    if (i !== 0) setMainLine(AppUtils.InitMainLine(i, period));
    else setMainLine(AppUtils.InitMainLine(-1, period));
  }

  const OnPrevPage = () => {
    const i = mainLine[0].ValueEvent - mainLine.length;
    if (i !== 0) setMainLine(AppUtils.InitMainLine(i, period));
    else setMainLine(AppUtils.InitMainLine(-1, period));
  }

  const OnNextPeriod = () => {
    const i = mainLine[0].ValueEvent + 1;
    if (i !== 0) setMainLine(AppUtils.InitMainLine(i, period));
    else setMainLine(AppUtils.InitMainLine(1, period));
  }

  const OnNextPage = () => {
    const i = mainLine[0].ValueEvent + mainLine.length;
    if (i !== 0) setMainLine(AppUtils.InitMainLine(i, period));
    else setMainLine(AppUtils.InitMainLine(1, period));
  }

  const OnShowSlice = (ev: number): void => {
    // const ar: TLPeriod[] = this.model.GetSlice(ev, this.Period);
    // const s = document.createElement('ul') as HTMLUListElement;
    // for (const o of ar) {
    //   const li = document.createElement('li');
    //   let txtPeriod: string;
    //   if (o.IsPeriod) {
    //     txtPeriod = '(' + o.Begin.Format() + ' - ' + o.End.Format() + ')';
    //   } else {
    //     txtPeriod = '(' + o.Begin.Format() + ')';
    //   }
    //   li.textContent = txtPeriod + ' ' + o.Name;
    //   s.append(li);
    // }
    // if (s.childNodes.length === 0) s.append('Нет событий.');
    // new BoxViewHtml(s).Show();
    alert('No implementation');
  }

  return (
    <AuthContext.Provider value={[authInfo, setAuthInfo]}>
      <AppHeader onPrevPeriod={OnPrevPeriod} onPrevPage={OnPrevPage} onNextPeriod={OnNextPeriod} onNextPage={OnNextPage}>
        <IntervalContext.Provider value={[period, setPeriod]}>
          <DateLine dates={AppUtils.GetDrawDates(period, mainLine)} onScaleBack={OnScaleBack} onScaleForward={OnScaleForward}
            onShowSlice={OnShowSlice}>
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
