// Define dimensions of the chart. Since the chart scales with a ViewBox, width and height mainly establish aspect ratio.
let w = 500;
let h = 300;
let paddingTop = 10;
let paddingBottom = 50;
let paddingOuter = 30
// Define variables that will be filled in later using the CSV.
let xScale;
let yScale;
let dataset;
let parsedCSV;
// Function to parse the CSV. Maps each column to a variable in a JS object. 
// Since D3 parses CSV cells as strings, the function converts numbers to float variables and sets GramStaining to a boolean value using a ternary operator.
let lineParse = (d) => {
    return{
    Bacteria: d.Bacteria,
    Penicilin: parseFloat(d.Penicilin),
    Streptomycin: parseFloat(d.Streptomycin),
    Neomycin: parseFloat(d.Neomycin),
    GramStaining: (d.GramStaining === "positive" ? true : false)
}}
// Import CSV, hosted on my GitHub.
d3.csv("https://raw.githubusercontent.com/dmdeloso/jour377-coursework/main/assignment1/antibiotics_data.csv", lineParse).then(function(data){
    // loads in csv data then filters out gram-positive bacteria
    parsedCSV = data;
    dataset = parsedCSV.filter((item) => { return item.GramStaining === false})
    // Sets X scale to evenly divide graph into bars based on the number of data points
    xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([paddingOuter, (w - paddingOuter)])
        .paddingInner(.20);
    // Sets y scale to a domain of 0 to the highest value in the dataset (defined as the highest Penicilin value) and a range of 0 to the height minus the predefined padding.
    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d){return d.Penicilin})])
        .range([0, h - paddingBottom]);
        // Creates svg in html
        let svg = d3.select("#chart1").append('svg')
    .attr("viewBox", '0 0 ' + w + " " + (h + 20))
    .attr("preserveAspectRatio", "xMidYMid meet");
    // Creates group of bars for each bacteria
let nodes = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("g")
    .classed("barGroup", true);
// Add Streptomycin bars and position at the first portion of each group
nodes.append("rect")
    .attr("width", ((xScale.bandwidth() /3) - 1))
    .attr("height", function(d){
        return yScale(d.Streptomycin);
    })
    .attr("x", function(d, i){
        return xScale(i)
    })
    .attr("y", function(d){
        return (h - yScale(d.Streptomycin)) - paddingBottom + 30
    })
    .attr("fill", "#54AAEB");

// Add Neomycin bars and position at the second portion of each group
  nodes.append("rect")
    .attr("width", ((xScale.bandwidth() /3) - 1))
    .attr("height", function(d){
        return yScale(d.Neomycin);
    })
    .attr("x", function(d, i){
        return xScale(i) + (xScale.bandwidth() /3)
    })
    .attr("y", function(d){
        return (h - yScale(d.Neomycin)) - paddingBottom + 30
    }).attr("fill", "#9E6348");

// Add Penicilin bars and position at the first portion of each group
    nodes.append("rect")
    .attr("width", ((xScale.bandwidth() /3) - 1))
    .attr("height", function(d){
        return yScale(d.Penicilin);
    })
    .attr("x", function(d, i){
        return xScale(i) + (xScale.bandwidth() - (xScale.bandwidth() /3))
    })
    .attr("y", function(d){
        return (h - yScale(d.Penicilin)) - paddingBottom + 30
    }).attr("fill", "#519E6A");
    // Create group for the bacteria labels
    let labels = svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("g")
        .classed("label", true);
    // Splits each bacteria name into two parts (so that the text can wrap properly) and appends text to bottom of graph
    labels.append("text")
        .append('tspan').text(function(d){return d.Bacteria.split(" ")[0]})
        .attr("y", h - yScale(0) - 10)
        .attr("x", function(d, i){
            return xScale(i) + ((xScale.bandwidth() /3) + 5)
        })
        .attr("font-size", ".4em")
        .attr("text-anchor", "middle")
        .append('tspan').text(function(d){return d.Bacteria.split(" ")[1]})
        .attr('dy', '1em')
        .attr("x", function(d, i){
           return xScale(i) + ((xScale.bandwidth() /3) + 5)
        })
    // Add chart title
    svg.append("text")
        .classed("top-heading", true)
        .text("Penicillin less effective against most gram-negative bacteria than other antibiotics")
        .attr("x", (w / 2))
        .attr("y", 15)
        .attr("font-size", '.75em')
        .attr("text-anchor", "middle");
    // Add y-axis title
    svg.append("text")
    .classed("side-title", true)
    .text("Minimum inhibitory concentration (MIC)")
    .attr("transform", "rotate(270)")
    .attr("x", -250)
    .attr("y", 15)
    .attr("font-size", ".6em")
    // Add x-axis title
    svg.append("text")
    .classed("bottom-title", true)
    .text("Gram-negative Bacteria")
    .attr("x", 50)
    .attr("y", h + 14)
    .attr("font-size", '.75em')
    .attr("text-anchor", "middle")
    .attr("x", w / 2)
