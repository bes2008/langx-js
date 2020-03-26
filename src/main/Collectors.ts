import * as Functions from "./Functions";
import * as Preconditions from "./Preconditions";
import {
    Consumer2,
    falsePredicate, IndexedConsumer2,
    Predicate,
    Predicate2,
    Supplier0,
    truePredicate
} from "./Functions";

import {
    ArrayList,
    HashMap,
    HashSet,
    LikeJavaMap,
    LinkedHashMap,
    LinkedHashSet,
    LinkedList, List,
    TreeMap,
    TreeSet
} from "./Iterables";
import * as Collects from "./Collects";
import {asIterable, newHashSet, newLinkedHashMap} from "./Collects";
import {Comparator} from "./Comparators";
import {Func} from "./Functions";
import {Func2} from "./Functions";
import * as Types from "./Types";


/**
 * @param C the container will be return, also te container will be fill
 * @param E  the element in a will be iterate
 */
export interface Collector<E extends any, C extends Iterable<E>> {
    supplier(): Supplier0<C>;

    accumulator(): Consumer2<C, E>;

    consumePredicate?(): Predicate<any> | Predicate2<any, any> | Function;

    breakPredicate?(): Predicate<any> | Predicate2<any, any> | Function;
}

export abstract class AbstractCollector<E extends any, C extends Iterable<E>> implements Collector<E, C> {
    consumePredicate(): Predicate<any> | Predicate2<any, any> | Function {
        return truePredicate();
    }

    breakPredicate(): Predicate<any> | Predicate2<any, any> | Function {
        return falsePredicate();
    }

    abstract supplier(): Supplier0<C>;

    abstract accumulator(): Consumer2<C, E>;
}


export function collect1(obj: object, containerFactory: Supplier0<Iterable<any>>, consumer: Consumer2<Iterable<any>, any>, consumePredicate?: Predicate<any> | Predicate2<any, any> | Function, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): Iterable<any> {
    return collect(asIterable(obj), {
        accumulator(): Consumer2<Iterable<any>, any> {
            return consumer;
        },
        supplier(): Supplier0<Iterable<any>> {
            return containerFactory;
        },
        breakPredicate(): Predicate<any> | Predicate2<any, any> | Function {
            return breakPredicate == null ? falsePredicate() : breakPredicate;
        },
        consumePredicate(): Predicate<any> | Predicate2<any, any> | Function {
            return consumePredicate == null ? truePredicate() : consumePredicate;
        }
    });
}

export function collect(iterable: Iterable<any>, collector: Collector<any, Iterable<any>>): Iterable<any> {
    let collection = collector.supplier().get();
    let consumer = collector.accumulator();
    let consumePredicate: Predicate<any> | Predicate2<any, any> | Function;
    if (Types.isFunction(collector["consumePredicate"])) {
        consumePredicate = (<Function>collector["consumePredicate"])();
    } else {
        consumePredicate = truePredicate();
    }

    let breakPredicate: Predicate<any> | Predicate2<any, any> | Function;
    if (Types.isFunction(collector["breakPredicate"])) {
        breakPredicate = (<Function>collector["breakPredicate"])();
    } else {
        breakPredicate = falsePredicate();
    }

    Collects.forEach(iterable, (element) => {
        consumer.accept(collection, element);
    }, consumePredicate, breakPredicate);
    return collection;
}

export function toList(): Collector<any, ArrayList<any>> {
    return toArrayList();
}

export function toArrayList(): Collector<any, ArrayList<any>> {
    return new class extends AbstractCollector<any, ArrayList<any>> {
        accumulator(): Consumer2<any, any> {
            return {
                accept(container: ArrayList<any>, element: any) {
                    container.add(element);
                    this.index++;
                }
            }
        }

        supplier(): Supplier0<ArrayList<any>> {
            return {
                get(): ArrayList<any> {
                    return Collects.newArrayList();
                }
            };
        }

    }
}

export function toLinkedList(): Collector<any, LinkedList<any>> {
    return new class extends AbstractCollector<any, LinkedList<any>> {
        accumulator(): Consumer2<any, any> {
            return {
                accept(container: LinkedList<any>, element: any) {
                    container.add(element);
                }
            };
        }

        supplier(): Supplier0<LinkedList<any>> {
            return {
                get(): LinkedList<any> {
                    return Collects.newLinkedList();
                }
            };
        }

    }
}

export function toSet(): Collector<HashSet<any>, any> {
    return toHashSet();
}

export function toHashSet(): Collector<any, HashSet<any>> {
    return new class extends AbstractCollector<any, HashSet<any>> {
        accumulator(): Consumer2<HashSet<any>, any> {
            return {
                accept(set: HashSet<any>, element: any) {
                    set.add(element);
                }
            };
        }

        supplier(): Supplier0<HashSet<any>> {
            return {
                get(): HashSet<any> {
                    return newHashSet();
                }
            };
        }
    }
}


export function toTreeSet(comparator?: Comparator<any>): Collector<any, TreeSet<any>> {
    return new class extends AbstractCollector<any, TreeSet<any>> {
        accumulator(): Consumer2<TreeSet<any>, any> {
            return {
                accept(set: TreeSet<any>, element: any) {
                    set.add(element);
                }
            };
        }

        supplier(): Supplier0<TreeSet<any>> {
            return {
                get(): TreeSet<any> {
                    return Collects.newTreeSet(undefined, comparator);
                }
            };
        }
    }
}

