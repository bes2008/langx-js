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

    return type;
}

export function isString(object: any) {
    return getType(object) == String;
}

export function isNumber(object: any) {
    return getType(object) == Number;
}

export function isBoolean(object: any) {
    return getType(object) == Boolean;
}

export function isDate(object:any) {
    return getType(object)==Date;
}

export function isFunction(object: any) {
    return getType(object) == Function;
}

export function isArray(object:any) {
    return getType(object)==Array;
}

export function isSet(object:any) {
    let type:any = getType(object);
    return type == Set || type == WeakSet;
}

export function isWeakSet(object: any) {
    return getType(object) == WeakSet;
}

export function isMap(object:any) {
    let type:any = getType(object);
    return type == Map || type == WeakMap;
}

export function isWeakMap(object:any) {
    return getType(object) == WeakMap;
}