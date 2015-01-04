exports.c = function (){
    return [].reduce.call(arguments, function(f1, f2){
        return function (){
            return f1(f2.apply(this, arguments));
        };
    });
};

exports.inc = function (increment){
    return function (value){
        return increment + value;
    };
};

exports.accessor = function (name, defaultValue){
    var attr = defaultValue;
    this[name] = function(value){
        if(arguments.length){
            attr = value;
            return this;
        }
        return attr;
    };
};
