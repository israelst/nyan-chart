exports.wordWrapping = function(){
    var scale;
    function axis(){}
    axis.scale = function(value){
        if(!arguments.length){
            return scale;
        }
        scale = value;
        return axis;
    };
    return axis;
};
