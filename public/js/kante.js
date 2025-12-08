(function(){
// Generates animated goal replays highlighting key events

// Pitch configuration
const kantePitch = d3.pitch();
const kantePitchWidth = 463.23;
kantePitch.height(300);

// Animation timing
EVENT_ANIMATION_TIME = 500  // Time taken to animat
AFTER_EVENT_WAIT_TIME = 500  // Time before next event

// City 1 - 3 Leicester 
const eventTitle1 = "Man City 1 - 3 Leicester, MW 25, 48'"

const eventData1 = [
  {type: "pass", x: 35, y: 25, endX: 50, endY: 5, player: 4, endPlayer: 14, outcome: "none"},
  {type: "carry", x: 50, y: 5, endX: 60, endY: 10, player: 14, outcome: "successful-dribble"},
  {type: "carry", x: 60, y: 10, endX: 65, endY: 15, player: 14, outcome: "none"},
  {type: "pass", x: 65, y: 15, endX: 80, endY: 16, player: 14, endPlayer: 26, outcome: "assist"},
  {type: "carry", x: 80, y: 16, endX: 92, endY: 27, player: 26, outcome: "none"},
  {type: "shot", x: 92, y: 27, endX: 105, endY: 34, player: 26, outcome: "goal"}
]

// For tooltips
eventPlayers1 = {
  "14": "N'Golo Kante",
  "26": "Riyad Mahrez",
  "4": "Danny Drinkwater"
}

// Newcastle 0 - 3 Leicester
const eventTitle2 = "Newcastle 0 - 3 Leicester, MW 13, 65'"

const eventData2 = [
  {type: "won", x: 65, y: 40, endX: 65, endY: 40, player: 14, outcome: "interception"},
  {type: "pass", x: 65, y: 40, endX: 100, endY: 62, player: 14, endPlayer: 26, outcome: "none"},
  {type: "carry", x: 100, y: 62, endX: 96, endY: 50, player: 26, outcome: "none"},
  {type: "pass", x: 96, y: 50, endX: 100, endY: 27, player: 26, endPlayer: 24, outcome: "assist"},
  {type: "shot", x: 100, y: 27, endX: 105, endY: 37, player: 24, outcome: "goal"}
]

// For tooltips
eventPlayers2 = {
  "14": "N'Golo Kante",
  "26": "Riyad Mahrez",
  "24": "Leonardo Ulloa"
}

// Needed for rendering tooltipls
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");


function renderPlayer(layer, x, y, eventId, player, opacity=1) {
  const playerObject = layer.append("g")
    .attr("class", 'event-player-' + eventId + ' event-' + eventId + '-all')
    .attr("transform", `translate(${x},${y})`)
    .attr("opacity", opacity)

  playerObject.append("circle")
    .attr("r", 2)
    .attr("fill", "white")
    .attr("stroke", "blue")
    .attr("stroke-width", 0.5);

  playerObject.append("text")
    .attr("y", 1)
    .attr("text-anchor", "middle")
    .style("font-size", "3px")
    .style("fill", "blue")
    .style("pointer-events", "none")
    .text(player);
  
  return playerObject
}

function renderPath(layer, x, y, endX, endY, eventId, dasharray, lineGen) {
  const path = layer.append('path')
    .attr('d', () => lineGen([[x, y],[endX, endY]]))
    .attr('stroke', 'blue')
    .attr('stroke-dasharray', dasharray)
    .attr('class', 'event-' + eventId + ' event-' + eventId + '-all')
  
  return path
}

function addTooltips(layer, selection, description) {
  layer.selectAll(selection)
    .on("mouseover", function(event) {
      tooltip
          .style("opacity", 1)
          .html(
              description
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mousemove", function(event) {
          tooltip
              .style("left", (event.clientX + window.scrollX + 10) + "px")
              .style("top", (event.clientY + window.scrollY - 28) + "px");
      })
      .on("mouseout", function() {
          tooltip.style("opacity", 0);
      });
}

function renderOutcome(layer, x, y, eventId, outcomeImage, opacity=1) {
  const plaqueSize = 5;
  const width = 5
  const height = 5

  const outcomePlaque = layer.append("g")
    .attr('class', 'event-outcome-' + eventId + ' event-' + eventId + '-all')
    .attr('opacity', opacity)
  
  outcomePlaque.append('rect')
    .attr('x', x - Math.SQRT2 * plaqueSize)
    .attr('y', y - Math.SQRT2 * plaqueSize)
    .attr('width', plaqueSize)
    .attr('height', plaqueSize)
    .attr('fill', '#D4AF37')
    .attr('transform', `rotate(45 ${x} ${y})`)
  
  outcomePlaque.append('image')
    .attr('x', x - width / 2)
    .attr('y', y - 1.75 * height)
    .attr('width', width)
    .attr('height', height)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('href', outcomeImage)
    .attr('xlink:href', outcomeImage)
    .style('pointer-events', 'none')
    
  return outcomePlaque
}

function renderEvent(d, layer, eventId, players, outcomeImages, outcomeDescriptions) {
  // Line generator
  const lineGen = d3.line()

  // Place events for carries at the end not source
  if (d.type === "carry") {
    // Path of carry
    renderPath(layer, d.x, d.y, d.endX, d.endY, eventId, 0, lineGen)
    
    // Ending player
    renderPlayer(layer, d.endX, d.endY, eventId, d.player);
  } else if (d.type === "pass") {
    // Path of pass
    renderPath(layer, d.x, d.y, d.endX, d.endY, eventId, 2, lineGen)

    // Ending player
    renderPlayer(layer, d.endX, d.endY, eventId, d.endPlayer);
  } else if (d.type === "shot") {
    // Path of shot
    renderPath(layer, d.x, d.y, d.endX, d.endY, eventId, 1, lineGen)
  }

  // Render starting player
  renderPlayer(layer, d.x, d.y, eventId, d.player);

  // Handle outcomes
  if (d.outcome !== "none") {
    if (d.outcome === "successful-dribble") {
      renderOutcome(layer, d.endX, d.endY, eventId, outcomeImages[d.outcome])
    } else {
      renderOutcome(layer, d.x, d.y, eventId, outcomeImages[d.outcome])
    }
  }

  // Add tooltips
  addTooltips(layer, '.event-outcome-' + eventId, outcomeDescriptions[d.outcome])
  addTooltips(layer, '.event-player-' + eventId, d.player + ". " + players[d.player])
  addTooltips(layer, '.event-' + eventId, d.type)
}

function renderEventAnimated(d, layer, eventId, players, outcomeImages, outcomeDescriptions) {
  // Line generator
  const lineGen = d3.line()

  // Place events for carries at the end not source
  if (d.type === "carry") {
    // Path of carry
    const path = renderPath(layer, d.x, d.y, d.x, d.y, eventId, 0, lineGen)

    // Transition path
    path.transition()
      .duration(EVENT_ANIMATION_TIME)
      .attr("d", () => lineGen([[d.x, d.y],[d.endX, d.endY]]))
    
    // Ending player
    const endPlayer = renderPlayer(layer, d.x, d.y, eventId, d.player);

    // Transition ending player
    endPlayer.transition()
      .duration(EVENT_ANIMATION_TIME)
      .attr("transform", `translate(${d.endX},${d.endY})`)
  } else if (d.type === "pass") {
    // Path of pass
    const path = renderPath(layer, d.x, d.y, d.x, d.y, eventId, 2, lineGen)

    // Transition path
    path.transition()
      .duration(EVENT_ANIMATION_TIME)
      .attr("d", () => lineGen([[d.x, d.y],[d.endX, d.endY]]))

    // Ending player
    const endPlayer = renderPlayer(layer, d.endX, d.endY, eventId, d.endPlayer, 0);

    // Fade ending player in
    endPlayer.transition()
      .duration(EVENT_ANIMATION_TIME)
      .attr("opacity", 1)
  } else if (d.type === "shot") {
    // Path of shot
    const path = renderPath(layer, d.x, d.y, d.x, d.y, eventId, 1, lineGen)

    // Transition path
    path.transition()
      .duration(EVENT_ANIMATION_TIME)
      .attr("d", () => lineGen([[d.x, d.y],[d.endX, d.endY]]))
  }

  renderPlayer(layer, d.x, d.y, eventId, d.player);

  // Handle outcomes
  if (d.outcome !== "none") {
    let outcomePlaque;

    if (d.outcome === "interception" || d.outcome === "ball won") {
      outcomePlaque = renderOutcome(layer, d.x, d.y, eventId, outcomeImages[d.outcome], 0)

      // Fade plaque in
      outcomePlaque.transition()
        .duration(AFTER_EVENT_WAIT_TIME)
        .attr("opacity", 1)

      // Add tooltips
      addTooltips(layer, '.event-outcome-' + eventId, outcomeDescriptions[d.outcome])
    } else {
      setTimeout(() => {
        if (d.outcome === "successful-dribble") {
          outcomePlaque = renderOutcome(layer, d.endX, d.endY, eventId, outcomeImages[d.outcome], 0)
        } else {
          outcomePlaque = renderOutcome(layer, d.x, d.y, eventId, outcomeImages[d.outcome], 0)
        }

        // Fade plaque in
        outcomePlaque.transition()
          .duration(AFTER_EVENT_WAIT_TIME)
          .attr("opacity", 1)
        
        // Add tooltips
        addTooltips(layer, '.event-outcome-' + eventId, outcomeDescriptions[d.outcome])
      }, EVENT_ANIMATION_TIME);
    }
  }

  // Add tooltips
  addTooltips(layer, '.event-player-' + eventId, d.player + ". " + players[d.player])
  addTooltips(layer, '.event-' + eventId, d.type)
}

// Plays the animations
function playAnimation(eventData, layer, players, id, outcomeImages, outcomeDescriptions) {
  // Select play button
  const button = d3.select('#' + id + '-play-button')

  // Check if button is active and exit if so
  if (button.classed("goal-animation-button-inactive")) {
    return
  }

  // Otherwise make button inactive while playing
  button.classed("goal-animation-button-inactive", true)

  // First remove all data
  eventData.map((d, i) => {
    layer.selectAll('.event-' + i + '-all').remove()
  })

  let i = 0
  const maxLen = eventData.length
  let playing = true

  function step() {
    if (playing) {
      renderEventAnimated(eventData[i], layer, i, players, outcomeImages, outcomeDescriptions)
      i += 1
      playing = i !== maxLen

      setTimeout(step, 1000)
    } else {
      // Re-activate button
      button.classed("goal-animation-button-inactive", false)
    }
  }

  // Run the animation
  step()
}

// Animate all events
function eventsReplayAnimation(eventData, title, id, players, addLegend=false) {
  // Images to display for outcomes
  const outcomeImages = {
    "interception": "images/interception.avif", 
    "assist": "images/assist.avif", 
    "goal": "images/goal.avif",
    "tackle": "images/tackle.avif", 
    "successful-dribble": "images/successful-dribble.avif"
  }

  const outcomeDescriptions = {
    "interception": "ball intercepted",
    "assist": "assist",
    "goal": "goal",
    "tackle": "successful tackle",
    "successful-dribble": "successful take-on"
  }

  const container = d3.select('#' + id).call(kantePitch);
  const layer = container.select(".above");

  const titleContainer = d3.select('#' + id + '-title')

    // Optionally add a legend showing the line styles used for event types
    if (addLegend) {
      const legend = container.append('div')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .append('div')
          .attr('class', 'kante-legend')
          .style('width', kantePitchWidth + 'px')
          .style('display', 'flex')
          .style('justify-content', 'center')
          .style('gap', '8px')
          .style('font-family', 'sans-serif')
          .style('font-size', '12px')
          .style('color', 'black');

      // Legend specification for the event lines
      const legendLines = [
        { key: 'carry', label: 'carry', dash: null },
        { key: 'pass', label: 'pass', dash: '8' },
        { key: 'shot', label: 'shot', dash: '4' }
      ];

      legendLines.forEach(itemSpec => {
        const item = legend.append('div')
          .attr('class', `kante-legend-item kante-legend-item-${itemSpec.key}`)
          .style('display', 'flex')
          .style('align-items', 'center')
          .style('gap', '6px');

        // Small inline SVG to show the line style
        const svg = item.append('svg')
          .attr('width', 32)
          .attr('height', 12)
          .style('display', 'block');

        const line = svg.append('line')
          .attr('x1', 4)
          .attr('y1', 6)
          .attr('x2', 32)
          .attr('y2', 6)
          .attr('stroke', 'blue')

        if (itemSpec.dash) {
          line.attr('stroke-dasharray', itemSpec.dash);
        }

        item.append('div')
          .text(itemSpec.label)
          .style('line-height', '1')
      });
    }

  // Add titles
  titleContainer
    .style('width', kantePitchWidth + "px")
    .style('display', 'block')
    .style('position', 'relative');

  titleContainer.append("div")
    .text(title)
    .style('font-size', '14px')
    .style('position', 'absolute')
    .style('left', '50%')
    .style('top', '50%')
    .style('transform', 'translate(-50%, -50%)');

  // Add play button that runs animation when clicked
  titleContainer.append("div")
    .style("position", "absolute")
    .style("left", "6px")
    .style("top", "50%")
    .style("transform", "translateY(-50%)")
    .style("width", "20px")
    .style("height", "20px")
    .style('cursor', 'pointer')
    .on('click', () => playAnimation(eventData, layer, players, id, outcomeImages, outcomeDescriptions))
      .append("img")
      .attr("src", "images/play-button.svg")
      .attr("width", "20px")
      .attr("height", "20px")
      .attr("id", id + '-play-button')
      .classed("goal-animation-button-inactive", false)
  
  eventData.forEach((d, i) => {
    renderEvent(d, layer, i, players, outcomeImages, outcomeDescriptions)
  })
}

// Render both animations
eventsReplayAnimation(eventData1, eventTitle1, 'kante-carries-animation-1', eventPlayers1)
eventsReplayAnimation(eventData2, eventTitle2, 'kante-carries-animation-2', eventPlayers2, true)

})();
