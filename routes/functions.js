var sum = [];
var sumEarnings = 0;
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var obj = {

    convert: function(array){
        var map = {}
        for(var i = 0; i < array.length; i++){
            var obj = array[i]
            if(!(obj._id in map)){
                map[obj._id] = obj
                map[obj._id].children = []
            }
            if(typeof map[obj._id].text == 'undefined'){
                map[obj._id]._id = obj._id
                map[obj._id].text = obj.name.capitalize();
                map[obj._id].name = obj.name.capitalize();
                map[obj._id].parentName = obj.parentName.capitalize();
                map[obj._id].parentId= obj.parentId
            }
            var parent = obj.parentId || '-';
            if(!(parent in map)){
                map[parent] = {}
                map[parent].children = []
            }
            map[parent].children.push(map[obj._id])
        }
        return map['-']
    },
   
    totalEarnings: function (node, level) {
        for (var i = 0; i < node.children.length; i++) {
            if (node.children.length > 0) {
                sumEarnings = 0;
                obj.totalEarnings(node.children[i], level + 1);
            }
            sumEarnings += node.children[i].earnings;
            // Earnings of a last child
            if (node.children[i].children.length == 0) {    
                node.children[i].text = node.children[i].text + " " + node.children[i].earnings + "K$";
            }
            // Total earnings of an other nodes
            else if (level > 0) {
                node.children[i].text = node.children[i].text + " " + node.children[i].earnings + "K$ (" + sumEarnings + "K$)";
            }
            if (level == 1) {
                sum.push(sumEarnings);
                sumEarnings = 0;
            }
            //Total earnings of a root
            if (level == 0) {
                var total = node.children[i].earnings + sum.reduce((a, b) => a + b, 0);
                node.children[i].text = node.children[i].name + " " + node.children[i].earnings + "K$ (" + total + "K$)";
                sum = [];
            }
        }
    }
}
module.exports = obj;