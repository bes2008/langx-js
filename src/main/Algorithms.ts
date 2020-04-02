import {Comparator} from "./Comparators";
import * as Emptys from "./Emptys";
import {ArrayList} from "./Iterables";


/**
 * if value== null: not found, the index is the suitable index
 * if value !=null: found, the index is the matched value's index
 */
export class SearchResult<E extends any> {
    value: E;
    index: number;

    constructor(index: number, value: E) {
        this.index = index;
        this.value = value;
    }
}

/**
 * using binary search logic to search an element
 * the search scope is [fromIndex, toIndex]
 * @param sortedArray the sorted array
 * @param fromIndex
 * @param toIndex
 * @param e the value will to search
 * @param asc search from left to right if true, else search from right to left
 * @param comparator
 */
export function binarySearch(sortedArray: ArrayList<any>, e: any, comparator: Comparator<any>, asc?: boolean, fromIndex?: number, toIndex?: number): SearchResult<any> {
    if (Emptys.isEmpty(sortedArray)) {
        return new SearchResult<any>(0, null);
    }
    if (fromIndex == null || fromIndex < 0) {
        fromIndex = 0;
    }
    if (toIndex == null || toIndex >= sortedArray.size()) {
        toIndex = sortedArray.size() - 1;
    }
    asc = asc == null || asc;

    if (asc) {
        // compare the first of current scope
        let cFirst = comparator.compare(e, sortedArray.get(fromIndex));
        if (cFirst <= 0) {
            return new SearchResult<any>(fromIndex, cFirst == 0 ? sortedArray.get(fromIndex) : null);
        }

        if (fromIndex == toIndex) {
            return new SearchResult<any>(toIndex + 1, null);
        }

        // compare the last of current scope
        let cLast = comparator.compare(e, sortedArray.get(toIndex));
        if (cLast >= 0) {
            return new SearchResult<any>(cLast == 0 ? toIndex : (toIndex + 1), cLast == 0 ? sortedArray.get(toIndex) : null);
        }
        if (toIndex - fromIndex == 1) {
            // has no middle element
            return new SearchResult<any>(toIndex, null);
        }
    } else {
        // compare the last of current scope
        let cLast = comparator.compare(e, sortedArray.get(toIndex));
        if (cLast >= 0) {
            return new SearchResult<any>(cLast == 0 ? toIndex : (toIndex + 1), cLast == 0 ? sortedArray.get(toIndex) : null);
        }

        if (fromIndex == toIndex) {
            return new SearchResult<any>(toIndex - 1, null);
        }

        // compare the first of current scope
        let cFirst = comparator.compare(e, sortedArray.get(fromIndex));
        if (cFirst <= 0) {
            return new SearchResult<any>(fromIndex, cFirst == 0 ? sortedArray.get(fromIndex) : null);
        }

        if (toIndex - fromIndex == 1) {
            // has no middle element
            return new SearchResult<any>(toIndex, null);
        }
    }

    // compare the middle of current scope
    let middleIndex = Math.floor((fromIndex + toIndex + 1) / 2);
    let cMiddle = comparator.compare(e, sortedArray.get(middleIndex));
    if (cMiddle == 0) {
        return new SearchResult<any>(middleIndex, sortedArray.get(middleIndex));
    }
    if (cMiddle < 0) {
        // go to the left
        if (fromIndex + 1 >= middleIndex) {
            // end
            return new SearchResult<any>(middleIndex, null);
        }
        return binarySearch(sortedArray, e, comparator, asc, fromIndex + 1, middleIndex - 1);
    } else {
        // go to the right
        if (toIndex - 1 <= middleIndex) {
            // end
            return new SearchResult<any>(middleIndex + 1, null);
        }
        return binarySearch(sortedArray, e, comparator, asc, middleIndex + 1, toIndex - 1);
    }
}