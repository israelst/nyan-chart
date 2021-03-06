var util = require('../util');
    inc = util.inc;

function wrapTextNode(textNode){
    var width = textNode.getComputedTextLength(),
    clientRect = textNode.getClientRects()[0],
    height = clientRect.height;

    return path(Math.ceil(width), height, 10, 4);
}

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


// TODO: Revisit the constructor, there is too many parameters, mind the default values
exports.tooltip = function (text, color, transitionConfig){
    return function(selection){
        if(selection.selectAll('text').empty()){
            selection.append('path');
            selection.append('text').text(0);
        }

        selection.select('path').attr('fill', color);

        selection.select('text')
            .attr('dx', 30)
            .attr('dy', '.35em')
            .transition()
            .call(transitionConfig)
            .tween("text", function(d) {
                var currValue = Number(this.textContent),
                    nextValue = Number(text(d)),
                    i = d3.interpolateRound(currValue, nextValue);
                return function(t) {
                    this.textContent = i(t);
                    d3.select(this.parentNode)
                        .select('path')
                        .attr('d', wrapTextNode(this));
                };
            });
    };
};

