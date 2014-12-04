var d3 = require('d3');

function category(d){ return d[0];}
function value(d){ return d[1];}
function c(f1, f2){
    return function(){
        return f1(f2.apply(this, arguments));
    };
}

exports.dot = function(){
    var width = 1280,
        bottom = 360;

    function chart(selection){
        var data = selection.datum(),
            categories = data.map(category),
            x = d3.scale.ordinal().domain(categories).rangeBands([0, width]),
            y = d3.scale.linear().domain([0, 100]).range([bottom - 45, 75]);

        selection.attr('viewBox', '0 0 ' + width + ' 515')
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('width', '100%');

        selection.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('r', '4')
            .attr('cy', c(y, value))
            .attr('cx', c(x, category));

        selection.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('y', bottom)
            .attr('x', c(x, category))
            .text(category);

    }
    return chart;
};
