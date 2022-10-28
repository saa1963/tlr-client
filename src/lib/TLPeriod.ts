import { makeAutoObservable } from 'mobx';
import DateUtils from './dateutils';
import {
  TLEvent,
  EnumPeriod,
  TLEventDay,
  TLEventMonth,
  TLEventYear,
  TLEventDecade,
  TLEventCentury,
} from './TLEvent';

export class TLPeriod {
  Id: number = Math.floor(Math.random() * Math.floor(1000000000));
  Name = 'Новый';
  Begin: TLEvent | null = null;
  End: TLEvent | null = null;
  mBeginDay?: number;
  mEndDay?: number;
  Periods: TLPeriod[] = [];
  Parent: TLPeriod | null = null;
  IsShowAll = false;

  constructor() {
    makeAutoObservable(this);
  }

  public toJSON() {
    return Object.assign(
      {},
      {
        Name: this.Name,
        Begin: this.Begin,
        End: this.End,
        Periods: this.Periods,
      },
    );
  }

  /**
   * создает TLPeriod из параметров
   */
  static CreateTLPeriodWithArgs(
    name: string,
    isperiod: boolean,
    beginType: EnumPeriod,
    beginDayday: number,
    beginDaymonth: number,
    beginDayyear: number,
    beginMonthmonth: number,
    beginMonthyear: number,
    beginYear: number,
    beginDecadedecade: number,
    beginDecadecentury: number,
    beginCentury: number,
    endType: EnumPeriod,
    endDayday: number,
    endDaymonth: number,
    endDayyear: number,
    endMonthmonth: number,
    endMonthyear: number,
    endYear: number,
    endDecadedecade: number,
    endDecadecentury: number,
    endCentury: number,
  ): TLPeriod {
    const rt = new TLPeriod();
    rt.Name = name;

    let type: EnumPeriod = beginType;
    if (type === EnumPeriod.day) {
      rt.Begin = TLEventDay.CreateTLEventDay(
        'Начало',
        DateUtils.DaysFromAD(beginDayyear, beginDaymonth, beginDayday),
        DateUtils.getMonthFromYMD({ year: beginDayyear, month: beginDaymonth, day: beginDayday }),
        beginDayyear,
        DateUtils.getDecadeFromYMD({ year: beginDayyear, month: beginDaymonth, day: beginDayday }),
        DateUtils.getCenturyFromYMD({ year: beginDayyear, month: beginDaymonth, day: beginDayday }),
      );
    } else if (type === EnumPeriod.month) {
      rt.Begin = TLEventMonth.CreateTLEventMonth(
        'Начало',
        DateUtils.getMonthFromYMD({ year: beginMonthyear, month: beginMonthmonth, day: 1 }),
        beginMonthyear,
        DateUtils.getDecadeFromYMD({ year: beginMonthyear, month: beginMonthmonth, day: 1 }),
        DateUtils.getCenturyFromYMD({ year: beginMonthyear, month: beginMonthmonth, day: 1 }),
      );
    } else if (type === EnumPeriod.year) {
      rt.Begin = TLEventYear.CreateTLEventYear(
        'Начало',
        beginYear,
        DateUtils.getDecadeFromYMD({ year: beginYear, month: 1, day: 1 }),
        DateUtils.getCenturyFromYMD({ year: beginYear, month: 1, day: 1 }),
      );
    } else if (type === EnumPeriod.decade) {
      rt.Begin = TLEventDecade.CreateTLEventDecade(
        'Начало',
        DateUtils.getDecade(beginDecadecentury, beginDecadedecade),
        beginDecadecentury,
      );
    } else if (type === EnumPeriod.century) {
      rt.Begin = TLEventCentury.CreateTLEventCentury('Начало', beginCentury);
    }
    if (isperiod) {
      type = endType;
      if (type === EnumPeriod.day) {
        rt.End = TLEventDay.CreateTLEventDay(
          'Конец',
          DateUtils.DaysFromAD(endDayyear, endDaymonth, endDayday),
          DateUtils.getMonthFromYMD({ year: endDayyear, month: endDaymonth, day: endDayday }),
          endDayyear,
          DateUtils.getDecadeFromYMD({ year: endDayyear, month: endDaymonth, day: endDayday }),
          DateUtils.getCenturyFromYMD({ year: endDayyear, month: endDaymonth, day: endDayday }),
        );
      } else if (type === EnumPeriod.month) {
        rt.End = TLEventMonth.CreateTLEventMonth(
          'Конец',
          DateUtils.getMonthFromYMD({ year: endMonthyear, month: endMonthmonth, day: 1 }),
          endMonthyear,
          DateUtils.getDecadeFromYMD({ year: endMonthyear, month: endMonthmonth, day: 1 }),
          DateUtils.getCenturyFromYMD({ year: endMonthyear, month: endMonthmonth, day: 1 }),
        );
      } else if (type === EnumPeriod.year) {
        rt.End = TLEventYear.CreateTLEventYear(
          'Конец',
          endYear,
          DateUtils.getDecadeFromYMD({ year: endYear, month: 1, day: 1 }),
          DateUtils.getCenturyFromYMD({ year: endYear, month: 1, day: 1 }),
        );
      } else if (type === EnumPeriod.decade) {
        rt.End = TLEventDecade.CreateTLEventDecade(
          'Конец',
          DateUtils.getDecade(endDecadecentury, endDecadedecade),
          endDecadecentury,
        );
      } else if (type === EnumPeriod.century) {
        rt.End = TLEventCentury.CreateTLEventCentury('Конец', endCentury);
      }
    } else {
      rt.End = rt.Begin;
    }
    rt.mBeginDay = rt.GetBeginDate();
    rt.mEndDay = rt.GetEndDate();

    return rt;
  }
  /**
   * создает TLPeriod из объекта десериализированного из JSON
   * @param o
   */
  static CreateTLPeriod(o: TLPeriod): TLPeriod {
    const rt = new TLPeriod();
    rt.Name = o.Name;
    if (!o.Begin) {
      o.Begin = TLEventCentury.CreateTLEventCentury('Начало', 19);
    }
    let type: EnumPeriod = TLEvent.GetType(o.Begin);
    if (type === EnumPeriod.day) {
      rt.Begin = TLEventDay.CreateTLEventDay(
        o.Begin.Name,
        o.Begin.Day,
        o.Begin.Month,
        o.Begin.Year,
        o.Begin.Decade,
        o.Begin.Century,
      );
    } else if (type === EnumPeriod.month) {
      rt.Begin = TLEventMonth.CreateTLEventMonth(
        o.Begin.Name,
        o.Begin.Month,
        o.Begin.Year,
        o.Begin.Decade,
        o.Begin.Century,
      );
    } else if (type === EnumPeriod.year) {
      rt.Begin = TLEventYear.CreateTLEventYear(
        o.Begin.Name,
        o.Begin.Year,
        o.Begin.Decade,
        o.Begin.Century,
      );
    } else if (type === EnumPeriod.decade) {
      rt.Begin = TLEventDecade.CreateTLEventDecade(o.Begin.Name, o.Begin.Decade, o.Begin.Century);
    } else if (type === EnumPeriod.century) {
      rt.Begin = TLEventCentury.CreateTLEventCentury(o.Begin.Name, o.Begin.Century);
    }
    if (!o.End) {
      o.End = TLEventCentury.CreateTLEventCentury('Конец', 21);
    }
    type = TLEvent.GetType(o.End);
    if (type === EnumPeriod.day) {
      rt.End = TLEventDay.CreateTLEventDay(
        o.End.Name,
        o.End.Day,
        o.End.Month,
        o.End.Year,
        o.End.Decade,
        o.End.Century,
      );
    } else if (type === EnumPeriod.month) {
      rt.End = TLEventMonth.CreateTLEventMonth(
        o.End.Name,
        o.End.Month,
        o.End.Year,
        o.End.Decade,
        o.End.Century,
      );
    } else if (type === EnumPeriod.year) {
      rt.End = TLEventYear.CreateTLEventYear(o.End.Name, o.End.Year, o.End.Decade, o.End.Century);
    } else if (type === EnumPeriod.decade) {
      rt.End = TLEventDecade.CreateTLEventDecade(o.End.Name, o.End.Decade, o.End.Century);
    } else if (type === EnumPeriod.century) {
      rt.End = TLEventCentury.CreateTLEventCentury(o.End.Name, o.End.Century);
    }
    rt.mBeginDay = rt.GetBeginDate();
    rt.mEndDay = rt.GetEndDate();
    if (o.Periods && o.Periods.length > 0) {
      o.Periods.forEach((o1) => {
        const period = TLPeriod.CreateTLPeriod(o1);
        period.Parent = rt;
        rt.Periods.push(period);
      });
    }
    return rt;
  }

