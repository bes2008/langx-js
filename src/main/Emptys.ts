let Emptys = {
    isNull : function (obj : any) {
        return obj==undefined || obj == null;
    },

    isArray: function (obj : any) {
        Array.isArray(obj);
    }
};
