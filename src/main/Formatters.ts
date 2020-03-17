export interface Formatter<DATA extends any, PARAMS >{
    format(data:DATA, params:PARAMS);
}