import Emptys from './Emptys';
import {RuntimeException} from "./Exceptions";
import {Predicate, Predicate2} from "./Functions";

export function checkNonNull(obj: any, message: string | String | Function): any {
    if (Emptys.isNull(obj)) {
        if(Emptys.isNull(message)){
            message = "is null";
        }
        throw new RuntimeException(message);
    }
    return obj;
}

export function checkNull(obj: any, message: string | String | Function) {
    if (Emptys.isNotNull(obj)) {
        if(Emptys.isNull(message)){
            message = "is not null";
        }
        throw new RuntimeException(message);
    }
    return obj;
}

export function checkTrue(expression : boolean | Boolean | Predicate<any> | Predicate2<any,any>, message: string | String | Function) {
    if(expression instanceof  Function){
        expression = (<Function>expression)();
    }

    if(!expression){
        if(Emptys.isNull(message)){
            message = "is not true expression";
        }
        throw new RuntimeException(message);
    }
}