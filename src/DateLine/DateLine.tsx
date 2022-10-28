import { useEffect, useRef, useState } from 'react';
import DateUtils from '../lib/dateutils';
import { EnumPeriod } from '../lib/EnumPeriod';
import { subscribe, unsubscribe } from '../lib/events';
import { TLPeriod } from '../lib/TLPeriod';
import NavButton from '../NavButton/NavButton';
import TLHeader from '../TLHeader/TLHeader';
import './DateLine.css'
import { DateLineUtils } from './DateLineUtils';
import ZoomIn from './icons8-zoom-in-50.png';
import ZoomOut from './icons8-zoom-out-50.png';
import LoadTLShow from '../LoadTLShow/LoadTLShow';

function DateLine() {
    const [period, setPeriod] = useState(EnumPeriod.decade);
    const [mainLine, setMainLine] = useState(DateLineUtils.InitMainLine(DateLineUtils.GetFirstInit(period), period));
    const [model, setModel] = useState([] as TLPeriod[]);

    const refLoadTL = useRef(null as {openModal: () => void} | null);

    useEffect(() => {
        window.onresize = () => {
          setMainLine(DateLineUtils.InitMainLine(DateLineUtils.GetFirstInit(period), period));
        }
      }, [period]);

    

    useEffect(() => {
        subscribe('createTL', createTL);
        subscribe('loadTL', loadTL);
        subscribe('loadfromfileTL', loadfromfileTL);
        return () => {
            unsubscribe('loadfromfileTL', loadfromfileTL);
            unsubscribe('loadTL', loadTL);
            unsubscribe('createTL', createTL);
        }
    });  

    const dates = DateLineUtils.GetDrawDates(period, mainLine);

    const createTL = () => {
        alert('createTL');
    }

    const loadTL = () => {
        refLoadTL?.current?.openModal();
    }

    const loadfromfileTL = () => {
        alert('loadfromfileTL');
    }

    const OnPrevPage = () => {
        const i = mainLine[0].ValueEvent - mainLine.length;
        if (i !== 0) setMainLine(DateLineUtils.InitMainLine(i, period));
        else setMainLine(DateLineUtils.InitMainLine(-1, period));
    };
    const OnPrevPeriod = () => {
        const i = mainLine[0].ValueEvent - 1;
        if (i !== 0) setMainLine(DateLineUtils.InitMainLine(i, period));
        else setMainLine(DateLineUtils.InitMainLine(-1, period));
    };
    const OnNextPeriod = () => {
        const i = mainLine[0].ValueEvent + 1;
        if (i !== 0) setMainLine(DateLineUtils.InitMainLine(i, period));
        else setMainLine(DateLineUtils.InitMainLine(1, period));
    };
    const OnNextPage = () => {
        const i = mainLine[0].ValueEvent + mainLine.length;
        if (i !== 0) setMainLine(DateLineUtils.InitMainLine(i, period));
        else setMainLine(DateLineUtils.InitMainLine(1, period));
    };
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
        setMainLine(DateLineUtils.InitMainLine(init, period));
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
        setMainLine(DateLineUtils.InitMainLine(init, period));
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
        <div>
        <table id="MainTable">
            <tbody>
            <tr className="date">
                <td className='saanavbutton'>
                    <NavButton onClick={OnPrevPage}>&lt;&lt;</NavButton>
                </td>
                <td className='saanavbutton'>
                    <NavButton onClick={OnPrevPeriod}>&lt;</NavButton>
                </td>
                {dates[0].map((a: string, idx: number) => {
                    return (
                        <td key={idx} className="date_cell" id={idx.toString()} onDoubleClick={(e) => { OnShowSlice(dates[1][idx]) }}>
                            <div className='d-flex justify-content-between'>
                                <button className='btn border-0 m-0 p-0' onClick={() => { OnScaleBack(idx) }}>
                                    <img src={ZoomOut} alt="ZoomOut" width="20" height="20" />
                                </button>
                                {a}
                                <button className='btn border-0 m-0 p-0' onClick={() => { OnScaleForward(idx) }}>
                                    <img src={ZoomIn} alt="ZoomIn" width="20" height="20" />
                                </button>
                            </div>
                        </td>
                    );
                })}
                <td className='saanavbutton'>
                    <NavButton onClick={OnNextPeriod}>&gt;</NavButton>
                </td>
                <td className='saanavbutton'>
                    <NavButton onClick={OnNextPage}>&gt;&gt;</NavButton>
                </td>
            </tr>
            {model.map((tl, idx) => {
                //return <TLHeader idx={idx} name={tl.Name} isMain={tl.Parent === null} mainLineCount={mainLine.length} />
                return <TLHeader tl={tl} mainLineCount={mainLine.length} />
            })}
            </tbody>
        </table>
        <LoadTLShow ref={refLoadTL}></LoadTLShow>
        </div>
    );
}

export default DateLine;