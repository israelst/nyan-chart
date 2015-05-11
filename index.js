var d3 = require('d3'),
    dot = require('./charts/dot').dot;

function dataGenerator(qtyOfCategories){
    for(var i = 0, data = []; i <= qtyOfCategories; i++){
        data.push(['Category ' + (i + 1) , Math.floor(Math.random() * 100)]);
    }
    return data;
}

function addSvg(width){
    width = width || '50%';
    return d3.select('article')
        .append('svg')
        .style('width', width);
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

    var dotChart = dot(addSvg('100%'));
    dotChart.data(dataGenerator(4))();

    setInterval(function(){
        dotChart.data(dataGenerator(4))();
    }, 2000);
});
