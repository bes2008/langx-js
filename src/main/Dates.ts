import * as Types from "./Types";
export function hashCode(date: Date): number {
    return date.getTime();
}

export function equals(date:Date, date2:number|string|Date|any) {
    if (date2 instanceof Date) {
        return date.getTime() == date2.getTime();
    }
    if (Types.isString(date2)) {
        return (date.toLocaleString() == date2 || date.toUTCString() == date2 || ("" + date.getTime()) == date2);
    }
    if(Types.isNumber(date2)){
        return date.getTime()==date2;
    }
    return false;
}