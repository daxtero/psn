const PsnQueryResult = require('./PsnQueryResult');
const PsnEntry = require('./PsnEntry');

let PsnParser = function () {

    return {
        /**
         * @param {string} cliOutput
         * @return {PsnQueryResult}
         */
        parse: function (cliOutput) {
            let entries = [];

            let lines = cliOutput.split("\n");
            lines.forEach((line) => {
                if(line === "") {
                    return;
                }
                let attributes = line.split("\t");
                let data = {
                    id: attributes[0],
                    title: attributes[1],
                    platform: attributes[2],
                    price: attributes[3],
                    type: attributes[4],
                };
                let psnEntry = new PsnEntry(data);
                entries.push(psnEntry);
            });

            return new PsnQueryResult(entries);
        }
    };
};
module.exports = PsnParser;