  public static CreateTLPeriodFromNumber(n: number, period: EnumPeriod) {
    const rt = new TLPeriod();
    rt.Name = '';
    switch (period) {
      case EnumPeriod.day:
        rt.Begin = TLEventDay.CreateTLEventDay1('', n);
        break;
      case EnumPeriod.month:
        rt.Begin = TLEventMonth.CreateTLEventMonth1('', n);
        break;
      case EnumPeriod.year:
        rt.Begin = TLEventYear.CreateTLEventYear1('', n);
        break;
      case EnumPeriod.decade:
        rt.Begin = TLEventDecade.CreateTLEventDecade1('', n);
        break;
      case EnumPeriod.century:
        rt.Begin = TLEventCentury.CreateTLEventCentury('', n);
    }
    rt.End = Object.assign({}, rt.Begin);
    rt.Parent = null;
    rt.mBeginDay = rt.GetBeginDate();
    rt.mEndDay = rt.GetEndDate();
    return rt;
  }

  public getRightBoundForPeriod(period: EnumPeriod): number {
    let l2: number = 0;
    if (!this.End) throw new Error('Using null reference');
    // [текущий(имеющаяся точность), внешний(точность сравнения)]
    switch (true) {
      case this.End.Type === EnumPeriod.day && period === EnumPeriod.day:
        l2 = this.End.Day!;
        break;
      case this.End.Type === EnumPeriod.month && period === EnumPeriod.day:
        l2 = DateUtils.RightDayOfMonth(this.End.Month!);
        break;
      case this.End.Type === EnumPeriod.year && period === EnumPeriod.day:
        l2 = DateUtils.RightDayOfYear(this.End.Year!);
        break;
      case this.End.Type === EnumPeriod.decade && period === EnumPeriod.day:
        l2 = DateUtils.RightDayOfDecade(this.End.Decade!);
        break;
      case this.End.Type === EnumPeriod.century && period === EnumPeriod.day:
        l2 = DateUtils.RightDayOfCentury(this.End.Century!);
        break;
      case this.End!.Type === EnumPeriod.day && period === EnumPeriod.month:
      case this.End.Type === EnumPeriod.month && period === EnumPeriod.month:
        l2 = this.End.Month!;
        break;
      case this.End.Type === EnumPeriod.year && period === EnumPeriod.month:
        l2 = DateUtils.RightMonthOfYear(this.End.Year!);
        break;
      case this.End.Type === EnumPeriod.decade && period === EnumPeriod.month:
        l2 = DateUtils.RightMonthOfDecade(this.End.Decade!);
        break;
      case this.End.Type === EnumPeriod.century && period === EnumPeriod.month:
        l2 = DateUtils.RightMonthOfCentury(this.End.Century!);
        break;
      case this.End!.Type === EnumPeriod.day && period === EnumPeriod.year:
      case this.End!.Type === EnumPeriod.month && period === EnumPeriod.year:
      case this.End.Type === EnumPeriod.year && period === EnumPeriod.year:
        l2 = this.End.Year!;
        break;
      case this.End.Type === EnumPeriod.decade && period === EnumPeriod.year:
        l2 = DateUtils.RightYearOfDecade(this.End.Decade!);
        break;
      case this.End.Type === EnumPeriod.century && period === EnumPeriod.year:
        l2 = DateUtils.RightYearOfCentury(this.End.Century!);
        break;
      case this.End!.Type === EnumPeriod.day && period === EnumPeriod.decade:
      case this.End!.Type === EnumPeriod.month && period === EnumPeriod.decade:
      case this.End!.Type === EnumPeriod.year && period === EnumPeriod.decade:
      case this.End.Type === EnumPeriod.decade && period === EnumPeriod.decade:
        l2 = this.End.Decade!;
        break;
      case this.End.Type === EnumPeriod.century && period === EnumPeriod.decade:
        l2 = DateUtils.RightDecadeOfCentury(this.End.Century!);
        break;
      case this.End!.Type === EnumPeriod.day && period === EnumPeriod.century:
      case this.End!.Type === EnumPeriod.month && period === EnumPeriod.century:
      case this.End!.Type === EnumPeriod.year && period === EnumPeriod.century:
      case this.End!.Type === EnumPeriod.decade && period === EnumPeriod.century:
      case this.End!.Type === EnumPeriod.century && period === EnumPeriod.century:
        l2 = this.End.Century!;
        break;
    }
    return l2;
  }

