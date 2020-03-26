import * as Functions from "./Functions";
import {
    Consumer2,
    falsePredicate,
    Predicate,
    Predicate2,
    Supplier0,
    truePredicate
} from "./Functions";

import {ArrayList, HashMap, HashSet, LinkedHashMap, LinkedHashSet, LinkedList, TreeMap, TreeSet} from "./Iterables";
import * as Collects from "./Collects";
import {asIterable, newHashSet} from "./Collects";
import {Comparator} from "./Comparators";
import {Func} from "./Functions";
import {Func2} from "./Functions";
import * as Types from "./Types";


/**
 * @param C the container will be return, also te container will be fill
 * @param E  the element in a will be iterate
 */
export interface Collector<C extends Iterable<E>,E extends any> {
    supplier():Supplier0<C>;
    accumulator():Consumer2<C, E>;
    consumePredicate?():Predicate<any>|Predicate2<any, any>|Function;
    breakPredicate?():Predicate<any>|Predicate2<any, any>|Function;
}

export abstract class AbstractCollector<C extends Iterable<E>,E extends any> implements Collector<C,E>{
    consumePredicate(): Predicate<any> | Predicate2<any, any> | Function {
        return truePredicate();
    }

    breakPredicate(): Predicate<any> | Predicate2<any, any> | Function {
        return  falsePredicate();
    }

    abstract supplier(): Supplier0<C>;
    abstract accumulator(): Consumer2<C, E>;
}


export function collect1(obj: object, containerFactory: Supplier0<Iterable<any>>, consumer: Consumer2<Iterable<any>, any>, consumePredicate?: Predicate<any> | Predicate2<any, any> | Function, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function):Iterable<any> {
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

export function collect(iterable:Iterable<any>, collector:Collector<Iterable<any>,any>):Iterable<any> {
    let collection = collector.supplier().get();
    let consumer = collector.accumulator();
    let consumePredicate:Predicate<any>|Predicate2<any, any>|Function;
    if(Types.isFunction(collector["consumePredicate"])){
        consumePredicate = (<Function>collector["consumePredicate"])();
    }else{
        consumePredicate = truePredicate();
    }

    let breakPredicate:Predicate<any>|Predicate2<any, any>|Function;
    if(Types.isFunction(collector["breakPredicate"])){
        breakPredicate = (<Function>collector["breakPredicate"])();
    }else{
        breakPredicate = falsePredicate();
    }

    Collects.forEach(iterable, (element)=>{
        consumer.accept(collection, element);
    }, consumePredicate, breakPredicate);
    return collection;
}

export function toList(): Collector<any, ArrayList<any>> {
    return toArrayList();
}

export function toArrayList(): Collector<any, ArrayList<any>> {
    return new class extends AbstractCollector<ArrayList<any>, any> {
        accumulator(): Consumer2<any, any> {
            return {
                accept(container: ArrayList<any>, element: any) {
                    container.add(element);
                }
            };
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
    return new class extends AbstractCollector<LinkedList<any>, any> {
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

export function toHashSet(): Collector<HashSet<any>, any> {
    return new class extends AbstractCollector<HashSet<any>, any> {
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


export function toTreeSet(comparator?:Comparator<any>): Collector<TreeSet<any>, any> {
    return new class extends AbstractCollector<TreeSet<any>, any> {
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
                    return Collects.newTreeSet(undefined,comparator);
                }
            };
        }
    }
}

export function toLinkedHashSet(): Collector<LinkedHashSet<any>, any> {
    return new class extends AbstractCollector<LinkedHashSet<any>, any> {
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

export function toMap(keyMapper:Func<any, any> | Func2<any, any, any> | Function, valueMapper:Func<any, any> | Func2<any, any, any> | Function): Collector<HashMap<any,any>, any> {
    return toHashMap(keyMapper, valueMapper);
}

export function toHashMap(keyMapper:Func<any, any> | Func2<any, any, any> | Function, valueMapper:Func<any, any> | Func2<any, any, any> | Function): Collector<HashMap<any,any>, any> {
    return new class extends AbstractCollector<HashMap<any,any>, any> {
        accumulator(): Consumer2<HashMap<any,any>, any> {
            return {
                accept(map: HashMap<any,any>, element: any) {
                    map.put(Functions.mapping(keyMapper,[element], Functions.mapping(valueMapper,[element])));
                }
            };
        }

        supplier(): Supplier0<HashMap<any,any>> {
            return {
                get(): HashMap<any,any> {
                    return Collects.newHashMap();
                }
            };
        }
    }
}

export function toLinkedHashMap(keyMapper:Func<any, any> | Func2<any, any, any> | Function, valueMapper:Func<any, any> | Func2<any, any, any> | Function): Collector<LinkedHashMap<any,any>, any> {
    return new class extends AbstractCollector<LinkedHashMap<any,any>, any> {
        accumulator(): Consumer2<LinkedHashMap<any,any>, any> {
            return {
                accept(map: LinkedHashMap<any,any>, element: any) {
                    map.put(Functions.mapping(keyMapper,[element], Functions.mapping(valueMapper,[element])));
                }
            };
        }

        supplier(): Supplier0<LinkedHashMap<any,any>> {
            return {
                get(): LinkedHashMap<any,any> {
                    return Collects.newLinkedHashMap();
                }
            };
        }
    }
}


export function toTreeMap(keyMapper:Func<any, any> | Func2<any, any, any> | Function, valueMapper:Func<any, any> | Func2<any, any, any> | Function, comparator?:Comparator<any>): Collector<TreeMap<any,any>, any> {
    return new class extends AbstractCollector<TreeMap<any,any>, any> {
        accumulator(): Consumer2<TreeMap<any,any>, any> {
            return {
                accept(map: TreeMap<any,any>, element: any) {
                    map.put(Functions.mapping(keyMapper,[element], Functions.mapping(valueMapper,[element])));
                }
            };
        }

        supplier(): Supplier0<TreeMap<any,any>> {
            return {
                get(): TreeMap<any,any> {
                    return Collects.newTreeMap(undefined, comparator);
                }
            };
        }
    }
}

