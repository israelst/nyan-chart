var d3 = require('d3'),
    dot = require('./charts/dot').dot;

function dataGenerator(qtyOfCategories){
    for(var i = 0, data = []; i <= qtyOfCategories; i++){
        data.push(['Category ' + (i + 1) , Math.floor(Math.random() * 100)]);
    }
    return data;
}

function addSvg(){
    return d3.select('body')
        .append('svg')
        .style('width', '50%');
}

window.addEventListener('load', function(){
    var colors = [
            '#65ffff',
            '#9966ff',
            '#fecd66',
            '#ff7e66',
            '#e0ff65',
        ];

    dot(addSvg())
        .data(dataGenerator(5))
        .colors(colors)();

    dot(addSvg())
        .data(dataGenerator(4))();

    var animatedChart = d3.select('body').append('svg'),
        dotChart = dot(animatedChart);

    setInterval(function(){
        dotChart.data(dataGenerator(4));
        dotChart();
    }, 2000);
});
