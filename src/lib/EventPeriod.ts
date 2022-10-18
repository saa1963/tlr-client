import { EnumPeriod } from './EnumPeriod';

export class Event {
    constructor(public ValueEvent: number, public TypeEvent: EnumPeriod) { }
}

export class Period {
    constructor(public Begin: Event, public End: Event, public TypePeriod: EnumPeriod) { }
}
