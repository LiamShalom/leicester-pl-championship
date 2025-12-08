(function(){
// Control constants
const NUM_TEAMS = 20;
const NUM_GW = 38;
const TO_HIGHLIGHT = 'Leicester'
const HIGHLIGHT_COLOR = '#383bebff'
const DEFAULT_COLOR = '#0000005c'
const START_GW = 29
const ANIMATION_START_GW = 29
const ANIMATION_TIME = 500

const data = [{team: 'Chelsea', positions: [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
              {team: 'Man City', positions: [2, 2, 4, 5, 6, 3, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 3, 2, 2, 2, 2]},
              {team: 'Arsenal', positions: [3, 5, 7, 7, 4, 4, 8, 7, 5, 4, 6, 8, 6, 6, 6, 6, 6, 6, 5, 6, 5, 5, 5, 6, 5, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3]},
              {team: 'Man United', positions: [14, 13, 14, 9, 12, 7, 4, 6, 8, 10, 7, 4, 4, 4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 4, 3, 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 4]},
              {team: 'Tottenham', positions: [8, 1, 6, 6, 9, 8, 6, 9, 11, 8, 12, 10, 7, 10, 10, 7, 7, 7, 7, 5, 6, 6, 6, 5, 6, 7, 6, 6, 7, 7, 6, 7, 6, 6, 6, 6, 6, 5]},
              {team: 'Liverpool', positions: [5, 9, 5, 8, 11, 14, 9, 5, 7, 7, 11, 12, 11, 8, 9, 11, 10, 9, 8, 8, 8, 8, 7, 7, 7, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6]},
              {team: 'Southampton', positions: [15, 15, 8, 4, 2, 2, 3, 3, 2, 2, 2, 2, 3, 3, 5, 5, 5, 4, 4, 4, 3, 3, 4, 3, 4, 5, 7, 7, 6, 6, 7, 6, 7, 7, 7, 7, 7, 7]},
              {team: 'Swansea', positions: [4, 4, 2, 3, 5, 5, 5, 8, 6, 6, 5, 7, 8, 7, 8, 9, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 8, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8]},
              {team: 'Stoke', positions: [17, 14, 10, 14, 13, 11, 16, 10, 12, 13, 9, 11, 12, 13, 13, 12, 13, 11, 11, 11, 11, 10, 10, 10, 10, 10, 10, 8, 8, 10, 10, 10, 9, 9, 10, 9, 9, 9]},
              {team: 'Crystal Palace', positions: [13, 18, 19, 17, 15, 9, 15, 16, 16, 17, 17, 15, 14, 15, 15, 16, 17, 18, 18, 18, 15, 13, 13, 13, 13, 13, 12, 12, 12, 11, 11, 11, 11, 12, 12, 12, 12, 10]},
              {team: 'Everton', positions: [10, 10, 17, 11, 14, 15, 17, 13, 9, 9, 10, 9, 10, 11, 12, 10, 11, 12, 12, 13, 12, 12, 12, 12, 12, 12, 14, 14, 14, 13, 12, 12, 12, 10, 11, 11, 10, 11]},
              {team: 'West Ham', positions: [18, 8, 11, 13, 8, 13, 7, 4, 4, 5, 4, 6, 5, 5, 4, 4, 4, 5, 6, 7, 7, 7, 8, 8, 8, 8, 9, 10, 10, 9, 9, 9, 10, 11, 9, 10, 11, 12]},
              {team: 'West Brom', positions: [11, 12, 18, 19, 16, 10, 14, 14, 13, 11, 13, 13, 15, 16, 16, 14, 15, 15, 16, 17, 14, 14, 15, 15, 14, 14, 13, 13, 13, 14, 14, 14, 13, 13, 13, 13, 13, 13]},
              {team: 'Leicester', positions: [9, 16, 15, 12, 7, 12, 12, 15, 17, 18, 18, 18, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 19, 19, 18, 17, 18, 17, 15, 14, 14]},
              {team: 'Newcastle', positions: [20, 17, 16, 20, 20, 19, 18, 18, 14, 12, 8, 5, 9, 9, 7, 8, 9, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 13, 14, 14, 16, 17, 17, 15]},
              {team: 'Sunderland', positions: [12, 11, 13, 15, 17, 17, 13, 17, 18, 15, 14, 14, 13, 14, 14, 15, 14, 14, 14, 14, 16, 16, 14, 14, 15, 16, 16, 16, 17, 17, 15, 16, 18, 16, 14, 16, 15, 16]},
              {team: 'Aston Villa', positions: [7, 7, 3, 2, 3, 6, 10, 12, 15, 16, 16, 16, 16, 12, 11, 13, 12, 13, 13, 12, 13, 15, 16, 16, 18, 19, 19, 17, 16, 16, 17, 15, 15, 17, 15, 14, 16, 17]},
              {team: 'Hull', positions: [6, 6, 9, 10, 10, 16, 11, 11, 10, 14, 15, 17, 17, 17, 18, 19, 19, 17, 17, 15, 18, 18, 18, 18, 16, 15, 15, 15, 15, 15, 16, 17, 16, 15, 18, 18, 18, 18]},
              {team: 'Burnley', positions: [19, 19, 20, 18, 19, 20, 19, 19, 20, 20, 20, 19, 19, 18, 19, 17, 18, 19, 19, 19, 17, 17, 17, 17, 19, 18, 18, 19, 18, 18, 18, 20, 20, 20, 20, 19, 19, 19]},
              {team: 'QPR', positions: [16, 20, 12, 16, 18, 18, 20, 20, 19, 19, 19, 20, 18, 19, 17, 18, 16, 16, 15, 16, 19, 19, 19, 19, 17, 17, 17, 18, 19, 20, 20, 19, 19, 19, 19, 20, 20, 20]}]

const images = {
  'Chelsea': 'images/team_logos/england_chelsea.svg',
  'Man City': 'images/team_logos/england_manchester-city--1997-2016.svg',
  'Arsenal': 'images/team_logos/england_arsenal.svg',
  'Man United': 'images/team_logos/england_manchester-united.svg',
  'Tottenham': 'images/team_logos/england_tottenham.svg',
  'Liverpool': 'images/team_logos/england_liverpool.svg',
  'Southampton': 'images/team_logos/england_southampton.svg',
  'Swansea': 'images/team_logos/england_swansea-city.svg',
  'Stoke': 'images/team_logos/england_stoke-city.svg',
  'Crystal Palace': 'images/team_logos/england_crystal-palace.svg',
  'Everton': 'images/team_logos/england_everton.svg',
  'West Ham': 'images/team_logos/england_west-ham.svg',
  'West Brom': 'images/team_logos/england_west-bromwich-albion.svg',
  'Leicester': 'images/team_logos/england_leicester.svg',
  'Newcastle': 'images/team_logos/england_newcastle.svg',
  'Sunderland': 'images/team_logos/england_sunderland.svg',
  'Aston Villa': 'images/team_logos/england_aston-villa.svg',
  'Hull': 'images/team_logos/england_hull-city.svg',
  'Burnley': 'images/team_logos/england_burnley.svg',
  'QPR': 'images/team_logos/england_qpr.svg',
}

// ---------------------------------------------------------
const svg = d3.select("#previous-season-animated-table");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 30, right: 140, bottom: 40, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const teams = data.map(d => d.team);
const maxGW = data[0].positions.length;

// Scales
const x = d3.scaleLinear()
  .domain([1, maxGW])
  .range([0, innerWidth]);

const y = d3.scaleLinear()
  .domain([1, 20])          // 20 league positions
  .range([0, innerHeight]); // 1 at top

let color = {}
teams.map(team => {
    if (team === TO_HIGHLIGHT){
        color = {...color, [team]: HIGHLIGHT_COLOR}
    } else {
        color = {...color, [team]: DEFAULT_COLOR}
    }
})

// Horizontal gridlines
g.append("g")
  .attr("class", "grid")
  .call(
    d3.axisLeft(y)
      .ticks(20)
      .tickSize(-innerWidth)
      .tickFormat("")
  );

g.append("g")
  .call(d3.axisLeft(y).ticks(20));

g.append("g")
  .attr("transform", `translate(0,${innerHeight})`)
  .call(d3.axisBottom(x).ticks(maxGW));

  // X-axis label
g.append("text")
  .attr("x", innerWidth / 2)
  .attr("y", innerHeight + 35)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .text("Matchweek");

// Y-axis label
g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -innerHeight / 2)
  .attr("y", -40)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .text("League Position");

// Information label with div indicators
const infoLabel = svg.append("foreignObject")
  .attr("x", margin.left)
  .attr("y", 5)
  .attr("width", width - margin.left - margin.right)
  .attr("height", 30);

const infoDiv = infoLabel.append("xhtml:div")
  .style("font-size", "14px")
  .style("display", "flex")
  .style("gap", "8px")
  .style("align-items", "center")
  .style("justify-content", "flex-end");

// Champions League indicator
const clDiv = infoDiv.append("xhtml:div")
  .style("display", "flex")
  .style("align-items", "center")
  .style("gap", "4px");

clDiv.append("xhtml:div")
  .style("width", "2px")
  .style("height", "14px")
  .attr("class", "champions-league-zone-div");

clDiv.append("xhtml:span")
  .text("= Champions League Qualification,");

// Europa League indicator
const elDiv = infoDiv.append("xhtml:div")
  .style("display", "flex")
  .style("align-items", "center")
  .style("gap", "4px");

elDiv.append("xhtml:div")
  .style("width", "2px")
  .style("height", "14px")
  .attr("class", "europa-league-zone-div");

elDiv.append("xhtml:span")
  .text("= Europa League Qualification,");

// Relegation indicator
const relDiv = infoDiv.append("xhtml:div")
  .style("display", "flex")
  .style("align-items", "center")
  .style("gap", "4px");

relDiv.append("xhtml:div")
  .style("width", "2px")
  .style("height", "14px")
  .attr("class", "relegation-zone-div");

relDiv.append("xhtml:span")
  .text("= Relegated to Championship");

// Relegation zone (positions 18–20)
const rowHeight = innerHeight / 20.0;

// g.append("rect")
//   .attr("class", "relegation-zone")
//   .attr("x", 0)
//   .attr("y", y(18.5) - rowHeight)
//   .attr("width", innerWidth)
//   .attr("height", rowHeight * 2.5);

// g.append("rect")
//   .attr("class", "champions-league-zone")
//   .attr("x", 0)
//   .attr("y", y(2) - rowHeight)
//   .attr("width", innerWidth)
//   .attr("height", rowHeight * 3.5);

// g.append("rect")
//   .attr("class", "europa-league-zone")
//   .attr("x", 0)
//   .attr("y", y(5.5) - rowHeight)
//   .attr("width", innerWidth)
//   .attr("height", rowHeight * 3);

// Line generator
function lineForGW(gw) {
  return d3.line()
    .x((d, i) => x(i + 1))
    .y((d, i) => y(d <= gw ? data[this.index].positions[i] : data[this.index].positions[i]));
}

const lineGen = d3.line()
  .x((d, i) => x(i + 1))
  .y(d => y(d));


// Initial draw
const paths = g.selectAll(".team-line")
  .data(data)
  .enter()
  .append("path")
    .attr("class", "team-line")
    .attr("stroke", d => color[d.team])
    .classed("perma-highlight", d => d.team === TO_HIGHLIGHT)
    .attr("d", d => lineGen(d.positions.slice(0, START_GW)))
    .on("mouseover", function() {
      d3.selectAll(".team-line").classed("highlight", false);
      d3.select(this).classed("highlight", true);
    })
    .on("mouseout", () => {
      d3.selectAll(".team-line").classed("highlight", false);
    });


// Animation
let currentGW = START_GW;
let playing = false;
const playButton = d3.select("#previous-season-play-button");
const stepBackButton = d3.select("#previous-season-step-back");
const stepForwardButton = d3.select("#previous-season-step-forward");

function updateVisualization() {
  paths.transition()
    .duration(ANIMATION_TIME)
    .attr("d", d =>
      lineGen(d.positions.slice(0, currentGW))
    );

  legendTeams.transition()
    .duration(ANIMATION_TIME)
    .attr("y", d => (d.positions[currentGW - 1] - 1) * (rowHeight + 1) - rowHeight / 2)

  legendChanges.transition()
    .duration(ANIMATION_TIME)
    .attr("y", d => (d.positions[currentGW - 1] - 1) * (rowHeight + 1) - rowHeight / 2)
    .attr('xlink:href', d => getLegendChangeImage(d.positions))
}

function animateStep() {
  updateVisualization();

  currentGW++;
  if (currentGW > maxGW) {
    if (currentGW >= maxGW) {
      currentGW = ANIMATION_START_GW;
    }
    playing = false;
    playButton.html("Play");
    stepBackButton.attr("disabled", null);
    stepForwardButton.attr("disabled", null);
    return;
  }

  if (playing) {
    setTimeout(animateStep, 2 * ANIMATION_TIME);
  }
}

playButton.on("click", () => {
  if (!playing) {
    playing = true;
    playButton.html("Pause");
    stepBackButton.attr("disabled", true);
    stepForwardButton.attr("disabled", true);
    animateStep();
  } else {
    playing = false;
    playButton.html("Play");
    stepBackButton.attr("disabled", null);
    stepForwardButton.attr("disabled", null);
  }
});

stepBackButton.on("click", () => {
  if (playing) {
    playing = false;
  }
  if (currentGW > ANIMATION_START_GW) {
    currentGW--;
    updateVisualization();
  }
});

stepForwardButton.on("click", () => {
  if (playing) {
    playing = false;
  }
  if (currentGW < maxGW) {
    currentGW++;
    updateVisualization();
  }
});

const getLegendZoneClass = (pos) => {
  if (pos <= 4) {
    return 'champions-league-zone'
  } else if (pos <= 7) {
    return 'europa-league-zone'
  } else if (pos >= 18) {
    return 'relegation-zone'
  }
  return 'default-zone'
}

const getLegendChangeImage = (positions) => {
  if (currentGW > 1) {
    if (positions[currentGW - 1] > positions[currentGW - 2]) {
      return 'images/position-change-down.svg'
    } else if (positions[currentGW - 1] == positions[currentGW - 2]) {
      return 'images/position-change-none.svg'
    }
    return 'images/position-change-up.svg'
  } 
  return 'images/position-change-none.svg'
}

const legend = g.append("g")
  .attr("transform", `translate(${innerWidth + 20}, 0)`);

const legendTeams = legend.selectAll(".legend-team")
    .data(data)
    .enter()
    .append("image")
        .attr("x", 4)
        .attr("y", d => (d.positions[currentGW - 1] - 1) * (rowHeight + 1) - rowHeight / 2)
        .attr('xlink:href', d => images[d.team])
        .attr('width', `${rowHeight}`)
        .attr('height', `${rowHeight}`)

const legendZones = legend.selectAll(".legend-zone")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", 0)
        .attr("y", d => (d.positions[currentGW - 1] - 1) * (rowHeight + 1) - rowHeight / 2)
        .attr('width', "2")
        .attr('height', `${rowHeight}`)
        .attr('class', d => getLegendZoneClass(d.positions[currentGW - 1]));

const legendChanges = legend.selectAll(".legend-changes")
  .data(data)
  .enter()
  .append("image")
        .attr("x", 8 + rowHeight)
        .attr("y", d => (d.positions[currentGW - 1] - 1) * (rowHeight + 1) - rowHeight / 2)
        .attr('xlink:href', d => getLegendChangeImage(d.positions))
        .attr('width', `${rowHeight}`)
        .attr('height', `${rowHeight}`)
})();
