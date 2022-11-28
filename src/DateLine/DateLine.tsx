import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import MessageBox from '../MessageBox/MessageBox';
import { ApiClient } from '../ApiClient';
import useForceUpdate from '../lib/ForceUpdate';
import AddPeriod from '../AddPeriod/AddPeriod';
import UploadFile from '../UploadFile/UploadFile';

function DateLine() {
    const [period, setPeriod] = useState(EnumPeriod.decade);
    const [mainLine, setMainLine] = useState(DateLineUtils.InitMainLine(DateLineUtils.GetFirstInit(period), period));
    const [model, setModel] = useState([] as TLPeriod[]);
    // Show or hide the custom context menu
    const [isShown, setIsShown] = useState(false);
    // The position of the custom context menu
    const [position, setPosition] =
        useState({ x: 0, y: 0, idx: 0, id: 0, idx0: undefined as number | undefined, item: undefined as TLPeriod | undefined });
    const forceUpdate = useForceUpdate();

    const refLoadTL = useRef(null as { openModal: () => void } | null);
    const refMB = useRef(null as { openModal: (value: string) => void, openModalHtml: (value: Node) => void } | null);
    const refAddPeriod = useRef(null as { openModal: () => void } | null);
    const refUploadFile = useRef(null as { openModal: () => void } | null);

    useEffect(() => {
        window.onresize = () => {
            setMainLine(DateLineUtils.InitMainLine(DateLineUtils.GetFirstInit(period), period));
        }
    }, [period]);

    useEffect(() => {
        subscribe('createTL', createTL);
        subscribe('loadTL', loadTLHandler);
        subscribe('loadfromfileTL', loadfromfileTL);
        return () => {
            unsubscribe('loadfromfileTL', loadfromfileTL);
            unsubscribe('loadTL', loadTLHandler);
            unsubscribe('createTL', createTL);
        }
    });

    const dates = useMemo(() => DateLineUtils.GetDrawDates(period, mainLine), [period, mainLine]);

    // Show the custom context menu
    function showContextMenu(event: React.MouseEvent<HTMLTableCellElement>, idx: number, id: number) {
        // Disable the default context menu
        event.preventDefault();

        setIsShown(false);
        const [tl, idx0] = model[idx].find(id);
        const newPosition = {
            x: event.pageX,
            y: event.pageY,
            idx: idx,
            id: id,
            idx0: idx0,
            item: tl,
        };

        setPosition(newPosition);
        setIsShown(true);
    }

    // Hide the custom context menu
    function hideContextMenu() {
        setIsShown(false);
    }

    // Do what you want when an option in the context menu is selected
    //const [selectedValue, setSelectedValue] = useState<string>();
    function contextMenuHandler(selectedValue: string, ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        switch (selectedValue) {
            case 'expand':
                if (position.item?.Items && position.item?.Items.length > 0) {
                    position.item!.Parent = model[position.idx];
                    AddTLHandler(position.item);
                }
                break;
            case 'edit':
                //await position.item?.EditPeriod(idx, idx0, period0);
                refAddPeriod.current?.openModal();
                break;
            case 'delete':
                model[position.idx].Remove(position.idx0!);
                ForceRenderDateLine();
                break;
        }
        setIsShown(false);
    }

    function AddTL(idx: number) {
        setPosition({
            x: 0, y: 0, idx: idx, id: 0,
            idx0: undefined as number | undefined, item: undefined as TLPeriod | undefined
        });
        refAddPeriod.current?.openModal();
    }

    function OnSubmitAddPeriod(tl: TLPeriod) {
        if (position.idx >= 0) {
            if (position.idx0) {
                tl.Parent = model[position.idx];
                model[position.idx].Items[position.idx0] = tl;
            } else {
                model[position.idx].Add(tl);
            }
            forceUpdate();
        }
    }

    function createTL() {
        alert('createTL');
    }

    function loadTLHandler() {
        refLoadTL?.current?.openModal();
    }

    async function loadTL(name: string) {
        const tl = await ApiClient.getInstance().GetTL(name);
        AddTLHandler(tl);
    }

    function loadfromfileTL() {
        refUploadFile.current?.openModal()
    }

    function UploadFileTL(file: Nullable<File>) {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result as string;
                const tline = JSON.parse(fileContent);
                const tl = TLPeriod.CreateTLPeriod(tline);
                tl.Parent = null;
                model.push(tl);
                forceUpdate();
            };
            reader.readAsText(file);
        }
    }

    function AddTLHandler(tl?: TLPeriod) {
        model.push(tl!);
        forceUpdate();
    }

    function RemoveTLHandler(idx: number) {
        model.splice(idx);
        forceUpdate();
    }

    function ForceRenderDateLine() {
        forceUpdate();
    }

    function ShowAll(idx: number) {
        const source = model[idx];
        const target = TLPeriod.CreateTLPeriod(source);
        target.IsShowAll = true;
        AddTLHandler(target);
    }

    function OnPrevPage() {
        const i = mainLine[0].ValueEvent - mainLine.length;
        if (i !== 0)
            setMainLine(DateLineUtils.InitMainLine(i, period));
        else
            setMainLine(DateLineUtils.InitMainLine(-1, period));
    }
    function OnPrevPeriod() {
        const i = mainLine[0].ValueEvent - 1;
        if (i !== 0)
            setMainLine(DateLineUtils.InitMainLine(i, period));
        else
            setMainLine(DateLineUtils.InitMainLine(-1, period));
    }
    function OnNextPeriod() {
        const i = mainLine[0].ValueEvent + 1;
        if (i !== 0)
            setMainLine(DateLineUtils.InitMainLine(i, period));
        else
            setMainLine(DateLineUtils.InitMainLine(1, period));
    }
    function OnNextPage() {
        const i = mainLine[0].ValueEvent + mainLine.length;
        if (i !== 0)
            setMainLine(DateLineUtils.InitMainLine(i, period));
        else
            setMainLine(DateLineUtils.InitMainLine(1, period));
    }
    function OnScaleBack(idx: number) {
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

    function OnScaleForward(idx: number) {
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



    function OnShowSlice(ev: number): void {
        const ar: TLPeriod[] = DateLineUtils.GetSlice(model, ev, period);
        const s = document.createElement('ul') as HTMLUListElement;
        for (const o of ar) {
          const li = document.createElement('li');
          let txtPeriod: string;
          if (o.IsPeriod) {
            txtPeriod = '(' + o.Begin!.Format() + ' - ' + o.End!.Format() + ')';
          } else {
            txtPeriod = '(' + o.Begin!.Format() + ')';
          }
          li.textContent = txtPeriod + ' ' + o.Name;
          s.append(li);
        }
        if (s.childNodes.length === 0) s.append('Нет событий.');
        refMB?.current?.openModalHtml(s)
    }
    
    return (
        <div>
            <table id="MainTable" onMouseDown={hideContextMenu}>
                <tbody>
                    <tr className="date">
                        <td className='saanavbutton'>
                            <NavButton onClick={OnPrevPage}>&lt;&lt;</NavButton>
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
                            <NavButton onClick={OnNextPage}>&gt;&gt;</NavButton>
                        </td>
                    </tr>
                    {model.map((tl, idx) => {
                        return (
                            <TLHeader key={idx} tl={tl} mainLine={mainLine} period={period} idx={idx}
                                addTL={AddTL}
                                removeTLHandler={RemoveTLHandler} forceRenderDateLine={ForceRenderDateLine}
                                contextMenuHandler={showContextMenu}
                                showMsgBox={(s: string) => refMB.current?.openModal(s)}
                                showAll={ShowAll}></TLHeader>
                        );
                    })}
                </tbody>
            </table>
            <LoadTLShow ref={refLoadTL} onSubmit={loadTL}></LoadTLShow>
            <MessageBox ref={refMB}></MessageBox>
            {isShown && (
                <div
                    style={{ top: position.y, left: position.x }}
                    className="custom-context-menu">
                    <div className="option" onClick={(ev) => contextMenuHandler("expand", ev)}>
                        Развернуть
                    </div>
                    <div className="option" onClick={(ev) => contextMenuHandler("edit", ev)}>
                        Изменить
                    </div>
                    <div className="option" onClick={(ev) => contextMenuHandler("delete", ev)}>
                        Удалить
                    </div>
                </div>
            )}
            <AddPeriod ref={refAddPeriod} inperiod={position.item ?? TLPeriod.CreateTL20Century()}
                OnSubmit={(tl: TLPeriod) => OnSubmitAddPeriod(tl)}></AddPeriod>
            <UploadFile ref={refUploadFile} OnSubmit={UploadFileTL}></UploadFile>
        </div>
    );
}

export default DateLine;