  public getLeftBoundForPeriod(period: EnumPeriod): number {
    let l2: number = 0;
    if (!this.Begin) throw new Error('Using null reference');
    // [текущий(имеющаяся точность), внешний(точность сравнения)]
    switch (true) {
      case this.Begin.Type === EnumPeriod.day && period === EnumPeriod.day:
        l2 = this.Begin.Day!;
        break;
      case this.Begin.Type === EnumPeriod.month && period === EnumPeriod.day:
        l2 = DateUtils.LeftDayOfMonth(this.Begin.Month!);
        break;
      case this.Begin.Type === EnumPeriod.year && period === EnumPeriod.day:
        l2 = DateUtils.LeftDayOfYear(this.Begin.Year!);
        break;
      case this.Begin.Type === EnumPeriod.decade && period === EnumPeriod.day:
        l2 = DateUtils.LeftDayOfDecade(this.Begin.Decade!);
        break;
      case this.Begin.Type === EnumPeriod.century && period === EnumPeriod.day:
        l2 = DateUtils.LeftDayOfCentury(this.Begin.Century!);
        break;
      case this.Begin!.Type === EnumPeriod.day && period === EnumPeriod.month:
      case this.Begin.Type === EnumPeriod.month && period === EnumPeriod.month:
        l2 = this.Begin.Month!;
        break;
      case this.Begin.Type === EnumPeriod.year && period === EnumPeriod.month:
        l2 = DateUtils.LeftMonthOfYear(this.Begin.Year!);
        break;
      case this.Begin.Type === EnumPeriod.decade && period === EnumPeriod.month:
        l2 = DateUtils.LeftMonthOfDecade(this.Begin.Decade!);
        break;
      case this.Begin.Type === EnumPeriod.century && period === EnumPeriod.month:
        l2 = DateUtils.LeftMonthOfCentury(this.Begin.Century!);
        break;
      case this.Begin!.Type === EnumPeriod.day && period === EnumPeriod.year:
      case this.Begin!.Type === EnumPeriod.month && period === EnumPeriod.year:
      case this.Begin.Type === EnumPeriod.year && period === EnumPeriod.year:
        l2 = this.Begin.Year!;
        break;
      case this.Begin.Type === EnumPeriod.decade && period === EnumPeriod.year:
        l2 = DateUtils.LeftYearOfDecade(this.Begin.Decade!);
        break;
      case this.Begin.Type === EnumPeriod.century && period === EnumPeriod.year:
        l2 = DateUtils.LeftYearOfCentury(this.Begin.Century!);
        break;
      case this.Begin!.Type === EnumPeriod.day && period === EnumPeriod.decade:
      case this.Begin!.Type === EnumPeriod.month && period === EnumPeriod.decade:
      case this.Begin!.Type === EnumPeriod.year && period === EnumPeriod.decade:
      case this.Begin.Type === EnumPeriod.decade && period === EnumPeriod.decade:
        l2 = this.Begin.Decade!;
        break;
      case this.Begin.Type === EnumPeriod.century && period === EnumPeriod.decade:
        l2 = DateUtils.LeftDecadeOfCentury(this.Begin.Century!);
        break;
      case this.Begin!.Type === EnumPeriod.day && period === EnumPeriod.century:
      case this.Begin!.Type === EnumPeriod.month && period === EnumPeriod.century:
      case this.Begin!.Type === EnumPeriod.year && period === EnumPeriod.century:
      case this.Begin!.Type === EnumPeriod.decade && period === EnumPeriod.century:
      case this.Begin.Type === EnumPeriod.century && period === EnumPeriod.century:
        l2 = this.Begin.Century!;
        break;
    }
    return l2;
  }

