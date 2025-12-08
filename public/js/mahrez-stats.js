const mahrezData = {
    Goals: 17,
    Assists: 11,
    xG: 11.88,
    xA: 11.45,
    SoT: 47,
    PK_Goals: 4,
    Free_Kicks: 5,
    Crosses: 72,
    Crosses_Completed: 17,
    Key_Passes: 67,
    Dribbles: 232,
    Dribbles_Success: 130,
    Duels_Won: 302,
    Minutes: 3052
};

(function() {
  function initMahrezStats() {
    const container = d3.select("#mahrez-stats");
    if (container.empty()) return;

    const minutesPer90 = mahrezData.Minutes / 90;
    const npGoals = mahrezData.Goals - mahrezData.PK_Goals;
    const npxG = mahrezData.xG - (mahrezData.PK_Goals * 0.76);
    
    const stats = [
      { label: "Goals\nper 90", value: (mahrezData.Goals / minutesPer90).toFixed(2), percentile: 94, category: "scoring" },
      { label: "PK Goals", value: mahrezData.PK_Goals, percentile: 85, category: "scoring" },
      { label: "G-PK\nper 90", value: (npGoals / minutesPer90).toFixed(2), percentile: 91, category: "scoring" },
      { label: "xG\nper 90", value: (mahrezData.xG / minutesPer90).toFixed(2), percentile: 86, category: "scoring" },
      { label: "npxG\nper 90", value: (npxG / minutesPer90).toFixed(2), percentile: 83, category: "scoring" },
      { label: "Shots on\nTarget", value: mahrezData.SoT, percentile: 91, category: "scoring" },
      { label: "xA+G\nper 90", value: ((mahrezData.xA + mahrezData.Goals) / minutesPer90).toFixed(2), percentile: 97, category: "playmaking" },
      { label: "xA\nper 90", value: (mahrezData.xA / minutesPer90).toFixed(2), percentile: 95, category: "playmaking" },
      { label: "Key Passes\nper 90", value: (mahrezData.Key_Passes / minutesPer90).toFixed(2), percentile: 92, category: "playmaking" },
      { label: "Crosses\nper 90", value: (mahrezData.Crosses / minutesPer90).toFixed(2), percentile: 78, category: "playmaking" },
      { label: "Dribbles\nper 90", value: (mahrezData.Dribbles / minutesPer90).toFixed(2), percentile: 99, category: "dribbling" },
      { label: "Successful\nDribbles", value: mahrezData.Dribbles_Success, percentile: 98, category: "dribbling" },
      { label: "Duels Won\nper 90", value: (mahrezData.Duels_Won / minutesPer90).toFixed(2), percentile: 88, category: "dribbling" }
    ];

    const categoryColors = {
      scoring: "#E63946",
      playmaking: "#457B9D", 
      dribbling: "#F4A261"
    };

    const width = 600;
    const height = 600;
    const margin = 40;
    const innerRadius = 60;
    const outerRadius = Math.min(width, height) / 2 - margin;

    const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
      .value(1)
      .sort(null)
      .padAngle(0.02);

    const pieData = pie(stats);

    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([innerRadius, outerRadius]);

    const bgArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    svg.selectAll(".bg-slice")
      .data(pieData)
      .enter()
      .append("path")
      .attr("class", "bg-slice")
      .attr("d", bgArc)
      .attr("fill", d => {
        const color = d3.color(categoryColors[d.data.category]);
        color.opacity = 0.2;
        return color;
      })
      .attr("stroke", "#444")
      .attr("stroke-width", 1);

    const percentileArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => radiusScale(d.data.percentile));

    svg.selectAll(".percentile-slice")
      .data(pieData)
      .enter()
      .append("path")
      .attr("class", "percentile-slice")
      .attr("d", percentileArc)
      .attr("fill", d => categoryColors[d.data.category])
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.8);
        
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.label.replace('\n', ' ')}</strong><br/>
                 Value: ${d.data.value}<br/>
                 Percentile: ${d.data.percentile}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1);
        
        tooltip.style("opacity", 0);
      });

    const labelArc = d3.arc()
      .innerRadius(d => radiusScale(d.data.percentile) - 15)
      .outerRadius(d => radiusScale(d.data.percentile) - 15);

    svg.selectAll(".percentile-label")
      .data(pieData)
      .enter()
      .append("text")
      .attr("class", "percentile-label")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .text(d => d.data.percentile);

    // Add stat labels outside
    const outerLabelArc = d3.arc()
      .innerRadius(outerRadius + 20)
      .outerRadius(outerRadius + 20);

    svg.selectAll(".stat-label")
      .data(pieData)
      .enter()
      .append("text")
      .attr("class", "stat-label")
      .attr("transform", d => {
        const pos = outerLabelArc.centroid(d);
        const angle = (d.startAngle + d.endAngle) / 2;
        const rotation = (angle * 180 / Math.PI) - 90;
        return `translate(${pos}) rotate(${rotation > 90 && rotation < 270 ? rotation + 180 : rotation})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#ccc")
      .attr("font-size", "9px")
      .each(function(d) {
        const lines = d.data.label.split('\n');
        const text = d3.select(this);
        text.text('');
        lines.forEach((line, i) => {
          text.append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? "-0.3em" : "1.1em")
            .text(line);
        });
      });

    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", innerRadius - 5)
      .attr("fill", "#222")
      .attr("stroke", "#666")
      .attr("stroke-width", 2);

    const legend = container.append("div")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("gap", "20px")
      .style("margin-top", "15px")
      .style("flex-wrap", "wrap");

    const categories = [
      { name: "Scoring", color: categoryColors.scoring },
      { name: "Playmaking", color: categoryColors.playmaking },
      { name: "Dribbling", color: categoryColors.dribbling }
    ];

    categories.forEach(cat => {
      const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px");

      item.append("div")
        .style("width", "12px")
        .style("height", "12px")
        .style("border-radius", "50%")
        .style("background", cat.color);

      item.append("span")
        .style("color", "#ccc")
        .style("font-size", "12px")
        .text(cat.name);
    });

    container.append("p")
      .style("text-align", "center")
      .style("color", "#999")
      .style("font-size", "11px")
      .style("margin-top", "10px")
      .style("font-style", "italic")
      .text("Values shown are percentiles compared to all Premier League players in the 2015-16 season.");

    const tooltip = d3.select("body").append("div")
      .attr("class", "mahrez-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px 14px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000);
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMahrezStats);
  } else {
    initMahrezStats();
  }
})();