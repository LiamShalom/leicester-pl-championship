
const chart = d3.select("#starting-xi")
  .append("div")
  .attr("class", "d3-soccer custom-theme")
  .style("width", pitch.width() + "px")
  .style("background-color", "#348C31")
  .call(pitch);

const layer = chart.select(".above");

d3.csv("data/StartingXI.csv").then(players => {

  const playersGroup = layer.selectAll(".player")
    .data(players)
    .join("g")
    .attr("class", "player");

  playersGroup.append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 4)
    .attr("fill", "#0053A0")
    .attr("stroke", "#fcc200")
    .attr("stroke-width", 0.3)
    .style("cursor", "pointer");

  playersGroup.append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "4px")
    .style("font-weight", "bold")
    .style("font-family", "DM Serif Display, serif")
    .style("pointer-events", "none")
    .text(d => d.num || d.number);

  playersGroup.on("mouseover", (event, d) => {
    // Display player info in the side panel
    d3.select("#player-name").text(d.name);
    d3.select("#player-meta").html(
       `<strong>Position:</strong> ${d.role} &nbsp;&nbsp;&nbsp; 
       <strong>Age:</strong> ${d.age} &nbsp;&nbsp;&nbsp; 
       <strong>Nation:</strong> ${d.nat}<br>
       ${d.desc}`
    );
    
    // Display player photo if available
    if (d.photo) {
      d3.select("#player-photo")
        .attr("src", d.photo)
        .style("display", "block");
    } else {
      d3.select("#player-photo").style("display", "none");
    }
  });
});


