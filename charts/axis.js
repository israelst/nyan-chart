exports.wordWrapping = function(){
    var scale;
    function axis(container){
        container.selectAll('foreignObject')
            .data(scale.domain())
            .enter()
            .append('foreignObject')
            .attr('width', scale.rangeBand())
            .append('xhtml:body')
            .append('xhtml:div')
            .text(function(d){ return d;});
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
