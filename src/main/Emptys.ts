export default {
    isNull : function (obj : any) {
        return obj==undefined || obj == null;
    },

    isNotNull: function(obj : any){
        return !this.isNull(obj);
    },

    isArray: function (obj : any) {
        Array.isArray(obj);
    }
};
