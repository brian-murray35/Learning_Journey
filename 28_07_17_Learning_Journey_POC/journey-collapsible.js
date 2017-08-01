// Prepare data for learning journey
var table =[];

$("table[id$='journey'] tr").each(function () {
    var arrayOfThisRow =[];
    var tableData = $(this).find('td');
    if (tableData.length > 0) {
        tableData.each(function () {
            arrayOfThisRow.push($(this).text());
        });
        table.push(arrayOfThisRow);
    }
});

var numberOfRows = table.length;

// Prepare data for asset tiles
var tiledata =[];
$("table[id$='assets'] tr").each(function () {
    var arrayOfThisRow =[];
    var tableData = $(this).find('td');
    if (tableData.length > 0) {
        tableData.each(function () {
            arrayOfThisRow.push($(this).text());
        });
        tiledata.push(arrayOfThisRow);
    }
});

// Define "done items" array - here to be read from file, later from LMS, based on user data
var doneItems =[];



// Prepare basic svg containers and elements

// define arc elements to be used in "connector" elements in the journey visualization
 var arc = d3.arc().innerRadius(19).outerRadius(20).startAngle(1 * Math.PI).endAngle(1.5 * Math.PI);
 var contarc = d3.arc().innerRadius(19).outerRadius(20).startAngle(1 * Math.PI).endAngle(2 * Math.PI);
 var arccont = d3.arc().innerRadius(19).outerRadius(20).startAngle(0 * Math.PI).endAngle(0.5 * Math.PI);
var arccontrev = d3.arc().innerRadius(19).outerRadius(20).startAngle(-1 * Math.PI).endAngle(-1.5 * Math.PI);






var screenWidth = $(window).width();
var svg = d3.select(".refbody").insert("svg", "div").attr("width", screenWidth -300).attr("height", "2000").attr("id", "main_svg");
width = + svg.attr("width"),
height = + svg.attr("height"),
radius = 10;
var canvaswidth = $(window).width() -200;

var canvas = svg.append("g").attr("id", "canvas"),
legend = svg.append("g").attr("id", "legend"),
collapsed = svg.append("g").attr("id","collapsed"),
content = svg.append("g").attr("id", "content");

//trigger redraw of learning journey after window resize, to make it responsive
window.onresize = function (event) {
    var newWidth = $(window).width();
    svg.attr("width", newWidth -300);
    canvas.select("#main").attr("width", newWidth -200);
    canvaswidth = newWidth -200;
    updateSVG(width);
};



// Create canvas for roadmap display and legend

canvas.append("line").attr("x1", "90").attr("y1", "30").attr("x2", "90").attr("y2", "1500").attr("stroke", "#000").attr("stroke-width", "1");
canvas.append("rect").attr("id", "square").attr("x", "80").attr("y", "1500").attr("width", 20).attr("height", 20).attr("stroke-width", "3").attr("stroke", "#f2b830").attr("fill", "white");


// Trigger redraw of datatable when search value is entered (redraw of datatable in turn triggers redraw of learning journey visualization...
d3.select("#test-input").on("input", function () {
    updateSearch($(this).val())
});

// Create div for display of tooltips (invisible normally, and attached later temporarily to elements on mouseover)
var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);


// Define collapsed svg content containers (asset tiles) from data
collapsed.selectAll("g").data(table).enter().append("g").attr("id", function (d, i) {
    return i;
});

