exports.wordWrapping = function(){
    var scale;
    function axis(container){
        var foreignObject = container.selectAll('foreignObject')
                .data(scale.domain())
                .enter()
                .append('foreignObject')
                .attr('width', scale.rangeBand())
                .attr('x', scale),
            div = foreignObject.append('xhtml:body')
                .append('xhtml:div')
                .text(function(d){ return d;}).node();
        foreignObject.attr('height', div.clientHeight);
    }
    axis.scale = function(value){
        if(!arguments.length){
            return scale;
        }
        scale = value;
        return axis;
    };
    return axis;
};
