import React from "react";
import { Heatmap } from "../common";
import "./DashboardContainer.css";
import matchData from  "../../data/19714.json";
import matchesData from "../../data/4.json";

export default class DashboardContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerNames: [
                "Bethany England",
                "Nikita Parris"
            ],
            match: matchesData.find(match => match.match_id === 19714)
        };
    }

    render() {
        return (
            <div>
                <h2>{this.state.match.home_team.home_team_name} ({this.state.match.home_score}) vs {this.state.match.away_team.away_team_name} ({this.state.match.away_score})</h2>
                <h3>Date: {this.state.match.match_date}</h3>
                <div className="chartGrid">
                    {this.state.playerNames ?
                        this.state.playerNames.map(playerName => <Heatmap 
                            data={matchData}
                            playerName={playerName}
                        />) : <div /> 
                    }
                </div>                
            </div>
        );
    }
}