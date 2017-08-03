$(document).ready(function(){

// Prepare data for learning journey - structure data
var table =[];

$("table[id$='STRUCTURE'] tr").each(function () {
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

// Prepare data for asset tiles - tile data
var tiledata =[];
$("table[id$='LJ'] tr").each(function () {
    var arrayOfThisRow =[];
    var tableData = $(this).find('td');
    if (tableData.length > 0) {
        tableData.each(function () {
            arrayOfThisRow.push($(this).text());
        });
        tiledata.push(arrayOfThisRow);
    }
});


// Prepare basic svg containers and elements

// define arc elements to be used in "connector" elements in the journey visualization
 var arc = d3.arc().innerRadius(19).outerRadius(20).startAngle(1 * Math.PI).endAngle(1.5 * Math.PI);
 var contarc = d3.arc().innerRadius(19).outerRadius(20).startAngle(1 * Math.PI).endAngle(2 * Math.PI);
 var arccont = d3.arc().innerRadius(19).outerRadius(20).startAngle(0 * Math.PI).endAngle(0.5 * Math.PI);
var arccontrev = d3.arc().innerRadius(19).outerRadius(20).startAngle(-1 * Math.PI).endAngle(-1.5 * Math.PI);





// insert main svg graphic into html body, define canvas for LJ
var screenWidth = $(window).width();
var svg = d3.select(".refbody").insert("svg", "div").attr("width", screenWidth -300).attr("height", "2480").attr("id", "main_svg");
width = + svg.attr("width"),
height = + svg.attr("height"),
radius = 10;
var canvaswidth = $(window).width() -248;

var canvas = svg.append("g").attr("id", "canvas"),
legend = svg.append("g").attr("id", "legend"),
collapsed = svg.append("g").attr("id","collapsed"),
content = svg.append("g").attr("id", "content");

//trigger redraw of learning journey after window resize, to make it responsive
window.onresize = function (event) {
    var newWidth = $(window).width();
    svg.attr("width", newWidth -300);
    canvas.select("#main").attr("width", newWidth -248);
    canvaswidth = newWidth -248;
    updateSVG(width);
};



// Create canvas content for roadmap display and legend

canvas.append("line").attr("x1", "90").attr("y1", "30").attr("x2", "90").attr("y2", "1500").attr("stroke", "#000").attr("stroke-width", "1");
canvas.append("rect").attr("id", "square").attr("x", "80").attr("y", "1500").attr("width", 20).attr("height", 20).attr("stroke-width", "3").attr("stroke", "#f2b830").attr("fill", "white");


// Create div for display of tooltips (invisible normally, and attached later temporarily to elements on mouseover)
var div = d3.select(".refbody").append("div").attr("id","container").attr("width","248px");				
$("#container").hide();

d3.select("#container").insert("svg", "div").attr("width", "248px").attr("height", "150px").append("g").attr("id","tile").attr("width","150px");

// define trigger event on table cells to show individual tile as mouseover - to be used in tile browser topic
/* not relevant here at the moment 
$("td.entry").mouseenter(function(){hoverdiv(event,'container')});
$("td.entry").mouseleave(function(){hoverout('container')});
*/
// Define 'normal' svg content containers (asset tiles) from data (normal here means collapsed, if we later add the capability to optionally expand tiles)
collapsed.selectAll("g").data(tiledata).enter().append("g").attr("id", function (d, i) {
//    return i;
return 'tile'.concat(tiledata[i][0].trim());
});

// add basic tile background rectangle to each collapsed asset tile --> no, define those as part of the individual tile layout...
//collapsed.selectAll("g").append("rect").attr("x", x).attr("y", y).attr("width", "248px").attr("height", "150px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7);   

// margin for what?
var margin = {
    top: 20,
    right: 60,
    bottom: 30,
    left: 20
};

// collapsed.selectAll("g rect").attr("stroke-width", "10").style("margin-right", "248px");

// add "Explore" button to expand a tile on click - currently not used...
/*collapsed.selectAll("g").append("text").attr("fill", "blue").attr("x", "7").attr("y", "112").attr("font-weight", "bold").attr("font-size", "15px").text("Explore").attr("style" ,"display:none")

    .on("click",function (d,i){
        content.selectAll("g").attr("style","display:none");
        content.select("g[id='" + i + "']").attr("style","display:block")
    });
*/    

// add specific basic content to each collapsed asset tile
collapsed.selectAll("g").each(function (d, i) {
 switch (tiledata[i][5].trim()) {
            case "Learning Room": //Learning Room
            d3.select(this).append("rect").attr("x",0).attr("y",0).attr("width","248px").attr("height","150px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "#666666").attr("x", "165").attr("y", "15").attr("font-size", "11px").attr("font-family", "Arial, Sans-Serif").text("Learning Room");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("width","248px").attr("font-weight", "bold").attr("font-size", "15px").text(function() {
                return tiledata[i][1].trim();
            }).call(wrap,170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "white").style("stroke", "black");
            d3.select(this).append("image").attr("x", 15).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "57").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            d3.select(this).append("image").attr("x", 70).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/Webinar.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "115").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access")
            d3.select(this).append("image").attr("x", 125).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "162").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("image").attr("x", 180).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/LearningRoom.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "223").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom")
           			
            // d3.select(this).append("circle").attr("cx", "9").attr("cy", "15").attr("r", "2").attr("fill", "white");
            // d3.select(this).append("circle").attr("cx", "18").attr("cy", "11").attr("r", "2").attr("fill", "white");
            // d3.select(this).append("circle").attr("cx", "18").attr("cy", "19").attr("r", "2").attr("fill", "white");
            // d3.select(this).append("line").attr("x1", "9").attr("y1", "15").attr("x2", "18").attr("y2", "11").attr("stroke", "white").attr("stroke-width", "1");
            // d3.select(this).append("line").attr("x1", "9").attr("y1", "15").attr("x2", "18").attr("y2", "19").attr("stroke", "white").attr("stroke-width", "1");
            break;
            case "openSAP": //OpenSAP
            d3.select(this).append("rect").attr("x",0).attr("y",0).attr("width","248px").attr("height","150px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
//            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "white").style("stroke", "black");
            d3.select(this).append("image").attr("x", 60).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/Webinar.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "95").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][2].trim()
            });
            break;
            case "Early Knowledge Transfer (EKT)": //e-Learning
             d3.select(this).append("rect").attr("x",0).attr("y",0).attr("width","248px").attr("height","150px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");

            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-weight", "bold").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "white");
            d3.select(this).append("image").attr("x", 50).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "80").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/LearningRoom.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "130").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom")
            break;
