let PsnEntry = function (data) {

    return {
        getId: function () {
            return data.id;
        },
        getTitle: function () {
            return data.title;
        },
        getPlatform: function () {
            return data.platform;
        },
        getPrice: function () {
            return data.price;
        },
        getType: function () {
            return data.type;
        },
        asDomNode: function () {
            var newDiv = document.createElement("div");
            var newContent = document.createTextNode(this.getTitle() + ' ' + this.getPrice()+ ' ' + this.getPlatform()+ ' ' + this.getType());
            newDiv.appendChild(newContent);

            return newDiv;
        }
    };
};
module.exports = PsnEntry;
