import * as Objects from "./Objects";
import * as Preconditions from "./Preconditions";
import * as Types from "./Types";
import * as Functions from "./Functions";
import {Func2, FunctionType} from "./Functions";

export interface Comparator<E> {
    compare(e1: E, e2: E): number;
}

export abstract class AbstractComparator<E> implements Comparator<E> {
    abstract compare(e1: E, e2: E): number;
}

export function isComparator(c: any) {
    if(Objects.isNull(c)){
        return false;
    }
    if(c instanceof AbstractComparator) {
        return true;
    }
    if(Types.isFunction(c["compare"])){
        let func:Function = <Function> c["compare"];
        return func.length>=2;
    }
    return false;
}

export class NumberComparator extends AbstractComparator<number> {
    compare(e1: number, e2: number): number {
        return e1 - e2;
    }
}

export class StringComparator extends AbstractComparator<string> {
    compare(e1: string, e2: string): number {
        if (e1 == null || e2 == null) {
            if (e1 == null && e2 == null) {
                return 0;
            }
            return e1 == null ? -1 : 1;
        }
        let minLength: number = Math.min(e1.length, e2.length);
        let i: number = 0;
        while (i < minLength) {
            let delta: number = e1.charCodeAt(i) - e2.charCodeAt(i);
            if (delta == 0) {
                i++;
            } else {
                return delta;
            }
        }
        return e1.length - e2.length;
    }
}

export class DateComparator extends AbstractComparator<Date> {
    compare(e1: Date, e2: Date): number {
        return e1.getTime() - e2.getTime();
    }
}

export class BooleanComparator extends AbstractComparator<Boolean> {
    compare(e1: Boolean, e2: Boolean): number {
        if (e1 == e2) {
            return 0;
        }
        return e1 ? 1 : -1;
    }
}

export class HashedComparator<E> extends AbstractComparator<E> {
    compare(e1: E, e2: E): number {
        return Objects.hashCode(e1) - Objects.hashCode(e2);
    }
}

export class ReverseComparator<E> extends AbstractComparator<E> {
    private readonly comparator: Comparator<E>;

    constructor(comparator: Comparator<E>) {
        super();
        this.comparator = comparator;
    }

    compare(e1: E, e2: E): number {
        return this.comparator.compare(e2, e1);
    }
}

export class IsComparator<E> extends AbstractComparator<E> {
    constructor() {
        super();
    }

    compare(e1: E, e2: E): number {
        return e1 === e2 ? 0 : 1;
    }
}

export class EqualsComparator<E> extends AbstractComparator<E> {
    constructor() {
        super();
    }

    compare(e1: E, e2: E): number {
        return Objects.equals(e1, e2, true) ? 0 : 1;
    }
}

export class FunctionComparator<E> extends AbstractComparator<E> {
    private readonly comp: Function|Func2<any, any, any>|Comparator<any>;

    constructor(f: Function|Func2<any, any, any>|Comparator<any>) {
        super();
        Preconditions.checkTrue(Functions.judgeFuncType(f)!=FunctionType.UNKNOWN, "argument is not a function");
        this.comp = f;
    }

    compare(e1: E, e2: E): number {
        let ret =isComparator(this.comp)? (<Comparator<any>>this.comp).compare(e1,e2): Functions.callFunction(<Function>this.comp, e1, e2);
        if (ret) {
            return 0;
        }
        if (Types.isNumber(ret)) {
            return ret;
        }
        return 1;
    }
}