// add basic tile background rectangle to each collapsed asset tile
collapsed.selectAll("g").append("rect").attr("x", x).attr("y", y).attr("width", "200px").attr("height", "188px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7);   

var margin = {
    top: 20,
    right: 60,
    bottom: 30,
    left: 20
};

// collapsed.selectAll("g 	").attr("stroke-width", "10").style("margin-right", "200px");

collapsed.selectAll("g").append("text").attr("fill", "blue").attr("x", "7").attr("y", "112").attr("font-size", "15px").text("Explore").attr("style" ,"display:none")

    .on("click",function (d,i){
        content.selectAll("g").attr("style","display:none");
        content.select("g[id='" + i + "']").attr("style","display:block")
    });

// add specific basic content to each collapsed asset tile
collapsed.selectAll("g").each(function (d, i) {
    var tileID = table[i][4];
    var tilecontents = tiledata.filter(function (item) {
        return item[0] == tileID
    });

        switch (tilecontents[0][4]) {
            case "1": //Learning Room
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "#666666").attr("x", "167").attr("y", "15").attr("font-size", "11px").attr("font-family", "Arial, Sans-Serif").text("Learning Room");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "red").style("stroke", "black");
            d3.select(this).append("image").attr("x", 15).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "45").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            d3.select(this).append("image").attr("x", 60).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/cloud.png")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "95").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("image").attr("x", 140).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/LearningRoom.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "170").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom")
            
            // d3.select(this).append("circle").attr("cx", "9").attr("cy", "15").attr("r", "2").attr("fill", "white");
            // d3.select(this).append("circle").attr("cx", "18").attr("cy", "11").attr("r", "2").attr("fill", "white");
            // d3.select(this).append("circle").attr("cx", "18").attr("cy", "19").attr("r", "2").attr("fill", "white");
            // d3.select(this).append("line").attr("x1", "9").attr("y1", "15").attr("x2", "18").attr("y2", "11").attr("stroke", "white").attr("stroke-width", "1");
            // d3.select(this).append("line").attr("x1", "9").attr("y1", "15").attr("x2", "18").attr("y2", "19").attr("stroke", "white").attr("stroke-width", "1");
            break;
            case "2": //OpenSAP
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "#f2b830").style("stroke", "black");
            d3.select(this).append("image").attr("x", 60).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/cloud.png")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "95").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            break;
            case "6": //e-Learning
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "#93c939");
            d3.select(this).append("image").attr("x", 50).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "80").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/LearningRoom.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "130").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom")
            break;
            case "8": //Certification
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            break;
            case "9": //Certification
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "#93c939");
            d3.select(this).append("image").attr("x", 50).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "80").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "25px").attr("height", "25px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            break;
            case "10": // Stay current (e-Learning)
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            break;
            default: // general asset tile with only one learning option
            d3.select(this).select("rect").attr("fill", "white");
            //d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("rx", "0").attr("ry", "0").attr("width", "180").attr("height", "25").attr("stroke", "#e0e2e5").attr("stroke-width", "0").attr("fill", "#f2b830");
            //d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "#93c939");
            // d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });

        }
    ;
});


// Define svg content containers for full asset tiles from data
content.selectAll("g").data(table).enter().append("g").attr("id", function (d, i) {
    return i;
});

// add basic tile background rectangle to each asset tile
content.selectAll("g").append("rect").attr("x", 0).attr("y", 0).attr("rx", "0").attr("ry", "0").attr("width", "180").attr("height", "200").attr("stroke", "#e0e2e5").attr("stroke-width", "1");
content.selectAll("g").append("text").attr("fill", "blue").attr("x", "7").attr("y", "112").attr("font-size", "15px").text("Explore")
    .on("click",function (d,i){
        content.select("g[id='" + i + "']").attr("style","display:none")
    });
content.append("defs");
content.selectAll("defs").append("pattern").attr("id","ebook").attr("x","0").attr("y","0").attr("height","40").attr("width","40");
content.select("#ebook").append("image").attr("x","0").attr("y","0").attr("height","40").attr("width","40").attr("xlink:href","281518_OpenBook_R_blue.png");

/*<defs id="mdef">
        <pattern id="image" x="0" y="0" height="40" width="40">
          <image x="0" y="0" width="40" height="40" xlink:href="http://www.e-pint.com/epint.jpg"></image>
        </pattern>
  </defs>
*/


