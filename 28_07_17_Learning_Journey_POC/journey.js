
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
var arc = d3.arc().innerRadius(15).outerRadius(20).startAngle(1 * Math.PI).endAngle(1.5 * Math.PI);
var contarc = d3.arc().innerRadius(15).outerRadius(20).startAngle(1 * Math.PI).endAngle(2 * Math.PI);
var arccont = d3.arc().innerRadius(15).outerRadius(20).startAngle(0 * Math.PI).endAngle(0.5 * Math.PI);


var screenWidth = $(window).width();
var svg = d3.select(".refbody").insert("svg", "div").attr("width", screenWidth -300).attr("height", "2000"),
width = + svg.attr("width"),
height = + svg.attr("height"),
radius = 10;
var canvaswidth = $(window).width() -248;

var canvas = svg.append("g").attr("id", "canvas"),
legend = svg.append("g").attr("id", "legend"),
content = svg.append("g").attr("id", "content");

//trigger redraw of learning journey after window resize, to make it responsive
window.onresize = function (event) {
    var newWidth = $(window).width();
    svg.attr("width", newWidth -300);
    canvas.select("#main").attr("width", newWidth -248);
    canvaswidth = newWidth -248;
    updateSVG(width);
};



// Create canvas for roadmap display and legend

canvas.append("line").attr("x1", "90").attr("y1", "30").attr("x2", "90").attr("y2", "1500").attr("stroke", "#e0e2e5").attr("stroke-width", "10");
canvas.append("rect").attr("id", "square").attr("x", "80").attr("y", "1500").attr("width", 20).attr("height", 20).attr("stroke-width", "3").attr("stroke", "#f2b830").attr("fill", "white");


// Trigger redraw of datatable when search value is entered (redraw of datatable in turn triggers redraw of learning journey visualization...
d3.select("#test-input").on("input", function () {
    updateSearch($(this).val())
});

// Create div for display of tooltips (invisible normally, and attached later temporarily to elements on mouseover)
var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);



// Define svg content containers (asset tiles) from data

content.selectAll("g").data(table).enter().append("g").attr("id", function (d, i) {
    return i;
});

// add basic tile background rectangle to each asset tile
content.selectAll("g").append("rect").attr("x", 0).attr("y", 0).attr("rx", "5").attr("ry", "5").attr("width", "180").attr("height", "248").attr("stroke", "#e0e2e5").attr("stroke-width", "1");