/*            case "Certification": //Certification
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][2].trim()
            });
            break;
*/            
            case "Certification": //Certification
			 d3.select(this).append("path").attr("d","M 15 0 L 30 15 L 15 30").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
			  d3.select(this).append("path").attr("d","M 25 0 L 40 15 L 25 30").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
             d3.select(this).append("rect").attr("x",55).attr("y",0).attr("width","248px").attr("height","150px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "gray");
            d3.select(this).append("text").attr("fill", "white").attr("x", "145").attr("y", "45").attr("text-anchor", "middle").attr("font-weight", "bold").attr("font-size", "16px").text(function (d) {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "70").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "white");
            d3.select(this).append("image").attr("x", 105).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "150").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            d3.select(this).append("image").attr("x", 155).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "195").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("text").attr("fill", "white").attr("x", "200").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][2].trim()
            });
            break;
            case "10": // Stay current (e-Learning)
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            break;
            default: // general asset tile with only one learning option
             d3.select(this).append("rect").attr("x",0).attr("y",0).attr("width",248).attr("height",150).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            //d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("rx", "0").attr("ry", "0").attr("width", "180").attr("height", "25").attr("stroke", "#e0e2e5").attr("stroke-width", "0").attr("fill", "#f2b830");
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "white");
            // d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-weight", "bold").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "black").attr("x", "235").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][5].trim()
            });

        }
    ;
    
   
});



//Define variables for controlling layout of learning journey

var x =[];
var y =[],
totalHeight;


// Compute arrangement of items into parts of learning journey (could also be triggered from the outside, e.g. when rendering LJ based on datatable, upon filtering and redraw of datatable
updateSVG();



