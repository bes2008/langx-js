import {AbstractCollection, AbstractMap, AbstractSet} from "./Iterables";

export function getType (object: any) : any {
    let typeString = typeof object;
    var type: any = undefined;
    switch (typeString) {
        case "undefined":
            type = undefined;
            break;
        case "boolean":
            type = Boolean;
            break;
        case "string":
            type = String;
            break;
        case "function":
            type = Function;
            break;
        case "bigint":
        case "number":
            type = Number;
            break;
        case "symbol":
        case "object":
            type = Object;
            break;
        default:
            type = Object;
    }
    if (type != undefined && type != Object) {
        return type;
    }

    if(object instanceof Date){
        return Date;
    }

    if (Array.isArray(object)) {
        return Array;
    }

    if(object instanceof Map){
        return Map;
    }

    if(object instanceof WeakMap){
        return WeakMap;
    }

    if(object instanceof Set){
        return Set;
    }
    if(object instanceof WeakSet){
        return WeakSet;
    }
    if(object instanceof Error){
        return Error;
    }

    return type;
}

export function isString(object: any):boolean {
    return getType(object) == String;
}

export function isNumber(object: any) :boolean{
    return getType(object) == Number;
}

export function isBoolean(object: any):boolean {
    return getType(object) == Boolean;
}

export function isDate(object:any):boolean {
    return getType(object)==Date;
}

export function isFunction(object: any):boolean {
    return getType(object) == Function;
}

export function isArray(object:any):boolean {
    return getType(object)==Array;
}



export function isWeakSet(object: any):boolean {
    return getType(object) == WeakSet;
}

export function isJsMap(object:any):boolean {
    let type:any = getType(object);
    return type == Map || type == WeakMap;
}

export function isMap(object:any) {
    return isJsMap(object) || isJavaMap(object);
}

export function isWeakMap(object:any):boolean {
    return getType(object) == WeakMap;
}

export function isError(object:any):boolean {
    return getType(object) ==Error;
}

export function isCollection(object:any) :boolean{
    return isArray(object) || isJsSet(object) || isJavaCollection(object);
}

export function isJavaCollection(object:any) {
    return object instanceof AbstractCollection;
}

export function isJavaMap(object:any) {
    return object instanceof AbstractMap;
}

export function isJavaSet(object:any) {
    return object instanceof AbstractSet;
}

export function isJsSet(object:any) :boolean{
    let type:any = getType(object);
    return type == Set;
}

export function isSet(object:any) {
    return isJsSet(object) || isJavaSet(object);
}

export function isSimpleObject(object:any):boolean {
    return !isFunction(object)
        && !isNumber(object)
        && !isString(object)
        && !isBoolean(object)
        && !isDate(object)
        && !isMap(object)
        && !isCollection(object)
        && !isError(object)
        ;
}