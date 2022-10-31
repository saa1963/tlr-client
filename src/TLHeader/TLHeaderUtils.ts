import { TLPeriod } from "../lib/TLPeriod";
import * as NSEventPeriod from '../lib/EventPeriod';
import { EnumPeriod } from "../lib/EnumPeriod";

export interface InterfaceExTLPeriod {
    il: number;
    ir: number;
    item: TLPeriod;
}

export const TLHeaderUtils = (function () {
    const getPeriodsInInterval = (model: TLPeriod, mainLine: NSEventPeriod.Event[], Period: EnumPeriod): TLPeriod[] => {
        return model.Items.filter((value) => {
            return value.IsIntersectIntervalsForPeriod(
              mainLine[0].ValueEvent,
              mainLine[mainLine.length - 1].ValueEvent,
              Period,
            );
          });
    }
    return {
        /**
         * 
         * @param tlIndex индекс объекта в массиве
         * @param model верхний (Parent=null) объект TLPeriod с индексом tlIndex
         * @returns void
         */
        DrawTL: (model: TLPeriod, mainLine: NSEventPeriod.Event[], Period: EnumPeriod): InterfaceExTLPeriod[][] => {
            // выбрать периоды попадающие в общий диапазон
            let items: TLPeriod[] = [];
            if (!model.IsShowAll) {
                items = getPeriodsInInterval(model, mainLine, Period);
            } else {
                model.getAllSuitablePeriodsFromHierarchy(
                    mainLine[0].ValueEvent,
                    mainLine[mainLine.length - 1].ValueEvent,
                    Period,
                    items,
                );
            }
            // вычисляем индексы
            let exItems: InterfaceExTLPeriod[] = [];
            for (const p of items) {
                let il: number | null = null,
                    ir: number | null = null;
                let попал: boolean;
                for (let i = 0; i < mainLine.length; i++) {
                    попал = p.IsIntersectIntervalsForPeriod(
                        mainLine[i].ValueEvent,
                        mainLine[i].ValueEvent,
                        Period,
                    );
                    if (il === null) {
                        if (попал) {
                            il = i;
                        }
                    }
                    if (il !== null) {
                        if (!попал) {
                            ir = i - 1;
                            break;
                        }
                    }
                }
                if (il !== null && ir === null) {
                    ir = mainLine.length - 1;
                }
                exItems.push({ il: il!, ir: ir!, item: p });
            }
            // упакуем
            const полки: InterfaceExTLPeriod[][] = [];
            let НомерПолки = -1; // индекс полки
            let НашлосьМесто: boolean;
            let свободнаяфишка: InterfaceExTLPeriod;
            let НомераУложенныхФишекНаПоследнююПолку: number[];
            while (exItems.length > 0) {
                let i = 0;
                полки.push([]);
                НомерПолки++;
                НомераУложенныхФишекНаПоследнююПолку = [];
                while (i < exItems.length) {
                    свободнаяфишка = exItems[i];
                    НашлосьМесто = true;
                    for (const уложеннаяфишка of полки[НомерПолки]) {
                        if (
                            TLPeriod.isIntersectIntervals(
                                уложеннаяфишка.il,
                                уложеннаяфишка.ir,
                                свободнаяфишка.il,
                                свободнаяфишка.ir,
                            )
                        ) {
                            НашлосьМесто = false;
                            break;
                        }
                    }
                    if (НашлосьМесто) {
                        полки[НомерПолки].push(свободнаяфишка);
                        НомераУложенныхФишекНаПоследнююПолку.push(i);
                    }
                    i++;
                }
                // eslint-disable-next-line no-loop-func
                exItems = exItems.filter((_, index) => {
                    return !НомераУложенныхФишекНаПоследнююПолку.includes(index);
                });
            }

            //полки.reverse();
            for (const exitem of полки) {
                exitem.sort((a, b) => {
                    return a.il - b.il;
                });
                //this.view.DrawEventsRow(tlIndex, exitem);

                
            }
            return полки;
        },
    }
})();
