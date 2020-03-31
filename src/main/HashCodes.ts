import * as Numbers from "./Numbers";
import * as Dates from "./Dates";
import * as Booleans from "./Booleans";
import * as Strings from "./Strings";
import * as Iterables from "./Iterables";
import * as Types from "./Types";
import {isEmpty} from "./Emptys";
import {Objects} from "./index";

Object.defineProperty(Object.prototype, "hashCode", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function () {
        return hashCode(this);
    }
});

Date.prototype["hashCode"] = function () {
    return Dates.hashCode(this);
};

Boolean.prototype["hashCode"] = function () {
    return Booleans.hashCode(this);
};

String.prototype["hashCode"] = function () {
    return Strings.hashCode(this);
};

Number.prototype["hashCode"] = function () {
    return Numbers.hashCode(this);
};

Array.prototype["hashCode"] = function () {
    return Iterables.hashCode(this);
};

Set.prototype["hashCode"] = function () {
    return Iterables.hashCode(this);
};
Map.prototype["hashCode"] = function () {
    return Iterables.hashCode(this);
};


export function hashCode(object: any) {
    if (isEmpty(object)) {
        return 0;
    }
    if (Types.isNumber(object)) {
        return Numbers.hashCode(object);
    }

    if (Types.isBoolean(object)) {
        return Booleans.hashCode(object);
    }

    if (Types.isString(object)) {
        return Strings.hashCode(<string>object);
    }
    if (Types.isDate(object)) {
        return Dates.hashCode(object);
    }
    if( object instanceof Array || object instanceof Set || object instanceof Map || Types.isCollection(object) || Types.isMap(object)){
        return Iterables.hashCode(object);
    }
    return hashCode(Objects.keys(object));
}

