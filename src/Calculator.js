import React from 'react';
import weapons from './weapons.js'
import f from './reusedFuncs.js'

class Calculator extends React.Component {
    constructor() {
        super()
        this.state = {
            numInput: "",
            currentCalc: "dist-to-dmg",
            currentWep: "AR",
            hitArea: "1",
            wallbang: "1",
            enemyHP: "100"
        }

        this.inputChange = this.inputChange.bind(this);
    }

    calculate(numInput, currentCalc, wep, hitArea, wallbang, hp) {
        if (numInput==="" || Number(numInput)<0) return "N/A"
        let num = Number(numInput)
        let mult = Number(hitArea) * Number(wallbang)
        let returnNum;

        if (currentCalc==="dist-to-dmg") returnNum = mult * f.distanceToDamage(num, wep)
        else if (currentCalc==="dmg-to-dist") returnNum = f.damageToDistance((1/mult) * num, wep)
        else if (currentCalc==="dist-to-ttk") {
            returnNum = f.calcTTK(mult * f.distanceToDamage(num, wep), wep, hp)
        }
        
        if (typeof(returnNum)==="number") return Math.round(returnNum*1000)/1000
        else return returnNum
    }

    inputChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    displaySelectors(currentCalc) {
        let wep = weapons[this.state.currentWep]
        let hpSelector = null
        if (currentCalc==="dist-to-ttk") {
            hpSelector = [
                <div className="select-box" key="0">
                    <label>Enemy HP</label>
                    <select name="enemyHP" onChange={this.inputChange}>
                        <option value="100">Standard (100hp)</option>
                        <option value="60">Hunter (60hp)</option>
                        <option value="90">Marksman, Vince, Bowman (90hp)</option>
                        <option value="120">Runner (120hp)</option>
                        <option value="130">Rocketeer (130hp)</option>
                        <option value="170">Spray N Pray (170hp)</option> 
                        {/* add custom */}
                    </select>
                </div>
            ]
        }

        let wepOptions = []
        let keyNum = 0
        for (let wep in weapons) {
            wepOptions.push(
                <option value={wep} key={keyNum}>{weapons[wep].name}</option>
            )
            keyNum++
        }

        return (
            <div id="calc-select-boxes">
                <div className="select-box">
                    <label>Calculation</label>
                    <select name="currentCalc" onChange={this.inputChange}>
                        <option value="dist-to-dmg">Distance to Damage</option>
                        <option value="dmg-to-dist">Damage to Distance</option>
                        <option value="dist-to-ttk">Distance to TTK</option>
                    </select>
                </div>
                <div className="select-box">
                    <label>Weapon</label>
                    <select name="currentWep" onChange={this.inputChange}>
                        {wepOptions}
                    </select>
                </div>
                <div className="select-box">
                    <label>Hit Area</label>
                    <select name="hitArea" onChange={this.inputChange}>
                        <option value="1">Body</option>
                        <option value={wep.headshotMult}>Head</option>
                        <option value="0.5">Limb</option>
                        <option value="0">Miss</option>
                    </select>
                </div>
                <div className="select-box">
                    <label>Wallbang</label>
                    <select name="wallbang" onChange={this.inputChange}>
                        <option value="1">No</option>
                        <option value={1 - (0.5 * wep.pierce)}>Yes</option>
                    </select>
                </div>
                {hpSelector}
            </div>
        )
    }

    render() {
        return (
            <div id="calc-box">
                {this.displaySelectors(this.state.currentCalc)}
                <div id="input-output">
                    <div className="column">
                        <label>Input</label>
                        <input type="number" name="numInput" onChange={this.inputChange} id="num-input"/>
                    </div>
                    <div className="column">
                        <label>Output</label>
                        <label>
                            <strong>
                                {this.calculate(
                                    this.state.numInput,
                                    this.state.currentCalc,
                                    weapons[this.state.currentWep],
                                    this.state.hitArea,
                                    this.state.wallbang,
                                    this.state.enemyHP
                                )}
                            </strong>
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calculator;