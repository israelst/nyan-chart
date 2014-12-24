var inc = require('../util').inc;

exports.balloonPath = function (width, height, radius, arrow){
    function join(){
        return [].map.call(arguments, inc('')).join(' ');
    }

    return ('M' + join(0, height/2) +
            'l' + join(arrow, -arrow) +
            'V' + radius +
            'q' + join(0, -radius, radius, -radius) +
            'H' + (width - radius) +
            'q' + join(radius, 0, radius, radius) +
            'V' + (height - radius) +
            'q' + join(0, radius, -radius, radius) +
            'H' + (arrow + radius) +
            'q' + join(-radius, 0, -radius, -radius) +
            'V' + (height/2 + arrow) +
            'Z');
};
