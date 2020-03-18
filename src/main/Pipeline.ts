import {Collection, HashSet, List} from "./Iterables";
import * as Collects from "./Collects";
import {Consumer, Consumer2, Func, Func2, Predicate, Predicate2} from "./Functions";

export class Pipeline<E extends any> {
    private readonly collection: Collection<E>;

    new(list?: Iterable<E> | Iterator<E> | any) {
        return new Pipeline(list);
    }

    constructor(list?: Iterable<E> | Iterator<E> | any) {
        if (list == null) {
            this.collection = Collects.emptyArrayList();
        }
        this.collection = Collects.asIterable(list);
    }

    forEach(consumer: Consumer<E> | Consumer2<number, E> | Function): void {
        Collects.forEach(this.collection, consumer);
    }

    map(mapper: Func<E, any> | Func2<number, E, any> | Function): Pipeline<E> {
        return new Pipeline(Collects.map(this.collection, mapper));
    }

    filter(predicate: Predicate<E> | Predicate2<number, E> | Function): Pipeline<E> {
        return new Pipeline(Collects.filter(this.collection, predicate));
    }

    firstN(predicate: Predicate<E> | Predicate2<number, E> | Function, count: number): Pipeline<E> {
        return new Pipeline(Collects.firstN(this.collection, predicate, count));
    }

    first(predicate: Predicate<E> | Predicate2<number, E> | Function): null | E {
        return Collects.first(this.collection, predicate);
    }

    toSet(): HashSet<E> {
        return Collects.toSet(this.collection);
    }

    toList(): List<E> {
        return Collects.toList(this.collection);
    }

    toArray(array?: Array<E>): Array<E> {
        return Collects.toArray(this.collection);
    }

    cleanNulls() {
        return new Pipeline(Collects.cleanNulls(this.collection));
    }

    flatMap(mapper?: Func<any, any> | Func2<any, any, any> | Function) {
        return new Pipeline(Collects.flatMap(this.collection, mapper));
    }

    anyMatch(predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
        return Collects.anyMatch(this.collection, predicate);
    }

    allMatch(predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
        return Collects.allMatch(this.collection, predicate);
    }

    noneMatch(predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
        return Collects.noneMatch(this.collection, predicate);
    }

    limit(limit:number):Pipeline<E>{
        return new Pipeline<E>(Collects.limit(this.collection, Math.max(0,limit)));
    }

    skip(skip:number):Pipeline<E>{
        return new Pipeline<E>(Collects.skip(this.collection, Math.max(0,skip)));
    }
}


export function of(list?: Iterable<any> | Iterator<any> | any) {
    return new Pipeline(list);
}

Pipeline["of"] = of;
