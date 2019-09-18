import React from "react";
import { 
    ReferenceDot, 
    ReferenceLine, 
    ReferenceArea, 
    ScatterChart, 
    Scatter, 
    CartesianGrid, 
    Tooltip, 
    XAxis, 
    YAxis
} from "recharts";
import "./Heatmap.scss";

export default class Heatmap extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            locations: [],
            heatSectors: [],
            playerName: this.props.playerName,
            vertical: window.innerWidth <= 500,
            scale: window.innerWidth <= 500 ? 4.5 : 5
        };

        this.renderScatterChart = this.renderScatterChart.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        const locations = this.getPositionalData(this.props.data, this.props.playerName);
        const heatSectors = this.getHeatmapSectors(locations, 4, 4);
        this.setState({
            locations,
            heatSectors
        });
    }

    resize() {
        this.setState({
            vertical: window.innerWidth <= 500,
            scale: window.innerWidth <= 500 ? 4.5 : 5
        });
    }

    getPositionalData = (events, playerName) => {
        const locations = events.filter(evt => {
            return evt.location && evt.player && evt.player.name === playerName;
        }).map(evt => {
            return {
                x: evt.location[0],
                y: evt.location[1]
            }
        });
        return locations;
    }

    getHeatmapSectors = (locations, noOfColumns, noOfRows) => {
        const sectorWidth = 120 / noOfColumns;
        const sectorHeight = 80 / noOfRows;
    
        let sectors = []
        let sector = 0;
        let xCount = 0;
        while (xCount < 120) {
            let yCount = 0;
            while(yCount < 80) {
                sectors[sector] ={
                    count: 0,
                    x1: xCount,
                    x2: xCount + sectorWidth,
                    y1: yCount,
                    y2: yCount + sectorHeight
                };
                for(let loc of locations) {
                    if((loc.x > xCount && loc.x < (xCount + sectorWidth)) &&
                        (loc.y > yCount && loc.y <= (yCount + sectorHeight))) {
                        sectors[sector].count++;
                    }
                };
                yCount += sectorHeight;
                sector++;
            }
            xCount += sectorWidth;
            sector++;
        }
        return sectors;
    }

    /* 
        This function will create a horizontal scatter chart of size 120 * 80 scaled by the `scale` parameter.
        The location data passed to the function range from x:0 - 120, and y:0 - 80.
    */
    renderScatterChart = (data, heatSectors, scale) => (
        <div className="pitch">
            <ScatterChart
                width={120*scale}
                height={80*scale}
                margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                }}
            >
                {/* 
                    The following Reference components are used to draw the football pitch
                */}
                <ReferenceDot x={12} y={40} r={10*scale} stroke="black" fillOpacity={0}/> {/* Left Penalty Arc */}
                <ReferenceDot x={60} y={40} r={10*scale} stroke="black" fillOpacity={0}/> {/* Center Circle */}
                <ReferenceDot x={108} y={40} r={10*scale} stroke="black" fillOpacity={0}/> {/* Right Penalty Arc */}
                <ReferenceArea x1={0} x2={18} y1={18} y2={80-18} fill="white" fillOpacity={1} stroke="black" /> {/* Left Penalty Area */}
                <ReferenceArea x1={102} x2={120} y1={18} y2={80-18} fill="white" fillOpacity={1} stroke="black" /> {/* Right Penalty Area */}
                <ReferenceArea x1={0} x2={6} y1={30} y2={80-30} fill="white" fillOpacity={1} stroke="black" /> {/* Left 6-yard Box */}
                <ReferenceArea x1={114} x2={120} y1={30} y2={80-30} fill="white" fillOpacity={1} stroke="black" /> {/* Right 6-yard box */}
                <ReferenceDot x={60} y={40} r={0.5*scale} fill="black" stroke="black"/> {/* Centre Spot */}
                <ReferenceDot x={12} y={40} r={0.5*scale} fill="black" stroke="black"/> {/* Left Penalty Spot */}
                <ReferenceDot x={108} y={40} r={0.5*scale} fill="black" stroke="black"/> {/* Right Penalty Spot */}
                {
                    /* 
                        Map the various heat sectors as ReferenceAreas onto the pitch,
                        using `sector.count` to determine opacity
                    */
                    heatSectors.map((sector, index) => (
                        <ReferenceArea 
                            key={index}
                            x1={sector.x1}
                            x2={sector.x2}
                            y1={sector.y1}
                            y2={sector.y2} 
                            fill="green"
                            fillOpacity={(sector.count / 100) * 1.3}
                            stroke="white"
                            strokeOpacity={0}
                        />
                    ))
                }
                <CartesianGrid />
                <ReferenceLine x={60} stroke="black"/> {/* Center Half */}
                <ReferenceArea x1={0} x2={0.1} y1={36} y2={80-36} fill="black" fillOpacity={1} stroke="black"/> {/* Left Goal line */}
                <ReferenceArea x1={119.9} x2={120} y1={36} y2={80-36} fill="black" fillOpacity={1} stroke="black"/> {/* Right Goal line */}
                <ReferenceArea x1={0} x2={120} y1={0} y2={80} fillOpacity={0} stroke="black" /> {/* Pitch Outline */}
                <XAxis type="number" dataKey="x" hide domain={[0,120]}/>
                <YAxis type="number" dataKey="y" hide domain={[0,80]}/>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Heatmap" data={data} fill="#777777"/>
            </ScatterChart>
        </div>
    );

    /* 
        This function will create a vertial scatter chart of size 80 * 120 scaled by the `scale` parameter.
        The location data passed to the function range from x:0 - 120, and y:0 - 80 so the data key for XAxis is y,
        and the data key for YAxis is x.
    */
    renderVerticalScatterChart = (data, heatSectors, scale) => (
        <div className="pitch">
            <ScatterChart
                width={80*scale}
                height={120*scale}
                margin={{
                top: 20, right: 20, bottom: 20, left: 20,
                }}
            >
                {/* 
                    The following Reference components are used to draw the football pitch
                */}
                <ReferenceDot y={12} x={40} r={10*scale} stroke="black"/> {/* Bottom Penalty Arc */}
                <ReferenceDot y={60} x={40} r={10*scale} stroke="black"/> {/* Center Circle */}
                <ReferenceDot y={108} x={40} r={10*scale} stroke="black"/> {/* Top Penalty Arc */}
                <ReferenceArea y1={0} y2={18} x1={18} x2={80-18} fill="white" fillOpacity={1} stroke="black"/> {/* Bottom Penalty Area */}
                <ReferenceArea y1={102} y2={120} x1={18} x2={80-18} fill="white" fillOpacity={1} stroke="black"/> {/* Top Penalty Area */}
                <ReferenceArea y1={0} y2={6} x1={30} x2={80-30} fill="white" fillOpacity={1} stroke="black"/> {/* Bottom 6-yard Box */}
                <ReferenceArea y1={114} y2={120} x1={30} x2={80-30} fill="white" fillOpacity={1} stroke="black"/> {/* Top 6-yard Box */}
                <ReferenceDot y={60} x={40} r={0.5*scale} fill="black" stroke="black"/> {/* Centre Spot */}
                <ReferenceDot y={12} x={40} r={0.5*scale} fill="black" stroke="black"/> {/* Bottom Penalty Spot */}
                <ReferenceDot y={108} x={40} r={0.5*scale} fill="black" stroke="black"/> {/* Top Penalty Spot */}
                {
                    /* 
                        Map the various heat sectors as ReferenceAreas onto the pitch,
                        using `sector.count` to determine opacity
                    */
                    heatSectors.map((sector, index) => (
                        <ReferenceArea 
                            key={index}
                            y1={sector.x1}
                            y2={sector.x2}
                            x1={sector.y1}
                            x2={sector.y2} 
                            fill="green"
                            fillOpacity={(sector.count / 100) * 1.3}
                            stroke="white"
                            strokeOpacity={0}
                        />
                    ))
                }
                <CartesianGrid />
                <ReferenceLine y={60} stroke="black"/> {/* Center Half */}
                <ReferenceArea y1={0} y2={0.1} x1={36} x2={80-36} fill="black" fillOpacity={1} stroke="black"/> {/* Bottom Goal line */}
                <ReferenceArea y1={119.9} y2={120} x1={36} x2={80-36} fill="black" fillOpacity={1} stroke="black"/> {/* Top Goal line */}
                <ReferenceArea x1={0} x2={80} y1={0} y2={120} fillOpacity={0} stroke="black" /> {/* Pitch Outline */}
                <XAxis type="number" dataKey="y" hide domain={[0,80]}/>
                <YAxis type="number" dataKey="x" hide domain={[0,120]}/>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Heatmap" data={data} fill="#777777"/>
            </ScatterChart>
        </div>
    );

    render() {
        const { locations, heatSectors, scale } = this.state;
        return (
            <div className="heatmap">
                <h6>{this.props.playerName} ({this.props.playerPosition})</h6>
                { this.state.vertical ?
                    this.renderVerticalScatterChart(locations, heatSectors, scale)
                    : this.renderScatterChart(locations, heatSectors, scale)
                }
            </div>
        );
    }
}