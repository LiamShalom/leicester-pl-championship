// Bubble chart for possession stats using pack layout
console.log('possession.js loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, initializing possession chart');
    
    const possessionDiv = d3.select('#possession');
    
    if (possessionDiv.empty()) {
        console.error('Possession div not found!');
        return;
    }

    // Load data
    d3.csv('data/PossessionStats.csv').then(rawData => {
        console.log('Data loaded:', rawData.length, 'teams');
        
        // Transform data for pack layout
        const data = rawData.map(d => ({
            id: d.Squad,
            value: Math.pow(+d.Poss, 3),
            originalValue: +d.Poss,
            players: +d['# Pl']
        }));

        // Specify the dimensions of the chart
        const width = 1200;
        const height = 1200;
        const margin = 1;

        // Helper functions
        const name = d => d.id;
        const format = d3.format(".1f");

        // Color function - grey for all except Leicester (blue)
        const color = d => d.data.id === 'Leicester City' ? '#0053A0' : '#CCCCCC';

        // Create the pack layout
        const pack = d3.pack()
            .size([width - margin * 2, height - margin * 2])
            .padding(3);

        // Compute the hierarchy from the (flat) data; expose the values
        // for each node; lastly apply the pack layout
        const root = pack(d3.hierarchy({children: data})
            .sum(d => d.value));

        // Create the SVG container
        const svg = possessionDiv.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-margin, -margin, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
            .attr("text-anchor", "middle");

        // Create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #ddd')
            .style('border-radius', '4px')
            .style('padding', '10px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
            .style('z-index', '1000');

        // Place each (leaf) node according to the layout's x and y values
        const node = svg.append("g")
            .selectAll()
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Add a title for accessibility
        node.append("title")
            .text(d => `${d.data.id}\nPossession: ${format(d.data.originalValue)}%\nPlayers: ${d.data.players}`);

        // Add a filled circle
        node.append("circle")
            .attr("fill-opacity", 0.8)
            .attr("fill", d => color(d))
            .attr("stroke", d => d.data.id === 'Leicester City' ? '#FFD700' : '#c1c1c1ff')
            .attr("stroke-width", d => d.data.id === 'Leicester City' ? 3 : 2)
            .attr("r", d => d.r)
            .style("cursor", "pointer")
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill-opacity', 1);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.95);

                tooltip.html(`
                    <strong style="color: black};">${d.data.id}</strong><br/>
                    Possession: ${format(d.data.originalValue)}%<br/>
                    Players: ${d.data.players}
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill-opacity', 0.8);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

        // Add a label
        const text = node.append("text")
            .attr("clip-path", d => `circle(${d.r})`);

        // Add team name (split by spaces for multi-line)
        text.selectAll()
            .data(d => name(d.data).split(/\s+/g))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
            .attr("font-size", "18px")
            .attr("font-weight", "600")
            .attr("fill", "white")
            .style("pointer-events", "none")
            .text(d => d);

        // Add a tspan for the possession percentage
        text.append("tspan")
            .attr("x", 0)
            .attr("y", d => {
                const words = name(d.data).split(/\s+/g);
                return `${words.length / 2 + 0.35}em`;
            })
            .attr("fill-opacity", 0.9)
            .attr("font-size", "16px")
            .attr("fill", "white")
            .text(d => `${format(d.data.originalValue)}%`)
            .style("pointer-events", "none")
            .style("pointer-events", "none");

        console.log('Bubble chart created');

    }).catch(error => {
        console.error('Error loading possession data:', error);
        possessionDiv
            .append('p')
            .style('color', 'red')
            .text('Error loading possession data. Please check the console.');
    });

}); // End DOMContentLoaded