  public IsIntersectIntervalsForPeriod(l1: number, r1: number, period: EnumPeriod): boolean {
    const l2: number = this.getLeftBoundForPeriod(period);
    const r2: number = this.getRightBoundForPeriod(period);
    return TLPeriod.isIntersectIntervals(l1, r1, l2, r2);
  }

  /**
   * Есть ли пересечение 2-х целочисленных интервалов
   * @param l1 левая граница интервал 1
   * @param r1 правая граница интервал 1
   */
  IsIntersectIntervals(l1: number, r1: number): boolean {
    return TLPeriod.isIntersectIntervals(l1, r1, this.mBeginDay!, this.mEndDay!);
  }

  static isIntersectIntervals(l1: number, r1: number, l2: number, r2: number): boolean {
    const l = Math.min(l1, l2);
    const r = Math.max(r1, r2);
    const s = r - l;
    return s <= r1 - l1 + (r2 - l2);
  }

  /**
   * Является ли интервал внутренним по отношению к другому
   * @param l1 - внешний интервал левая граница
   * @param r1 - внешний интервал правая граница
   * @param l2 - внутренний интервал левая граница
   * @param r2 - внутренний интервал правая граница
   */
  static isInnerInterval(l1: number, r1: number, l2: number, r2: number): boolean {
    if (l1 > r1 || l2 > r2) throw new Error('Неверно заданы интервалы');
    return l2 >= l1 && l2 <= r1 && r2 >= l1 && r2 <= r1;
  }

