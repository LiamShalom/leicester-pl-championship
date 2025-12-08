// Spinning pie chart showing Leicester's odds
const data = [
    { name: "Leicester City", value: 1, color: "#0053A0" },
    { name: "Other Teams", value: 999, color: "#E0E0E0" }
];

const container = d3.select('#spin-wheel');
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;

const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height);

// Create a group for the spinning wheel
const wheelGroup = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

// Create pie chart
const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius - 10);

// Draw pie slices
const slices = wheelGroup.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => d.data.color)
    .attr('stroke', 'white')
    .attr('stroke-width', 0);

// Add pointer/arrow at top (separate from spinning wheel)
svg.append('polygon')
    .attr('points', `${width/2},${height/2 - radius + 5} ${width/2 - 10},${height/2 - radius - 10} ${width/2 + 10},${height/2 - radius - 10}`)
    .attr('fill', 'red')
    .attr('stroke-width', 1);

// Add spin button
const button = container.append('button')
    .attr('class', 'spin-button')
    .text('Spin the Wheel')
    .on('click', spinWheel);

// Add result text
const result = container.append('div')
    .attr('class', 'spin-result')
    .text('Click to spin!');

let isSpinning = false;
let currentRotation = 0;

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    button.property('disabled', true);
    result.text('Spinning...');
    
    // Random rotation between 720-1440 degrees (2-4 full spins)
    const spins = 3 + Math.random() * 2;
    const extraDegrees = Math.random() * 360;
    const newRotation = currentRotation + (spins * 360) + extraDegrees;
    
    // Calculate if we land on Leicester (tiny slice)
    const finalAngle = newRotation % 360;
    const leicesterAngle = (data[0].value / (data[0].value + data[1].value)) * 360;
    const landedOnLeicester = finalAngle < leicesterAngle;
    
    // Animate spin
    wheelGroup.transition()
        .duration(3000)
        .ease(d3.easeCubicOut)
        .attrTween('transform', () => {
            return t => {
                const rotation = d3.interpolate(currentRotation, newRotation)(t);
                return `translate(${width / 2}, ${height / 2}) rotate(${rotation})`;
            };
        })
        .on('end', () => {
            currentRotation = newRotation % 360;
            isSpinning = false;
            button.property('disabled', false);
            
            if (landedOnLeicester) {
                result.text('🎉 LEICESTER CITY! Against all odds! 🎉')
                    .style('color', 'white')
                    .style('font-weight', 'bold');
            } else {
                result.text('Arsenal probably won!')
                    .style('color', 'white')
                    .style('font-weight', 'normal');
            }
        });
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {});
}