// add full detail content to each full asset tile
content.selectAll("g").each(function (d, i) {
    var tileID = table[i][4];
    var tilecontents = tiledata.filter(function (item) {
        return item[0] == tileID
    });
    if (tilecontents.length == 1) {
        switch (tilecontents[0][4]) {
            case "1": //Learning Room
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "#41a6f4");
            d3.select(this).append("circle").attr("cx", "9").attr("cy", "15").attr("r", "2").attr("fill", "white");
            d3.select(this).append("circle").attr("cx", "18").attr("cy", "11").attr("r", "2").attr("fill", "white");
            d3.select(this).append("circle").attr("cx", "18").attr("cy", "19").attr("r", "2").attr("fill", "white");
            d3.select(this).append("line").attr("x1", "9").attr("y1", "15").attr("x2", "18").attr("y2", "11").attr("stroke", "white").attr("stroke-width", "1");
            d3.select(this).append("line").attr("x1", "9").attr("y1", "15").attr("x2", "18").attr("y2", "19").attr("stroke", "white").attr("stroke-width", "1");
            d3.select(this).append("rect").attr("fill", "#41a6f4").attr("x", "35").attr("y", "165").attr("width", "100").attr("height", "20");
            d3.select(this).append("text").attr("fill", "white").attr("x", "40").attr("y", "180").attr("font-size", "14px").text("Learning Room");
            break;
            case "2": //OpenSAP
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            d3.select(this).append("rect").attr("fill", "#494f43").attr("x", "35").attr("y", "165").attr("width", "100").attr("height", "20");
            d3.select(this).append("text").attr("fill", "white").attr("x", "55").attr("y", "180").attr("font-size", "14px").text("Open");
            d3.select(this).append("text").attr("fill", "#f2b830").attr("x", "90").attr("y", "180").attr("font-size", "14px").text("SAP")
            break;
            case "6": //e-Learning
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("rect").attr("fill", "#41a6f4").attr("x", "5").attr("y", "115").attr("width", "75").attr("height", "20");
            d3.select(this).append("a").attr("href", function () {
                return tilecontents[0][7].trim()
            }).attr("target", "_self").append("text").attr("fill", "white").attr("x", "10").attr("y", "130").attr("font-size", "14px").text("E-learning");
            d3.select(this).append("text").attr("fill", "black").attr("x", "45").attr("y", "145").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                return tilecontents[0][6].trim()
            });
            break;
            case "8": //Certification
            d3.select(this).select("rect").attr("fill", "grey");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            d3.select(this).append("circle").attr("cx", 90).attr("cy", 120).attr("r", "30").attr("fill", "#f2b830");
            d3.select(this).append("a").attr("href", function () {
                return tilecontents[0][7].trim()
            }).append("rect").attr("x", 0).attr("y", 0).attr("rx", "5").attr("ry", "5").attr("width", "180").attr("height", "200").attr("stroke", "#e0e2e5").attr("stroke-width", "1").attr("fill", "transparent");
            break;
            case "9": //Certification
            d3.select(this).select("rect").attr("fill", "grey");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            d3.select(this).append("circle").attr("cx", 90).attr("cy", 120).attr("r", "30").attr("fill", "#f2b830");
            d3.select(this).append("a").attr("href", function () {
                return tilecontents[0][7].trim()
            }).append("rect").attr("x", 0).attr("y", 0).attr("rx", "5").attr("ry", "5").attr("width", "180").attr("height", "200").attr("stroke", "#e0e2e5").attr("stroke-width", "1").attr("fill", "transparent");
            break;
            case "10": // Stay current (e-Learning)
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("rect").attr("fill", "#41a6f4").attr("x", "5").attr("y", "115").attr("width", "75").attr("height", "20");
            d3.select(this).append("a").attr("href", function () {
                return tilecontents[0][7].trim()
            }).attr("target", "_self").append("text").attr("fill", "white").attr("x", "10").attr("y", "130").attr("font-size", "14px").text("E-learning");
            d3.select(this).append("text").attr("fill", "black").attr("x", "45").attr("y", "145").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                return tilecontents[0][6].trim()
            });
            break;
            default: // general asset tile with only one learning option
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("rx", "0").attr("ry", "0").attr("width", "180").attr("height", "25").attr("stroke", "#e0e2e5").attr("stroke-width", "0").attr("fill", "#f2b830");
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "red").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            switch (tilecontents[0][4]) {
                case "3":
                d3.select(that).append("rect").attr("fill", "#85c13c").attr("x", "5").attr("y", "155").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {
                    return item[7].trim()
                }).append("text").attr("fill", "white").attr("x", "8").attr("y", "170").attr("font-size", "14px").text("Live Access");
                d3.select(that).append("text").attr("fill", "black").attr("x", "45").attr("y", "185").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                    return item[6].trim()
                });
                break;
                case "4":
                d3.select(that).append("rect").attr("fill", "#41a6f4").attr("x", "95").attr("y", "155").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {
                    return item[7].trim()
                }).attr("target", "_self").append("text").attr("fill", "white").attr("x", "110").attr("y", "170").attr("font-size", "14px").text("E-book")
                d3.select(that).append("text").attr("fill", "black").attr("x", "128").attr("y", "185").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                    return item[6].trim()
                });
                break;
                case "5":
                d3.select(that).append("rect").attr("fill", "#edeeef").attr("x", "95").attr("y", "115").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {
                    return item[7].trim()
                }).attr("target", "_self").append("text").attr("fill", "black").attr("x", "98").attr("y", "130").attr("font-size", "14px").text("Classroom");
                d3.select(that).append("text").attr("fill", "black").attr("x", "128").attr("y", "145").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                    return item[6].trim()
                });
                break;
                case "6":
                d3.select(that).append("rect").attr("fill", "#41a6f4").attr("x", "5").attr("y", "115").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {
                    return item[7].trim()
                }).attr("target", "_self").append("text").attr("fill", "white").attr("x", "10").attr("y", "130").attr("font-size", "14px").text("E-learning");
                d3.select(that).append("text").attr("fill", "black").attr("x", "45").attr("y", "145").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                    return item[6].trim()
                });
                break;
                case "7":
                d3.select(that).append("rect").attr("fill", "#41a6f4").attr("x", "35").attr("y", "165").attr("width", "100").attr("height", "20");
                d3.select(that).append("text").attr("fill", "white").attr("x", "50").attr("y", "180").attr("font-size", "14px").text("Assessment")
                break;
                case "10":
                d3.select(that).append("rect").attr("fill", "#85c13c").attr("x", "5").attr("y", "155").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {
                    return item[7].trim()
                }).append("text").attr("fill", "white").attr("x", "8").attr("y", "170").attr("font-size", "14px").text("Live Access");
                d3.select(that).append("text").attr("fill", "black").attr("x", "45").attr("y", "185").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                    return item[6].trim()
                });
                break;
            }
            break;
        }
    } else {
        // general asset tile, with multiple learning options
        d3.select(this).select("rect").attr("fill", "red");
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("rx", "0").attr("ry", "0").attr("width", "180").attr("height", "25").attr("stroke", "#e0e2e5").attr("stroke-width", "0").attr("fill", "#f2b830");
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
        d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
            return tilecontents[0][1].trim();
        }).call(wrap, 170);
        d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
            return tilecontents[0][2].trim()
        });
        var that = this;
        tilecontents.forEach(function (item) {
            switch (item[4]){
            case "5": // Classroom
                d3.select(that).append("rect").attr("fill", "#edeeef").attr("x", "95").attr("y", "115").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {return item[7].trim()})
                    .attr("target", "_self").append("text").attr("fill", "black").attr("x", "98").attr("y", "130").attr("font-size", "14px").text("Classroom");
                d3.select(that).append("text").attr("fill", "black").attr("x", "128").attr("y", "145").attr("font-size", "12px").attr("text-anchor", "middle").text(function () {
                    return item[6].trim()});
                break;
            case "4": // e-Book
                d3.select(that).append("rect").attr("fill", "url(#ebook)").attr("x", "95").attr("y", "155").attr("width", "75").attr("height", "75");
                d3.select(that).append("a").attr("href", function () {return item[7].trim()}).attr("target", "_self").append("text").attr("fill", "white")
                    .attr("x", "110").attr("y", "170").attr("font-size", "14px").text("E-book");
                d3.select(that).append("text").attr("fill", "black").attr("x", "128").attr("y", "185").attr("font-size", "12px").attr("text-anchor", "middle")
                    .text(function () {return item[6].trim() });
                break;
            case "6": // e-Learning
                d3.select(that).append("rect").attr("fill", "#41a6f4").attr("x", "5").attr("y", "115").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {return item[7].trim()}).attr("target", "_self").append("text").attr("fill", "white")
                    .attr("x", "10").attr("y", "130").attr("font-size", "14px").text("E-learning");
                d3.select(that).append("text").attr("fill", "black").attr("x", "45").attr("y", "145").attr("font-size", "12px").attr("text-anchor", "middle")
                    .text(function () {return item[6].trim()});
                break;
            case "3": // Live-Access
                d3.select(that).append("rect").attr("fill", "#85c13c").attr("x", "5").attr("y", "155").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () { return item[7].trim()}).append("text").attr("fill", "white").attr("x", "8").attr("y", "170")
                    .attr("font-size", "14px").text("Live Access");
                d3.select(that).append("text").attr("fill", "black").attr("x", "45").attr("y", "185").attr("font-size", "12px").attr("text-anchor", "middle")
                    .text(function () { return item[6].trim()});
                break;
            case "10": // Live-access
                d3.select(that).append("rect").attr("fill", "#85c13c").attr("x", "5").attr("y", "155").attr("width", "75").attr("height", "20");
                d3.select(that).append("a").attr("href", function () {return item[7].trim()}).append("text").attr("fill", "white").attr("x", "8").attr("y", "170")
                    .attr("font-size", "14px").text("Live Access");
                d3.select(that).append("text").attr("fill", "black").attr("x", "45").attr("y", "185").attr("font-size", "12px").attr("text-anchor", "middle")
                    .text(function () {return item[6].trim()});
                break;
           case "7": // Assessment
                d3.select(that).append("rect").attr("fill", "#41a6f4").attr("x", "35").attr("y", "165").attr("width", "100").attr("height", "20");
                d3.select(that).append("text").attr("fill", "white").attr("x", "50").attr("y", "180").attr("font-size", "14px").text("Assessment")
            ;
            break;
           } 
        })
    };
});

