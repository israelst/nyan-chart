exports.dot = function(){
    function chart(selection){
        var data = selection.datum();

        selection.attr('viewBox', '0 0 1280 515 ')
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('width', '100%');

        selection.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('y', '360')
            .attr('x', function(d, i){ return 100 * i;})
            .text(function(d){ return d[0];});

    }
    return chart;
};
