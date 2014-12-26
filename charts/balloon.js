var util = require('../util');
    inc = util.inc;

function path(width, height, radius, arrow){
    function join(){
        return [].map.call(arguments, inc('')).join(',');
    }

    return ('M' + join(15, 0) +
            ' l' + join(arrow, -arrow) +
            ' v' + (-height/2 + 2*radius) +
            ' q' + join(0, -radius, radius, -radius) +
            ' h' + width +
            ' q' + join(radius, 0, radius, radius) +
            ' v' + (height - 2*radius) +
            ' q' + join(0, radius, -radius, radius) +
            ' h' + -width +
            ' q' + join(-radius, 0, -radius, -radius) +
            ' v' + (-height/2 + 2*radius) +
            ' Z');
}

exports.tooltip = function (text, color){
    return function(selection){
        var balloonEl = selection.append('path');
        selection.append('text')
            .attr('dx', 22)
            .attr('dy', '.4em')
            .text(text);

        balloonEl
            .attr('fill', color)
            .attr('d', function(){
                var textNode = this.nextElementSibling,
                    clientRect = textNode.getClientRects()[0],
                    width = textNode.getComputedTextLength(),
                    height = clientRect.height;

                return path(Math.ceil(width), height, 5, 4);
            });

    };
};
