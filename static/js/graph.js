queue()
    .defer(d3.json, "/livmanu/data")
    .await(makeGraphs);

function print_filter(filter){
        var f=eval(filter);
        if (typeof(f.length) != "undefined") {}else{}
        if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
        if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
        console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    }
/*
function removeLiv(group) {
    return {
        all:function() {
            return group.all().filter
        }
    }
};

function removeManu(group) {

}
*/
function makeGraphs(error, json_results) {

    //Create a Crossfilter instance
    var results = crossfilter(json_results);

    //Define Dimensions
    var yearDim = results.dimension(function(d) {
        return d["Season"];
    });

    var gamesDim = results.dimension(function(d) {
        return d["Played"];
    });
    print_filter(gamesDim);

    var divisionDim = results.dimension(function(d) {
        return d["Division"]
    })

    //Calculate Metrics
    var positions = yearDim.group().reduceSum(dc.pluck('OverallPosition'));
    var divisionsPlayed = divisionDim.group();

    var all = results.groupAll();

    //Charts
    var timeChart = dc.lineChart("#time-chart");
    var manUtdSeasons = dc.numberDisplay("#manu-total-seasons");
    var divisionChart = dc.pieChart("#division-chart");


    var xTicks = d3.format(".0f");

    timeChart
       .width(800)
       .height(200)
        .brushOn(false)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(yearDim)
       .group(positions)
       .x(d3.time.scale().domain([1894, 2016]))
       .y(d3.scale.linear().domain([44,0]))
       .xAxisLabel("Season")
        .yAxisLabel("League Position")
        .colors("red")
       .xAxis().tickFormat(xTicks);

    manUtdSeasons
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);

    divisionChart
        .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(divisionDim)
       .group(divisionsPlayed);

    dc.renderAll();

}