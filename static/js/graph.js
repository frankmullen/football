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

function makeGraphs(error, json_results) {

    //Create a Crossfilter instance
    var results = crossfilter(json_results);

    //Define Dimensions
    var yearDim = results.dimension(function(d) {
        return d["Season"];
    });

    //Create group of objects with finishing positions for both teams by year
    var positions = yearDim.group().reduce(
        function(p, v) { // add
            p[v["Team"]] = (p[v["Team"]] || 0) + v["OverallPosition"];
            return p;
        },
        function(p, v) { // remove
            p[v["Team"]] -= v["OverallPosition"];
            return p;
        },
        function() { // initial
            return {};
        });

    //Create group of combined goals to use as filtering chart
    var goals = yearDim.group().reduceSum(dc.pluck('For'));

    //Chart
    var composite = dc.compositeChart("#time-chart");
    var volumeChart = dc.lineChart("#volume-chart");

    //Number formatting for x-axis
    var xTicks = d3.format(".0f");

    //Create array of team names
    var names = json_results.map(function(row) { return row.Team; });

    composite
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
        .brushOn(false)
       .x(d3.time.scale().domain([1894, 2016]))
       .y(d3.scale.linear().domain([44,0]))
        .shareTitle(false)
        .compose(
            names.map(function(name) {
                return dc.lineChart(composite)
                .dimension(yearDim)
                .colors(function() {
                    if (name == "Liverpool") {
                        return "red";
                    } else {
                        return "black";
                    }
                })
                .group(positions)
                .valueAccessor(function(kv) {
                    return kv.value[name];
                })
                .title(function(kv) {
                    return name + ' ' + kv.key + ': ' + kv.value;
                });
        }))
        .rangeChart(volumeChart)
       .xAxisLabel("Season")
        .yAxisLabel("League Position")
       .xAxis().tickFormat(xTicks);
/
// filtering
    volumeChart
        .width(800)
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 65})
        .dimension(yearDim)
        .group(positions)
       // .rangeChart(stackLinesChart)
        //.centerBar(true)
        //.gap(0)
        .elasticX(true)
        .x(d3.time.scale().domain([1894, 2016]))
        //.round(d3.time.month.round)
        //.xUnits(d3.time.months)
       /* .renderlet(function (chart) {
            chart.select("g.y").style("display", "none");
            composite.filter(chart.filter());
        })*/
        .xAxis().tickFormat(xTicks);

    var all = results.groupAll();

    var totalSeasons = dc.numberDisplay("#total-seasons");

    totalSeasons
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);

    dc.renderAll()
    dc.redrawAll();

}