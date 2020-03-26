import {Collection, HashSet, LikeJavaMap, LikeJavaSet, List} from "./Iterables";
import * as Collects from "./Collects";
import {Consumer, Consumer2, Func, Func2, Predicate, Predicate2, Supplier0} from "./Functions";
import * as Objects from "./Objects";
import {Comparator} from "./Comparators";
import * as Collectors from "./Collectors";
import {Collector} from "./Collectors";

export class Pipeline<E extends any> {
    private readonly collection: Collection<E>;

    new(list?: Iterable<E> | Iterator<E> | any) {
        return new Pipeline(list);
    }

    constructor(list?: Iterable<E> | Iterator<E> | any) {
        if (list == null) {
            this.collection = Collects.emptyArrayList();
        }
        this.collection = Collects.asList(list);
    }

    forEach(consumer: Consumer<E> | Consumer2<number, E> | Function, consumePredicate?: Predicate<any> | Predicate2<any, any> | Function, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): void {
        Collects.forEach(this.collection, consumer, consumePredicate, breakPredicate);
    }

    map(mapper: Func<E, any> | Func2<number, E, any> | Function): Pipeline<E> {
        return new Pipeline(Collects.map(this.collection, mapper));
    }

    filter(predicate: Predicate<E> | Predicate2<number, E> | Function, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): Pipeline<E> {
        return new Pipeline(Collects.filter(this.collection, predicate, breakPredicate));
    }

    findN(predicate: Predicate<E> | Predicate2<number, E> | Function, count: number): Pipeline<E> {
        return new Pipeline(Collects.findN(this.collection, predicate, count));
    }

    findFirst(predicate?: Predicate<E> | Predicate2<number, E> | Function): null | E {
        if (predicate == null) {
            predicate = <Predicate<E>>Objects.unknownNull();
        }
        return Collects.findFirst(this.collection, predicate);
    }

    asSet(): LikeJavaSet<E> {
        return <HashSet<any>>this.collect(Collectors.toHashSet());
    }

    asList(): List<E> {
        return <List<E>>this.collect(Collectors.toArrayList());
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

    limit(limit: number): Pipeline<E> {
        return new Pipeline<E>(Collects.limit(this.collection, Math.max(0, limit)));
    }

    skip(skip: number): Pipeline<E> {
        return new Pipeline<E>(Collects.skip(this.collection, Math.max(0, skip)));
    }

    distinct(comparator?: Comparator<E>): Pipeline<E> {
        return new Pipeline<E>(Collects.distinct(this.collection));
    }

    reverse(): Pipeline<E> {
        return new Pipeline<E>(Collects.reverse(this.collection));
    }

    count(): number {
        return Collects.count(this.collection);
    }

    addAll(appendment: Iterable<any>): Pipeline<any> {
        Collects.addAll(this.collection, appendment);
        return this;
    }

    contains(element: any, deep?: boolean): boolean {
        return Collects.contains(this.collection, element, deep);
    }

    containsAll(iterable: Iterable<any>, deep?: boolean): boolean {
        return Collects.contains(this.collection, iterable, deep);
    }

    containsAny(iterable: Iterable<any>, deep?: boolean): boolean {
        return Collects.contains(this.collection, iterable, deep);
    }

    containsNone(iterable: Iterable<any>, deep?: boolean): boolean {
        return Collects.contains(this.collection, iterable, deep);
    }

    collect(collector: Collector<Iterable<any>, any>): Iterable<any> {
        return Collectors.collect(this.collection, collector);
    }

    groupBy(classifier: Func<any, any> | Func2<any, any, any> | Function, mapFactory: Supplier0<LikeJavaMap<any, List<any>>>): LikeJavaMap<any, List<any>> {
        return Collects.groupBy(classifier, mapFactory);
    }

    partitionBy(classifier: Func<any, any> | Func2<any, any, any> | Function):List<List<any>> {
        return Collects.partitionBy(this.collection,classifier);
    }
}


export function of(list?: Iterable<any> | Iterator<any> | any) {
    return new Pipeline(list);
}

Pipeline["of"] = of;
