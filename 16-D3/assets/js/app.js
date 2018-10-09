// @TODO: YOUR CODE HERE!
//d3.csv("data/data.csv").then( function(phData) {
// Set up SVG chart
var svgWidth = 1000;
var svgHeight = 700;

// Margin
var margin = {top: 20,  right: 40,  bottom: 100,  left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg").attr("height", svgHeight).attr("width", svgWidth).append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

var chart = svg.append("g");

d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 0);

url = "/data";
d3.csv("data/data.csv").then( function(data) {
    // copy data into global dataset
    dataset = data;

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (data) {
            var state = " "+data.state;
            switch (activeX) {
                case "age":
                    state+="<br> Age: "+data.age;
                    break;
                case "poverty":
                    state+="<br> Poverty: "+data.poverty;
                    break;
                case "income":
                    state+="<br> Income: "+data.income;
                    break;
            }
            switch (activeY) {
                case "smokes":
                    state+="<br> Smokes: "+data.smokes;
                    break;
                case "obesity":
                    state+="<br> Obesity: "+data.obesity;
                    break;
                case "healthcare":
                    state+="<br> Healthcare: "+data.healthcare;
                    break;
            }
            return state;
        });

    chart.call(toolTip);

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;


    function findMinAndMaxX(dataColumnX) {
        xMin = d3.min(dataset, function (d) { return d[dataColumnX] * 0.9 });
        xMax = d3.max(dataset, function (d) { return d[dataColumnX] * 1.1 });
    };

    function findMinAndMaxY(dataColumnY) {
        yMin = d3.min(dataset, function (d) { return d[dataColumnY] * 0.9 });
        yMax = d3.max(dataset, function (d) { return d[dataColumnY] * 1.1 });
    };

    var defaultAxisLabelX = "age"
    var activeX = defaultAxisLabelX;
    var defaultAxisLabelY = "smokes"
    var activeY = defaultAxisLabelY;

    findMinAndMaxX(defaultAxisLabelX)
    findMinAndMaxY(defaultAxisLabelY)

    xScale.domain([xMin, xMax]);
    yScale.domain([yMin, yMax])

    // create chart
    chart.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[defaultAxisLabelX]); })
        .attr("cy", function (d) { return yScale(d[defaultAxisLabelY]); })
        .attr("r", 15)
        .attr("fill", "#4380BA")
        .attr("opacity", 0.75)
        .on("mouseover", function (d)   { toolTip.show(d, this); })
        .on("mouseout", function (d, i) { toolTip.hide(d, this); })

    chart.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) { return d.abbr; })
        .attr("x", function (d) { return xScale(d[defaultAxisLabelX]); })
        .attr("y", function (d) { return yScale(d[defaultAxisLabelY]); })
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("class","stateText")
        .on("mouseover", function (d)   { toolTip.show(d, this); })
        .on("mouseout", function (d, i) { toolTip.hide(d, this); })

    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
    chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis)


    // Append axes titles
    // add x-axis titles
    chart.append("text")
        .attr("transform", `translate(${width / 2},${height + 40})`)
        .attr("class", "axis-text-x active")
        .attr("data-axis-name", "age")
        .text("Age (Median) ");

    chart.append("text")
        .attr("transform", `translate(${width / 2},${height + 60})`)
        .attr("class", "axis-text-x inactive")
        .attr("data-axis-name", "poverty")
        .text("In Poverty (%)");

    chart.append("text")
            .attr("transform", `translate(${width / 2},${height + 80})`)
            .attr("class", "axis-text-x inactive")
            .attr("data-axis-name", "income")
            .text("Household Income (Median)");

    // add y-axis titles
    chart.append("text")
        .attr("transform", `translate(-40,${height / 2})rotate(270)`)
        .attr("class", "axis-text-y active")
        .attr("data-axis-name", "smokes")
        .text("Smokes (%)");

    chart.append("text")
        .attr("transform", `translate(-60,${height / 2})rotate(270)`)
        .attr("class", "axis-text-y inactive")
        .attr("data-axis-name", "obesity")
        .text("Obesity (%)");

    chart.append("text")
            .attr("transform", `translate(-80,${height / 2})rotate(270)`)
            .attr("class", "axis-text-y inactive")
            .attr("data-axis-name", "healthcare")
            .text("Lacks Healthcare (%)");

    function labelChangeX(clickedAxis) {
        d3.selectAll(".axis-text-x")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

        clickedAxis.classed("inactive", false).classed("active", true);
    }
    function labelChangeY(clickedAxis) {
        d3.selectAll(".axis-text-y")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
        clickedAxis.classed("inactive", false).classed("active", true);
    }

    d3.selectAll(".axis-text-x").on("click", function () {
        var clickedSelection = d3.select(this);
        var isClickedSelectionInactive = clickedSelection.classed("inactive");
//        console.log("this axis is inactive", isClickedSelectionInactive)
        var clickedAxis = clickedSelection.attr("data-axis-name");
//        console.log("current axis: ", clickedAxis);
        activeX = clickedAxis;
        if (isClickedSelectionInactive) {
            currentAxisLabelX = clickedAxis;
            findMinAndMaxX(currentAxisLabelX);
            xScale.domain([xMin, xMax]);
            svg.select(".x-axis")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .call(xAxis);
            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("opacity", 0.50)
                        .attr("r", 20)
                })
                .attr("cx", function (d) {
                    return xScale(d[currentAxisLabelX]);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", 15)
                        .attr("fill", "#4380BA")
                        .attr("opacity", 0.75);
                })
            d3.selectAll(".stateText")
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .attr("x", function (d) {
                        return xScale(d[currentAxisLabelX]);
                    })
            labelChangeX(clickedSelection);
        }
    });

    d3.selectAll(".axis-text-y").on("click", function () {
        var clickedSelection = d3.select(this);
        var isClickedSelectionInactive = clickedSelection.classed("inactive");
//        console.log("this axis is inactive", isClickedSelectionInactive)
        var clickedAxis = clickedSelection.attr("data-axis-name");
//        console.log("current axis: ", clickedAxis);
        activeY = clickedAxis;
        if (isClickedSelectionInactive) {
            currentAxisLabelY = clickedAxis;
            findMinAndMaxY(currentAxisLabelY);
            yScale.domain([yMin, yMax]);
            svg.select(".y-axis")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .call(yAxis);
            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("opacity", 0.50)
                        .attr("r", 20)
                })
                .attr("cy", function (data) {
                    return yScale(data[currentAxisLabelY]);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", 15)
                        .attr("fill", "#4380BA")
                        .attr("opacity", 0.75);
                })
            d3.selectAll(".stateText")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("y", function (d) {
                    return yScale(d[currentAxisLabelY]);
                })
            labelChangeY(clickedSelection);
        }
    });
});
