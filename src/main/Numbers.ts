import * as Types from "./Types";

export function isFloat(n:number|string):boolean{
    let n1:Number= Number(n);
    if(!Types.isFunction(Number["isFloat"])){
        Number["isFloat"]  = (n2)=> {
            if(!isNumber(n2)){
                return false;
            }
            return n2.toString().indexOf(".")!=-1;
        };
    }
    return Number["isFloat"].call(Number, n1);
}

export function isInteger(n:number|string|any):boolean {
    let n1:Number= Number(n);
    if(!Types.isFunction(Number["isInteger"])){
        Number["isInteger"]  = (n2)=> {
            if(!isNumber(n2)){
                return false;
            }
            return n2.toString().indexOf(".")==-1;
        };
    }
    return Number["isInteger"].call(Number, n1);
}

export function isNumber(obj:any):boolean {
    return !Number.isNaN(Number(obj));
}

export function parseInt(str:string|String|number|Number, radix?:number):number{
    if(radix==null || radix<2 || radix>36){
        radix=10;
    }
    return Number.parseInt(str.toString(), radix);
}

export function hashCode(n:number) {
    return parseInt(n)
}