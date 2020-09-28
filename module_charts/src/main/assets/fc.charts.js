var dom = document.getElementById("container");
var myChart = echarts.init(dom);

function setData(jsonString) {
    var data = generate(jsonString);
    var option = getOption(data);
    myChart.setOption(option, true);
}


function getOption(data) {
    var type = data.type;
    if ("pie" == type) {
        return {
            color: data.colorData,
            tooltip: {
                trigger: 'item',
                formatter: '{b} <br/>金额 : {c}万元 <br/> 占比：{d}%',
                position: 'inside',
                confine: true,
            },
            grid: {
                left:20,
                right: 20,
                top: 40,
                bottom: 25,
                containLabel: true
            },
            legend: {
                show: true,
                orient: 'horizontal',
                selectedMode: false,
                bottom: 0,
                data: data.legendData,
                textStyle: { fontSize: 10 },
                icon: 'rect',
                itemWidth: 7,
                itemHeight: 7
            },
            series: [
                {
                    name: data.legendData[0],
                    type: 'pie',
                    radius: '64%',
                    center: ['50%', '45%'],
                    type: data.type,
                    data: data.seriesData,
//                    label: { formatter: '{b} {d}%' },
                    label: { formatter: '{b}' },
                    hoverAnimation: true,
                    hoverOffset: 10,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 0,
                            shadowOffsetX: 0
                        }
                    },
                },
            ]
        };
    } else if ("bar" == type) {
        return {
            color: data.colorData,
            tooltip: {
                trigger: 'item',
                formatter: '{b} <br/> {a} : {c}',
                position: 'inside',
                confine: true,
            },
            grid: {
                top: 40,
                left: 13,
                bottom: 22,
                right: 13,
                containLabel: true
            },
            legend: {
                show: false,
                orient: 'horizontal',
                selectedMode: false,
                bottom: 0,
                data: ['金额(万元)'],
                textStyle: {
                    fontSize: 10,
                    color: '#5C5C5C',
                },
                icon: 'rect',
                itemWidth: 8,
                itemHeight: 8,
            },
            xAxis: {
                show: true, // 是否显示x轴
                type: 'category', // 类目轴
                axisTick: false,     // 是否显示刻度
                data: data.legendData,
                axisLine: {
                    lineStyle: {
                        color: '#DFDFDF'
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#DFDFDF'
                    },
                },
                axisLabel: {
                    show: true,
                    interval: 0,    //强制文字产生间隔
                    rotate: 40,     //文字逆时针旋转45°
                    fontSize: 10,
                    color: '#8C8C8C',
                    align: 'right',
                    margin: 10,
                    formatter: function (params) {
                       var newParamsName = "";
                       var paramsNameNumber = params.length;
                       var provideNumber = 6;
                       var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                       if (paramsNameNumber > provideNumber) {
                           for (var p = 0; p < rowNumber; p++) {
                               var tempStr = "";
                               var start = p * provideNumber;
                               var end = start + provideNumber;
                               if (p == rowNumber - 1) {
                                   tempStr = params.substring(start, paramsNameNumber);
                               } else {
                                   if (p == 1) {
                                       tempStr = params.substring(start, end);
                                       newParamsName += tempStr+"...";
                                       break;
                                   } else {
                                       tempStr = params.substring(start, end);
                                       if (p < 1) {
                                           tempStr += "\n";
                                       }
                                   }
                               }
                               newParamsName += tempStr;
                           }

                       } else {
                           newParamsName = params;
                       }
                       return newParamsName
                   }
                }
            },
            yAxis: {
                name: '万元',  // 坐标轴名称
                show: true, // 是否显示y轴
                splitNumber: 6,
                type: 'value',
                splitLine: {
                    show: false,
                },
                nameTextStyle: {   // 坐标轴名称样式
                    color: '#3C3C3C'
                },
                axisLine: {
                    lineStyle: {
                        color: '#DFDFDF'
                    },
                },
                axisLabel: {
                    show: true,
                    fontSize: 10,
                    color: '#8C8C8C',
                }

            },
            label: {
                show: false, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                    color: 'black',
                    fontSize: 16,
                    fontWeight: 600
                },

            },
            series: [
                {
                    name: '金额(万元)',
                    type: 'bar',
                    barWidth: '40%',
                    center: ['70%', '20%'],
                    type: data.type,
                    data: data.seriesData,
                    hoverAnimation: false,
                    hoverOffset: 0,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 0,
                            shadowOffsetX: 0
                        }
                    },
                },

            ]
        };
    }
}

function generate(jsonString) {
    var data = JSON.parse(jsonString);
    var list = data.data;
    var legendData = [];
    var seriesData = [];
    var colorData = [];
    for (var i = 0; i < list.length; i++) {
        legendData.push(list[i].name);
        seriesData.push({
            name: list[i].name,
            value: list[i].value,
            itemStyle: { color: list[i].color }
        });
        colorData.push(list[i].color);
    }
    return {
        legendData: legendData,
        seriesData: seriesData,
        colorData: colorData,
        type: data.type
    };
}