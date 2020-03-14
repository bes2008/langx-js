import * as Types from './Types';
export class RuntimeException extends Error{
    constructor(message: string| String | Function) {
        super();
        this.message = Types.isFunction(message) ? (<Function>message)() : message;
    }

}