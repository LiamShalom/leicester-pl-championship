// D3 Scatterplot for Premier League Squad Value vs Final Position
d3.csv("./data/PremierLeagueSquadValueData.csv").then((data) => {
    data.forEach((d) => {
        d.squad_value_eur = +d.squad_value_eur / 1_000_000; // millions
        d.final_position = +d.final_position;
    });

    // Remove rows with missing/invalid numeric values or where position == 0
    data = data.filter(
        (d) =>
            d.squad_value_eur != null &&
            !isNaN(d.squad_value_eur) &&
            // exclude entries with zero squad value
            d.squad_value_eur !== 0 &&
            d.final_position != null &&
            !isNaN(d.final_position) &&
            d.final_position !== 0
    );

    const margin = { top: 40, right: 40, bottom: 60, left: 70 };

    // make the chart responsive to the container size
    const container = document.getElementById("scatterplot");
    const containerWidth = container ? container.clientWidth : 1000;
    const containerHeight = container ? container.clientHeight : 500;
    const width = containerWidth;
    const height = Math.max(500, containerHeight);

    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "100%");

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.squad_value_eur)])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([20.5, 0.5]) // 1 at top
        .range([height - margin.bottom, margin.top]);



    // helper to format values (input here is in millions)
    function formatValue(v, forTooltip = false) {
        if (v >= 1000) {
            // show as billions
            let s = d3.format('.1f')(v / 1000);
            if (s.endsWith('.0')) s = s.slice(0, -2);
            return forTooltip ? `€${s}B` : `${s}B€`;
        }
        const s = d3.format(',.0f')(v);
        return forTooltip ? `€${s}M` : `${s}M€`;
    }

    // use formatted ticks that show billions for values >= 1000 (million)
    const xAxis = d3.axisBottom(x).ticks(10).tickFormat((d) => formatValue(d, false));
    const yAxis = d3.axisLeft(y).ticks(20);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Squad Value (Euros €)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Final League Position");

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(d.squad_value_eur))
        .attr("cy", (d) => y(d.final_position))
        .attr("r", (d) =>
            d.club === "Leicester City" && d.season === "2015-16" ? 8 : 6
        )
        .attr("opacity", 0.8)
        .attr("fill", (d) =>
            d.club === "Leicester City" && d.season === "2015-16" ? "#0053A0" : "#ccc"
        )
        .attr("stroke", (d) =>
            d.club === "Leicester City" && d.season === "2015-16" ? "#FFD700" : "#333"
        )
        .attr("stroke-width", 0.5)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            console.log(event);
            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", d.club === "Leicester City" && d.season === "2015-16" ? 10 : 8)
                .attr("opacity", 1);
            
            tooltip
                .style("opacity", 1)
                .html(
                    `<strong>${d.club}</strong><br>Season: ${d.season}<br>Value: ${formatValue(
                        d.squad_value_eur,
                        true
                    )}<br>Position: ${d.final_position}`
                )
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.clientX + window.scrollX + 10) + "px")
                .style("top", (event.clientY + window.scrollY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", d.club === "Leicester City" && d.season === "2015-16" ? 8 : 6)
                .attr("opacity", 0.8);
            
            tooltip.style("opacity", 0);
        });
});