function updateSVG() {
// remove all connector elements so that we have a "clean" canvas 
    collapsed.selectAll("rect.connector").remove();
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



// initialize tile placement arrays ([x[i] and y[i] will later determine the absolute placement of tile i within the LJ svg)
    for (i = 0; i < table.length; i++) {
        x[i] = 0;
        y[i] = 0;
    };
    
//    get currently "visible" (filtered) part of datatable containing learning journey entries (not used currently, only relevant when basing LJ rendering on dynamic datatable)
//    var temp = document.getElementsByClassName("datatable")[0];
//    var index;
//    for (j = 0; j < temp.rows.length; j++) {
//        var value = temp.rows[j].cells[4].innerHTML.trim();

// push tile id values into respective learning scenario arrays, for later placement into LJ graphic
        for (k = 0; k < table.length; k++) {
//            if (table[k][4].trim() == value) {
                var category = table[k][3].trim();
//                console.log(category);
                if (category.indexOf("Room") != -1) {
                    QlearningRooms.push(k)
                };                
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
//            }
        };
//    };  // end of extra filtering loop, through j
/*console.log(QlearningRooms);
console.log(QgettingStarted);
console.log(QfullyCompetent);
console.log(QexpandSkills);
console.log(QstayCurrent);
*/

// push Learning Room items into Learning Room track of LJ   
     if (QlearningRooms.length > 0) {
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "purple");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "16px").attr("fill", "black").attr("font-family", "Bentonsans Light").text("Join the SAP Learning Room").call(wrap, canvaswidth);
        ycounter = ycounter + 1 * totalHeight;
        
        ycounter = renderPart(QlearningRooms, xcounter, ycounter,"learningRooms");
        xcounter = 130;
        ycounter = ycounter + 248;
    };

// push Getting Started items into Getting Started track of LJ  
    if (QgettingStarted.length > 0) {
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "red");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter -20;
        }).attr("font-size", "16px").attr("fill", "black").attr("font-family", "Bentonsans Light").text("Start with an overview").call(wrap, canvaswidth);
        ycounter = ycounter + 1 * totalHeight;
        
        ycounter = renderPart(QgettingStarted, xcounter, ycounter,"gettingStarted");
        xcounter = 130;
        ycounter = ycounter + 248;
    };

// push Fully Competent items into Fully Competent track of LJ
    if (QfullyCompetent.length > 0) {      
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter +6).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "#93c939");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter +12;
        }).attr("font-size", "16px").attr("fill", "black").attr("font-family", "Bentonsans Light").text("Become fully competent").call(wrap, canvaswidth);
        ycounter = ycounter + 5 * totalHeight;
      
        var QfullyCompetentTopics =[];
        QfullyCompetent.forEach(function(item){
            QfullyCompetentTopics.push(table[item][5].trim())
            });
        QfullyCompetentTopics = $.uniqueSort(QfullyCompetentTopics);
               
        QfullyCompetentTopics.forEach(function (item) {
            collapsed.append("text").attr("class", "headers").attr("fill", "black").attr("display", "block").attr("font-family", "Bentonsans Light").attr("x", function () {
                return xcounter + 0;
            }).attr("y", function () {
                return ycounter +20;
            }).attr("font-size", "12px").text(function () {
                return item;
            }).call(wrap, canvaswidth);
            ycounter = ycounter + 20 * totalHeight;
            Qtemp = QfullyCompetent.filter(function (currentValue) {
                return table[currentValue][5].trim() == item
            });
            ycounter = renderPart(Qtemp, xcounter, ycounter,"fullyCompetent");
            xcounter = 130;
            ycounter = ycounter + 248;
        });
    };
    
    

    if (QexpandSkills.length > 0) {      
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter +6).attr("r", "10").attr("stroke", "#000").attr("stroke-width", "1").style("fill", "#93c939");
        collapsed.append("text").attr("class", "headers").attr("fill", "#222222").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter +12;
        }).attr("font-size", "16px").attr("fill", "#93c939").attr("font-family", "Arial, Sans-Serif").text("Expand your skills").call(wrap, canvaswidth);
        ycounter = ycounter + 5 * totalHeight;    
        var QexpandSkillsTopics =[];
        QexpandSkills.forEach(function(item){
            QexpandSkillsTopics.push(table[item][5].trim())
            });      
 
        QexpandSkillsTopics = $.uniqueSort(QexpandSkillsTopics);      
        
        QexpandSkillsTopics.forEach(function (item) {
            collapsed.append("text").attr("class", "headers").attr("fill", "black").attr("display", "block").attr("x", function () {
                return xcounter + 20;
            }).attr("y", function () {
                return ycounter -20;
            }).attr("font-size", "20px").text(function () {
                return item;
            }).call(wrap, canvaswidth);
            ycounter = ycounter + 20 * totalHeight;
            Qtemp = QexpandSkills.filter(function (currentValue) {
                return table[currentValue][5].trim() == item
            });
            ycounter = renderPart(Qtemp, xcounter, ycounter,"expandSkills");
            xcounter = 130;
            ycounter = ycounter + 248;
        });
    };


    
    if (QstayCurrent.length > 0) {
        canvas.append("circle").attr("class", "marker").attr("cx", "90").attr("cy", ycounter -30).attr("r", "10").attr("stroke", "black").attr("stroke-width", "1").attr("fill", "blue");
        collapsed.append("text").attr("class", "headers").attr("fill", "black").attr("x", function () {
            return xcounter + 0;
        }).attr("y", function () {
            return ycounter -25;
        }).attr("font-size", "16px").attr("fill", "black").attr("font-family", "Bentonsans Light").text("Stay current").call(wrap, canvaswidth);
        ycounter = ycounter + 0 * totalHeight;
        
        ycounter = renderPart(QstayCurrent, xcounter, ycounter,"stayCurrent");
    };
    
