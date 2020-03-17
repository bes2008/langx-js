import * as Numbers from "./Numbers";
import * as Dates from "./Dates";
import * as Booleans from "./Booleans";
import * as Objects from "./Objects";
import * as Strings from "./Strings";
import * as Iterables from "./Iterables";

Object.prototype["hashCode"]=function(){
    return Objects.hashCode(this);
};

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

Set.prototype["hashCode"]=function () {
    return Iterables.hashCode(this);
};
Map.prototype["hashCode"]=function () {
    return Iterables.hashCode(this);
};