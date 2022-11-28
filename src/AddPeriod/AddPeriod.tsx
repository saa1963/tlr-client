import * as bootstrap from "bootstrap";
import React, { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { EnumPeriod } from "../lib/EnumPeriod";
import { TLPeriod } from "../lib/TLPeriod";
import { TLPeriodView } from "../lib/TLPeriodView";

enum EnumBoundary { begin, end }

function SelectType({ p_type, boundary, setInview }: 
    { p_type: EnumPeriod, boundary: EnumBoundary, setInview: (value: React.SetStateAction<TLPeriodView>) => void }) {
    return (
        <div className="row">
            <div className="col mb-2">
                <label className="me-2">Тип события</label>
                <select value={p_type} onChange={
                    (e: ChangeEvent<HTMLSelectElement>) => {
                        let v: number = e.target.selectedIndex
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginType: v + 1 } })
                        else
                            setInview((prevState) => { return { ...prevState, endType: v + 1 } })
                    }
                }>
                    {[[EnumPeriod.day, 'День'], [EnumPeriod.month, 'Месяц'],
                    [EnumPeriod.year, 'Год'], [EnumPeriod.decade, 'Десятилетие'],
                    [EnumPeriod.century, 'Век']]
                        .map((val) => {
                            return <option key={val[0]} value={val[0]}>{val[1]}</option>
                        })}
                </select>
            </div>
        </div>)
}

function DayYear({ p_day, p_month, p_year, boundary, setInview }:
    { p_day: Nullable<number>, p_month: Nullable<number>, p_year: Nullable<number>, boundary: EnumBoundary, 
            setInview: (value: React.SetStateAction<TLPeriodView>) => void }) {
    return (
        <div className="row justify-content-start">
            <input className="form-control col-3 mb-2"
                type="number" value={p_day ?? ''}
                placeholder="День" required min="1" max="31"
                onChange={
                    (e: ChangeEvent<HTMLInputElement>) => {
                        let v: Nullable<number> = parseInt(e.target.value)
                        if (isNaN(v)) v = null;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginDayday: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endDayday: v } })
                    }
                } />
            <select value={p_month ?? 0} className="form-control col-4 mb-2"
                placeholder="Месяц" required
                onChange={
                    (e: ChangeEvent<HTMLSelectElement>) => {
                        let v: Nullable<number> = e.target.selectedIndex
                        if (v === 0) v = null;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginDaymonth: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endDaymonth: v } })
                    }
                }>
                {['Месяц', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
                    .map((val, idx) => {
                        return <option key={val} value={idx}>{val}</option>
                    })}
            </select>
            <input className="form-control col-3" type="number mb-2"
                value={p_year ?? ''} placeholder="Год" required min="-10000" max="2050"
                onChange={
                    (e: ChangeEvent<HTMLInputElement>) => {
                        let v: Nullable<number> = parseInt(e.target.value)
                        if (isNaN(v)) v = null;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginDayyear: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endDayyear: v } })
                    }
                } />
        </div>)
}

function MonthYear({ p_month, p_year, boundary, setInview }:
    { p_month: Nullable<number>, p_year: Nullable<number>, boundary: EnumBoundary, 
        setInview: (value: React.SetStateAction<TLPeriodView>) => void }) {
    return (
        <div className="row justify-content-start">
            <select value={p_month ?? 0} className="form-control col-4 mb-2"
                placeholder="Месяц" required
                onChange={
                    (e: ChangeEvent<HTMLSelectElement>) => {
                        let v: Nullable<number> = e.target.selectedIndex
                        if (v === 0) v = null;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginMonthmonth: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endMonthmonth: v } })
                    }}>
                {['Месяц', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
                    .map((val, idx) => {
                        return <option key={val} value={idx}>{val}</option>
                    })}
            </select>
            <input className="form-control col-3 mb-2" type="number"
                value={p_year ?? ''} placeholder="Год" required min="-10000" max="2050"
                onChange={
                    (e: ChangeEvent<HTMLInputElement>) => {
                        let v: Nullable<number> = parseInt(e.target.value)
                        if (isNaN(v)) v = null;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginMonthyear: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endMonthyear: v } })
                    }
                } />
        </div>)
}

