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
    return type;
}

export function isFunction(object: any) {
    return getType(object) == Function;
}

export function isArray(object:any) {
    return getType(object)==Array;
}