(function(){

function initGoalFrame() {
  
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 500
  const height = 200
  
  const svg = d3.select("#goal-frame-viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Load the data
  d3.csv("data/VardyGoals.csv").then(data => {
    data.forEach(d => {
      d.goal_y = +d.goal_y;
      d.goal_z = +d.goal_z;
      d.xG = +d.xG;
      d.goalId = `goal-${d.match_id}-${d.minute}`;
    });

    // Goal post positions 
    const goalMinY = 36.0;
    const goalMaxY = 44.0;
    const goalMaxZ = 2.44;

    const xScale = d3.scaleLinear()
      .domain([goalMinY, goalMaxY])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, goalMaxZ])
      .range([height, 0]);

    // Draw the goal frame using SVG path
    // Copied from https://www.fotmob.com/matches/
    const goalPath = "M503.369 407.8l11.792-4.027-.322-.946-11.553 3.944V402.4h.138l11.833-7.071-.514-.858-11.595 6.929h-12.556l4.87-6.087-.781-.625-5.11 6.388v.324h-11.714v-.035l2.951-6.149-.9-.432-3.049 6.353v.263h-11.716v-.149l-3.049-6.467-.9.432 2.951 6.149v.035h-11.716v-.324l-5.11-6.388-.781.625 4.87 6.087h-11.573l-.121-.062v-.087h-.17l-11.316-5.8-.456.89 10.942 5.6v4.481l-10.552-3.6-.324.946 10.876 3.714v4.441l-10.59-2.712-.248.969 10.838 2.775v4.548l-11.13-1.9-.168.986 11.3 1.922V424h1v-5.4h11.715v5.4h1v-5.4h11.714v5.4h1v-5.4h11.714v5.4h1v-5.4h11.714v5.4h1v-5.406h11.715V424h1v-5.478l11.3-1.929-.168-.986-11.13 1.907V413.2h.064l11.774-3.015-.248-.969-11.59 2.968V407.8zm-1.083-1h-11.715v-4.4h11.715zm-12.715-4.4v4.4h-11.714v-4.4zm-24.428 5.384l11.714.005v4.411h-11.714zm-1 4.416h-11.714v-4.422h11.714zm13.714-4.411l11.714.005v4.406h-11.714zm-1-5.389v4.4h-11.714v-4.4zm-12.714 0v4.4h-11.714v-4.4zm-24.429 0h11.715v4.4H439.8l-.083-.029zm0 5.373l11.715.005v4.422h-11.652l-.063-.016zm0 9.834v-4.422h11.715v4.418zm12.715 0v-4.418h11.714v4.414zm12.714 0v-4.413h11.714v4.406zm12.714 0v-4.409h11.714v4.4zm24.429 0h-11.715v-4.4h11.715zm0-5.4h-11.715v-4.406l11.715.005z";
    
    const postsPath = "M428 424v-27a1 1 0 0 1 1-1h84a1 1 0 0 1 1 1v27h2v-27a3 3 0 0 0-3-3h-84a3 3 0 0 0-3 3v27z";

    const goalGroup = svg.append("g")
      .attr("transform", `scale(${width / 90}, ${height / 30}) translate(-426, -394)`);
    
    goalGroup.append("path")
      .attr("fill", "#414141")
      .attr("d", goalPath);
    
    goalGroup.append("path")
      .attr("fill", "#E5E5E5")
      .attr("d", postsPath);

    const defs = svg.append("defs");
    
    const shotSymbol = defs.append("symbol")
      .attr("id", "shot-icon")
      .attr("viewBox", "0 0 12 13");
    
    shotSymbol.append("g")
      .attr("stroke", "none")
      .attr("stroke-width", "1")
      .attr("fill", "none")
      .attr("fill-rule", "evenodd")
      .html(`
        <g id="icGoalShotMap" transform="translate(-0.000000, 0.000000)" fill-rule="nonzero">
          <circle id="Ellipse_497" fill="#FFFFFF" cx="6.001" cy="6" r="5"></circle>
          <path d="M5.626,0 L6.376,0 C6.40552627,0.00839994525 6.43559797,0.014748416 6.466,0.019 C7.38628604,0.0800102699 8.27823106,0.362345175 9.066,0.842 C10.5785278,1.72761944 11.6210494,3.2377561 11.913,4.966 C11.954,5.184 11.975,5.405 12.005,5.625 L12.005,6.375 C11.9965643,6.40485607 11.9902156,6.4352628 11.986,6.466 C11.9143578,7.48399561 11.5745138,8.46488534 11.001,9.309 C10.1013506,10.6886225 8.66737647,11.6308345 7.044,11.909 C6.823,11.95 6.597,11.972 6.374,12.002 L5.624,12.002 C5.59852286,11.993925 5.57243929,11.9879057 5.546,11.984 C4.52846394,11.9161882 3.54695405,11.5805084 2.701,11.011 C1.31669631,10.111854 0.371171834,8.67507734 0.093,7.048 C0.052,6.826 0.03,6.601 0,6.378 L0,5.628 C0.017,5.486 0.032,5.343 0.052,5.201 C0.406968,2.60773495 2.39922581,0.542274001 4.978,0.094 C5.193,0.053 5.41,0.03 5.626,0 L5.626,0 Z M8.878,8.652 L8.878,8.672 L9.522,8.672 C9.57659281,8.66892223 9.62754501,8.64362681 9.663,8.602 C10.1962134,7.8620027 10.4891036,6.97600124 10.502,6.064 C10.5075297,5.99808243 10.4738632,5.93505553 10.416,5.903 C10.088,5.677 9.764,5.446 9.438,5.217 C9.32885651,5.16723745 9.24531718,5.07433535 9.20738486,4.96053838 C9.16945254,4.84674141 9.18054274,4.72229613 9.238,4.617 C9.369,4.237 9.501,3.858 9.626,3.477 C9.63973503,3.42435564 9.6314301,3.3683876 9.603,3.322 C9.06224838,2.587148 8.31006414,2.03487172 7.447,1.739 C7.39009663,1.71388699 7.32379611,1.72402708 7.277,1.765 C6.954,2.011 6.629,2.254 6.304,2.498 C6.22368795,2.58148214 6.11284167,2.62865783 5.997,2.62865783 C5.88115833,2.62865783 5.77031205,2.58148214 5.69,2.498 C5.368,2.257 5.046,2.017 4.726,1.773 C4.6777614,1.72817388 4.60778163,1.71566353 4.547,1.741 C3.683918,2.0363171 2.93167082,2.58829067 2.391,3.323 C2.3625699,3.3693876 2.35426497,3.42535564 2.368,3.478 C2.493,3.859 2.626,4.238 2.756,4.618 C2.81284647,4.72341148 2.82360722,4.84762812 2.78573493,4.96124498 C2.74786265,5.07486184 2.66472406,5.1677787 2.556,5.218 C2.233,5.445 1.913,5.673 1.588,5.896 C1.52340272,5.93181534 1.48611824,6.00245961 1.493,6.076 C1.51064624,6.97977129 1.79946822,7.85738596 2.322,8.595 C2.35667055,8.6515865 2.4210997,8.68282487 2.487,8.675 C2.887,8.665 3.287,8.66 3.682,8.654 C3.79722474,8.63566529 3.91499088,8.66427766 4.00895802,8.73343748 C4.10292516,8.80259729 4.16525269,8.90653386 4.182,9.022 C4.3,9.406 4.419,9.789 4.534,10.174 C4.54734003,10.2344488 4.59455117,10.28166 4.655,10.295 C5.52190519,10.5665089 6.45109481,10.5665089 7.318,10.295 C7.38568847,10.2792888 7.43779637,10.225222 7.451,10.157 C7.565,9.772 7.685,9.389 7.803,9.005 C7.84139059,8.77212823 8.0595692,8.61316953 8.293,8.648 C8.495,8.654 8.686,8.652 8.878,8.652 L8.878,8.652 Z" id="Path_4408" fill="#333"></path>
          <path d="M6.002,7.875 C5.772,7.875 5.541,7.87 5.311,7.875 C5.11189042,7.89145718 4.92841557,7.76636069 4.871,7.575 L4.36,6.306 C4.292,6.136 4.222,5.966 4.16,5.793 C4.07432579,5.61229677 4.13962495,5.39607436 4.311,5.293 C4.78633333,4.93166667 5.264,4.57333333 5.744,4.218 C5.88880091,4.0890945 6.10719909,4.0890945 6.252,4.218 C6.73533333,4.57533333 7.216,4.936 7.694,5.3 C7.86647228,5.40251509 7.92952648,5.62145327 7.838,5.8 C7.601,6.41 7.357,7.018 7.11,7.624 C7.04860909,7.7918262 6.88195555,7.89731871 6.704,7.881 C6.471,7.872 6.236,7.876 6.002,7.875 L6.002,7.875 Z" id="Path_4409" fill="#333"></path>
        </g>
      `);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "goal-frame-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 1000);

    const iconSize = 28;

    function highlightShot(goalId, active) {
      const d = data.find(g => g.goalId === goalId);
      if (d) {
        if (active) {
          svg.selectAll(".shot").style("opacity", 0.2);
          svg.select(`.goal-frame-shot-${goalId}`).style("opacity", 1);
          
        } else {
          svg.selectAll(".shot").style("opacity", 1);
          
          svg.selectAll(`.highlight-circle-${goalId}`).remove();
        }
      }
    }

    // Listen for events from vardy-goals pitch visualization
    if (window.vardyGoalsEvents) {
      window.vardyGoalsEvents.on('goalHover', function(eventData) {
        highlightShot(eventData.goalId, eventData.active);
      });
    }

    svg.selectAll(".shot")
      .data(data)
      .enter()
      .append("use")
      .attr("class", d => `shot goal-frame-shot-${d.goalId}`)
      .attr("href", "#shot-icon")
      .attr("x", d => xScale(d.goal_y) - iconSize / 2)
      .attr("y", d => yScale(d.goal_z) - iconSize / 2)
      .attr("width", iconSize)
      .attr("height", iconSize)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        svg.selectAll(".shot").style("opacity", 0.2);
        d3.select(this).style("opacity", 1);
        
        if (window.vardyGoalsEvents) {
          window.vardyGoalsEvents.emit('goalFrameHover', { goalId: d.goalId, data: d, active: true });
        }
        
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>vs ${d.opponent}</strong><br/>
            Minute: ${d.minute}'<br/>
            Body Part: ${d.body_part}<br/>
            Type: ${d.shot_type}<br/>
            xG: ${d.xG.toFixed(2)}
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function(event, d) {
        svg.selectAll(".shot").style("opacity", 1);
        
        if (window.vardyGoalsEvents) {
          window.vardyGoalsEvents.emit('goalFrameHover', { goalId: d.goalId, data: d, active: false });
        }
        
        tooltip.style("opacity", 0);
      });

  }).catch(error => {
    console.error("Error loading VardyGoals.csv:", error);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGoalFrame);
} else {
  initGoalFrame();
}

})();
