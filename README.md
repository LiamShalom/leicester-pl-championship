# Leicester City Premier League Championship - Interactive Data Visualization

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://liamshalom.github.io/leicester-pl-championship/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive data visualization exploring how Leicester City achieved one of the greatest underdog stories in sports history by winning the 2015-16 Premier League title.

![Leicester City Trophy](public/images/pl_trophy.png)

## 🏆 About The Project

In the 2015-16 season, Leicester City defied 5,000-to-1 odds to claim the Premier League title, completing one of the most remarkable achievements in sports history. This interactive visualization explores the key factors behind their miraculous triumph through data-driven storytelling.

### Features

- **Animated League Tables** - Watch Leicester's dramatic escape from relegation in 2014-15 and their title-winning campaign in 2015-16
- **Manager Analysis** - Explore Claudio Ranieri's managerial history and why his appointment was initially questioned
- **Squad Value Comparison** - Interactive scatterplot showing how Leicester's budget compared to other Premier League teams
- **Match-by-Match Journey** - Detailed visualization of their 2015-16 season fixtures and results
- **Player Spotlights**:
  - **Jamie Vardy** - Goal scoring timeline and record-breaking streak
  - **N'Golo Kanté** - Defensive actions heatmap showing his incredible work rate
  - **Riyad Mahrez** - Key performance statistics
- **Tactical Analysis** - Formation and starting XI breakdowns
- **Possession Statistics** - How Leicester's counter-attacking style proved effective

## 🛠️ Built With

- **[D3.js](https://d3js.org/)** - Data visualization library
- **[D3-Soccer](https://github.com/probberechts/d3-soccer)** - Football pitch visualization

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/LiamShalom/leicester-pl-championship.git
   cd leicester-pl-championship
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start a local server
   ```bash
   # Using Node.js (install serve globally first)
   npx serve public
   ```

4. Open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
leicester-pl-championship/
├── public/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styles
│   ├── data/               # CSV data files
│   │   ├── KanteDefensiveActions.csv
│   │   ├── Leicester_2015_16_Fixtures.csv
│   │   ├── match_events.csv
│   │   ├── PossessionStats.csv
│   │   ├── PremierLeagueSquadValueData.csv
│   │   ├── RanieriTeams.csv
│   │   ├── StartingXI.csv
│   │   └── VardyGoals.csv
│   ├── images/             # Images and icons
│   │   ├── players/        # Player photos
│   │   └── team_logos/     # Team badges
│   └── js/                 # JavaScript visualization modules
│       ├── animated-table-2014.js
│       ├── animated-table-2015.js
│       ├── game-fixtures.js
│       ├── goal-frame.js
│       ├── kante.js
│       ├── mahrez-stats.js
│       ├── possession.js
│       ├── ranieri-stats.js
│       ├── scatterplot.js
│       ├── spin-wheel.js
│       ├── starting-xi.js
│       └── vardy-goals.js
├── package.json
├── LICENSE
└── README.md
```

## 📊 Data Sources

- Premier League historical data
- Player statistics from the 2015-16 season
- Match events and fixture data
- Squad valuation data (2010-2020)

## 👥 Authors

- **Liam Shalom** - [GitHub](https://github.com/LiamShalom)
- **Solden Stoll** - [GitHub](https://github.com/soldenstoll)

## 🙏 Acknowledgments

- Created as part of CSE 442 - Data Visualization at the University of Washington
- AI tools (GitHub Copilot, Claude) were used to assist with styling and data cleaning
- Leicester City FC for the incredible 2015-16 season that inspired this project

*"Dilly Ding, Dilly Dong"* - Claudio Ranieri
