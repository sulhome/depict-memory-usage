// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.close);
    });


function createSvg(divId) {
    var svg = d3.select("#" + divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}

function drawChart(sgv, dataFileName) {
    d3.json("mem-stats/" + dataFileName, function (error, data) {
        data.forEach(function (d) {
            d.date = d.time;
            var memoryInMB = parseInt(d.current_base / 1000000);
            d.close = +memoryInMB;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.close;
        })]);

        // Add the valueline path.
        sgv.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        sgv.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        sgv.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });
}

function addXLable(svg) {
    svg.append("text")
        .attr("class", "label")
        .attr("x", 265)
        .attr("y", 240)
        .style("text-anchor", "middle")
        .text("Time");

}

function addYLable(svg) {
    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "start")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Memory (MB)");

}