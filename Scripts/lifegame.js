﻿/// <reference path="~/Scripts/d3/d3.min.js" />

var width = 200,
    height = 200;

var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

var matrix = new Array(width); // 二维数组
var lifeList = []; // life列表，由二维数组映射，方便data操作
for (var i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(height);
    matrix[i].x = i;
    for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = {
            value: false,
            x: i,
            y: j,
            count: 0,
            value2: false
        };
        lifeList.push(matrix[i][j]);
    }
}

// 初始life
matrix[width / 2][height / 2].value2 = true;
//matrix[width / 2][height / 2 + 1].value2 = true;
//matrix[width / 2 + 1][height / 2].value2 = true;
//matrix[width / 2 + 1][height / 2 + 1].value2 = true;

var times = 0;
update();

// 生成
function generation() {
    times++;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var life = matrix[i][j];
            life.count = 0;
            for (var ii = (i == 0 ? 0 : i - 1) ; ii <= (i == width - 1 ? i : i + 1) ; ii++) {
                for (var jj = (j == 0 ? 0 : j - 1) ; jj <= (j == height - 1 ? j : j + 1) ; jj++) {
                    if (ii != i || jj != j) {

                        if (matrix[ii][jj].value) {
                            life.count = life.count + 1;
                        }
                    }
                }
            }
            if (life.count == 1 || life.count == 2 || life.count == 3) {
                life.value2 = true;
            } else {
                life.value2 = false;
            }
        }
    }

    update();
}

// 更新
function update() {
    lifeList.forEach(function (d) {
        d.value = d.value2;
    });
    var lifes = lifeList.filter(function (d) {
        return d.value;
    });
    d3.select('#times').text(times);
    d3.select('#lifes').text(lifes.length);

    svg.selectAll('rect')
        .data(lifes, function (d) {
            return d.x + '_' + d.y;
        })
        .enter()
        .append('rect')
        .filter(function (d) {
            return d.value;
        })
    //.each(function (d) { console.log(d); })
    .attr('x', function (d) {
        return d.x;
    })
        .attr('y', function (d) {
            return d.y;
        })
        .attr('width', 1).attr('height', 1)
        .style('fill', 'blue');

    svg.selectAll('rect')
        .data(lifes, function (d) {
            return d.x + '_' + d.y;
        })
        .exit()
        .remove();
}