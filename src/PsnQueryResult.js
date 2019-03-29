let PsnQueryResult = function (entries) {

    return {
        /**
         * @return{PsnEntry[]}
         */
        getEntries: function () {
            return entries;
        }
    };
};
module.exports = PsnQueryResult;
