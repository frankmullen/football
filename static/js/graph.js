queue()
   .defer(d3.json, "/manu/data")
   .await(makeGraphs);

function makeGraphs(error, json_results) {

    /*
    //clean JSON year data
    var allData = json_results;
    console.log(allData);
    var parseYear = d3.time.format("%Y").parse;
    allData.forEach(function(d) {
        dString = d["Season"].toString();
        console.log(dString);
        d["Season"] = parseYear(dString);
        console.log(d["Season"]);
        console.log(d["OverallPosition"]);
    }); */

    //Create a Crossfilter instance
    var ndx = crossfilter(json_results);

    //Define Dimensions
    var yearDim = ndx.dimension(function(d) {
        return d["Season"];
    });

    var position = yearDim.group().reduceSum(dc.pluck('OverallPosition'));

    var positionDim = ndx.dimension(function(d) {
        return d["OverallPosition"];
    });
    /*var minPosition = positionDim.bottom(1)[0].position;
    console.log(minPosition);
    var maxPosition = positionDim.top(1)[0].position;
    console.log(maxPosition);*/

    //Charts
    var timeChart = dc.lineChart("#time-chart");
    var xTicks = d3.format(".0f");

    timeChart
        .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(yearDim)
        .group(position)
       .x(d3.time.scale().domain([1894,2016]))
        .y(d3.scale.linear().domain([50,0]))
       .xAxisLabel("Season")
        .yAxisLabel("League Position")
        .xAxis().tickFormat(xTicks);

    dc.renderAll();
}