content.selectAll("g").each(function (d, i) {
    var tileID = table[i][4];
    var tilecontents = tiledata.filter(function (item) {
        return item[0] == tileID
    });
    if (tilecontents.length == 1) {
        switch (tilecontents[0][4]) {
            case "1": //Learning Room
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "20px").text(function () {
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
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "20px").text(function () {
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
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "20px").text(function () {
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
            }).append("rect").attr("x", 0).attr("y", 0).attr("rx", "5").attr("ry", "5").attr("width", "180").attr("height", "248").attr("stroke", "#e0e2e5").attr("stroke-width", "1").attr("fill", "transparent");
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
            }).append("rect").attr("x", 0).attr("y", 0).attr("rx", "5").attr("ry", "5").attr("width", "180").attr("height", "248").attr("stroke", "#e0e2e5").attr("stroke-width", "1").attr("fill", "transparent");
            break;
            case "10": // Stay current (e-Learning)
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "20px").text(function () {
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
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "20px").text(function () {
                return tilecontents[0][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tilecontents[0][2].trim()
            });
            d3.select(this).append("text").attr("fill", "blue").attr("x", "30").attr("y", "20").attr("width", "150").attr("height", "84").text("Details").on("mouseover", function (d, i) {
                div.transition().duration(248).style("opacity", .9);
                div.html("This could be a fairly long additional text giving more detail about the asset...").style("left", (d3.event.pageX + 20) + "px").style("top", (d3.event.pageY - 28) + "px");
            }).on("mouseout", function (d) {
                div.transition().duration(500).style("opacity", 0)
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
        d3.select(this).select("rect").attr("fill", "white");
        d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
        d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
        d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "20px").text(function () {
            return tilecontents[0][1].trim();
        }).call(wrap, 170);
        d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
            return tilecontents[0][2].trim()
        });
        d3.select(this).append("text").attr("fill", "blue").attr("x", "30").attr("y", "20").attr("width", "150").attr("height", "84").text("Details").on("mouseover", function (d, i) {
            div.transition().duration(248).style("opacity", .9);
            div.html("This could be a fairly long additional text giving more detail about the asset...").style("left", (d3.event.pageX + 20) + "px").style("top", (d3.event.pageY - 28) + "px");
        }).on("mouseout", function (d) {
            div.transition().duration(500).style("opacity", 0)
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
                d3.select(that).append("rect").attr("fill", "#41a6f4").attr("x", "95").attr("y", "155").attr("width", "75").attr("height", "20");
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



//Define variables for controlling layout of learning journey

var x =[];
var y =[],
totalHeight;

// Compute arrangement of items into parts of learning journey

function updateSVG() {
// remove all connector elements so that we have a "clean" canvas 
    content.selectAll("rect.connector").remove();
    content.selectAll("text.headers").remove();
    content.selectAll("path.connector").remove();
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
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", "4").attr("fill", "white");
        content.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
            return xcounter + 20;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "30px").text("Start with an overview").call(wrap, canvaswidth);
        ycounter = ycounter + 30 * totalHeight;
        
        ycounter = renderPart(QgettingStarted, xcounter, ycounter);
        xcounter = 130;
        ycounter = ycounter + 280;
    };
    
    if (QfullyCompetent.length > 0) {
        
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", "4").attr("fill", "white");
        content.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
            return xcounter + 20;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "30px").text("Go deeper and become fully competent").call(wrap, canvaswidth);
        ycounter = ycounter + 30 * totalHeight + 20;
        
        var QfullyCompetentvalues =[];
        QfullyCompetentvalues = $.unique(QfullyCompetent.map(function (currentValue) {
            return table[currentValue][3].trim()
        }).sort());
        
        
        QfullyCompetentvalues.forEach(function (item) {
            content.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
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
            ycounter = ycounter + 280;
        });
    };
    
    
    if (QexpandSkills.length > 0) {
        
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", "4").attr("fill", "white");
        content.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
            return xcounter + 20;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "30px").text("Expand your skills").call(wrap, canvaswidth);
        ycounter = ycounter + 30 * totalHeight;
        
        var QexpandSkillsvalues =[];
        QexpandSkillsvalues = $.unique(QexpandSkills.map(function (currentValue) {
            return table[currentValue][3].trim()
        }).sort());
        
        
        QexpandSkillsvalues.forEach(function (item) {
            content.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
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
            ycounter = ycounter + 280;
        });
    };
    
    if (QstayCurrent.length > 0) {
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#f2b830").attr("stroke-width", "4").attr("fill", "white");
        content.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
            return xcounter + 20;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "30px").text("Stay current").call(wrap, canvaswidth);
        ycounter = ycounter + 30 * totalHeight;
        
        ycounter = renderPart(QstayCurrent, xcounter, ycounter);
    };
    
    content.selectAll("g").attr("transform", function (d, i) {
        return "translate(" + x[i] + "," + y[i] + ")";
    }).style("display", function (d, i) {
        if (y[i] !== 0) {
            return "block";
        } else {
            return "none";
        }
    });
    
    canvas.select("rect").attr("y", function (d) {
        return ycounter + 240;
    });
    canvas.selectAll("line").attr("y2", function (d) {
        return ycounter + 150
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
            content.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(-20,0)").attr("fill", "#e0e2e5").attr("d", arc);
            content.select("g[id='" + index + "']").append("rect").attr("class", "connector").attr("x", -21).attr("y", 15).attr("width", 21).attr("height", 5).attr("fill", "#e0e2e5");
        } else {
            if (xcount == 130) {
                content.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(0,0)").attr("fill", "#e0e2e5").attr("d", contarc);
                content.select("g[id='" + index + "']").append("rect").attr("class", "connector").attr("x", -1).attr("y", -20).attr("width", 21).attr("height", 5).attr("fill", "#e0e2e5");
            }
        };
        if (xcount + 248 < canvaswidth -248) {
            xcount = xcount + 248;
            if (i < Qarray.length -1) {
                content.select("g[id='" + index + "']").append("rect").attr("class", "connector").attr("x", 180).attr("y", 15).attr("width", 20).attr("height", 5).attr("fill", "#e0e2e5")
            };
        } else {
            xcount = 130;
            if (i < Qarray.length -1) {
                ycount = ycount + 240;
                content.select("g[id='" + index + "']").append("path").attr("class", "connector").attr("transform", "translate(180,40)").attr("fill", "#e0e2e5").attr("d", arccont);
                content.select("g[id='" + index + "']").append("rect").attr("class", "connector").attr("x", 195).attr("y", 45).attr("width", 5).attr("height", 15).attr("fill", "#e0e2e5");
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
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        totalHeight = lineHeight;
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line =[word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy",++ lineNumber * lineHeight + dy + "em").text(word);
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

$(".body refbody").prepend($('<div><svg width="100%" height=""20px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:12" /></svg></div><div class="floating-box1"><img src="img/LearningJourney.svg" alt="Learning Journey" style="width:60px;"></div><div class="floating-box2"><h1 class="title topictitle1">SAP HANA Development</h1></div><div style="margin-top:-5px;margin-right:28px;margin-left:28px"><svg width="100%" height="3px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" /></svg></div>'));
