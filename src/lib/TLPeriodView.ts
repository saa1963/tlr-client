import { EnumPeriod } from "./EnumPeriod";

export class TLPeriodView {
    constructor(
    public name: string,
    public isperiod: boolean,
    public beginType: EnumPeriod,
    public endType: EnumPeriod,
    public beginDayday: Nullable<number> = null,
    public beginDaymonth: Nullable<number> = null,
    public beginDayyear: Nullable<number> = null,
    public beginMonthmonth: Nullable<number> = null,
    public beginMonthyear: Nullable<number> = null,
    public beginYear: Nullable<number> = null,
    public beginDecadedecade: Nullable<number> = null,
    public beginDecadecentury: Nullable<number> = null,
    public beginCentury: Nullable<number> = null,
    public endDayday: Nullable<number> = null,
    public endDaymonth: Nullable<number> = null,
    public endDayyear: Nullable<number> = null,
    public endMonthmonth: Nullable<number> = null,
    public endMonthyear: Nullable<number> = null,
    public endYear: Nullable<number> = null,
    public endDecadedecade: Nullable<number> = null,
    public endDecadecentury: Nullable<number> = null,
    public endCentury: Nullable<number> = null){}
}
