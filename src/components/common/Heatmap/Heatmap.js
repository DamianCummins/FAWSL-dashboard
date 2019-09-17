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
            scale: window.innerWidth <= 760 ? 3.5 : 5
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
        this.setState({scale: window.innerWidth <= 760 ? 3.5 : 5});
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

    renderScatterChart = (data, heatSectors, scale) => (
        <ScatterChart
            width={120*scale}
            height={80*scale}
            margin={{
            top: 20, right: 20, bottom: 20, left: 20,
            }}
        >
            <ReferenceDot x={12} y={40} r={10*scale} stroke="black"/>
            <ReferenceDot x={60} y={40} r={10*scale} stroke="black"/>
            <ReferenceDot x={108} y={40} r={10*scale} stroke="black"/>
            <ReferenceArea x1={0} x2={18} y1={18} y2={80-18} fill="white" fillOpacity={1} stroke="black"/>
            <ReferenceArea x1={102} x2={120} y1={18} y2={80-18} fill="white" fillOpacity={1} stroke="black"/>
            <ReferenceArea x1={0} x2={6} y1={30} y2={80-30} fill="white" fillOpacity={1} stroke="black"/>
            <ReferenceArea x1={114} x2={120} y1={30} y2={80-30} fill="white" fillOpacity={1} stroke="black"/>
            {
                heatSectors.map((sector, index) => (
                    <ReferenceArea 
                        key={index}
                        x1={sector.x1}
                        x2={sector.x2}
                        y1={sector.y1}
                        y2={sector.y2} 
                        fill="green"
                        fillOpacity={(sector.count / 100) * 2}
                        stroke="white"
                        strokeOpacity={0}
                    />
                ))
            }
            <ReferenceDot x={60} y={40} r={0.5*scale} fill="black" stroke="black"/>
            <ReferenceDot x={12} y={40} r={0.5*scale} fill="black" stroke="black"/>
            <ReferenceDot x={108} y={40} r={0.5*scale} fill="black" stroke="black"/>
            <CartesianGrid />
            <ReferenceLine x={60} stroke="black"/>
            <ReferenceArea x1={0} x2={0.1} y1={36} y2={80-36} fill="black" fillOpacity={1} stroke="black"/>
            <ReferenceArea x1={119.9} x2={120} y1={36} y2={80-36} fill="black" fillOpacity={1} stroke="black"/>
            <XAxis type="number" dataKey="x" hide domain={[0,120]}/>
            <YAxis type="number" dataKey="y" hide domain={[0,80]}/>
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Heatmap" data={data} fill="#777777" />
        </ScatterChart>
    );

    render() {
        const { locations, heatSectors, scale } = this.state;
        return (
            <div className="heatmap" style={{width: 120 * scale}}>
                <h4>{this.props.playerName} ({this.props.playerPosition})</h4>
                {this.renderScatterChart(locations, heatSectors, scale)}
            </div>
        );
    }
}