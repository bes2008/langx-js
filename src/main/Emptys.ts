let Emptys = {
    isNull : function (obj : any) {
        return obj==undefined || obj == null;
    },

    misArray: function (obj : any) {
        Array.isArray(obj);
    }
};