  /**
   * Является ли период подмножеством другого периода, который передается параметром
   * @param period
   * @param periodType
   */
  IsSubsetOf(period: TLPeriod, periodType: EnumPeriod) {
    return TLPeriod.isInnerInterval(
      period.getLeftBoundForPeriod(periodType),
      period.getRightBoundForPeriod(periodType),
      this.getLeftBoundForPeriod(periodType),
      this.getRightBoundForPeriod(periodType),
    );
  }

  /**
   * Первый день интервала
   * */
  private GetBeginDate(): number {
    let dt: number = 0;
    switch (this.Begin!.Type) {
      case EnumPeriod.day:
        dt = this.Begin!.Day!;
        break;
      case EnumPeriod.month:
        dt = DateUtils.FirstDayOfMonth(this.Begin!.Month!);
        break;
      case EnumPeriod.year:
        dt = DateUtils.FirstDayOfYear(this.Begin!.Year!);
        break;
      case EnumPeriod.decade:
        dt = DateUtils.FirstDayOfDecade(this.Begin!.Decade!);
        break;
      case EnumPeriod.century:
        dt = DateUtils.FirstDayOfCentury(this.Begin!.Century!);
        break;
    }
    return dt;
  }
  /**
   * Последний день интервала
   * */
  private GetEndDate(): number {
    let dt: number = 0;
    switch (this.End!.Type) {
      case EnumPeriod.day:
        dt = this.End!.Day!;
        break;
      case EnumPeriod.month:
        dt = DateUtils.FirstDayOfMonth(this.End!.Month! + 1) - 1;
        break;
      case EnumPeriod.year:
        dt = DateUtils.FirstDayOfYear(this.End!.Year! + 1) - 1;
        break;
      case EnumPeriod.decade:
        dt = DateUtils.FirstDayOfDecade(this.End!.Decade! + 1) - 1;
        break;
      case EnumPeriod.century:
        dt = DateUtils.FirstDayOfCentury(this.End!.Century! + 1) - 1;
        break;
    }
    return dt;
  }

  public Add(model: TLPeriod): number {
    const rt = this.Periods.push(model);
    return rt;
  }

  public Remove(i: number): boolean {
    if (!this.validIndex(i)) throw new Error('Неверный индекс');
    this.Periods.splice(i, 1);
    return true;
  }

  public get Count(): number {
    return this.Periods.length;
  }

  public get Items(): TLPeriod[] {
    return this.Periods;
  }

  public Item(i: number): TLPeriod {
    if (!this.validIndex(i)) throw new Error('Неверный индекс');
    return this.Periods[i];
  }

  public get IsPeriod() {
    let rt: boolean = false;
    if (this.Begin!.Type === this.End!.Type) {
      switch (this.Begin!.Type) {
        case EnumPeriod.day:
          rt = this.Begin!.Day !== this.End!.Day;
          break;
        case EnumPeriod.month:
          rt = this.Begin!.Month !== this.End!.Month;
          break;
        case EnumPeriod.year:
          rt = this.Begin!.Year !== this.End!.Year;
          break;
        case EnumPeriod.decade:
          rt = this.Begin!.Decade !== this.End!.Decade;
          break;
        case EnumPeriod.century:
          rt = this.Begin!.Century !== this.End!.Century;
          break;
      }
    } else {
      rt = true;
    }
    return rt;
  }

  /**
   * Метод проходит по дереву TLPeriod и выбирает элементы пересекающие интервал
   * @param leftBorder Левая граница интервала
   * @param rightBorder Правая граница интервала
   * @param items Заполняемый массив
   */
  public getAllSuitablePeriodsFromHierarchy(
    leftBorder: number,
    rightBorder: number,
    globalPeriod: EnumPeriod,
    items: TLPeriod[],
  ): void {
    for (let i = 0; i < this.Periods.length; i++) {
      const period = this.Periods[i];
      if (period.Count === 0) {
        if (period.IsIntersectIntervalsForPeriod(leftBorder, rightBorder, globalPeriod)) {
          items.push(period);
        }
      } else {
        if (period.IsIntersectIntervalsForPeriod(leftBorder, rightBorder, globalPeriod)) {
          items.push(period);
        }
        period.getAllSuitablePeriodsFromHierarchy(leftBorder, rightBorder, globalPeriod, items);
      }
    }
  }

  private validIndex(i: number): boolean {
    if (!this.Periods) return false;
    if (this.Periods.length === 0) return false;
    if (i < 0 || i >= this.Periods.length) return false;
    return true;
  }
}