// make all detail asset tiles invisible (until expanded by clicking "explore")
content.selectAll("g").attr("style","display:none");

//Define variables for controlling layout of learning journey

var x =[];
var y =[],
totalHeight;

// Compute arrangement of items into parts of learning journey

function updateSVG() {
// remove all connector elements so that we have a "clean" canvas 
    collapsed.selectAll("rect.connector").remove();
	 collapsed.selectAll("rect.line_connector").remove();
	 collapsed.selectAll("rect.long_connector").remove();
    collapsed.selectAll("text.headers").remove();
    collapsed.selectAll("path.connector").remove();
    canvas.selectAll("circle.marker").remove();
// initialize positioning counters and streams of learning journey    
    var xcounter = 130;
    var ycounter = 60;
    QlearningRooms =[],
    QgettingStarted =[],
    QfullyCompetent =[],
    QexpandSkills =[];
    QstayCurrent =[];
    
    
    //    get currently "visible" (filtered) part of datatable containing learning journey entries
    var temp = document.getElementsByClassName("datatable")[0];
    var index;
    for (i = 0; i < table.length; i++) {
        x[i] = 0;
        y[i] = 0;
    };
    for (j = 0; j < temp.rows.length; j++) {
        var value = temp.rows[j].cells[4].innerHTML.trim();
        
        for (k = 0; k < table.length; k++) {
            if (table[k][4].trim() == value) {
                var category = table[k][3].trim();
                console.log(category);
                if (category.indexOf("overview") != -1) {
                    QgettingStarted.push(k)
                };
                if (category.indexOf("fully") != -1) {
                    QfullyCompetent.push(k)
                };
                if (category.indexOf("Expand") != -1) {
                    QexpandSkills.push(k)
                };
                if (category.indexOf("Stay") != -1) {
                    QstayCurrent.push(k)
                };
            }
        };
    };
    
    
    
    
    
    if (QgettingStarted.length > 0) {
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "red");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "16px").attr("fill", "red").attr("font-family", "Arial, Sans-Serif").text("Join the SAP Learning Room").call(wrap, canvaswidth);
        ycounter = ycounter + 1 * totalHeight;
        
        ycounter = renderPart(QgettingStarted, xcounter, ycounter);
        xcounter = 130;
        ycounter = ycounter + 200;
    };
    
    if (QfullyCompetent.length > 0) {
        
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter +6).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "#93c939");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter +12;
        }).attr("font-size", "16px").attr("fill", "red").attr("font-family", "Arial, Sans-Serif").text("Start with an overview").call(wrap, canvaswidth);
        ycounter = ycounter + 5 * totalHeight;
        
        var QfullyCompetentvalues =[];
        QfullyCompetentvalues = $.unique(QfullyCompetent.map(function (currentValue) {
            return table[currentValue][3].trim()
        }).sort());
        
        
        QfullyCompetentvalues.forEach(function (item) {
            collapsed.append("text").attr("class", "headers").attr("fill", "black").attr("display", "none").attr("x", function () {
                return xcounter + 20;
            }).attr("y", function () {
                return ycounter -20;
            }).attr("font-size", "20px").text(function () {
                return item;
            }).call(wrap, canvaswidth);
            ycounter = ycounter + 20 * totalHeight;
            Qtemp = QfullyCompetent.filter(function (currentValue) {
                return table[currentValue][3].trim() == item
            });
            ycounter = renderPart(Qtemp, xcounter, ycounter);
            xcounter = 130;
            ycounter = ycounter + 200;
        });
    };
    
    
    if (QexpandSkills.length > 0) {
        
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter +8).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "#f2b830");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 5;
        }).attr("y", function () {
            return ycounter +15;
        }).attr("font-size", "16px").attr("fill", "red").attr("font-family", "Arial, Sans-Serif").text("Expand your skills").call(wrap, canvaswidth);
        ycounter = ycounter + 10 * totalHeight;
        
        var QexpandSkillsvalues =[];
        QexpandSkillsvalues = $.unique(QexpandSkills.map(function (currentValue) {
            return table[currentValue][3].trim()
        }).sort());
        
        
        QexpandSkillsvalues.forEach(function (item) {
            collapsed.append("text").attr("class", "headers").attr("fill", "black").attr("display", "none").attr("x", function () {
                return xcounter + 20;
            }).attr("y", function () {
                return ycounter -20;
            }).attr("font-size", "20px").text(function () {
                return item;
            }).call(wrap, canvaswidth);
            ycounter = ycounter + 20 * totalHeight;
            Qtemp = QexpandSkills.filter(function (currentValue) {
                return table[currentValue][3].trim() == item
            });
            ycounter = renderPart(Qtemp, xcounter, ycounter);
            xcounter = 130;
            ycounter = ycounter + 200;
        });
    };
    
    if (QstayCurrent.length > 0) {
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", "4").attr("fill", "white");
        collapsed.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
            return xcounter + 20;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "30px").text("Stay current").call(wrap, canvaswidth);
        ycounter = ycounter + 30 * totalHeight;
        
        ycounter = renderPart(QstayCurrent, xcounter, ycounter);
    };
    
    collapsed.selectAll("g").attr("transform", function (d, i) {
        return "translate(" + x[i] + "," + y[i] + ")";
    }).style("display", function (d, i) {
        if (y[i] !== 0) {
            return "block";
        } else {
            return "none";
        }
    });
    
    content.selectAll("g").attr("transform", function (d, i) {
        return "translate(" + x[i] + "," + y[i] + ")";
    })
    
    canvas.select("rect").attr("y", function (d) {
        return ycounter + 240;
    });
    canvas.selectAll("line").attr("y2", function (d) {
        return ycounter + 88
    });
    canvas.select("#square").attr("y", function (d) {
        return ycounter + 140
    });
}



