import * as Objects from "./Objects";
export interface Comparator<E> {
    compare(e1: E, e2: E): number;
}

export class NumberComparator implements Comparator<number> {
    compare(e1: number, e2: number): number {
        return e1 - e2;
    }
}

export class StringComparator implements Comparator<string> {
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

export class DateComparator implements Comparator<Date> {
    compare(e1: Date, e2: Date): number {
        return e1.getTime() - e2.getTime();
    }
}

export class BooleanComparator implements Comparator<Boolean> {
    compare(e1: Boolean, e2: Boolean): number {
        if (e1 == e2) {
            return 0;
        }
        return e1 ? 1 : -1;
    }
}

export class HashedComparator<E> implements Comparator<E>{
    compare(e1: E, e2: E): number {
        return Objects.hashCode(e1)- Objects.hashCode(e2);
    }
}