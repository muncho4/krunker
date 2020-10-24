import React from 'react';
import f from './reusedFuncs';
import weapons from './weapons.js'
import createGraph from './createGraph.js'

class Comparison extends React.Component {
    constructor() {
        super()
        this.state = {
            currentWeps: ["", "", ""],
            enemiesHP: "100",
            storedUnivEnemiesHP: "100",
            shotsType: "uniform",
            hitAreas: "Body",
            storedUnivHitAreas: "Body",
            storedWepHitAreas: ["Body", "Body", "Body"],
            wallbangs: "No",
            storedUnivWallbangs: "No",
            storedWepWallbangs: ["No", "No", "No"],
            innerShotsTypes: ["uniform", "uniform", "uniform"],
            configuringShots: false
        }

        this.inputChange = this.inputChange.bind(this);
        this.stateSwitch = this.stateSwitch.bind(this);
        this.shotsTypeChange = this.shotsTypeChange.bind(this)
        this.oneIndexInputChange = this.oneIndexInputChange.bind(this)
        this.innerShotsTypeChange = this.innerShotsTypeChange.bind(this);
        this.blobChange = this.blobChange.bind(this);
        this.updateShotsArrays = this.updateShotsArrays.bind(this)
    }

    inputChange(e) {
        let storedName = "storedUniv" + e.target.name[0].toUpperCase() + e.target.name.slice(1)
        this.setState({[e.target.name]: e.target.value, [storedName]: e.target.value})
    }

    stateSwitch(e) {
        this.setState({[e.target.name]: !this.state[e.target.name]})
    }

    shotsTypeChange(e) {
        this.setState({[e.target.name]: e.target.value})
        if (e.target.value==="per-weapon") {
            let hitAreasArray = Array(3)
            let wallbangsArray = Array(3)
            let HPArray = Array(3)
            hitAreasArray.fill(this.state.hitAreas)
            wallbangsArray.fill(this.state.wallbangs)
            HPArray.fill(this.state.enemiesHP)
            this.setState({hitAreas: hitAreasArray, wallbangs: wallbangsArray, enemiesHP: HPArray})
        } else if (e.target.value==="uniform") {
            this.setState({
                hitAreas: this.state.storedUnivHitAreas,
                wallbangs: this.state.storedUnivWallbangs,
                enemiesHP: this.state.storedUnivEnemiesHP
            })
        }
    }

    oneIndexInputChange(e) {
        let index = Number(e.target.name.slice(-1))
        let property = e.target.name.slice(0, e.target.name.length - 2)
        let propArray = this.state[property]
        propArray[index] = e.target.value
        let storedName = "storedWep" + property[0].toUpperCase() + property.slice(1)
        let storedPropArray = this.state[property]
        storedPropArray[index] = e.target.value
        this.setState({[property]: propArray, [storedName]: storedPropArray})
        if (
            (property==="currentWeps" || property==="enemiesHP") &&
            this.state.innerShotsTypes[index]==="individual"
        ) {
            let wep = weapons[this.state.currentWeps[index]]
            let hp = this.state.enemiesHP[index]
            let allHitAreas = this.state.hitAreas
            let allWallbangs = this.state.wallbangs
            this.updateShotsArrays(wep, hp, allHitAreas, allWallbangs, index, property)
        }
    }

