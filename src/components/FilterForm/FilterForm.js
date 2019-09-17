import React from "react";
import { ComboBox, MultiSelect } from "carbon-components-react";
import "./FilterForm.scss";

export default class FilterForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            match: null,
            players: []
        }

        this.setMatch = this.setMatch.bind(this);
    }

    setMatch = (match) => {
        this.props.setMatch(match.selectedItem)
        this.setState({
            match: match.selectedItem
        });
    }

    setPlayers = (players) => {
        this.props.setPlayers(players.selectedItems)
        this.setState({
            players: players.selectedItem
        });
    }

    render() {
        return (
            <div className="filterForm">
                <ComboBox
                    id="MatchSelector"
                    title="Match:"
                    titleText="Match"
                    helperText="Select a match"
                    light
                    items={this.props.matches}
                    itemToString={item => (item ? `${item.home_team.home_team_name} (${item.home_score}) vs ${item.away_team.away_team_name} (${item.away_score})` : "")}
                    onChange={this.setMatch}
                />
                <MultiSelect.Filterable
                    id="PlayerSelector"
                    title="Players"
                    titleText="Players:"
                    helperText="Select players to compare"
                    light
                    disabled={(!this.state.match && !this.props.players) || this.props.players.length === 0}
                    items={this.props.players}
                    itemToString={item => (item && item.player ? item.player.name : "")}
                    onChange={this.setPlayers}
                />
            </div>
        );
    }
}