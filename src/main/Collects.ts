import * as Types from './Types';

export function isIterable(object:any):boolean{
    return Types.isArray(object) || Types.isJsSet(object) || Types.isJsMap(object) || Types.isFunction(object[Symbol.iterator]);
}

import * as Iterables from './Iterables';
export function asIterable(obj:any): Iterable<any> {
    return Iterables.asIterable(obj);
}