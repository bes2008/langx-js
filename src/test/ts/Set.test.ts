import * as Collects from "../../main/Collects";
import * as logger from "../../main/logger";
import {LikeJavaSet,  List} from "../../main/Iterables";
/**
 * HelloWorld.test.ts
 */
describe("Set Tests", ()=>{

    function testSet(list:LikeJavaSet<any>){
        debugger;
        list.addAll(Collects.newList(["a","b","c","d","e"]));
        Collects.forEach(list, (element)=>{
            logger.info(element);
        });
        expect(list.size()).toBe(5);
        list.add("f");
        expect(list.size()).toBe(6);
        list.remove("f");
        expect(list.size()).toBe(5);
        list.remove("f");
        expect(list.size()).toBe(5);
        if(list.contains("a")){
            logger.info("has 'a'");
        }
        if(list.containsAll(Collects.newList(["a","b"]))){
            logger.info("contains ['a', 'b']");
        }
        let alist:List<any> =  Collects.newList(["a","b","k"]);
        if(!list.containsAll(alist)){
            logger.info("not contains ['a', 'b','k']");
        }
        list.removeAll(alist);
        expect(list.size()).toBe(3);
        expect(list.isEmpty()).toBe(false);
        list.retainAll(Collects.newList(["c","d","m"]));
        expect(list.containsAll(Collects.newList(["c","d"]))).toBe(true);
    }

    test("HashSet Test", ()=>{
        testSet(Collects.emptyHashSet());
    });

    test("Tree Test", ()=>{
        testSet(Collects.emptyTreeSet());
    });

});