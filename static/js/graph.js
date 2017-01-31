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

    var dim = results.dimension(dc.pluck("Season")),
        group1 = dim.group().reduceSum(dc.pluck("Liverpool")),
        group2 = dim.group().reduceSum(dc.pluck("Manchester"));

    print_filter(group1);
    print_filter(group2);
/*
    //Define Dimensions
    var yearDim = results.dimension(function(d) {
        return d["Season"];
    });

    print_filter(yearDim);

    var yearDimGroup =  yearDim.group().reduceSum(function(d) {
        return d["Team"];
    });
    //print_filter(yearDimGroup);

    var teamDim = results.dimension(function(d) {
        return d["Team"];
    });
    print_filter(teamDim);

    var teamDimManu = teamDim.filter("Manchester");

    print_filter(teamDimManu);

    var group = yearDim.group();
    print_filter(group);

    var manuGroup = removeLiv(group);
    var livGroup = removeManu(group);


    var livPosition = livYearDim.group().reduceSum(dc.pluck('OverallPosition'));
    var manuPosition = manuYearDim.group().reduceSum(dc.pluck('OverallPosition'));

    var allLiv = liv.groupAll();
    var allManu = manu.groupAll();

    //Define values to be used in charts
    var livMinYear = livYearDim.bottom(1)[0]["Season"];
    var livMaxDate = livYearDim.top(1)[0]["Season"];

    //Charts
    var composite = dc.compositeChart("#time-chart");
    var livTotalSeasons = dc.numberDisplay("#liv-total-seasons");
    var manuTotalSeasons = dc.numberDisplay("#manu-total-seasons");


    var xTicks = d3.format(".0f");

    composite
        .width(800)
        .height(200)
        .dimension(livYearDim)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .compose([
            dc.lineChart(composite)
                .dimension(livYearDim)
                .colors('black')
                .group(manuPosition, "Manchester United"),
            dc.lineChart(composite)
                .dimension(livYearDim)
                .colors('red')
                .group(livPosition, "Liverpool")
        ])
        .x(d3.time.scale().domain([1894,2016]))
        .y(d3.scale.linear().domain([44,0]))
        .xAxisLabel("Season")
        .yAxisLabel("League Position")
        .xAxis().tickFormat(xTicks);

    livTotalSeasons
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(allLiv);

    manuTotalSeasons
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(allManu);


    dc.renderAll();
*/
}