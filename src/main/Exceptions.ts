import * as Types from './Types';

export class RuntimeException extends Error {
    constructor(message: string | String | Function) {
        super();
        this.message = Types.isFunction(message) ? (<Function>message)() : message;
    }
}

export class IllegalArgumentException extends RuntimeException{
    constructor(message: string | String | Function) {
        if(message==null){
            message="Illegal argument";
        }
        super(message);
    }
}

export class IndexOutboundException extends RuntimeException {
    constructor(message?: string | String | Function | undefined | null) {
        if (message == null) {
            message = "Index outbound";
        }
        super(message);
    }
}

export class UnsupportOperationException extends RuntimeException {
    constructor(message?: string) {
        super(message ? message : "Unsupport operation");
    }
}