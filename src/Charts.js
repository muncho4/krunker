import React from 'react';
import weapons from './weapons.js'
import icons from './img/icons.js'
import createGraph from './createGraph.js'
import f from './reusedFuncs.js'

class Charts extends React.Component {
    constructor() {
        super()
        this.state = {
            currentWep: null,
            hovering: false,
            hoverText: null
        }

        this.selectWeapon = this.selectWeapon.bind(this)
        this.inputChange = this.inputChange.bind(this)
        this.iconEnter = this.iconEnter.bind(this);
        this.iconLeave = this.iconLeave.bind(this);

        this.hoverHelp = React.createRef()
    }

    inputChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    selectWeapon(weapon) {
        this.setState({currentWep: weapon})
    }

    displayWeaponRow(shortWepName, wepObj, key, singleWep) {
        let weapon = shortWepName
        let wep = wepObj
        let keyNum = key
        let fireModeIcon;
        if (wep.fireMode==="Auto") fireModeIcon = icons.fireModeAuto
        else if (wep.fireMode==="Burst") fireModeIcon = icons.fireModeBurst
        else if (wep.fireMode==="Single") fireModeIcon = icons.fireModeSingle
        let velocity = "Hitscan"
        if (wep.velocity) velocity = "~" + wep.velocity + " units/s"
        let background = null
        if (singleWep) background = "rgb(160,160,160)"
        
        return (
            <div className="weapon-row" key={keyNum} onClick={() => {this.selectWeapon(weapon)}} style={{backgroundColor: background}}>
                <div className="weapon-pic-box">
                    <div>
                        <label className="wep-name"><strong>{wep.name}</strong></label>
                    </div>
                    <img className="wep-img" src={wep.pictureURL} alt={`${wep.name} img`}/>
                    <div>
                        <div 
                            className="icon-row" id={`mag-size-${keyNum}`}
                            onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                        >
                            <img className="icon no-mouse" src={icons.magSize} alt="mag size"/>
                            <label className="no-mouse">{wep.magSize}</label>
                        </div>
                        <div 
                            className="icon-row" id={`time-between-shots-${keyNum}`}
                            onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                        >
                            <img className="icon no-mouse" src={icons.timeBetweenShots} alt="time between shots"/>
                            <label className="no-mouse">{wep.timeBetweenShots}ms</label>
                        </div>
                        <div 
                            className="icon-row" id={`reload-time-${keyNum}`}
                            onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                        >
                            <img className="icon no-mouse" src={icons.reloadTime} alt="reload time"/>
                            <label className="no-mouse">{wep.reloadTime}ms</label>
                        </div>
                    </div>
                </div>
                <div className="dmg-graph-box">
                    <label><strong>Damage</strong></label>
                    <div className="dmg-box">
                        {this.createDamageGraph(wep)}
                    </div>
                </div>
                <div className="ttk-graph-box">
                    <label className="ttk-small"><strong>Time to Kill (ms)</strong></label>
                    <div>
                        {this.createSmallTTKGraph(wep)}
                    </div>
                </div>
                <div className="spread-box">
                    <label><strong>Hipfire Spread: </strong>{wep.spread}</label>
                    <svg viewBox="0 0 310 310" className="spread-circ">
                        <circle
                            cx="155" cy="155" strokeWidth="2"
                            stroke="red" fill="none" r={wep.spread/2}>
                        </circle>
                    </svg>
                </div>
                <div className="icon-col col-0">
                    <div 
                        className="icon-row" id={`swap-time-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.swapTime} alt="swap time"/>
                        <label className="no-mouse">{wep.swapTime}ms</label>
                    </div>
                    <div 
                        className="icon-row" id={`zoom-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.zoom} alt="zoom"/>
                        <label className="no-mouse">{wep.zoom}x</label>
                    </div>
                    <div 
                        className="icon-row" id={`aim-speed-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.aimSpeed} alt="aim speed"/>
                        <label className="no-mouse">{wep.aimSpeed}ms</label>
                    </div>
                </div>
                <div className="icon-col col-1">
                    <div 
                        className="icon-row" id={`headshot-multiplier-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.headshotMult} alt="headshot multiplier"/>
                        <label className="no-mouse">{wep.headshotMult}x</label>
                    </div>
                    <div 
                        className="icon-row" id={`wallbang-multiplier-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.wallbangMult} alt="wallbang multiplier"/>
                        <label className="no-mouse">{1 - (0.5 * wep.pierce)}x</label>
                    </div>
                    <div 
                        className="icon-row" id={`speed-multiplier-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.speedMultiplier} alt="speed multiplier"/>
                        <label className="no-mouse">{wep.speedMultiplier}x</label>
                    </div>
                </div>
                <div className="icon-col col-2">
                    <div 
                        className="icon-row" id={`bullet-velocity-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.velocity} alt="bullet velocity"/>
                        <label className="no-mouse">{velocity}</label>
                    </div>
                    <div 
                        className="icon-row" id={`fire-mode-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={fireModeIcon} alt="fire mode"/>
                        <label className="no-mouse">{wep.fireMode}</label>
                    </div>
                    <div 
                        className="icon-row spread-icon" id={`hipfire-spread-${keyNum}`}
                        onMouseOver={this.iconEnter} onMouseOut={this.iconLeave}
                    >
                        <img className="icon no-mouse" src={icons.spread} alt="spread"/>
                        <label className="no-mouse">{wep.spread}</label>
                    </div>
                </div>
            </div>
        )
    }

    displayWeaponCharts() {
        let weaponRows = []
        let keyNum = 0
        for (let weapon in weapons) {
            let wep = weapons[weapon]
            weaponRows.push(
                this.displayWeaponRow(weapon, wep, keyNum)
            )
            keyNum++
        }

        return (
            <div id="weapon-rows">
                {weaponRows}
            </div>
        )
    }

    iconEnter(e) {
        if (!e.nativeEvent.pageX || !e.nativeEvent.pageY) return
        let title = e.target.id
        title = title[0].toUpperCase() + title.slice(1, title.length)
        let sliceIndex = 0
        for (let i=0; i<title.length; i++) if (title[i]==="-") {
            title = f.stringSplice(title, i, 1, " ")
            title = f.stringSplice(title, i+1, 1, title[i+1].toUpperCase())
            sliceIndex = i
        }
        this.setState({hoverText: title.slice(0, sliceIndex), hovering: {x: e.nativeEvent.pageX, y: e.nativeEvent.pageY}})
    }

    iconLeave() {
        this.setState({hovering: false, hoverText: null})
    }

    displayHoverHelp(helpTextObj, text) {
        if (!helpTextObj) return;
        let offsetY = 0
        let offsetX = 0
        if (this.hoverHelp.current) {
            offsetX = this.hoverHelp.current.clientWidth / 2
            offsetY = this.hoverHelp.current.clientHeight + 2
        }
        return (
            <div
                id="hover-help" ref={this.hoverHelp} className="no-mouse" onTouchStart={this.iconLeave}
                style={{"top": Math.max(0, helpTextObj.y - offsetY), "left": Math.max(0, helpTextObj.x - offsetX)}}
            >
                <label><strong>{text}</strong></label>
            </div>
        )
    }

    displayWeaponInfo(wepString) {
        let info = []
        let wep = weapons[wepString]

        for (let property in wep) {
            if (property==="pictureURL") continue;
            let propInfo = f.supplementProps[property]
            let units = propInfo.units || " "
            let value;
            if (!propInfo.value) value = wep[property]
            else value = propInfo.value(wep)
            if (wep.burst && property==="timeBetweenShots") units = units + ` (${wep.burst}ms burst)`
            else if (wep.pellets && property==="damage") units = units + ` (x${wep.pellets})`
            info.push(<p key={info.length}><strong>{propInfo.title || property}: </strong>{value + units}</p>)
            if (propInfo.moreProps) {
                for (let addProp of propInfo.moreProps) {
                    let units = addProp.units || " "
                    let value = addProp.value(wep)
                    info.push(<p key={info.length}><strong>{addProp.title}: </strong>{value + units}</p>)
                }
            }
        }

        return (
            <div id="weapon-rows">
                <div id="charts-back" onClick={() => {this.selectWeapon(null)}}>
                    <label><strong>Back</strong></label>
                </div>
                {this.displayWeaponRow(this.state.currentWep, wep, "0", true)}
                <div id="info-box">
                    <div>
                        {info}
                    </div>
                    <div id="graphs-column">
                        {f.createLargeDMGGraph([{id: 0, wep: wep, finalMult: 1}])}
                        {f.createLargeTTKGraph([{id: 2, wep: wep, hitArea: 1, wallbang: 1, hp: 100, shotsType: "uniform"}])}
                    </div>
                </div>
            </div>
        )
    }

    createDamageGraph(wep) {
        let damageData = f.genDamageData(wep, 1)

        let yBounds = f.setYBounds(
            damageData[1][damageData[1].length - 1],
            damageData[1][0],
            10,
            1
        )

        let dmgGraphOptions = {
            title: false,
            fontFamily: "Arial",
            decimals: 2,
            legend: false,
            xInc: 4,
            xMin: 0,
            xMax: 600,
            xLineIncs: 4,
            xStart: 100,
            xEnd: 860,
            yMin: yBounds[0],
            yInc: 2,
            yMax: yBounds[1],
            yLineIncs: 4,
            lineIncWidth: 3,
            outerBorder: false,
            labelFontSize: "48px",
            graphClass: "small-graph",
            svgWidth: 900,
            data: [
                {
                    color: "red",
                    lineWidth: 8,
                    shapeSize: 0,
                    shape: "circle",
                    x: damageData[0],
                    y: damageData[1]
                }
            ]
        }

        return createGraph(dmgGraphOptions)
    }

    createSmallTTKGraph(wep) {
        let data = []
        let yBounds = [0, 100]
        let squareSize = 8
        let ttkData = f.genAlgTTKData(wep, 1, 100)
        if (ttkData) {
            yBounds = f.setYBounds(
                ttkData[1][0],
                ttkData[1][ttkData[1].length - 1],
                100,
                100
            )
            squareSize = 8
            if (wep.velocity) squareSize = 0
            data = [{
                color: "green",
                lineWidth: 8,
                shapeSize: squareSize,
                shape: "square",
                x: ttkData[0],
                y: ttkData[1]
            }]
        }

        let ttkGraphOptions = {
            title: false,
            fontFamily: "Arial",
            decimals: 2,
            legend: false,
            xTitle: false,
            xInc: 4,
            xMin: 0,
            xMax: 600,
            xLineIncs: 4,
            xStart: 112,
            xEnd: 860,
            yTitle: false,
            yMin: yBounds[0],
            yInc: 2,
            yMax: yBounds[1],
            yLineIncs: 4,
            lineIncWidth: 3,
            outerBorder: false,
            labelFontSize: "48px",
            graphClass: "small-graph ttk-small",
            svgWidth: 900,
            data: data
        }

        return createGraph(ttkGraphOptions)
    }

    render() {
        if (!this.state.currentWep) {
            return (
                <div>
                    {this.displayWeaponCharts()}
                    {this.displayHoverHelp(this.state.hovering, this.state.hoverText)}
                </div>
            )
        } else {
            return (
                <div>
                    {this.displayWeaponInfo(this.state.currentWep)}
                    {this.displayHoverHelp(this.state.hovering, this.state.hoverText)}
                </div>
            )
        }
    }
}

export default Charts;