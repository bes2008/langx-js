export class ObjectPropertiesIterator implements Iterator<any>{
    private readonly obj:Object;
    private keys:Array<string>;
    private index:number = 0;

      constructor(object:Object) {
          this.obj = object;
          this.keys =Object.keys(object);
          this.index = 0;
      }


    next(...args: [] | [undefined]): IteratorYieldResult<any> | IteratorReturnResult<any> {
        return {
            value:this.obj[this.keys[this.index++]],
            done: this.index < this.keys.length
        };
    }

    return(value?: any): IteratorYieldResult<any> | IteratorReturnResult<any> {
        return {
            value: value,
            done: true
        };
    }

    throw(e?: any): IteratorYieldResult<any> | IteratorReturnResult<any> {
          if(e!=null && e instanceof Error){
              throw e;
          }
          return {
              value:null,
              done: this.index<this.keys.length
          }
    }
}

export function asIterable(object: any) {

}