import DateUtils from "../lib/dateutils";
import { EnumPeriod } from "../lib/EnumPeriod";
import * as NSEventPeriod from '../lib/EventPeriod';
import { TLPeriod } from "../lib/TLPeriod";

export const DateLineUtils = (function () {
    const getColumnCount = (): number => {
        const widthNavButton = 35;
        const widthColumn = 125;
        return Math.floor((document.documentElement.clientWidth - (widthNavButton * 4) - 2) / widthColumn);
    };
    return {
        /**
         * Вычисляет значение с которого будет рендерится mainLine
         * @param Period текущий период
         * @param mainLineLength текущая длина mainLine
         * @returns число
         */
        GetFirstInit: (Period: EnumPeriod) => {
            const dt = new Date();
            let cur: number;
            switch (Period) {
                case EnumPeriod.day:
                    cur = DateUtils.DaysFromAD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
                    break;
                case EnumPeriod.month:
                    cur = DateUtils.getMonthFromYMD({
                        year: dt.getFullYear(),
                        month: dt.getMonth() + 1,
                        day: dt.getDate(),
                    });
                    break;
                case EnumPeriod.year:
                    cur = dt.getFullYear();
                    break;
                case EnumPeriod.decade:
                    cur = DateUtils.getDecadeFromDate(dt);
                    break;
                case EnumPeriod.century:
                    cur = DateUtils.getCenturyFromDate(dt);
                    break;
            }
            const mainLineLength = getColumnCount();
            return cur - mainLineLength + 1;
        },
        /**
         * Генерит массив NSEventPeriod.Event[]
         * @param init число начиная с которого генерится mainLine
         * @param mainLineLength длина mainLine
         * @param Period текущий период
         * @returns массив NSEventPeriod.Event[]
         */
        InitMainLine: (init: number, Period: EnumPeriod) => {
            const mainLineLength: number = getColumnCount();
            const rt: NSEventPeriod.Event[] = new Array(mainLineLength);
            for (let i = 0; i < mainLineLength; ++i) {
                if (init + i !== 0) rt[i] = new NSEventPeriod.Event(init + i, Period);
                else {
                    rt[i] = new NSEventPeriod.Event(1, Period);
                    init++;
                }
            }
            return rt;
        },
        GetDrawDates: (period: EnumPeriod, mainLine: NSEventPeriod.Event[]): [string[], number[]] => {
            const dates: string[] = [];
            const datesNum: number[] = [];
            for (let i = 0; i < mainLine.length; ++i) {
                datesNum.push(mainLine[i].ValueEvent);
                switch (period) {
                    case EnumPeriod.day:
                        dates.push(DateUtils.formatDay(mainLine[i].ValueEvent));
                        break;
                    case EnumPeriod.month:
                        dates.push(DateUtils.formatMonth(mainLine[i].ValueEvent));
                        break;
                    case EnumPeriod.year:
                        dates.push(DateUtils.formatYear(mainLine[i].ValueEvent));
                        break;
                    case EnumPeriod.decade:
                        dates.push(DateUtils.formatDecade(mainLine[i].ValueEvent));
                        break;
                    case EnumPeriod.century:
                        dates.push(DateUtils.formatCentury(mainLine[i].ValueEvent));
                        break;
                }
            }
            return [dates, datesNum];
        },
        GetSlice: (models: TLPeriod[], n: number, period: EnumPeriod): TLPeriod[] => {
            const items: TLPeriod[] = [];
            for (const q of models) {
                q.getAllSuitablePeriodsFromHierarchy(n, n, period, items);
            }
            const items1: TLPeriod[] = [];
            for (const it of items) {
                if (!items1.includes(it)) {
                    items1.push(it);
                }
            }
            items1.sort((a, b) => (a.mBeginDay ?? 0) - (b.mBeginDay ?? 0));
            return items1;
        }
    }
})();
