export interface Func<I, O> {
    apply(input: I): O;
}

export interface Func2<I1, I2, O> {
    apply(i1: I1, i2: I2): O;
}

export interface Consumer<I> {
    accept(i: I);
}

export interface Consumer2<I1, I2> {
    accept(i1: I1, i2: I2);
}

export interface Supplier0<O> {
    get(): O;
}

export interface Supplier<I, O> {
    get(i: I): O;
}

export interface Supplier2<I1, I2, O> {
    get(i1: I1, i2: I2): O;
}

export interface Predicate<I> {
    test(i: I): boolean;
}

export interface Predicate2<I1, I2> {
    test(i1: I1, i2: I2): boolean;
}

import * as Emptys from "./Emptys";

export class IsNullPredicate implements Predicate<any> {
    test(i: any): boolean {
        return Emptys.isNull(i);
    }
}

export function isNullPredicate(): Predicate<any> {
    return new IsNullPredicate();
}