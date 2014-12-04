var d3 = require('d3');

function category(d){ return d[0];}

exports.dot = function(){
    var width = 1280;

    function chart(selection){
        var data = selection.datum(),
            categories = data.map(category),
            x = d3.scale.ordinal().domain(categories).rangeBands([0, width]);

        selection.attr('viewBox', '0 0 ' + width + ' 515')
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('width', '100%');

        selection.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('y', '360')
            .attr('x', function(d){ return x(d[0]);})
            .text(category);

    }
    return chart;
};