function DecadeCentury({ p_decade, p_century, boundary, setInview }:
    { p_decade: Nullable<number>, p_century: Nullable<number>, boundary: EnumBoundary, 
        setInview: (value: React.SetStateAction<TLPeriodView>) => void }) {
    return (
        <div className="row justify-content-start">
            <select value={p_decade ?? -1} className="form-control col-4 mb-2"
                placeholder="Десятилетие" required
                onChange={
                    (e: ChangeEvent<HTMLSelectElement>) => {
                        let v: Nullable<number> = e.target.selectedIndex
                        if (v === 0) v = null;
                        else v = v - 1;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginDecadedecade: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endDecadedecade: v } })
                    }
                }>
                {
                    [['-1', ''], ['0', '00-е'], ['1', '10-е'], ['2', '20-е'],
                    ['3', '30-е'], ['4', '40-е'], ['5', '50-е'], ['6', '60-е'],
                    ['7', '70-е'], ['8', '80-е'], ['9', '90-е']]
                        .map((val, idx) => {
                            return <option key={val[0]} value={val[0]}>{val[1]}</option>
                        })
                }
            </select>
            <input className="form-control col-3 mb-2" type="number"
                value={p_century ?? ''} placeholder="Век" required min="-21" max="21"
                onChange={
                    (e: ChangeEvent<HTMLInputElement>) => {
                        let v: Nullable<number> = parseInt(e.target.value)
                        if (isNaN(v)) v = null;
                        if (boundary === EnumBoundary.begin)
                            setInview((prevState) => { return { ...prevState, beginDecadecentury: v } })
                        else
                            setInview((prevState) => { return { ...prevState, endDecadecentury: v } })
                    }
                } />
        </div>)
}

function Card1({inview, setInview}: {inview: TLPeriodView, setInview: (value: React.SetStateAction<TLPeriodView>) => void}) {
    return (
        <div className="card mb-2">
            <div className="card-header">
                Начало периода
            </div>
            <div className="card-body">
                <div className="container">
                    <SelectType p_type={inview.beginType} boundary={EnumBoundary.begin} setInview={setInview}></SelectType>
                    {inview.beginType === EnumPeriod.day && <DayYear p_day={inview.beginDayday}
                        p_month={inview.beginDaymonth}
                        p_year={inview.beginDayyear} boundary={EnumBoundary.begin} setInview={setInview}></DayYear>}
                    {inview.beginType === EnumPeriod.month && <MonthYear p_month={inview.beginMonthmonth}
                        p_year={inview.beginMonthyear} boundary={EnumBoundary.begin} setInview={setInview}></MonthYear>}
                    {inview.beginType === EnumPeriod.year && <div className="row mb-2">
                        <input className="form-control col-4" type="number" value={inview.beginYear ?? ''}
                            placeholder="Год" min="-10000" max="2050" required
                            onChange={
                                (e: ChangeEvent<HTMLInputElement>) => {
                                    let v: Nullable<number> = parseInt(e.target.value)
                                    if (isNaN(v)) v = null;
                                    setInview((prevState) => { return { ...prevState, beginYear: v } })
                                }
                            } />
                    </div>}
                    {inview.beginType === EnumPeriod.decade && <DecadeCentury p_decade={inview.beginDecadedecade!}
                        p_century={inview.beginDecadecentury!} boundary={EnumBoundary.begin} setInview={setInview}></DecadeCentury>}
                    {inview.beginType === EnumPeriod.century && <div className="row">
                        <input className="form-control col-4" type="number"
                            value={inview.beginCentury ?? ''} placeholder="Век" min="-20" max="22" required
                            onChange={
                                (e: ChangeEvent<HTMLInputElement>) => {
                                    let v: Nullable<number> = parseInt(e.target.value)
                                    if (isNaN(v)) v = null;
                                    setInview((prevState) => { return { ...prevState, beginCentury: v } })
                                }
                            } />
                    </div>}
                </div>
            </div>
        </div>
    )
}

