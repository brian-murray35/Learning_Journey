$(document).ready(function () {

    // Journey title
    // TODO: get proper encoding version of texts (for special characters or different leters other than latin)
    var journeyTitle = $("td[id$='journey_title'] p").text().trim();

    // Prepare data for learning journey - structure data
    // TODO: merge the structure and tile data into one array, as they seem to be always same amount of rows
    var LJStructureData = [];
    $("table[id$='STRUCTURE'] tr").each(function () {
        var rowObj = {};
        var tableData = $(this).find("td");
        if (tableData.length > 0) {
            rowObj = {
                // TODO: get proper encoding version of texts (for special characters or different leters other than latin)
                // "journeyID": $(tableData[0]).text().trim(),
                // "journeyTitle": $(tableData[1]).text().trim(),
                "scenarioID": $(tableData[2]).text().trim(),
                "scenarioTitle": $(tableData[3]).text().trim(),
                "subtopicID": $(tableData[4]).text().trim(),
                "subtopicTitle": $(tableData[5]).text().trim(),
                "tileID": $(tableData[6]).text().trim(),
                "tileTitle": $(tableData[7]).text().trim()
            };
            LJStructureData.push(rowObj);
        }
    });
    
    // Prepare data for asset tiles - tile data
    // TODO: merge the structure and tile data into one array, as they seem to be always same amount of rows
    var LJTileData = [];
    $("table[id$='LJ'] tr").each(function () {
        var rowObj = {};
        var tableData = $(this).find('td');
        if (tableData.length > 0) {
            rowObj = {
                // TODO: get proper encoding version of texts (for special characters or different leters other than latin)
                "tileID": $(tableData[0]).text().trim(),
                "tileTitle": $(tableData[1]).text().trim(),
                "courseCode": $(tableData[2]).text().trim(),
                "shortDescription": $(tableData[3]).text().trim(),
                "footnote": $(tableData[4]).text().trim(),
                "type": $(tableData[5]).text().trim(),
                "learningRoomURL": [$($(tableData[6]).find("a")).text().trim(), $($(tableData[6]).find("a")).attr("href")],
                "learningRoomDuration": $(tableData[7]).text().trim(),
                "learningRoomPlanned": $(tableData[8]).text().trim(),
                "openSAPURL": [$($(tableData[9]).find("a")).text().trim(), $($(tableData[9]).find("a")).attr("href")],
                "openSAPDuration": $(tableData[10]).text().trim(),
                "openSAPPlanned": $(tableData[11]).text().trim(),
                "liveAccessURL": [$($(tableData[12]).find("a")).text().trim(), $($(tableData[12]).find("a")).attr("href")],
                "liveAccessDuration": $(tableData[13]).text().trim(),
                "liveAccessPlanned": $(tableData[14]).text().trim(),
                "eBookURL": [$($(tableData[15]).find("a")).text().trim(), $($(tableData[15]).find("a")).attr("href")],
                "eBookDuration": $(tableData[16]).text().trim(),
                "eBookPlanned": $(tableData[17]).text().trim(),
                "classroomURL": [$($(tableData[18]).find("a")).text().trim(), $($(tableData[18]).find("a")).attr("href")],
                "classroomDuration": $(tableData[19]).text().trim(),
                "classroomPlanned": $(tableData[20]).text().trim(),
                "eLearningURL": [$($(tableData[21]).find("a")).text().trim(), $($(tableData[21]).find("a")).attr("href")],
                "eLearningDuration": $(tableData[22]).text().trim(),
                "eLearningPlanned": $(tableData[23]).text().trim(),
                "certURL": [$($(tableData[24]).find("a")).text().trim(), $($(tableData[24]).find("a")).attr("href")],
                "certDuration": $(tableData[25]).text().trim(),
                "certPlanned": $(tableData[26]).text().trim(),
                "certSecondaryText": $(tableData[27]).text().trim(),
                "otherURL": [$($(tableData[28]).find("a")).text().trim(), $($(tableData[28]).find("a")).attr("href")],
                "otherDuration": $(tableData[29]).text().trim(),
                "otherPlanned": $(tableData[30]).text().trim(),
                "otherButtonLabel": $(tableData[31]).text().trim(),
                "otherSecondaryText": $(tableData[32]).text().trim(),
                "academyURL": [$($(tableData[33]).find("a")).text().trim(), $($(tableData[33]).find("a")).attr("href")],
                "academyDuration": $(tableData[34]).text().trim(),
                "academyPlanned": $(tableData[35]).text().trim()
            };
            LJTileData.push(rowObj);
        }
    });

    // Constraints
    var ROADMAP_TOP_MARGIN = 30; // top margin of roadmap
    var ROADMAP_LEFT_MARGIN = 25; // left margin of roadmap
    var ROADMAP_RIGHT_MARGIN = 18; // right margin of roadmap
    var SCENARIO_MARKER_RADIUS = 7; // Circle radius in scenario
    var TILE_MARKER_RADIUS = 7; // Circle radius in Tile
    var TILE_MARKER_MARGIN = 6; // Circle Top and Left margin in Tile
    var TILE_WIDTH = 248; // Tile Width
    var TILE_HEIGHT = 188; // Tile Height
    var TILE_BOTTOM_MARGIN = 30; // Tile Bottom margin
    


    // Prepare basic svg containers and elements

    // insert main svg graphic into html body, define canvas for LJ
    var svg = d3.select(".refbody").insert("svg", "div").attr("width", "100%").attr("height", "2480").attr("id", "main_svg2");
    var roadmap = svg.append("g").attr("id", "roadmap");
    var tileContainer = svg.append("g").attr("id", "tile-container");

    // Create canvas content for roadmap display
    roadmap.append("line")
        .attr("x1", ROADMAP_LEFT_MARGIN)
        .attr("y1", ROADMAP_TOP_MARGIN)
        .attr("x2", ROADMAP_LEFT_MARGIN)
        .attr("y2", "1500")
        .attr("stroke", "#000")
        .attr("stroke-width", "1");








    // TODO: not used?? delete?
    var canvaswidth = $(window).width() -248;
    
    //trigger redraw of learning journey after window resize, to make it responsive - this needs to be cleaned up...
    window.onresize = function (event) {
        var newWidth = $(window).width();
        var newRefbody = $(".refbody").width();
        // preventing svg area be smaller than 320px (mobile @media min size)
        console.log(newRefbody);
        if (newWidth > 320) {
            $("#main_svg").attr("width", newRefbody);
        } else {
            $("#main_svg").attr("width", 500);
        }
        // svg.attr("width", newWidth -300);
        // roadmap.select("#main").attr("width", newWidth -248);
        // canvaswidth = newWidth -248;

        updateSVG();
    };



    // Create div for display of tooltips (invisible normally, and attached later temporarily to elements on mouseover)
    var div = d3.select(".refbody").append("div").attr("id", "container").attr("width", "248px");
    $("#container").hide();
    
    d3.select("#container").insert("svg", "div").attr("width", "248px").attr("height", "150px").append("g").attr("id", "tile").attr("width", "150px");
    
    // define trigger event on table cells to show individual tile as mouseover - to be used in tile browser topic
    /* not relevant here at the moment
    $("td.entry").mouseenter(function(){hoverdiv(event,'container')});
    $("td.entry").mouseleave(function(){hoverout('container')});
     */
    // Define 'normal' svg content containers (asset tiles) from data (normal here means tileContainer, if we later add the capability to optionally expand tiles)
    tileContainer.selectAll("g").data(LJTileData).enter().append("g").attr("id", function (d, i) {
        //    return i;
        return 'tile'.concat(LJTileData[i].tileID);
    });
    
    // add basic tile background rectangle to each tileContainer asset tile --> no, define those as part of the individual tile layout...
    //tileContainer.selectAll("g").append("rect").attr("x", x).attr("y", y).attr("width", "248px").attr("height", "150px").attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7);
    
    // margin for what?
    var margin = {
        top: 20,
        right: 60,
        bottom: 30,
        left: 20
    };
    
    // tileContainer.selectAll("g rect").attr("stroke-width", "10").style("margin-right", "248px");
    
    // add "Explore" button to expand a tile on click - currently not used...
    /*tileContainer.selectAll("g").append("text").attr("fill", "blue").attr("x", "7").attr("y", "112").attr("font-weight", "bold").attr("font-size", "15px").text("Explore").attr("style" ,"display:none")
    
    .on("click",function (d,i){
    content.selectAll("g").attr("style","display:none");
    content.select("g[id='" + i + "']").attr("style","display:block")
    });
     */
    
    // add specific content to each tileContainer asset tile
    tileContainer.selectAll("g").each(function (d, i) {
        var tileType = LJTileData[i].type;
        var tileTitle = LJTileData[i].tileTitle;
        switch (tileType) {
            case "Learning Room": //Learning Room
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("width", TILE_WIDTH).attr("height", TILE_HEIGHT).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            d3.select(this).append("text").attr("fill", "#666666").attr("x", "165").attr("y", "15").attr("font-size", "11px").attr("font-family", "Arial, Sans-Serif").text(tileType);
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("width", "248px").attr("font-weight", "bold").attr("font-size", "15px").text(tileTitle).call(wrap, TILE_WIDTH);
            d3.select(this).append("circle").attr("cx", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("cy", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("r", TILE_MARKER_RADIUS).attr("fill", "white").style("stroke", "black");
            d3.select(this).append("image").attr("x", 15).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/eLearning.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "57").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning");
            d3.select(this).append("image").attr("x", 70).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/Webinar.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "115").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access");
            d3.select(this).append("image").attr("x", 125).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/eBook.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "162").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-book");
            d3.select(this).append("image").attr("x", 180).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/LearningRoom.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "223").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom");          
            break;
            case "openSAP": //OpenSAP
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("width", TILE_WIDTH).attr("height", TILE_HEIGHT).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            //            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("width", "248px").attr("font-weight", "bold").attr("font-size", "15px").text(tileTitle).call(wrap, TILE_WIDTH);
            d3.select(this).append("text").attr("fill", "#666666").attr("font-size","11").attr("x", "235").attr("y", "20").attr("text-anchor", "end").text(tileType);
            d3.select(this).append("circle").attr("cx", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("cy", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("r", TILE_MARKER_RADIUS).attr("fill", "white").style("stroke", "black");
            d3.select(this).append("image").attr("x", 70).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/Webinar.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "115").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access");
            d3.select(this).append("image").attr("x", 125).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/eBook.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "162").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-book");
            break;
            case "Early Knowledge Transfer (EKT)": //e-Learning
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("width", TILE_WIDTH).attr("height", TILE_HEIGHT).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-weight", "bold").attr("font-size", "15px").text(tileTitle).call(wrap, TILE_WIDTH);
            d3.select(this).append("text").attr("fill", "#666666").attr("font-size","11").attr("x", "235").attr("y", "20").attr("text-anchor", "end").text(tileType);
            d3.select(this).append("circle").attr("cx", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("cy", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("r", TILE_MARKER_RADIUS).style("stroke", "black").attr("fill", "white");
            d3.select(this).append("image").attr("x", 75).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/eLearning.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "110").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning")
            
            d3.select(this).append("image").attr("x", 125).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/LearningRoom.svg")
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "170").attr("y", "145").attr("text-anchor", "end").attr("font-size", "8px").text("Classroom")
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
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("width", TILE_WIDTH).attr("height", TILE_HEIGHT).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            d3.select(this).append("circle").attr("cx", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("cy", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("r", TILE_MARKER_RADIUS).style("stroke", "black").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "124").attr("y", "45").attr("text-anchor", "middle").attr("font-weight", "bold").attr("font-size", "15px").text(tileTitle).call(wrap, TILE_WIDTH);
            d3.select(this).append("text").attr("fill", "#666666").attr("font-size","11").attr("x", "235").attr("y", "20").attr("text-anchor", "end").text(tileType);
            d3.select(this).append("path").attr("d", "M -25 5 L -15 15 L -25 25").attr("stroke", "#F0AB00").attr("stroke-width", 2).attr("fill", "none");
            d3.select(this).append("path").attr("d", "M -15 5 L -5 15 L -15 25").attr("stroke", "#F0AB00").attr("stroke-width", 2).attr("fill", "none");
            d3.select(this).append("image").attr("x", 100).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/Certification.svg")
            break;
            case "10": // Stay current (e-Learning)
            d3.select(this).select("rect").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-size", "15px").text(tileTitle).call(wrap, TILE_WIDTH);
            break;
            default: // general asset tile with only one learning option
            d3.select(this).append("rect").attr("x", 0).attr("y", 0).attr("width", TILE_WIDTH).attr("height", TILE_HEIGHT).attr("stroke", "#000").attr("stroke-width", "1").attr("rx", 7).attr("ry", 7).attr("fill", "white");
            d3.select(this).append("circle").attr("cx", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("cy", TILE_MARKER_RADIUS + TILE_MARKER_MARGIN).attr("r", TILE_MARKER_RADIUS).style("stroke", "black").attr("fill", "white");
            d3.select(this).append("text").attr("fill", "black").attr("x", "5").attr("y", "45").attr("font-weight", "bold").attr("font-size", "15px").text(tileTitle).call(wrap, TILE_WIDTH);
            d3.select(this).append("text").attr("fill", "#666666").attr("font-size","11").attr("x", "235").attr("y", "20").attr("text-anchor", "end").text(tileType);
            d3.select(this).append("image").attr("x", 60).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/eLearning.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "102").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("E-learning");
            d3.select(this).append("image").attr("x", 125).attr("y", 85).attr("width", "49px").attr("height", "49px").attr("xlink:href", "img/Webinar.svg");
            d3.select(this).append("text").attr("fill", "#999999").attr("x", "160").attr("y", "140").attr("text-anchor", "end").attr("font-size", "8px").text("Live Access");
        };
    });
    
    
    
    //Define variables for controlling layout of learning journey
    
    var x =[];
    var y =[];
    
    var totalHeight = 0;
    var xcount, ycount;    
    
    // Compute arrangement of items into parts of learning journey (could also be triggered from the outside, e.g. when rendering LJ based on datatable, upon filtering and redraw of datatable
    updateSVG();
    
    function updateSVG() {
        // remove all connector elements so that we have a "clean" canvas
        roadmap.selectAll("circle.scenarioMarker").remove();
        roadmap.selectAll("text.scenarioHeader").remove();
        tileContainer.selectAll("g path.in-connector").remove();
        tileContainer.selectAll("g path.tileContainer-out-connector").remove();
        tileContainer.selectAll("g path.tileContainer-in-connector").remove();
        // initialize positioning counters and streams of learning journey
        xposition = ROADMAP_LEFT_MARGIN + ROADMAP_RIGHT_MARGIN; // initial x value when starting to render journey
        yposition = ROADMAP_TOP_MARGIN; // initial y value when starting to render journey
        
        // todo: delete?
        xcount = 130; // initial x value when starting to render journey
        ycount = 30; // initial y value when starting to render journey

        var Qscenarios =[];
            Qscenarios[1] =[];
            Qscenarios[2] =[];
            Qscenarios[3] =[];
            Qscenarios[4] =[];
            Qscenarios[5] =[];

        // initialize tile placement arrays ([x[i] and y[i] will later determine the absolute placement of tile i within the LJ svg)
        for (i = 0; i < LJTileData.length; i++) {
            x[i] = 0;
            y[i] = 0;
        };
        
        // push tile id values into respective learning scenario arrays, for later placement into LJ graphic
        for (k = 0; k < LJTileData.length; k++) {
            switch (LJStructureData[k].scenarioID) {
                case "1":
                Qscenarios[1].push(k);
                break
                case "2":
                Qscenarios[2].push(k);
                break
                case "3":
                Qscenarios[3].push(k);
                break
                case "4":
                Qscenarios[4].push(k);
                break
                case "5":
                Qscenarios[5].push(k);
                break
            }
        };
        
        
        for (k = 1; k < 6; k++) {
            // renderScenario only if there are tiles in it (length > 0)
            if (Qscenarios[k].length > 0) {
                var scenarioGridRows = renderScenario(k, Qscenarios, xposition, yposition);
                yposition = scenarioGridRows;
            }
        };

        // adjust length of svg and roadmap
        svg.attr("height", yposition);
        roadmap.selectAll("line").attr("y2", yposition);
    }
    
    // render Scenario and returns next yposition (to place next scenario)
    function renderScenario(scenarioID, Qscenarios, xposition, yposition) {        
        roadmap.append("circle")
            .attr("class", "scenarioMarker")
            .attr("cx", ROADMAP_LEFT_MARGIN)
            .attr("cy", yposition)
            .attr("r", SCENARIO_MARKER_RADIUS)
            .attr("stroke", "#000")
            .attr("stroke-width", "1")
            .style("fill", generateScenarioColor(scenarioID));
        roadmap.append("text")
            .attr("class", "scenarioHeader")
            .attr("fill", "#222222")
            .attr("x", xposition)
            .attr("y", yposition + 10) // top 10px to vertical align text in the middle
            .attr("font-size", "21pt")
            .attr("fill", "#222")
            .attr("font-family", "Arial Regular")
            .text(generateScenarioHeader(scenarioID))
            .call(wrap, canvaswidth);

        // yposition = yposition + 20 * totalHeight;
        
        var Qtopics = [];

        // get Topics in a Scenario
        Qscenarios[scenarioID].forEach(function (item) {
            Qtopics.push(LJStructureData[item].subtopicTitle)
        });

        //remove duplicates from topics list
        Qtopics = Qtopics.filter(function (elem, pos) {
            return Qtopics.indexOf(elem) === pos
        });
        
        yposition += 28; // 18px distance between Scenario Title and tile + 10px

        Qtopics.forEach(function (item) {
            
            Qtiles = Qscenarios[scenarioID].filter(function (currentValue) {
                return LJStructureData[currentValue].subtopicTitle == item
            });
            var topicGridRows = renderTopic(scenarioID, Qtiles, item, xposition, yposition); // this will render and return number of rows needed to display content
            yposition = topicGridRows;
        });

        return yposition;
    }
    
    // render Topic and position the tiles. After will return next yposition (to place next topic)
    function renderTopic(scenarioID, Qtiles, topicTitle, xposition, yposition) {
        console.log("Qtiles length ", Qtiles.length);
        var topicgridrows = _calculateTopicGridRows(Qtiles.length); // number of rows needed to render topic
        var xpositionInitial = xposition;
        for (i = 0; i < Qtiles.length; i++) {
            var index = Qtiles[i];
            
            var id = LJStructureData[index].tileID;
            tileContainer.select("g[id='tile" + id + "'] circle").attr("fill", generateScenarioColor(scenarioID));
            tileContainer.select("g[id='tile" + id + "']")
                .attr("transform", "translate(" + xposition + "," + yposition + ")"); // translate to the right position
                // .style("display", "block");
            if ((i+1) % topicgridrows === 0) {
                // same row: sum previous tiles widths
                xposition += TILE_WIDTH + ROADMAP_RIGHT_MARGIN;
            } else {
                // new row: reset xposition 
                xposition = xpositionInitial;
                yposition += TILE_HEIGHT + TILE_BOTTOM_MARGIN;
            }



            // if (xcount + 280 > canvaswidth) {
            //     // wrap around to next row of tiles
            //     xcount = 130;
            //     ycount = ycount + 240;
            //     if (i > 0) {
            //         // add connected-to-previous-tile-in-last-row path...
            //         // tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d", "M 10 0 L 25 -10 L 50 -10").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
            //         tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "tileContainer-in-connector").attr("d", "M 22 0 L 31 -9 L 61 -9").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
            //     }
            // };
            // if (tileContainer.select("g[id='tile" + id + "']").text().indexOf("Certification") != -1){
            //     xcount=xcount+20;
            // };
            // x[index] = xcount; // assign current xcount and ycount values to current tile in rendering process
            // y[index] = ycount;
            
            // if (i == 0) {
            //     // add topic name
            //     tileContainer.append("text").attr("class", "headers").attr("fill", "black").attr("display", "block").attr("x", function () {
            //         return xcount + 20;
            //     }).attr("y", function () {
            //         return ycount -10;
            //     }).attr("font-size", "14px").text(topicTitle).call(wrap, canvaswidth);
            //     // add connector to main vertical line...
            //     tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "in-connector").attr("d", "M -40 0 L -25 15 L 0 15").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
            // };
            // if ((i > 0) & (xcount != 130)) { // add horizontal connected-to-previous-tile path...
            //     if (tileContainer.select("g[id='tile" + id + "']").text().indexOf("Certification") != -1) // certification tile
            //     {
            //         // tileContainer.select("g[id='tile" + id + "']").append("rect").attr("x", -70).attr("y", 15).attr("width", 40).attr("height", 1).attr("fill", "#000");
            //     }
            //     else{
            //         // tileContainer.select("g[id='tile" + id + "']").append("rect").attr("x", -50).attr("y", 15).attr("width", 50).attr("height", 1).attr("fill", "#000");
            //     }
            // };
            
            
            // if (tileContainer.select("g[id='tile" + id + "']").text().indexOf("Certification") != -1) {
            //     // this was a certification tile, so wrap...
            //     xcount = 130;
            //     ycount = ycount + 240
            // } else {
            //     xcount = xcount + 300;
            //     if ((xcount + 280 > canvaswidth) & (i < Qtiles.length -1)) {
            //         // add connector downwards to next tile...
            //         // tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d", "M 248 16 L 260 26 L 260 46").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
            //         tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "tileContainer-out-connector").attr("d", "M 248 16 L 260 28 L 260 58").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
                
            //     }
            // };
        }
        
        // next row
        yposition += TILE_HEIGHT + TILE_BOTTOM_MARGIN;

        return yposition;
    }

    // generate Scenario Color
    function generateScenarioColor(k) {
        switch (k) {
            case 1:
                return "#970A82"; // SAP Purpule
                break;
            case 2:
                return "#Fa9100"; // SAP Light Orange
                break;
            case 3:
                return "#93C939"; // SAP Green shade
                break;
            case 4:
                return "#008FD3"; // SAP Blue
                break;
            case 5:
                return "#F0AB00"; // SAP Gold
                break;
            default:
                return "#000";
                break;
        }
    };

    // generate Scenario Header
    function generateScenarioHeader(k) {    
        switch (k) {
            case 1:
            return "Join the SAP Learning Room";
            break;
            case 2:
            return "Start with an overview";
            break;
            case 3:
            return "Become fully competent";
            break;
            case 4:
            return "Expand your skills";
            break;
            case 5:
            return "Stay current";
            break;
            default:
            return "undefined";// TODO: rename undefined scenario header
        }
    };

    // calculate rows needed in Topic grid to render Tiles
    function _calculateTopicGridRows(numberOfTiles) {
        var refbodyWidth = $(".refbody").width();
        var renderingWidthAvailable = (refbodyWidth < 320 ? 320 : refbodyWidth ) - (ROADMAP_LEFT_MARGIN + ROADMAP_RIGHT_MARGIN);
        var totalRowsWidth = numberOfTiles * (TILE_WIDTH + ROADMAP_RIGHT_MARGIN);
        console.log(Math.ceil(totalRowsWidth / renderingWidthAvailable));
        return Math.ceil(totalRowsWidth / renderingWidthAvailable);
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


    /*
    function renderPart(Qarray, xcount, ycount, scenario) {
    var Qhelper =[];
    for (i = Qarray.length -1; i > -1; i--) {
    if (table[Qarray[i]][3].trim() == "XL") {
    Qhelper.unshift(Qarray[i]);
    Qarray.splice(i, 1);
    }
    };
    Qarray = Qarray.concat(Qhelper);
    
    //    console.log(Qarray);
    //    console.log(xcount);
    //    console.log(ycount);
    
    for (i = 0; i < Qarray.length; i++) {
    var index = Qarray[i];
    var id = table[index][6].trim();
    tileContainer.select("g[id='tile" + id + "'] circle").attr("fill",function(){
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
    tileContainer.select("g[id='tile" + id + "']").attr("class", "connector").append("path").attr("d","M -40 0 L -25 15 L 0 15").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
    } else {
    if (xcount == 130) {
    tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d","M 10 0 L 25 -10 L 50 -10").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 55).attr("y", -11).attr("width", 2).attr("height", 2).attr("fill", "#000");
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 60).attr("y", -11).attr("width", 2).attr("height", 2).attr("fill", "#000");
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 65).attr("y", -11).attr("width", 2).attr("height", 2).attr("fill", "#000");
    }
    };
    if (xcount + 220 < canvaswidth -220) {
    xcount = xcount + 267;
    if (i < Qarray.length -1) {
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 248).attr("y", 15).attr("width", 20).attr("height", 1).attr("fill", "#000");
    };
    } else {
    xcount = 130;
    if (i < Qarray.length -1) {
    ycount = ycount + 180;
    tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d","M 248 16 L 260 26 L 260 46").attr("stroke", "#000").attr("stroke-width",1).attr("fill", "none");
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 259).attr("y", 51).attr("width", 2).attr("height", 2).attr("fill", "#000");
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 259).attr("y", 56).attr("width", 2).attr("height", 2).attr("fill", "#000");
    tileContainer.select("g[id='tile" + id + "']").append("rect").attr("class", "connector").attr("x", 259).attr("y", 61).attr("width", 2).attr("height", 2).attr("fill", "#000");
    
    };
    };
    };
    return ycount;
    }
     */
    
    function hoverout(divid) {
        d3.select("#tile").selectAll("*").remove();
        $("#" + divid).toggle();
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
            lineHeight = 1.2, //ems
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
    
    $(".body").prepend($('<div><svg width="100%" height="20px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:12" /></svg></div><div class="floating-box1"><img src="img/LearningJourney.svg" alt="Learning Journey" style="width:60px;"></div><div class="floating-box2"><h1 class="title topictitle1">' + journeyTitle + '</h1></div><div style="margin-top:-5px;margin-right:24px;margin-left:28px"><svg width="100%" height="3px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" /></svg></div>'));
})