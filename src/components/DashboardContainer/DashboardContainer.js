import React from "react";
import { Heatmap } from "../common";
import FilterForm from "../FilterForm";
import "./DashboardContainer.scss";
import matches from "../../data/4.json";

export default class DashboardContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            selectedPlayers: [],
            match: null,
            matchData: [],
            homeTeam: null,
            awayTeam: null
        };

        this.setMatch = this.setMatch.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
    }

    setMatch = (match) => {
        this.setState({
            match
        });
        if (match) {
            fetch(`https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${match.match_id}.json`)
                .then(response => response.json())
                .then(matchData => {
                    console.log(matchData.filter(event => event.tactics))
                    const homeTeam = matchData.filter(event => event.tactics).find(event => event.team.name === match.home_team.home_team_name);
                    const awayTeam = matchData.filter(event => event.tactics).find(event => event.team.name === match.away_team.away_team_name);
                    this.setState({
                        matchData,
                        homeTeam,
                        awayTeam,
                        players: [...homeTeam.tactics.lineup, ...awayTeam.tactics.lineup]
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    setPlayers = (selectedPlayers) => {
        this.setState({
            selectedPlayers: selectedPlayers
        });
    }

    render() {
        return (
            <div className="dashboardContainer">
                <h4 className="title">Competition: {matches && matches[0] && matches[0].competition ? matches[0].competition.competition_name : ""}</h4>
                <FilterForm
                    matches={matches}
                    setMatch={this.setMatch}
                    players={this.state.players}
                    setPlayers={this.setPlayers}
                />
                {this.state.match ? 
                    <div>
                        <h2>{this.state.match.home_team.home_team_name} ({this.state.match.home_score}) vs {this.state.match.away_team.away_team_name} ({this.state.match.away_score})</h2>
                        <h3>Date: {this.state.match.match_date}</h3>
                        <div className="chartGrid">
                            <div class="bx--grid">
                                <div class="bx--row">
                                {this.state.selectedPlayers ?
                                    this.state.selectedPlayers.map(player => (
                                        <div class="bx--col">
                                            <Heatmap 
                                                data={this.state.matchData}
                                                playerName={player.player.name}
                                                playerPosition={player.position.name}
                                            />
                                        </div>)) : <div /> 
                                }
                                </div>
                            </div>
                        </div>
                    </div> : <div/>
                }      
            </div>
        );
    }
}