// Supporting functions

function renderDoneItems() {
    content.selectAll("g").each(function (d) {
        $.getJSON('http://dewdfth12408:2017/html5-LearningJourney-EN/get_data.php', function (data) {
            for (i = 0; i < data.length; i++) {
                doneItems.push(data[i]);
            }
        });
        if (doneItems.indexOf(d[4]) != -1) {
            d3.select(this).select("rect").attr("stroke", "green").attr("stroke-width", 3)
        }
    })
}



function renderPart(Qarray, xcount, ycount) {
    var Qhelper =[];
    for (i = Qarray.length -1; i > -1; i--) {
        if (table[Qarray[i]][3].trim() == "XL") {
            Qhelper.unshift(Qarray[i]);
            Qarray.splice(i, 1);
        }
    };
    Qarray = Qarray.concat(Qhelper);
    console.log(Qarray);
    console.log(xcount);
    console.log(ycount);
    
    for (i = 0; i < Qarray.length; i++) {
        var index = Qarray[i];
        x[index] = xcount;
        y[index] = ycount;
        
        if (i == 0) {
            collapsed.select("g[id='" + index + "']").attr("class", "connector").append("rect").attr("x", -35).attr("y", 20).attr("width", 31).attr("id", "angle").attr("transform", "rotate(30)").attr("height", 1).style("fill", "#000");
            //collapsed.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(-20,0)").attr("fill", "#000").attr("width", 10).attr("d", arc);
            collapsed.select("g[id='" + index + "']").append("rect").attr("class", "connector").attr("x", -13).attr("y", 15).attr("width", 13).attr("id", "first").attr("height", 1).attr("fill", "#000");
        } else {
            if (xcount == 130) {
                collapsed.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(0,0)").attr("fill", "#000").attr("d", contarc);
                collapsed.select("g[id='" + index + "']").append("rect").attr("class", "long_connector").attr("x", -1).attr("y", -20).attr("width", 550).attr("height", 1).attr("fill", "#000").append("path").attr("class", "connector").attr("transform", "translate(250,40)").attr("fill", "#000").attr("d", arccont);
            }
			if (xcount == 130) {
            collapsed.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(543,-39)").attr("fill", "#000").attr("d", arccontrev);
            }
        };
        if (xcount + 200 < canvaswidth -200) {
            xcount = xcount + 292;
            if (i < Qarray.length -1) {
                collapsed.select("g[id='" + index + "']").append("rect").attr("class", "connector").attr("x", 180).attr("y", 15).attr("width", 20).attr("height", 1).attr("fill", "#000");
            };
        } else {
            xcount = 130;
            if (i < Qarray.length -1) {
                ycount = ycount + 220;""
                collapsed.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(250,40)").attr("fill", "#000").attr("d", arccont);
                collapsed.select("g[id='" + index + "']").append("rect").attr("class", "line_connector").attr("x", 270).attr("y", 40).attr("width", "1").attr("height", "170").attr("fill", "#000");
            };
        };
    };
    return ycount;
}