function Card2({inview, setInview}: {inview: TLPeriodView, setInview: (value: React.SetStateAction<TLPeriodView>) => void}) {
    return (
        <div className="card">
            <div className="card-header">
                Конец периода
            </div>
            <div className="card-body">
                <div className="container">
                    <SelectType p_type={inview.endType} boundary={EnumBoundary.end} setInview={setInview}></SelectType>
                    {inview.endType === EnumPeriod.day &&
                        <DayYear p_day={inview.endDayday!} p_month={inview.endDaymonth!}
                            p_year={inview.endDayyear!} boundary={EnumBoundary.end} setInview={setInview}></DayYear>}
                    {inview.endType === EnumPeriod.month && <MonthYear p_month={inview.endMonthmonth}
                        p_year={inview.endMonthyear} boundary={EnumBoundary.end} setInview={setInview}></MonthYear>}
                    {inview.endType === EnumPeriod.year && <div className="row mb-2">
                        <input className="form-control col-4" type="number" value={inview.endYear ?? ''}
                            placeholder="Год" min="-10000" max="2050" required
                            onChange={
                                (e: ChangeEvent<HTMLInputElement>) => {
                                    let v: Nullable<number> = parseInt(e.target.value)
                                    if (isNaN(v)) v = null;
                                    setInview((prevState) => { return { ...prevState, endYear: v } })
                                }
                            } />
                    </div>}
                    {inview.endType === EnumPeriod.decade && <DecadeCentury p_decade={inview.endDecadedecade}
                        p_century={inview.endDecadecentury} boundary={EnumBoundary.end} setInview={setInview}></DecadeCentury>}
                    {inview.endType === EnumPeriod.century && <div className="row">
                        <input className="form-control col-4" type="number" value={inview.endCentury ?? ''}
                            placeholder="Век" min="-100" max="22" required
                            onChange={
                                (e: ChangeEvent<HTMLInputElement>) => {
                                    let v: Nullable<number> = parseInt(e.target.value)
                                    if (isNaN(v)) v = null;
                                    setInview((prevState) => { return { ...prevState, endCentury: v } })
                                }
                            } />
                    </div>}
                </div>
            </div>
        </div>
    )
}

function AddPeriod({ inperiod, OnSubmit }:
    { inperiod: TLPeriod, OnSubmit: (tl: TLPeriod) => void }, ref: any) {

    const [inview, setInview] = useState(inperiod.ViewFromPeriod());

    useEffect(() => {
        setInview(inperiod.ViewFromPeriod());
    }, [inperiod])

    useImperativeHandle(ref, () => {
        return {
            openModal: () => {
                const myModalEl = document.getElementById('tmAddPeriod');
                const m = bootstrap.Modal.getOrCreateInstance(myModalEl!);
                m?.show();
            },
        }
    });

    return (
        <div id="tmAddPeriod" className="modal" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <form>
                        <div className="modal-header">
                            <h5 className="modal-title">Период</h5>
                            <button type="button" className="close closeaddperiodmodal" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container pb-2">
                                <div className="form-group row pb-2">
                                    <input className="form-control col-8"
                                        type="text" value={inview.name}
                                        placeholder="Введите наименование" required
                                        onChange={
                                            (e: ChangeEvent<HTMLInputElement>) =>
                                                setInview((prevState) => { return { ...prevState, name: e.target.value } })
                                        } />
                                </div>
                                <div className="row">
                                    <label className="col-6">Период?</label>
                                    <input className="col-1"
                                        type="checkbox" checked={inview.isperiod}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setInview((prevState) => {
                                            return { ...prevState, isperiod: e.target.checked }
                                        })} />
                                </div>
                            </div>
                            <Card1 inview={inview} setInview={setInview}></Card1>
                            {inview.isperiod && <Card2 inview={inview} setInview={setInview}></Card2>}
                        </div>
                        <div id="addperiod_server_error" className="alert alert-danger" role="alert" style={{ display: 'none' }}>
                        </div>
                        <div className="modal-footer">
                            <input type="submit" hidden id="addperiod_submit" />
                            <button id="btnCancelAddPeriod" type="button"
                                className="btn btn-secondary" data-bs-dismiss="modal">
                                Закрыть
                            </button>
                            <button id="btnAddPeriod" type="button" className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={(e) => OnSubmit(TLPeriod.CreateTLPeriodWithView(inview))}>OK</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(AddPeriod)