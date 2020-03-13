var Types = {
    getType: function (object) {
        var typeString = typeof object;
        var type = undefined;
        switch (typeString) {
            case "undefined":
                type = undefined;
                break;
            case "boolean":
                type = Boolean;
                break;
            case "string":
                type = String;
                break;
            case "function":
                type = Function;
                break;
            case "bigint":
            case "number":
                type = Number;
                break;
            case "symbol":
            case "object":
                type = Object;
                break;
            default:
                type = Object;
        }
        if (type != undefined && type != Object) {
            return type;
        }
        if (Array.isArray(object)) {
            return Array;
        }
    }
};
//# sourceMappingURL=Types.js.map