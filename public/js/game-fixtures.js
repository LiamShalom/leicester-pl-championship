// Load and display Leicester City 2015-16 fixtures as flip cards
d3.csv("data/Leicester_2015_16_Fixtures.csv").then(data => {
    const sortedFixtures = data.sort((a, b) => {
        dateA = a.Date.split('/');
        dateB = b.Date.split('/');
        return Date(dateA[1],dateA[0],dateA[2]) - Date(dateB[1],dateB[0],dateB[2]);
    })

    createFlipCardGrid(sortedFixtures);
});

function createFlipCardGrid(fixtures) {
    const container = d3.select('#game-fixtures');

    // Create grid container
    const grid = container.append('div')
        .attr('class', 'flip-card-grid');

    // Create flip cards
    fixtures.forEach((fixture, index) => {
        const card = grid.append('div')
            .attr('class', 'flip-card');

        const cardInner = card.append('div')
            .attr('class', 'flip-card-inner');

        // Front of card (opponent)
        const cardFront = cardInner.append('div')
            .attr('class', 'flip-card-front');

        dateArray = fixture.Date.split('/');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

        cardFront.append('div')
            .attr('class', 'date')
            .text(months[parseInt(dateArray[1]) - 1] + " " + dateArray[0]);

        cardFront.append('div')
            .attr('class', 'home-away')
            .text(fixture['Home/Away'] === 'H' ? 'Home' : 'Away');

        cardFront.append('img')
            .attr('class', 'opponent-logo')
            .attr('src', fixture.Logo)
            .attr('alt', fixture.Opponent + ' logo')
            .attr('width', '60')
            .attr('height', '60');

        // Back of card (score)
        let leicesterGoals, opponentGoals;
        
        if (fixture['Home/Away'] === 'H') {
            [leicesterGoals, opponentGoals] = fixture.Score.split(':').map(Number);
        } else {
            [opponentGoals, leicesterGoals] = fixture.Score.split(':').map(Number);
        }

        let result;
        let resultClass;

        if (leicesterGoals > opponentGoals) {
            result = 'Win';
            resultClass = 'W';
        } else if (leicesterGoals < opponentGoals) {
            result = 'Loss';
            resultClass = 'L';
        } else {
            result = 'Draw';
            resultClass = 'D';
        }

        // Add result class to card
        card.classed(resultClass, true);

        const cardBack = cardInner.append('div')
            .attr('class', `flip-card-back ${resultClass}`);

        cardBack.append('div')
            .attr('class', 'result-label')
            .text(result);

        cardBack.append('div')
            .attr('class', 'score')
            .text(fixture.Score);
    });
    
    // Add bottom-right text area
    container.append('div')
        .attr('class', 'fixtures-info-box')
        .html(`
            <h2>Game Fixtures</h2>
            <p><strong>Leicester City ended the season with 81 points. Of the 38 games, they won 23, tied 12, and only lost 3.  </strong></p>
            <p>Hover over cards to reveal how they preformed on their journey to Premier League glory </p>
        `);
}
