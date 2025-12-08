// Shared event system for goal highlighting
window.vardyGoalsEvents = {
  listeners: [],
  emit: function(eventType, data) {
    this.listeners.forEach(listener => {
      if (listener.type === eventType) {
        listener.callback(data);
      }
    });
  },
  on: function(eventType, callback) {
    this.listeners.push({ type: eventType, callback: callback });
  }
};

const third = d3.select("#vardy-goals")
  .append("div")
  .attr("class", "d3-soccer custom-theme")
  .style("width", attackingThird.width() + "px")
  .style("background-color", "#333")
  .call(attackingThird);

const thirdLayer = third.select(".above");

// Create tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip vardy-tooltip")
  .style("position", "absolute")
  .style("background", "rgba(0, 0, 0, 0.8)")
  .style("color", "white")
  .style("border-radius", "4px")
  .style("border", "0px")
  .style("padding", "8px 12px")
  .style("pointer-events", "none")
  .style("opacity", 0)
  .style("font-size", "12px")
  .style("z-index", "1000");

const color = {
  "Left Foot": "#fa9b48ff",
  "Right Foot": "#a5a5a5ff",
  "Head": "#1fb4a5ff"
};

d3.csv("data/VardyGoals.csv").then(goals => {
  // Add unique ID to each goal
  goals.forEach((d, i) => {
    d.goalId = `goal-${d.match_id}-${d.minute}`;
  });

  const goalsGroup = thirdLayer.selectAll(".goal")
    .data(goals)
    .join("g")
    .attr("class", d => `goal goal-group-${d.goalId}`);

  // Add lines from shot to goal
  goalsGroup.append("line")
    .attr("class", d => `goal-line goal-line-${d.goalId}`)
    .attr("x1", d => +d.shot_x - 15.8)
    .attr("y1", d => +d.shot_y - 6)
    .attr("x2", d => +d.goal_x - 15.8)
    .attr("y2", d => +d.goal_y - 6)
    .attr("stroke", d => color[d.body_part])
    .attr("stroke-width", 0.2)
    .attr("stroke-opacity", 0.8)
    .style("pointer-events", "none");

  // Add circles for shot location
  goalsGroup.append("circle")
    .attr("class", d => `goal-circle goal-circle-${d.goalId}`)
    .attr("cx", d => +d.shot_x - 15.8)
    .attr("cy", d => +d.shot_y - 6)
    .attr("r", d => d.xG * 0.5 + 0.5)
    .attr("fill", d => color[d.body_part])
    .attr("fill-opacity", 0.8)
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      highlightGoal(d, true);
      
      // Emit event to goal frame
      window.vardyGoalsEvents.emit('goalHover', { goalId: d.goalId, data: d, active: true });

      tooltip.transition()
        .duration(200)
        .style("opacity", 1);

      tooltip.html(`
            <strong>vs ${d.opponent}</strong><br/>
            Minute: ${d.minute}'<br/>
            Body Part: ${d.body_part}<br/>
            Type: ${d.shot_type}<br/>
            xG: ${(+d.xG).toFixed(2)}
          `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px")
    })
    .on("mouseout", function (event, d) {
      highlightGoal(d, false);
      
      // Emit event to goal frame
      window.vardyGoalsEvents.emit('goalHover', { goalId: d.goalId, data: d, active: false });

      tooltip.transition()
        .duration(200)
        .style("opacity", 0);
    });

  // Function to highlight a goal
  function highlightGoal(d, active) {
    const circle = d3.select(`.goal-circle-${d.goalId}`);
    const line = d3.select(`.goal-line-${d.goalId}`);
    
    if (active) {
      circle
        .transition()
        .duration(200)
        .attr("r", d.xG * 0.8 + 0.5)
        .attr("fill-opacity", 1);
      
      line
        .transition()
        .duration(200)
        .attr("stroke-width", 0.4)
        .attr("stroke-opacity", 1);
    } else {
      circle
        .transition()
        .duration(200)
        .attr("r", d.xG * 0.5 + 0.5)
        .attr("fill-opacity", 0.8);
      
      line
        .transition()
        .duration(200)
        .attr("stroke-width", 0.2)
        .attr("stroke-opacity", 0.8);
    }
  }

  // Listen for events from goal frame
  window.vardyGoalsEvents.on('goalFrameHover', function(eventData) {
    const goal = goals.find(g => g.goalId === eventData.goalId);
    if (goal) {
      highlightGoal(goal, eventData.active);
    }
  });

  // Add legend on the pitch
  const legend = thirdLayer.append("g")
    .attr("class", "legend");

  // Body Part Legend Background
  legend.append("rect")
    .attr("x", 55)
    .attr("y", 17.9)
    .attr("width", 32)
    .attr("height", 4)
    .attr("fill", "#444")
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#666")
    .attr("stroke-width", 0.15)
    .attr("rx", 0.3);

  // Body Part Label
  legend.append("text")
    .attr("x", 56)
    .attr("y", 20.4)
    .attr("font-size", "1.2px")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .text("Body Part:");

  // xG Legend Background
  legend.append("rect")
    .attr("x", 55)
    .attr("y", 22.5)
    .attr("width", 32)
    .attr("height", 4)
    .attr("fill", "#444")
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#666")
    .attr("stroke-width", 0.15)
    .attr("rx", 0.3);

  // xG Label
  legend.append("text")
    .attr("x", 56)
    .attr("y", 24.9)
    .attr("font-size", "1.2px")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .text("Expected:");

  // Legend items
  const legendItems = Object.entries(color);
  legendItems.forEach(([bodyPart, colorValue], i) => {
    const xPos = 63.5 + i * 9;
    const size = i * 0.15 + 0.5;
    const xGValue = [0.25, 0.5, 0.75];

    // Color circle
    legend.append("circle")
      .attr("cx", xPos)
      .attr("cy", 20)
      .attr("r", 0.5)
      .attr("fill", colorValue);

    // Label
    legend.append("text")
      .attr("x", xPos + 1)
      .attr("y", 20.4)
      .attr("font-size", "1px")
      .attr("fill", "white")
      .text(bodyPart);

    // xG circle
    legend.append("circle")
      .attr("cx", xPos)
      .attr("cy", 24.5)
      .attr("r", size)
      .attr("fill", "#333")
      .attr("stroke", "white")
      .attr("stroke-width", 0.2);

    // Label
    legend.append("text")
      .attr("x", xPos + 1 + i * 0.3)
      .attr("y", 24.9)
      .attr("font-size", "1px")
      .attr("fill", "white")
      .text(`${xGValue[i]}`);
  });

}).catch(error => {
  console.error("Error loading vardy goals:", error);
});