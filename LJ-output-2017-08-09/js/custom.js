//TODO: Use IIFE (Immediately Invoked Function Expression) to prevent custom.js code to break with other global vars
// also it will enable code compression as global vars will be recognized
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
                "journeyID": $(tableData[0]).text().trim(),
                "journeyTitle": $(tableData[1]).text().trim(),
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

    // Constraints in pixels
    var ROADMAP_TOP_MARGIN = 30; // top margin of roadmap
    var ROADMAP_LEFT_MARGIN = 25; // left margin of roadmap
    var ROADMAP_RIGHT_MARGIN = 18; // right margin of roadmap
    var SCENARIO_MARKER_RADIUS = 7; // Circle radius in scenario
    var SCENARIO_TITLE_FONT_SIZE = 21; // Scenario title font size
    var SCENARIO_TITLE_BOTTOM_MARGIN = 18; // bottom margin of scenario title
    var TILE_MARKER_RADIUS = 7; // Circle radius in Tile
    var TILE_MARKER_MARGIN = 6; // Circle Top and Left margin in Tile
    var TILE_WIDTH = 248; // Tile Width
    var TILE_HEIGHT = 188; // Tile Height
    var TILE_BOTTOM_MARGIN = 30; // Tile Bottom margin
    
    // Prepare basic svg containers and elements

    // insert main svg graphic into html body, define canvas for LJ
    var svg = d3.select(".refbody").insert("svg", "div").attr("width", "100%").attr("height", 9999).attr("id", "main_svg2");
    var roadmap = svg.append("g").attr("id", "roadmap");
    var tileContainer = svg.append("g").attr("id", "tile-container");

    // Create canvas content for roadmap display
    roadmap.append("line")
        .attr("x1", ROADMAP_LEFT_MARGIN)
        .attr("y1", ROADMAP_TOP_MARGIN)
        .attr("x2", ROADMAP_LEFT_MARGIN)
        .attr("y2", 9999) // y2 will be calculated after tiles are rendered
        .attr("stroke", "#000")
        .attr("stroke-width", "1");


    // TODO: use a realtime instance of canvas width. there is a magic number which doesn't make sense now
    var canvaswidth = $(window).width() -248;
    
    //trigger redraw of learning journey after window resize, to make it responsive - this needs to be cleaned up...
    window.onresize = function (event) {
        var newWidth = $(window).width();
        var newRefbody = $(".refbody").width();
        // preventing svg area be smaller than 320px (mobile @media min-size)
        if (newWidth > 320) {
            $("#main_svg2").attr("width", newRefbody);
        } else {
            $("#main_svg2").attr("width", 320);
        }

        updateSVG();
    };

    // Define 'normal' svg content containers (asset tiles) from data (normal here means tileContainer, if we later add the capability to optionally expand tiles)
    tileContainer.selectAll("g").data(LJTileData).enter().append("g").attr("id", function (d, i) {
        return 'tile'.concat(LJTileData[i].tileID);
    });

    // add specific content to each tileContainer asset tile
    tileContainer.selectAll("g").each(function (d, i) {
        var tileType = LJTileData[i].type;
        var tileTitle = LJTileData[i].tileTitle;
        // TODO: there are several chunks of the same code. Add it to a function when refactoring code.
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
        tileContainer.selectAll("text.topicHeader").remove();
        tileContainer.selectAll("g path.in-connector").remove();
        tileContainer.selectAll("g path.out-in-connector").remove();
        tileContainer.selectAll("g path.cont-out-connector").remove();
        tileContainer.selectAll("g path.cont-in-connector").remove();
        // initialize positioning counters and streams of learning journey
        xposition = ROADMAP_LEFT_MARGIN + ROADMAP_RIGHT_MARGIN; // initial x value when starting to render journey
        yposition = ROADMAP_TOP_MARGIN; // initial y value when starting to render journey
        
        // todo: delete?
        xcount = 130; // initial x value when starting to render journey
        ycount = 30; // initial y value when starting to render journey

        

        // initialize tile placement arrays ([x[i] and y[i] will later determine the absolute placement of tile i within the LJ svg)
        for (i = 0; i < LJTileData.length; i++) {
            x[i] = 0;
            y[i] = 0;
        };

        // TODO: move this to init part, as it won't need to be mapped every screen resize
        var Qscenarios =[];
            Qscenarios[1] =[];
            Qscenarios[2] =[];
            Qscenarios[3] =[];
            Qscenarios[4] =[];
            Qscenarios[5] =[];

        // TODO: move this to init part, as it won't need to be mapped every screen resize (also the for loop)
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
            .attr("x", xposition)
            .attr("y", yposition + (SCENARIO_TITLE_FONT_SIZE/2) - 3) //vertical align text in the middle (fontsize / 2) - 3px (magic number)
            .attr("font-size", SCENARIO_TITLE_FONT_SIZE)
            .attr("fill", "#222")
            .attr("font-family", "Arial Regular")
            .text(generateScenarioHeader(scenarioID))
            .call(wrap, canvaswidth);

        //add font size
        yposition += SCENARIO_TITLE_FONT_SIZE;
        
        var Qtopics = [];

        // get Topics in a Scenario
        Qscenarios[scenarioID].forEach(function (item) {
            Qtopics.push(LJStructureData[item].subtopicTitle)
        });

        //remove duplicates from topics list
        Qtopics = Qtopics.filter(function (elem, pos) {
            return Qtopics.indexOf(elem) === pos
        });
        
        yposition += SCENARIO_TITLE_BOTTOM_MARGIN; // distance between Scenario Title and tile

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
        var topicgridrows = _calculateTopicGridRows(Qtiles.length); // number of rows needed to render topic
        var maxtilesinarow = _calculateMaxTilesPerRow(); // max number of tiles in the same row
        var xpositionInitial = xposition;
        for (i = 0; i < Qtiles.length; i++) {
            // Render Topic Title
            if (i === 0 && topicTitle && topicTitle !== "") {
                tileContainer.append("text")
                    .attr("class", "topicHeader")
                    .attr("fill", "black")
                    .attr("display", "block")
                    .attr("x", xposition)
                    .attr("y", yposition)
                    .attr("font-size", "14px")
                    .text(topicTitle)
                    .call(wrap, $(".refbody").width());
                yposition += 21;
            }

            // Render Tile
            var index = Qtiles[i];
            var id = LJStructureData[index].tileID;
            tileContainer.select("g[id='tile" + id + "'] circle").attr("fill", generateScenarioColor(scenarioID));
            // translate to the right position
            tileContainer.select("g[id='tile" + id + "']").attr("transform", "translate(" + xposition + "," + yposition + ")");
            // checks if tiles needs to be rendered in same row or new row
            if ((i+1) % maxtilesinarow === 0 && (i+1) < Qtiles.length) {
                // new row: reset xposition 
                xposition = xpositionInitial;
                yposition += TILE_HEIGHT + TILE_BOTTOM_MARGIN;
            } else {
                // same row: sum previous tiles widths
                xposition += TILE_WIDTH + ROADMAP_RIGHT_MARGIN;
            }

            // Add connectors

            // add connector to roadmap if first tile in Topic
            if (i === 0) {
                tileContainer.select("g[id='tile" + id + "']")
                    .append("path")
                    .attr("class", "in-connector")
                    // .attr("d", "M -40 0 L -25 15 L 0 15") // this is t he original connector
                    .attr("d", "M " + -1*ROADMAP_RIGHT_MARGIN + " 0 L " + -1*(ROADMAP_RIGHT_MARGIN/2) + " " + (TILE_MARKER_RADIUS + TILE_MARKER_MARGIN) + " L 0 " + (TILE_MARKER_RADIUS + TILE_MARKER_MARGIN))
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("fill", "none");
            } else if (i !== 0) { // add connector to roadmap if not first tile in Topic
                // TODO: add logic for same row tile
                if (true) {
                    tileContainer.select("g[id='tile" + id + "']")
                        .append("path")
                        .attr("class", "cont-in-connector")
                        .attr("d", "M 22 0 L 31 -9 L 61 -9")
                        .attr("stroke", "#000")
                        .attr("stroke-width", 1).attr("fill", "none");
                } else {
                    tileContainer.select("g[id='tile" + id + "']")
                        .append("path")
                        .attr("class", "out-in-connector")
                        .attr("d", "M " + -1*ROADMAP_RIGHT_MARGIN + " " + (TILE_MARKER_RADIUS + TILE_MARKER_MARGIN) + " L 0 " + (TILE_MARKER_RADIUS + TILE_MARKER_MARGIN))
                        .attr("stroke", "#000")
                        .attr("stroke-width", 1)
                        .attr("fill", "none");
                }
            }

            


            // if (xcount + 280 > canvaswidth) {
            //     // wrap around to next row of tiles
            //     xcount = 130;
            //     ycount = ycount + 240;
            //     if (i > 0) {
            //         // add connected-to-previous-tile-in-last-row path...
            //         // tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "connector").attr("d", "M 10 0 L 25 -10 L 50 -10").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
            //         tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "cont-in-connector").attr("d", "M 22 0 L 31 -9 L 61 -9").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
            //     }
            // };
            // if (tileContainer.select("g[id='tile" + id + "']").text().indexOf("Certification") != -1){
            //     xcount=xcount+20;
            // };
            // x[index] = xcount; // assign current xcount and ycount values to current tile in rendering process
            // y[index] = ycount;
            
            
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
            //         tileContainer.select("g[id='tile" + id + "']").append("path").attr("class", "cont-out-connector").attr("d", "M 248 16 L 260 28 L 260 58").attr("stroke", "#000").attr("stroke-width", 1).attr("fill", "none");
                
            //     }
            // };
        }
        
        // topic is finished! add next row
        yposition += TILE_HEIGHT + TILE_BOTTOM_MARGIN;

        return yposition;
    }

    /* =========================================================== */
    /* begin: supporting methods                                     */
    /* =========================================================== */

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
            return "Undefined Scenario"; // TODO: rename undefined scenario header
        }
    };

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
    };

    // calculate rows needed in Topic grid to render Tiles
    function _calculateTopicGridRows(numberOfTiles) {
        var refbodyWidth = $(".refbody").width();
        var sizeOfOneTile = (TILE_WIDTH + ROADMAP_RIGHT_MARGIN);
        var renderingWidthAvailable = (refbodyWidth < 320 ? 320 : refbodyWidth ) - (ROADMAP_LEFT_MARGIN + ROADMAP_RIGHT_MARGIN);
        var totalRowsWidth = numberOfTiles * sizeOfOneTile;
        return Math.ceil(totalRowsWidth / renderingWidthAvailable);
    };

    // calculate max tiles that fits it a row in Topic grid
    function _calculateMaxTilesPerRow() {
        var refbodyWidth = $(".refbody").width();
        var sizeOfOneTile = (TILE_WIDTH + ROADMAP_RIGHT_MARGIN);
        var renderingWidthAvailable = (refbodyWidth < 320 ? 320 : refbodyWidth ) - (ROADMAP_LEFT_MARGIN + ROADMAP_RIGHT_MARGIN);
        var maxNumberOfTiles = Math.floor(renderingWidthAvailable / sizeOfOneTile);
        // never returns 0 rows. Minimum is always 1 row
        return maxNumberOfTiles === 0 ? 1 : maxNumberOfTiles;
    };

    $(".body").prepend($('<div><svg width="100%" height="20px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:12" /></svg></div><div class="floating-box1"><img src="img/LearningJourney.svg" alt="Learning Journey" style="width:60px;"></div><div class="floating-box2"><h1 class="title topictitle1">' + journeyTitle + '</h1></div><div style="margin-top:-5px;margin-right:24px;margin-left:28px"><svg width="100%" height="3px"><line x1="0" y1="0" x2="100%" y2="0" style="stroke:rgb(0,0,0);stroke-width:4" /></svg></div>'));
})