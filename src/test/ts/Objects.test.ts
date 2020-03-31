import * as Objects from "../../main/Objects";
import * as logger from "../../main/logger";
/**
 * Objects.test.ts
 */
describe("Objects test", () => {

    test("TreeMap Test", () => {
        debugger;
        let obj = {
            "a":"a",
            b:"b"
        };
        logger.info(Objects.hashCode(obj));
        for(let key in obj){
            logger.debug(key);
        }
    });

});