// translate all tiles to their proper place in the LJ svg graphic, based on x and y coordinates calculated before (making sure that tiles are identified by their id and matched with their index position in the underlying table)    
    collapsed.selectAll("g").each(function (d, i) {
        var index;
        var id = $(this).attr("id");

        for (j = 0; j < table.length; j++){
            if('tile'+table[j][6].trim()==id){index=j}
            };

        d3.select(this).attr("transform", function () {
        return "translate(" + x[index] + "," + y[index] + ")";
    }).style("display", function () {
        if (y[index] !== 0) {
            return "block";
        } else {
            return "none";
        }
    });
    });


// this is how easy this was before - can we get back to this somehow? will need to work on this part...
/*    content.selectAll("g").attr("transform", function (d, i) {
        return "translate(" + x[i] + "," + y[i] + ")";
    })
*/    

// adjust length of canvas, vertical line and "end" square
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

// this function currently not used - only needed in future, for connecting to Learning Hub and showing which LJ items a user has already completed
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



function renderPart(Qarray, xcount, ycount, scenario) {
/*    var Qhelper =[];
    for (i = Qarray.length -1; i > -1; i--) {
        if (table[Qarray[i]][3].trim() == "XL") {
            Qhelper.unshift(Qarray[i]);
            Qarray.splice(i, 1);
        }
    };
    Qarray = Qarray.concat(Qhelper);
*/   
//    console.log(Qarray);
//    console.log(xcount);
//    console.log(ycount);
    
    for (i = 0; i < Qarray.length; i++) {
        var index = Qarray[i];
        var id = table[index][6].trim();
        collapsed.select("g[id='tile" + id + "'] circle").attr("fill",function(){
            switch(scenario){
                case "learningRooms":
                    return "purple";
                    break
                case "gettingStarted":
                    return "red";
                    break
                case "fullyCompetent":
                    return "green";
                    break                
                case "expandSkills":
                    return "yellow";
                    break
                case "stayCurrent":
                    return "blue";
                    break
                default:
                    return "white";
                    break
            }
        });
        x[index] = xcount;
        y[index] = ycount;
        
        if (i == 0) {
            collapsed.select("g[id='tile" + id + "']").attr("class", "connector").append("path").attr("d","M -40 0 L -25 15 L 0 15").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
        } else {
            if (xcount == 130) {
                collapsed.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d","M 10 0 L 25 -10 L 50 -10").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
                collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 55).attr("y", -11).attr("width", 2).attr("height", 2).attr("fill", "#000");
				 collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 60).attr("y", -11).attr("width", 2).attr("height", 2).attr("fill", "#000");
				 collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 65).attr("y", -11).attr("width", 2).attr("height", 2).attr("fill", "#000");
			}
        };
        if (xcount + 220 < canvaswidth -220) {
            xcount = xcount + 267;
            if (i < Qarray.length -1) {
                collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 248).attr("y", 15).attr("width", 45).attr("height", 1).attr("fill", "#000");
            };
        } else {
            xcount = 130;
            if (i < Qarray.length -1) {
                ycount = ycount + 180;
                collapsed.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d","M 248 16 L 260 26 L 260 46").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
                collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 259).attr("y", 51).attr("width", 2).attr("height", 2).attr("fill", "#000");
				 collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 259).attr("y", 56).attr("width", 2).attr("height", 2).attr("fill", "#000");
				 collapsed.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 259).attr("y", 61).attr("width", 2).attr("height", 2).attr("fill", "#000");

            };
        };
    };
    return ycount;
}

