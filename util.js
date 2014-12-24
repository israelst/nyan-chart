exports.c = function (){
    return [].reduce.call(arguments, function(f1, f2){
        return function (){
            return f1(f2.apply(this, arguments));
        };
    });
};

exports.inc = function inc(increment){
    return function (value){
        return increment + value;
    };
};
