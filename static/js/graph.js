queue()
    .defer(d3.json, "/manu/data")
    .await(makeGraphs);

function print_filter(filter){
        var f=eval(filter);
        if (typeof(f.length) != "undefined") {}else{}
        if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
        if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
        console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    }

function makeGraphs(error, manu_results) {

    //Create a Crossfilter instance
    var manu = crossfilter(manu_results);

    //Define Dimensions
    var manuYearDim = manu.dimension(function(d) {
        return d["Season"];
    });

    var manuPosition = manuYearDim.group().reduceSum(dc.pluck('OverallPosition'));

    var allManu = manu.groupAll();

    //Define values to be used in charts
    var minYear = manuYearDim.bottom(1)[0]["Season"];
    var maxYear = manuYearDim.top(1)[0]["Season"];

    //Charts
    var linechart = dc.lineChart("#time-chart");
    var manuTotalSeasons = dc.numberDisplay("#manu-total-seasons");


    var xTicks = d3.format(".0f");

    linechart
        .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(manuYearDim)
        .group(manuPosition)
        .x(d3.time.scale().domain([minYear,maxYear]))
        .y(d3.scale.linear().domain([44,0]))
        .xAxisLabel("Season")
        .yAxisLabel("League Position")
        .xAxis().tickFormat(xTicks);


    manuTotalSeasons
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(allManu);


    dc.renderAll();

}