// Adds value labels for each bar and positions them at the middle of their respective bars
svg.selectAll(".barGroup")
    .data(dataset)
    .append("text")
    .text(function(d){
        return d.Streptomycin;
    })
    .attr("x", function(d, i){
        return xScale(i) + ((xScale.bandwidth() / 3) / 2)
    })
    .attr("y", function(d){
        return (h - yScale(d.Streptomycin)) - paddingBottom + 28
    })
    .attr("text-anchor", "middle")
    .attr("font-size", ".3rem")
    .classed("bar-label", true)
    svg.selectAll(".barGroup")
    .data(dataset)
    .append("text")
    .text(function(d){
        return d.Neomycin;
    })
    .attr("x", function(d, i){
        return xScale(i) + (xScale.bandwidth() /3) + ((xScale.bandwidth() / 3) / 2)
    })
    .attr("y", function(d){
        return (h - yScale(d.Neomycin)) - paddingBottom + 28
    })
    .attr("text-anchor", "middle")
    .attr("font-size", ".3rem")
    .classed("bar-label", true);
    svg.selectAll(".barGroup")
    .data(dataset)
    .append("text")
    .text(function(d){
        return d.Penicilin;
    })
    .attr("x", function(d, i){
        return xScale(i) + (xScale.bandwidth() - (xScale.bandwidth() /3)) + ((xScale.bandwidth() / 3) / 2)
    })
    .attr("y", function(d){
        return (h - yScale(d.Penicilin)) - paddingBottom + 28
    })
    .attr("text-anchor", "middle")
    .attr("font-size", ".3rem")
    .classed("bar-label", true);
    // Create legend and set colors to match bar colors.
    let chartLegend = svg.append("g")
    .attr("id", "chart-legend")
    chartLegend.append("rect")
    .attr("x", w - 110)
    .attr("y", 125)
    .attr("width", 8)
    .attr("height", 8)
    .attr("fill", "#54AAEB");
    chartLegend.append("text")
    .attr("x", w - 100)
    .attr("y", 132)
    .attr("font-size", ".5rem")
    .text("Streptomycin")
    .classed("legend-text", true)
    .attr("fill", "#54AAEB");
    chartLegend.append("rect")
    .attr("x", w - 110)
    .attr("y", 140)
    .attr("width", 8)
    .attr("height", 8)
    .attr("fill", "#9E6348");
    chartLegend.append("text")
    .attr("x", w - 100)
    .attr("y", 147)
    .attr("font-size", ".5rem")
    .text("Neomycin")
    .classed("legend-text", true)
    .attr("fill", "#9E6348");
    chartLegend.append("rect")
    .attr("x", w - 110)
    .attr("y", 155)
    .attr("width", 8)
    .attr("height", 8)
    .attr("fill", "#519E6A");
    chartLegend.append("text")
    .attr("x", w - 100)
    .attr("y", 162)
    .attr("font-size", ".5rem")
    .text("Penicillin")
    .classed("legend-text", true)
    .attr("fill", "#519E6A");
    // Adds text next to largest bar to provide context
    let descTextX = 71;
    let descriptText = svg.append("text");
    descriptText.append("tspan")
    .classed("desc-text", true)
    .attr("x", descTextX)
    .attr("y", 40)
    .text("With an MIC of 870, penicillin needs 870 ")
    .append("tspan")
    .attr("dy", '.6rem')
    .attr("x", descTextX)
    .text("times more concentration than streptomycin")
    .append("tspan")
    .attr("dy", '.6rem')
    .attr("x", descTextX)
    .text("and 543.75 times more concentration than")
    .append("tspan")
    .attr("dy", '.6rem')
    .attr("x", descTextX)
    .text("neomycin to prevent aerobacter aerogenes ")
    .append("tspan")
    .attr("dy", '.6rem')
    .attr("x", descTextX)
    .text("growth in vitro.")
})