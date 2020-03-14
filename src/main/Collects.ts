import * as Emptys from './Emptys';
import * as Types from './Types';
import * as Objects from './Objects';
import {isArray} from "./Types";
import {isSet} from "./Types";
import {isMap} from "./Types";
import {isFunction} from "./Types";

export function isIterable(object:any):boolean{
    return isArray(object) || isSet(object) || isMap(object) || isFunction(object["next"]) ;
}

export function asIterable() {

}