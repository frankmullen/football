queue()
   .defer(d3.json, "/livmanu/data")
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

    function print_filter(filter){
        var f=eval(filter);
        if (typeof(f.length) != "undefined") {}else{}
        if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
        if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
        console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    }

    //Create a Crossfilter instance
    var ndx = crossfilter(json_results);

    //Define Dimensions
    var yearDim = ndx.dimension(function(d) {
        return d["Season"];
    });
    print_filter(yearDim);
    var teamDim = ndx.dimension(function(d) {
        return d["Team"];
    })
    //console.log(yearDim.top(Infinity));
    var teamDimManchester = teamDim.filter("Manchester");
    print_filter(teamDimManchester);

    var teamDimLiverpool = ndx.dimension(function(d) {
        return d["Team"]="Liverpool";
    });
    print_filter(teamDimLiverpool);

    var positionManchester = teamDimManchester.group().reduceSum(dc.pluck('OverallPosition'));
    //print_filter(positionManchester);

    //var teamDimManchester = teamDim.filter("Manchester");
    //print_filter(teamDimManchester);
    //

/*
    var yearDimManchester = yearDim.dimension(function(d) {
        return d["Season"];
    });
    print_filter(yearDimManchester);


    var positionDim = ndx.dimension(function(d) {
        return d["OverallPosition"];
    });


    //Charts
    var composite = dc.compositeChart("#time-chart");
    var xTicks = d3.format(".0f");

    composite
        .width(800)
        .height(200)
        .dimension(yearDim)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .compose([
            dc.lineChart(composite)
                .dimension(yearDim)
                .colors('red')
                .group(positionManchester, "Manchester United"),
            dc.lineChart(composite)
                .dimension(yearDim)
                .colors('yellow')
                .group(positionLiverpool, "Liverpool")
        ])
        .x(d3.time.scale().domain([1890,2020]))
        .y(d3.scale.linear().domain([50,0]))
        .xAxisLabel("Season")
        .yAxisLabel("League Position")
        .xAxis().tickFormat(xTicks);




    dc.renderAll();
    */
}