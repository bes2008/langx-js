export class RuntimeException extends Error{
    message: string;
    constructor(message: string | Function) {
        super();
        if()
        this.message = message;

    }
}