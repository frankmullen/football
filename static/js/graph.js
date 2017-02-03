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
/*
    var gamesDim = results.dimension(function(d) {
        return d["Played"];
    });


    var divisionDim = results.dimension(function(d) {
        return d["Division"]
    })
*/
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

    print_filter(positions);

    var all = results.groupAll();

    //Charts
    var composite = dc.compositeChart("#time-chart");
    var totalSeasons = dc.numberDisplay("#total-seasons");



    var xTicks = d3.format(".0f");

    var names = Array.prototype.slice.call(arguments);

    console.log(names.toString());

    composite
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .x(d3.time.scale().domain([1894, 2016]))
       .y(d3.scale.linear().domain([44,0]))
        .shareTitle(false)
        .compose(
            names.map(function(name) {
                return dc.lineChart(composite)
                .dimension(yearDim)
                .colors('red')
                .group(positions)
                .valueAccessor(function(kv) {
                    return kv.value[name];
                })
                .title(function(kv) {
                    return name + ' ' + kv.key + ': ' + kv.value;
                });
        }))
       .xAxisLabel("Season")
        .yAxisLabel("League Position")
       .xAxis().tickFormat(xTicks);

    totalSeasons
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);


    dc.renderAll();

}