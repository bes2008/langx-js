import * as Types from "./Types";
import * as Preconditions from "./Preconditions";

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
import {ArrayList} from "./Iterables";

export class IsNullPredicate implements Predicate<any> {
    test(i: any): boolean {
        return Emptys.isNull(i);
    }
}

export function isNullPredicate(): Predicate<any> {
    return new IsNullPredicate();
}

export class AllPredicate implements Predicate<any>{
    private readonly predicates:ArrayList<Predicate<any>> = new ArrayList<Predicate<any>>();
    constructor(predicates:Iterable<Predicate<any>>) {
        Preconditions.checkNonNull(predicates);
        for (let predicate of predicates){
            if(predicate!=null){
                this.predicates.add(predicate);
            }
        }
    }
    test(i: any): boolean {
        let matched: boolean= true;
        for(let predicate of this.predicates){
            matched = predicate.test(i);
            if(!matched){
                return  false;
            }
        }
        return true;
    }
}

export class AllPredicate2 implements Predicate2<any,any>{
    private readonly predicates:ArrayList<Predicate2<any,any>> = new ArrayList<Predicate2<any,any>>();
    constructor(predicates:Iterable<Predicate2<any,any>>) {
        Preconditions.checkNonNull(predicates);
        for (let predicate of predicates){
            if(predicate!=null){
                this.predicates.add(predicate);
            }
        }
    }
    test(i: any,i2:any): boolean {
        let matched: boolean= true;
        for(let predicate of this.predicates){
            matched = predicate.test(i,i2);
            if(!matched){
                return  false;
            }
        }
        return true;
    }
}

export function allPredicate(predicates:Iterable<Predicate<any>>) {
    return new AllPredicate(predicates);
}

export function allPredicate2(predicates:Iterable<Predicate2<any, any>>) {
    return new AllPredicate2(predicates);
}

export class AnyPredicate implements Predicate<any>{
    private readonly predicates:ArrayList<Predicate<any>> = new ArrayList<Predicate<any>>();
    constructor(predicates:Iterable<Predicate<any>>) {
        Preconditions.checkNonNull(predicates);
        for (let predicate of predicates){
            if(predicate!=null){
                this.predicates.add(predicate);
            }
        }
    }
    test(i: any): boolean {
        let matched: boolean= false;
        for(let predicate of this.predicates){
            matched = predicate.test(i);
            if(matched){
                return true;
            }
        }
        return false;
    }
}
export class AnyPredicate2 implements Predicate2<any,any>{
    private readonly predicates:ArrayList<Predicate2<any,any>> = new ArrayList<Predicate2<any,any>>();
    constructor(predicates:Iterable<Predicate2<any,any>>) {
        Preconditions.checkNonNull(predicates);
        for (let predicate of predicates){
            if(predicate!=null){
                this.predicates.add(predicate);
            }
        }
    }
    test(i: any,i2:any): boolean {
        let matched: boolean= false;
        for(let predicate of this.predicates){
            matched = predicate.test(i,i2);
            if(matched){
                return true;
            }
        }
        return false;
    }
}
export function anyPredicate(predicates:Iterable<Predicate<any>>) {
    return new AnyPredicate(predicates);
}

export function anyPredicate2(predicates:Iterable<Predicate2<any, any>>) {
    return new AnyPredicate2(predicates);
}
export class NonePredicate implements Predicate<any>{
    private readonly predicates:ArrayList<Predicate<any>> = new ArrayList<Predicate<any>>();
    constructor(predicates:Iterable<Predicate<any>>) {
        Preconditions.checkNonNull(predicates);
        for (let predicate of predicates){
            if(predicate!=null){
                this.predicates.add(predicate);
            }
        }
    }
    test(i: any): boolean {
        let matched: boolean= true;
        for(let predicate of this.predicates){
            matched = predicate.test(i);
            if(matched){
                return false;
            }
        }
        return true;
    }
}

export class NonePredicate2 implements Predicate2<any,any>{
    private readonly predicates:ArrayList<Predicate2<any,any>> = new ArrayList<Predicate2<any,any>>();
    constructor(predicates:Iterable<Predicate2<any,any>>) {
        Preconditions.checkNonNull(predicates);
        for (let predicate of predicates){
            if(predicate!=null){
                this.predicates.add(predicate);
            }
        }
    }
    test(i: any, i2:any): boolean {
        let matched: boolean= true;
        for(let predicate of this.predicates){
            matched = predicate.test(i,i2);
            if(matched){
                return false;
            }
        }
        return true;
    }
}

export function nonePredicate(predicates:Iterable<Predicate<any>>) {
    return new NonePredicate(predicates);
}

export function nonePredicate2(predicates:Iterable<Predicate2<any, any>>) {
    return new NonePredicate2(predicates);
}

export class NonPredicate implements Predicate<any>{
    private readonly predicate:Predicate<any>;
    constructor(predicate:Predicate<any>) {
        this.predicate = predicate;
    }

    test(i: any): boolean {
        return !this.predicate.test(i);
    }
}

export class NonPredicate2 implements Predicate2<any,any>{
    private readonly predicate:Predicate2<any,any>;
    constructor(predicate:Predicate2<any,any>) {
        this.predicate = predicate;
    }

    test(i: any,i2:any): boolean {
        return !this.predicate.test(i,i2);
    }
}

export function nonPredicate(predicate:Predicate<any>){
    return new NonPredicate(predicate);
}

export function nonPredicate2(predicate:Predicate2<any,any>){
    return new NonPredicate2(predicate);
}

export function nonPredicateAny(predicate:Predicate<any>|Predicate2<any,any>|Function) {
    let predicateType = judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let p:Predicate<any>|Predicate2<any,any>|Function|any;
    switch (predicateType) {
        case PredicateType.PREDICATE:
            p = nonPredicate(<Predicate<any>>predicate);
            break;
        case PredicateType.PREDICATE2:
            p = nonPredicate2(<Predicate2<any,any>>predicate);
            break;
        case PredicateType.FUNCTION:
            p = (i1:any,i2:any)=>{
                return !(<Function>predicate).call({},i1,i2);
            };
            break;
    }
    return p;
}

export class BooleanPredicate implements Predicate<any>{
    private readonly value:boolean;
    constructor(value:boolean) {
        Preconditions.checkTrue(Types.isBoolean(value));
        this.value = value;
    }

    test(i: any): boolean {
        return this.value;
    }
}

export function booleanPredicate(value:boolean) {
    return new BooleanPredicate(value);
}

export function truePredicate() {
    return booleanPredicate(true);
}

export function falsePredicate() {
    return booleanPredicate(false);
}