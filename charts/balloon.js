var util = require('../util');
    inc = util.inc;

function path(width, height, radius, arrow){
    function join(){
        return [].map.call(arguments, inc('')).join(',');
    }

    return ('M' + join(15, 0) +
            ' l' + join(arrow, -arrow) +
            ' v' + (-height/2 + arrow) +
            ' q' + join(0, -radius, radius, -radius) +
            ' h' + width +
            ' q' + join(radius, 0, radius, radius) +
            ' v' + (height) +
            ' q' + join(0, radius, -radius, radius) +
            ' h' + -width +
            ' q' + join(-radius, 0, -radius, -radius) +
            ' v' + (-height/2 + arrow) +
            ' Z');
}

exports.tooltip = function (text, color){
    return function(selection){
        var balloonEl = selection.append('path');
        selection.append('text')
            .attr('dx', 30)
            .attr('dy', '.35em')
            .text(text);

        balloonEl
            .attr('fill', color)
            .attr('d', function(){
                var textNode = this.nextElementSibling,
                    width = textNode.getComputedTextLength(),
                    clientRect = textNode.getClientRects()[0],
                    height = clientRect.height;

                return path(Math.ceil(width), height, 10, 4);
            });
    };
};