export function toLinkedHashSet(): Collector<any, LinkedHashSet<any>> {
    return new class extends AbstractCollector<any, LinkedHashSet<any>> {
        accumulator(): Consumer2<LinkedHashSet<any>, any> {
            return {
                accept(set: LinkedHashSet<any>, element: any) {
                    set.add(element);
                }
            };
        }

        supplier(): Supplier0<LinkedHashSet<any>> {
            return {
                get(): LinkedHashSet<any> {
                    return Collects.newLinkedHashSet(undefined);
                }
            };
        }
    }
}

export function toMap(keyMapper: Func<any, any> | Func2<any, any, any> | Function, valueMapper: Func<any, any> | Func2<any, any, any> | Function): Collector<any, HashMap<any, any>> {
    return toHashMap(keyMapper, valueMapper);
}

export function toHashMap(keyMapper: Func<any, any> | Func2<any, any, any> | Function, valueMapper: Func<any, any> | Func2<any, any, any> | Function): Collector<any, HashMap<any, any>> {
    return new class extends AbstractCollector<any, HashMap<any, any>> {
        accumulator(): Consumer2<HashMap<any, any>, any> {
            return new class implements IndexedConsumer2<HashMap<any, any>, any> {
                index: number = 0;

                accept(map: HashMap<any, any>, element: any) {
                    map.put(Functions.mappingCollectionElement(keyMapper, element, this.index), Functions.mappingCollectionElement(valueMapper, element, this.index));
                    this.index++;
                }
            };
        }

        supplier(): Supplier0<HashMap<any, any>> {
            return {
                get(): HashMap<any, any> {
                    return Collects.newHashMap();
                }
            };
        }
    }
}

export function toLinkedHashMap(keyMapper: Func<any, any> | Func2<any, any, any> | Function, valueMapper: Func<any, any> | Func2<any, any, any> | Function): Collector<any, LinkedHashMap<any, any>> {
    return new class extends AbstractCollector<any, LinkedHashMap<any, any>> {
        accumulator(): Consumer2<LinkedHashMap<any, any>, any> {
            return new class implements IndexedConsumer2<LinkedHashMap<any, any>, any> {
                index: number = 0;

                accept(map: LinkedHashMap<any, any>, element: any) {
                    map.put(Functions.mappingCollectionElement(keyMapper, element, this.index), Functions.mappingCollectionElement(valueMapper, element, this.index));
                    this.index++;
                }
            };
        }

        supplier(): Supplier0<LinkedHashMap<any, any>> {
            return {
                get(): LinkedHashMap<any, any> {
                    return Collects.newLinkedHashMap();
                }
            };
        }
    }
}


export function toTreeMap(keyMapper: Func<any, any> | Func2<any, any, any> | Function, valueMapper: Func<any, any> | Func2<any, any, any> | Function, comparator?: Comparator<any>): Collector<any, TreeMap<any, any>> {
    return new class extends AbstractCollector<any, TreeMap<any, any>> {
        accumulator(): Consumer2<TreeMap<any, any>, any> {
            return new class implements IndexedConsumer2<TreeMap<any, any>, any> {
                index: number = 0;

                accept(map: TreeMap<any, any>, element: any) {
                    map.put(Functions.mappingCollectionElement(keyMapper, element, this.index), Functions.mappingCollectionElement(valueMapper, element, this.index));
                    this.index++;
                }
            };
        }

        supplier(): Supplier0<TreeMap<any, any>> {
            return {
                get(): TreeMap<any, any> {
                    return Collects.newTreeMap(undefined, comparator);
                }
            };
        }
    }
}


export function groupingBy(classifier: Func<any, any> | Func2<any, any, any> | Function, mapFactory: Supplier0<LikeJavaMap<any, List<any>>>): Collector<any, LikeJavaMap<any, List<any>>> {
    Preconditions.checkNonNull(classifier);
    Preconditions.checkNonNull(mapFactory);
    return new class extends AbstractCollector<any, LikeJavaMap<any, List<any>>> {
        accumulator(): Consumer2<LikeJavaMap<any, any>, any> {
            return new class implements IndexedConsumer2<LikeJavaMap<any, List<any>>, any> {
                index: number = 0;

                accept(map: LikeJavaMap<any, List<any>>, element: any) {
                    let group: any = Functions.mapping(classifier, [element]);
                    let list: List<any> = map.get(group);
                    if (list == null) {
                        list = Collects.newArrayList();
                        map.put(group, list);
                    }
                    list.add(element);
                    this.index++;
                }
            }
        }

        supplier(): Supplier0<LikeJavaMap<any, List<any>>> {
            return mapFactory;
        }

    }
}

export function partioningBy(classifier: Func<any, any> | Func2<any, any, any> | Function): Collector<any, LikeJavaMap<any, List<any>>> {
    return groupingBy(classifier, {
        get(): LikeJavaMap<any, List<any>> {
            return newLinkedHashMap();
        }
    });
}
