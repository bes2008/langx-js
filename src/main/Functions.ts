import * as Types from "./Types";

export interface Func<I, O> {
    apply(input: I): O;
}

export interface Func2<I1, I2, O> {
    apply(i1: I1, i2: I2): O;
}

export enum FunctionType {
    UNKNOWN,
    FUNC,
    FUNC2,
    FUNCTION
}

export function judgeFuncType(mapper?: Func<any, any> | Func2<any, any, any> | Function): FunctionType {
    if (mapper == null) {
        return FunctionType.UNKNOWN;
    }
    let hasApplyMethod = Types.isFunction(mapper["apply"]);
    if (hasApplyMethod) {
        if (mapper["apply"] == Function.apply) {
            hasApplyMethod = false;
        }
    }
    if (!hasApplyMethod) {
        let consumerIsFunction = Types.isFunction(mapper);
        if (consumerIsFunction) {
            return FunctionType.FUNCTION;
        }
    } else {
        if ((<Function>mapper["apply"]).length == 1) {
            return FunctionType.FUNC;
        } else if ((<Function>mapper["apply"]).length >= 2) {
            return FunctionType.FUNC2;
        }
    }
    return FunctionType.UNKNOWN;
}


export interface Consumer<I> {
    accept(i: I);
}

export interface Consumer2<I1, I2> {
    accept(i1: I1, i2: I2);
}

export enum ConsumerType {
    UNKNOWN,
    CONSUMER,
    CONSUMER2,
    FUNCTION
}

export function judgeConsumerType(consumer: Consumer<any> | Consumer2<any, any> | Function): ConsumerType {
    if (consumer == null) {
        return ConsumerType.UNKNOWN;
    }
    let hasAcceptMethod = Types.isFunction(consumer["accept"]);

    if (!hasAcceptMethod) {
        let consumerIsFunction = Types.isFunction(consumer);
        if (consumerIsFunction) {
            return ConsumerType.FUNCTION;
        }
    } else {
        if ((<Function>consumer["accept"]).length == 1) {
            return ConsumerType.CONSUMER;
        } else {
            return ConsumerType.CONSUMER2;
        }
    }
    return ConsumerType.UNKNOWN;
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


export enum PredicateType {
    UNKNOWN,
    PREDICATE,
    PREDICATE2,
    FUNCTION
}

export function judgePredicateType(predicate?: Predicate<any> | Predicate2<any, any> | Function): PredicateType {
    if (predicate == null) {
        return PredicateType.UNKNOWN;
    }
    let hasTestMethod = Types.isFunction(predicate["test"]);

    if (!hasTestMethod) {
        let predicateIsFunction = Types.isFunction(predicate);
        if (predicateIsFunction) {
            return PredicateType.FUNCTION;
        }
    } else {
        if ((<Function>predicate["test"]).length == 1) {
            return PredicateType.PREDICATE;
        } else {
            return PredicateType.PREDICATE2;
        }
    }
    return PredicateType.UNKNOWN;
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