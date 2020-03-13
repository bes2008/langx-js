export var logger = {
    debug: function (args: Array<any>) {
        console.debug(args);
    },
    info: function (args: Array<any>) {
        console.log(args);
    },
    warn: function (args: Array<any>) {
        console.warn(args);
    },
    error: function (args: Array<any>) {
        console.error(args);
    }
};