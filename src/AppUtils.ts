import DateUtils from "./lib/dateutils";
import { EnumPeriod } from "./lib/EnumPeriod";
import * as NSEventPeriod from './lib/EventPeriod';

export const AppUtils = (function () {
    const getClientWidth = (): number => {
        return Math.floor((document.documentElement.clientWidth - 2) / 120);
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
            const mainLineLength = getClientWidth();
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
            const mainLineLength: number = getClientWidth();
            const rt: NSEventPeriod.Event[] = new Array(mainLineLength);
            for (let i = 0; i < mainLineLength; ++i) {
                if (init + i !== 0) rt[i] = new NSEventPeriod.Event(init + i, Period);
                else {
                    rt[i] = new NSEventPeriod.Event(1, Period);
                    init++;
                }
            }
            return rt;
        }
    }
})();