    innerShotsTypeChange(e) {
        let index = Number(e.target.name.slice(-1))
        let typesArray = this.state.innerShotsTypes
        typesArray[index] = e.target.value
        this.setState({innerShotsTypes: typesArray})

        let allHitAreas = this.state.hitAreas.slice(0)
        let allWallbangs = this.state.wallbangs.slice(0)
        if (e.target.value==="individual") {
            let maxBTK = 0
            let hitAreaMult = 1
            let wallbangMult = 1
            if (this.state.currentWeps[index]!=="") {
                let wep = weapons[this.state.currentWeps[index]]
    
                switch (this.state.hitAreas[index]) {
                    case "Head": hitAreaMult = wep.headshotMult; break;
                    case "Limb": hitAreaMult = wep.limbMult || 0.5; break;
                    default: hitAreaMult = 1;
                }
                switch (this.state.wallbangs[index]) {
                    case "Yes": wallbangMult = 1 - (0.5 * wep.pierce) || 1; break;
                    default: wallbangMult = 1;
                }
                let lowestDamage = f.distanceToDamage(600, wep)
                if (lowestDamage > 0) {
                    maxBTK = Math.ceil(
                        this.state.enemiesHP[index] / (hitAreaMult * wallbangMult * lowestDamage)
                    ) //mult!==0
                } else {
                    maxBTK = Math.ceil(5000/wep.timeBetweenShots) + 1
                }
            }

            let hitAreasArray = Array(maxBTK)
            let wallbangsArray = Array(maxBTK)

            hitAreasArray.fill(hitAreaMult)
            wallbangsArray.fill(wallbangMult)
            allHitAreas[index] = hitAreasArray
            allWallbangs[index] = wallbangsArray
            this.setState({hitAreas: allHitAreas, wallbangs: allWallbangs})
        } else if (e.target.value==="uniform") {
            allHitAreas[index] = this.state.storedWepHitAreas[index]
            allWallbangs[index] = this.state.storedWepWallbangs[index]
            this.setState({hitAreas: allHitAreas, wallbangs: allWallbangs})
        }
    }

    blobChange(e) {
        let shotsType = "wallbangs"
        if (e.target.name.startsWith("hitAreas")) shotsType = "hitAreas"
        let lng = shotsType.length
        let macroIndex = Number(e.target.name.slice(lng + 1, lng + 2))
        let microIndex = Number(e.target.name.slice(lng + 3, e.target.name.length))
        let fullShotsArray = this.state[shotsType]
        let shotsArray = fullShotsArray[macroIndex]
        shotsArray[microIndex] = e.target.value
        fullShotsArray[macroIndex] = shotsArray
        this.setState({ [shotsType]: fullShotsArray })

        let currentWep = this.state.currentWeps[macroIndex]
        let hp = this.state.enemiesHP[macroIndex]
        let allHitAreas = this.state.hitAreas
        let allWallbangs = this.state.wallbangs
        this.updateShotsArrays(weapons[currentWep], hp, allHitAreas, allWallbangs, macroIndex)
    }

    updateShotsArrays(wep, hp, allHitAreas, allWallbangs, index, prop) {
        let multsInput = []
        let hitAreaMults = allHitAreas[index]
        let wallbangMults = allWallbangs[index]
        if (prop==="currentWeps") {
            let lowestDamage = f.distanceToDamage(600, wep)
            let maxBTK = 0
            if (lowestDamage > 0) maxBTK = Math.ceil(hp / lowestDamage)
            else maxBTK = Math.ceil(5000/wep.timeBetweenShots) + 1
            hitAreaMults = Array(maxBTK)
            wallbangMults = Array(maxBTK)
            hitAreaMults.fill(1)
            wallbangMults.fill(1)
            allHitAreas[index] = hitAreaMults
            allWallbangs[index] = wallbangMults
            this.setState({hitAreas: allHitAreas, wallbangs: allWallbangs})
            return
        }
        for (let i=0; i<hitAreaMults.length; i++) multsInput[i] = Number(wallbangMults[i]) * Number(hitAreaMults[i])
        let dmgInput = f.distanceToDamage(600, wep)
        let newBTK = 0
        if (dmgInput > 0) newBTK = f.shotsToBTK(multsInput, 1, dmgInput, hp)
        else newBTK = Math.ceil(5000/wep.timeBetweenShots) + 1
        if (newBTK > hitAreaMults.length) {
            for (let i=hitAreaMults.length; i<newBTK; i++) {
                hitAreaMults[i] = 1
                wallbangMults[i] = 1
            }
            allHitAreas[index] = hitAreaMults
            allWallbangs[index] = wallbangMults
            this.setState({hitAreas: allHitAreas, wallbangs: allWallbangs})
        } else if (newBTK < hitAreaMults.length) {
            hitAreaMults.length = newBTK
            wallbangMults.length = newBTK
            allHitAreas[index] = hitAreaMults
            allWallbangs[index] = wallbangMults
            this.setState({hitAreas: allHitAreas, wallbangs: allWallbangs})
        }
    } 