function wrap(text, width) {
    text.each(function (d, i) {
        var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line =[],
        lineNumber = 0,
        lineHeight = 1.2, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").attr("font-family", "Arial, Sans-Serif").attr("fill", "#222222");
        totalHeight = lineHeight;
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line =[word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy",++ lineNumber * lineHeight + dy + "em").text(word).attr("font-size", "16px").attr("font-family", "Arial, Sans-Serif").attr("font-weight", "bold").attr("fill", "#222222");
                totalHeight = totalHeight + lineHeight;
            }
        };
    });
}

function filterPrio(value) {
    $("select[rel*='2'] option").each(function () {
        this.selected = (this.text == value);
    });
    $("select[rel*='2']").change();
}

function filterInfra(value) {
    $("input[rel*='9']").val(value);
    $("input[rel*='9']").keyup();
}

function updateSearch(value) {
    $("input[rel*='6']").val(value);
    $("input[rel*='6']").keyup();
}

function sortBy(column) {
    switch (column) {
        case "what": $("#d490e64").click();
        break;
        case "prio": $("#d490e79").click();
        break;
        default: $("#d490e64").click()
    }
}

function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("active", false);
    alert(d3.select(this).attr("cx"));
}

// Adding the header

$(".body").prepend($('<div><svg width="100%" height="20px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:12" /></svg></div><div class="floating-box1"><img src="img/LearningJourney.svg" alt="Learning Journey" style="width:60px;"></div><div class="floating-box2"><h1 class="title topictitle1">SAP HANA Development</h1></div><div style="margin-top:-5px;margin-right:28px;margin-left:28px"><svg width="100%" height="3px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" /></svg></div>'));
$("rect#first.connector").replaceWith("<h2>New heading</h2>");