function hoverout(divid){
      d3.select("#tile").selectAll("*").remove(); 
          $("#"+divid).toggle();
}

/* ignore this part for now - it is for the tile browser... 
function hoverdiv(e,divid){

    var left  = e.clientX  + "px";
    var top  = e.clientY  + "px";
//    var width = $(e.target).width() + "px";
//    var div1 = $("#"+divid);
    var tileID = $(e.target).parent().children().first().text().trim();


    var i=0;
    for (j = 0; j < tiledata.length; j++) {
        if (tiledata[j][0].trim()==tileID){i=j}
        };
    d3.select("#tile").selectAll("*").remove(); 
    
    $("#"+divid).css('z-index',10);
    $("#"+divid).css('left',left);
    $("#"+divid).css('top',top);
    $("#"+divid).css('position','fixed');
    $("#"+divid).toggle();
    
    
    d3.selectAll("#tile").each(function () {
 //       d3.select("#tile").append("rect").attr("x", x).attr("y", y).attr("width", "248px").attr("height", "150px").attr("fill","white").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7);


 switch (tiledata[i][5].trim()) {
            case "Learning Room": //Learning Room
            d3.select(this).append("rect").attr("x",0).attr("y",0).attr("width","248px").attr("height","248px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "#666666").attr("x", "95").attr("y", "15").attr("font-size", "11px").attr("font-family", "Arial, Sans-Serif").text("Learning Room");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("width","248px").attr("font-size", "15px").text(function() {
                return tiledata[i][1].trim();
            }).call(wrap,170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "red").style("stroke", "black");
            d3.select(this).append("image").attr("x", 15).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/Asset 1blue.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "45").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            d3.select(this).append("image").attr("x", 60).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/Webinar.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "95").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("image").attr("x", 140).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/LearningRoom.svg")
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
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").attr("fill", "#f2b830").style("stroke", "black");
            d3.select(this).append("image").attr("x", 60).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/Webinar.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "95").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("text").attr("fill", "black").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][2].trim()
            });
            break;
            case "6": //e-Learning
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "#93c939");
            d3.select(this).append("image").attr("x", 50).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "80").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/LearningRoom.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "130").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom")
            break;
            case "8": //Certification
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][2].trim()
            });
            break;
            case "9": //Certification
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "white").attr("x", "90").attr("y", "45").attr("text-anchor", "middle").attr("font-size", "16px").text(function (d) {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "#93c939");
            d3.select(this).append("image").attr("x", 50).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "80").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            d3.select(this).append("image").attr("x", 100).attr("y", 110).attr("width", "49px").attr("height", "49px").attr("xlink:href","img/eBook.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "125").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-book")
            d3.select(this).append("text").attr("fill", "white").attr("x", "170").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][2].trim()
            });
            break;
            case "10": // Stay current (e-Learning)
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            break;
            default: // general asset tile with only one learning option
             d3.select(this).append("rect").attr("x",0).attr("y",0).attr("width",248).attr("height",248).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            //d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("rx", "0").attr("ry", "0").attr("width", "180").attr("height", "25").attr("stroke", "#e0e2e5").attr("stroke-width", "0").attr("fill", "#f2b830");
            //d3.select(this).append("circle").attr("cx", "15").attr("cy", "15").attr("r", "10").style("stroke", "black").attr("fill", "#93c939");
            // d3.select(this).append("circle").attr("cx", "15").attr("cy", "13").attr("r", "5").attr("stroke", "#f2b830").attr("stroke-width", 3).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(function () {
                return tiledata[i][1].trim();
            }).call(wrap, 170);
            d3.select(this).append("text").attr("fill", "black").attr("x", "190").attr("y", "20").attr("text-anchor", "end").text(function () {
                return tiledata[i][5].trim()
            });

        }
    ;
});  
    
} // end function hoverdiv
*/


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

$(".body").prepend($('<div><svg width="100%" height="20px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:12" /></svg></div><div class="floating-box1"><img src="img/LearningJourney.svg" alt="Learning Journey" style="width:60px;"></div><div class="floating-box2"><h1 class="title topictitle1">SAP HANA Development</h1></div><div style="margin-top:-5px;margin-right:24px;margin-left:28px"><svg width="100%" height="3px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" /></svg></div>'));

})
