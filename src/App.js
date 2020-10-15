import React from 'react';
import './App.css';
import Charts from './Charts.js'
import Comparison from './Comparison.js'
import Calculator from './Calculator.js'
import About from './About.js'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            currentComponent: "charts"
        }
    }

    changeComponent(compName) {
        this.setState({currentComponent: compName})
    }

    render() {
        let mainPage = null
        let chartsTabStyle = {}
        let comparisonTabStyle = {}
        let calculatorTabStyle = {}
        let aboutTabStyle = {}

        switch (this.state.currentComponent) {
            case "charts": 
                mainPage = <Charts></Charts>;
                chartsTabStyle = {color: "black", backgroundColor: "rgb(160,160,160)", cursor: "auto"}
                break;
            case "comparison": 
                mainPage = <Comparison></Comparison>;
                comparisonTabStyle = {color: "black", backgroundColor: "rgb(160,160,160)", cursor: "auto"}
                break;    
            case "calculator":
                mainPage = <Calculator></Calculator>;
                calculatorTabStyle = {color: "black", backgroundColor: "rgb(160,160,160)", cursor: "auto"}
                break;
            case "about":
                mainPage = <About></About>;
                aboutTabStyle = {color: "black", backgroundColor: "rgb(160,160,160)", cursor: "auto"}
                break;   
            default: mainPage = null
        }

        return (
            <div>
                <h1>Krunker Weapon Stats v0.1 (Game Data v3.1.1)</h1>
                <div id="tabs">
                    <div className="tab" style={chartsTabStyle} onClick={() => this.changeComponent("charts")}>
                        <label className="tab-label"><strong>Charts</strong></label>
                    </div>
                    <div className="tab" style={comparisonTabStyle} onClick={() => this.changeComponent("comparison")}>
                        <label className="tab-label"><strong>Comparison</strong></label>
                    </div>
                    <div className="tab" style={calculatorTabStyle} onClick={() => this.changeComponent("calculator")}>
                        <label className="tab-label"><strong>Calculator</strong></label>
                    </div>
                    <div className="tab" style={aboutTabStyle} onClick={() => this.changeComponent("about")}>
                        <label className="tab-label"><strong>About/Help</strong></label>
                    </div>
                </div>
                {mainPage}
            </div>

        )
    }
}

export default App;

// new stories***

// fix calc for shotguns
// hover info for graphs
// clean up creategraph (set defaults, etc)
// custom x bounds
// 2nd look for icons
// better dark theme
// fix comp data structure
// linkable results
// make wbmult a method?
// class stats
// make mobile not terrible