    displayWepSelectors(currentWeps, shotsType) {
        let wepOptions = []
        let keyNum = 0
        for (let wep in weapons) {
            wepOptions.push(
                <option value={wep} key={keyNum}>{weapons[wep].name}</option>
            )
            keyNum++
        }

        let perWeaponSelects = []
        if (shotsType==="per-weapon") {
            for (let i=0; i<3; i++) {
                let shotsSelectDisabled = false
                let configureShotsButton = null
                if (this.state.innerShotsTypes[i]==="individual") {
                    shotsSelectDisabled = true
                    configureShotsButton = [
                        <div className="center" key="0">
                            <button name="configuringShots" value={i} onClick={this.inputChange}>Configure Shots</button>
                        </div>
                    ]
                }
                perWeaponSelects.push(
                    <div key={i}>
                        <div className="select-box">
                            <label>Enemy HP</label>
                            <select
                                name={`enemiesHP-${i}`} onChange={this.oneIndexInputChange}
                                defaultValue={this.state.storedUnivEnemiesHP}
                            >
                                <option value="100">Standard (100hp)</option>
                                <option value="60">Hunter (60hp)</option>
                                <option value="90">Marksman, Vince, Bowman (90hp)</option>
                                <option value="120">Runner (120hp)</option>
                                <option value="130">Rocketeer (130hp)</option>
                                <option value="170">Spray N Pray (170hp)</option> 
                            </select>
                        </div>
                        <div className="select-box">
                            <label>Hit Area</label>
                            <select 
                                name={`hitAreas-${i}`} onChange={this.oneIndexInputChange}
                                disabled={shotsSelectDisabled} defaultValue={this.state.storedUnivHitAreas}
                            >
                                <option value="Body">Body</option>
                                <option value="Head">Head</option>
                                <option value="Limb">Limb</option>
                            </select>
                        </div>
                        <div className="select-box">
                            <label>Wallbang</label>
                            <select 
                                name={`wallbangs-${i}`} onChange={this.oneIndexInputChange}
                                disabled={shotsSelectDisabled} defaultValue={this.state.storedUnivWallbangs}
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                        <div className="select-box">
                            <label>Shots Type</label>
                            <select name={`shotsType-${i}`} onChange={this.innerShotsTypeChange}>
                                <option value="uniform">Uniform per Weapon</option>
                                <option value="individual">Individual</option>
                            </select>
                        </div>
                        {configureShotsButton}
                    </div>
                )
            }
        }

        let wepSelectRows = []
        let weaponSelectors = []
        let disableUniformSelectors = false
        let numWeps = 2;
        if ((currentWeps[0]!=="" && currentWeps[1]!=="") || currentWeps[2]!=="") numWeps = 3
        if (shotsType==="uniform") {
            for (let i=0; i<numWeps; i++) {
                wepSelectRows.push(
                    <div className="select-box" key={i}>
                        <label>Weapon {i + 1}</label>
                        <select name={`currentWeps-${i}`} onChange={this.oneIndexInputChange} defaultValue={this.state.currentWeps[i]}>
                            <option value="">none</option>
                            {wepOptions}
                        </select>
                    </div>
                )
            }
            weaponSelectors = [
                <div className="column" key="0">
                    {wepSelectRows}
                </div>
            ]
        } else if (shotsType==="per-weapon") {
            disableUniformSelectors = true
            for (let i=0; i<numWeps; i++) {
                weaponSelectors.push(
                    <div className="column" key={i}>
                        <div className="select-box">
                            <label>Weapon {i + 1}</label>
                            <select name={`currentWeps-${i}`} onChange={this.oneIndexInputChange} defaultValue={this.state.currentWeps[i]}>
                                <option value="">none</option>
                                {wepOptions}
                            </select>
                        </div>
                        {perWeaponSelects[i]}
                    </div>
                )
            }
        }

        return (
            <div id="select-boxes" className="row">
                {weaponSelectors}
                <div className="column">
                    <div className="select-box">
                        <label>Shot types</label>
                        <select name="shotsType" onChange={this.shotsTypeChange}>
                            <option value="uniform">Uniform</option>
                            <option value="per-weapon">Per Weapon</option>
                        </select>
                    </div>
                    <div className="select-box">
                        <label>Enemy HP</label>
                        <select name="enemiesHP" onChange={this.inputChange} disabled={disableUniformSelectors}>
                            <option value="100">Standard (100hp)</option>
                            <option value="60">Hunter (60hp)</option>
                            <option value="90">Marksman, Vince, Bowman (90hp)</option>
                            <option value="120">Runner (120hp)</option>
                            <option value="130">Rocketeer (130hp)</option>
                            <option value="170">Spray N Pray (170hp)</option> 
                            {/* add custom */}
                        </select>
                    </div>
                    <div className="select-box">
                        <label>Hit Area</label>
                        <select name="hitAreas" onChange={this.inputChange} disabled={disableUniformSelectors}>
                            <option value="Body">Body</option>
                            <option value="Head">Head</option>
                            <option value="Limb">Limb</option>
                        </select>
                    </div>
                    <div className="select-box">
                        <label>Wallbang</label>
                        <select name="wallbangs" onChange={this.inputChange} disabled={disableUniformSelectors}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    displayTTKCompGraph(wepsArray, shotsType, hitAreas, wallbangs, enemiesHP, innerShotsTypes) {
        let inputObjs = []

        for (let i=0; i<3; i++) { //for each weapon
            let wepKey = wepsArray[i]
            if (wepKey==="") continue;
            let wep = weapons[wepKey]
            let finalHitArea;
            let hitAreaMult;
            let finalWallbang;
            let wallbangMult;
            let enemyHP;
            if (shotsType==="uniform") {
                finalHitArea = hitAreas
                finalWallbang = wallbangs
                enemyHP = Number(enemiesHP)
            } else if (shotsType==="per-weapon") {
                finalHitArea = hitAreas[i]
                finalWallbang = wallbangs[i]
                enemyHP = Number(enemiesHP[i])
            }
            switch (finalHitArea) {
                case "Head": hitAreaMult = wep.headshotMult; break;
                case "Limb": hitAreaMult = wep.limbMult || 0.5; break;
                default: hitAreaMult = 1;
            }
            switch (finalWallbang) {
                case "Yes": wallbangMult = 1 - (0.5 * wep.pierce); break;
                default: wallbangMult = 1;
            }

            inputObjs.push({
                id: i,
                wep: wep,
                hitArea: hitAreaMult,
                wallbang: wallbangMult,
                hitAreas: finalHitArea,
                wallbangs: finalWallbang,
                hp: enemyHP,
                shotsType: innerShotsTypes[i]
            })
        }
        return f.createLargeTTKGraph(inputObjs)
    }

    displayDMGCompGraph(wepsArray, shotsType, hitAreas, wallbangs) {
        let cleanWepsArray = []
        for (let string of wepsArray) if (string!=="") cleanWepsArray.push(string)
        let dmgData = []
        let dataSets = []
        let yBounds = [0, 100]
        let yMin;
        let yMax;
        for (let j=0; j<3; j++) { //for each weapon
            let wepKey = wepsArray[j]
            if (wepKey==="") continue;
            let i = dataSets.length
            let wep = weapons[wepKey]

            let finalHitArea;
            let hitAreaMult;
            let finalWallbang;
            let wallbangMult;
            if (shotsType==="uniform") {
                finalHitArea = hitAreas
                finalWallbang = wallbangs
            } else if (shotsType==="per-weapon") {
                finalHitArea = hitAreas[j]
                finalWallbang = wallbangs[j]
            }
            switch (finalHitArea) {
                case "Head": hitAreaMult = wep.headshotMult; break;
                case "Limb": hitAreaMult = wep.limbMult || 0.5; break;
                default: hitAreaMult = 1;
            }
            switch (finalWallbang) {
                case "Yes": wallbangMult = 1 - (0.5 * wep.pierce); break;
                default: wallbangMult = 1;
            }

            dmgData[i] = f.genDamageData(wep, hitAreaMult * wallbangMult)
            if (!yMin && !yMax) { 
                yMin = dmgData[i][1][dmgData[i][1].length - 1]
                yMax = dmgData[i][1][0]
            } else {
                if (dmgData[i][1][dmgData[i][1].length - 1] < yMin) {
                    yMin = dmgData[i][1][dmgData[i][1].length - 1]
                }
                if (dmgData[i][1][0] > yMax) yMax = dmgData[i][1][0] //oof
            }
            let lineColor;
            switch (j) {
                default: lineColor = "red"; break;
                case 1: lineColor = "blue"; break;
                case 2: lineColor = "green"; break;
            }
            dataSets.push(
                {
                    name: wep.shortName || wep.name, //smg long name 2 long
                    color: lineColor,
                    lineWidth: 3,
                    shapeSize: 0,
                    shape: "square",
                    x: dmgData[i][0],
                    y: dmgData[i][1]
                }
            )
        }
        if (dataSets.length > 0) yBounds = f.setYBounds(yMin, yMax, 10, 1)

        let graphOptions = {
            title: "Damage",
            fontFamily: "Arial",
            decimals: 2,
            legend: Math.abs(dataSets.length - 1) + dataSets.length - 1, //{length <= 1} => false, {length > 1} => true
            xTitle: "Distance (units)",
            xInc: 6,
            xMin: 0,
            xMax: 600,
            xLineIncs: 6,
            xStart: 77,
            yTitle: "Damage",
            yMin: yBounds[0],
            yInc: 5,
            yMax: yBounds[1],
            yLineIncs: 5,
            outerBorder: false,
            graphClass: "large-graph",
            data: dataSets
        }
        return createGraph(graphOptions)
    }

    displayWeaponInfo(wepsArray) {
        let cleanWepsArray = []
        for (let string of wepsArray) if (string!=="") cleanWepsArray.push(string)
        if (cleanWepsArray.length===0) return

        let rows = []

        for (let property in weapons["AR"]) {
            let propInfo = f.supplementProps[property]
            if (!propInfo.skip) {
                let columns = []
                columns.push(<th key={columns.length}>{propInfo.title}</th>)
                let valueTotal = 0;
                if (propInfo.prefer && cleanWepsArray.length > 1) {
                    for (let wepString of cleanWepsArray) {
                        let wep = weapons[wepString]
                        if (!propInfo.value && !propInfo.numValue) valueTotal += wep[property]
                        else if (!propInfo.numValue) valueTotal += propInfo.value(wep)
                        else valueTotal += propInfo.numValue(wep)
                    }
                }
                let avgValue = valueTotal / cleanWepsArray.length

                for (let i=0; i<3; i++) { //for each weapon
                    let wepString = wepsArray[i]
                    if (wepString==="") continue;
                    let wep = weapons[wepString]
                    let units = propInfo.units || " "
                    let value;
                    if (!propInfo.value) value = wep[property]
                    else value = propInfo.value(wep)
                    let numValue = value
                    if (typeof(value)==="string" && propInfo.prefer) numValue = propInfo.numValue(wep)
                    let color = null
                    if (propInfo.prefer && cleanWepsArray.length > 1) color = this.valueToColor(numValue, avgValue, propInfo.prefer)
                    if (wep.burst && property==="timeBetweenShots") units = units + ` (${wep.burst}ms burst)`
                    else if (wep.pellets && property==="damage") units = units + ` (x${wep.pellets})`
                    if (property!=="name") columns.push(<td style={{"backgroundColor": color}} key={columns.length}>{value + units}</td>)
                    else {
                        let color = "black"
                        switch (i) {
                            default: color = "red"; break;
                            case 1: color = "blue"; break;
                            case 2: color = "green"; break;
                        }
                        columns.push(<th key={columns.length} className="column-title" style={{color: color}}>{value}</th>)
                    }
                }
                rows.push(<tr key={rows.length}>{columns}</tr>)
            }
            if (propInfo.moreProps) {
                for (let addProp of propInfo.moreProps) {
                    let moreColumns = []
                    moreColumns.push(<th key={moreColumns.length}>{addProp.title}</th>)
                    let valueTotal = 0;
                    if (addProp.prefer && cleanWepsArray.length > 1) {
                        for (let wepString of cleanWepsArray) valueTotal += addProp.value(weapons[wepString])
                    }
                    let avgValue = valueTotal/cleanWepsArray.length
                    for (let wepString of cleanWepsArray) {
                        let units = addProp.units || " "
                        let value = addProp.value(weapons[wepString])
                        let color = null
                        if (addProp.prefer && cleanWepsArray.length > 1) color = this.valueToColor(value, avgValue, addProp.prefer)
                        moreColumns.push(<td style={{"backgroundColor": color}} key={moreColumns.length}>{value + units}</td>)
                    }
                    rows.push(<tr key={rows.length}>{moreColumns}</tr>)
                }
            }
        }

        return (
            <div id="wep-table">
                <table>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        )
    }

    displayShotsConfigure(value, currentWeps, hitAreas) { //value===false or string num
        if (!value) return
        let index = Number(value)
        let wep = weapons[currentWeps[index]]
        let maxBTK = hitAreas[index].length

        let blobs = []
        for (let i=0; i<maxBTK; i++) {
            blobs.push(
                <div key={i} className="shot-box">
                    <label><strong>Shot {i+1}</strong></label>
                    <div className="select-box">
                        <label>Hit Area</label>
                        <select name={`hitAreas-${index}-${i}`} onChange={this.blobChange} defaultValue={this.state.hitAreas[index][i]}>
                            <option value="1">Body</option>
                            <option value={wep.headshotMult}>Head</option>
                            <option value={wep.limbMult || 0.5}>Limb</option>
                            <option value="0">Miss</option>
                        </select>
                    </div>
                    <div className="select-box">
                        <label>Wallbang</label>
                        <select name={`wallbangs-${index}-${i}`} onChange={this.blobChange} defaultValue={this.state.wallbangs[index][i]}>
                            <option value="1">No</option>
                            <option value={1 - (0.5 * wep.pierce)}>Yes</option>
                        </select>
                    </div>
                </div>
            )
        }
        
        return (
            <div id="darkener">
                <div id="shots-container">
                    <div id="shots-config">
                        <div>
                            <button name="configuringShots" onClick={this.stateSwitch}>save {`&`} quit</button>
                        </div>
                        <div id="shot-boxes">
                            {blobs}
                        </div>
                        <div>
                            <button name="configuringShots" onClick={this.stateSwitch}>save {`&`} quit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    valueToColor(value, avg, pref) {
        let ratio = 0
        if (pref==="higher") ratio = (value - avg)/avg
        else ratio = (avg - value)/avg
    
        let red = 0
        let green = 0
        let blue = 0
        if (ratio < -1) red = 255
        else if (ratio < 0) { red = 255; green = (ratio + 1) * 255 }
        else if (ratio < (2/3)) { red = (1 - (ratio * 1.5)) * 255; green = 255 }
        else if (ratio < 1) green = 255 - ((ratio - (2/3)) * 3 * 128)
        else green = 127

        return `rgb(${red}, ${green}, ${blue})`
    }

    render() {
        return (
            <div id="comparison-box" className="column">
                {this.displayWepSelectors(this.state.currentWeps, this.state.shotsType)}
                <div id="comp-graphs">
                    {this.displayTTKCompGraph(
                        this.state.currentWeps,
                        this.state.shotsType,
                        this.state.hitAreas,
                        this.state.wallbangs,
                        this.state.enemiesHP,
                        this.state.innerShotsTypes
                    )}
                    {this.displayDMGCompGraph(
                        this.state.currentWeps,
                        this.state.shotsType,
                        this.state.hitAreas,
                        this.state.wallbangs
                    )}
                </div>
                {this.displayWeaponInfo(this.state.currentWeps)}
                {this.displayShotsConfigure(
                    this.state.configuringShots,
                    this.state.currentWeps,
                    this.state.hitAreas,
                    this.state.wallbangs
                )}
            </div>
        )
    }
}

export default Comparison;