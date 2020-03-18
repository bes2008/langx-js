export interface Formatter<DATA extends any, O extends any >{
    format(data:DATA, params?:Array<any>):O;
}
