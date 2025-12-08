// Load and display Ranieri's managerial history as a horizontal timeline
d3.csv("data/RanieriTeams.csv").then(data => {
    createTimeline(data.reverse());
});

function createTimeline(data) {
    const container = d3.select('#ranieri-teams');

    // Create timeline container
    const timeline = container.append('div')
        .attr('class', 'timeline-container');

    // Create timeline track
    const track = timeline.append('div')
        .attr('class', 'timeline-track');

    // Create timeline items
    data.forEach((team, index) => {
        const item = track.append('div')
            .attr('class', 'timeline-item');

        // Determine if team won trophies
        const hasTrophies = team.Trophies !== "none";
        const resultClass = hasTrophies ? 'success' : 'neutral';

        // Create timeline node
        const node = item.append('div')
            .attr('class', `timeline-node ${resultClass}`);

        // Add team logo to node
        node.append('img')
            .attr('src', team.Image)
            .attr('alt', team.Team + ' logo')
            .attr('class', 'timeline-logo');

        // Create content card
        const card = item.append('div')
            .attr('class', `timeline-card ${resultClass}`);

        // Add timespan
        card.append('div')
            .attr('class', 'timeline-timespan')
            .text(team.Span);

        // Add team name
        card.append('div')
            .attr('class', 'timeline-team-name')
            .text(team.Team);

        // Add record
        const record = team.Wins + "-" + team.Draws + "-" + team.Losses;
        card.append('div')
            .attr('class', 'timeline-record')
            .html(`<strong>Record:</strong> ${record}`);

        // Add PPG
        card.append('div')
            .attr('class', 'timeline-ppg')
            .html(`<strong>PPG:</strong> ${team.PPG}`);

        // Add trophies if any
        if (hasTrophies) {
            const trophySection = card.append('div')
                .attr('class', 'timeline-trophies');

            trophySection.append('img')
                .attr('src', team.TrophyImage)
                .attr('alt', 'Trophy')
                .attr('class', 'timeline-trophy-icon');

            trophySection.append('div')
                .attr('class', 'timeline-trophy-text')
                .text(team.Trophies);
        } else {
            card.append('div')
                .attr('class', 'timeline-no-trophies')
                .text('No major trophies');
        }
    });
}
