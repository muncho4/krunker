import React from 'react';

function createGraph(opt) {
    let options = opt
    
    // function setDefaults(optionsInput) {
    //     let defaultSettings = {
    //         title: "graph title",
    //         fontFamily: "Arial",
    //         decimals: 2,
    //         legend: true,
    //         width: 800,
    //         height: 600,
    //         labelFontSize: "18px",
    //         titleFontSize: "50px",
    //         bgLineIncsColor: "gray",
    //         bgLineWidth: "1",
    //         //labelstartend
    //         xAxis: {
    //             title: "x axis title",
    //             xIncrements: 10,
    //             min: 0,
    //             max: 100,
    //             bgLineIncs: 10,
    //             start: 77,
    //             end: 775
    //         },
    //         yAxis: {
    //             title: "y axis title",
    //             xIncrements: 10,
    //             min: 0,
    //             max: 100,
    //             bgLineIncs: 10,
    //             start: 77,
    //             end: 775
    //         },
    //         outerBorder: false,
    //         graphClass: null,
    //         data: []
    //     }
    // }

    //defaults
    if (options.title===false) options.title = ""
    else options.title = options.title || "graph title" 
    if (typeof(options.decimals)!=="number") options.decimals = 2
    if (typeof(options.legend)!=="boolean" && options.data && options.data.length > 1) options.legend = true
    options.fontFamily = options.fontFamily || "Times New Roman"
    if (typeof(options.xInc)!=="number") {
        if (options.data && options.data.x) options.xInc = options.data[0].x.length - 1
        else options.xInc = 10
    } 
    if (typeof(options.xMin)!=="number") options.xMin = 0
    if (typeof(options.xMax)!=="number") {
        if (options.data) {
            let biggestX = 0
            for (let dataSet of options.data) {
                for (let x of dataSet.x) {
                    if (x > biggestX) biggestX = x
                }
            }
                options.xMax = biggestX
            if (options.xMax===options.xMin) options.xMax = options.xMin + 1
        } else options.xMax = 10
    }
    if (typeof(options.xLineIncs)!=="number") {
        if (options.data && options.data.x) options.xLineIncs = options.data[0].x.length - 1
        else options.xLineIncs = 10
    } 

    if (typeof(options.yInc)!=="number") {
        if (options.data && options.data.y) options.yInc = options.data[0].y.length - 1
        else options.yInc = 10
    } 
    if (typeof(options.yMin)!=="number") options.yMin = 0
    if (typeof(options.yMax)!=="number") {
        if (options.data) {
            let biggestY = 0
            for (let dataSet of options.data) {
                for (let y of dataSet.y) {
                    if (y > biggestY) biggestY = y
                }
            }	
            options.yMax = biggestY
            if (options.yMax===options.yMin) options.yMax = options.yMin + 1
        } else options.yMax = 10
    }
    if (typeof(options.yLineIncs)!=="number") {
        if (options.data && options.data.y) options.yLineIncs = options.data[0].y.length - 1
        else options.yLineIncs = 10
    }
    options.labelFontSize = options.labelFontSize || "18px"

    if (options.data) {
        for (let i=0; i<options.data.length; i++) {
            options.data[i].name = options.data[i].name || `line ${i+1}`
            if (!options.data[i].shape) {
                if (i%4===0) options.data[i].shape = "circle"
                else if (i%4===1) options.data[i].shape = "square"
                else if (i%4===2) options.data[i].shape = "triangle"
                else if (i%4===3) options.data[i].shape = "rhombus"
            }
            if (!options.data[i].color) {
                if (i===0) options.data[i].color = "red"
                else if (i===1) options.data[i].color = "blue"
                else if (i===2) options.data[i].color = "green"
                else if (i===3) options.data[i].color = "purple"
                else options.data[i].color = "black"
            }
            if (typeof(options.data[i].lineWidth)!=="number") options.data[i].lineWidth = 2
            if (typeof(options.data[i].shapeSize)!=="number") {
                if (options.data[i].shape==="circle") options.data[i].shapeSize = 5
                else if (options.data[i].shape==="square") options.data[i].shapeSize = 8
                else if (options.data[i].shape==="triangle") options.data[i].shapeSize = 7
                else if (options.data[i].shape==="rhombus") options.data[i].shapeSize = 6
            }
        }
    }
    let graphicWidth = options.svgWidth || 800
    let incWidth = options.lineIncWidth || "1"

    let keyNum = 0

    let xAxisEnd = options.xEnd || 775
    if (options.legend && !options.xEnd) xAxisEnd = 675
    let xAxisStart = options.xStart || 75
    let xAxisWidth = xAxisEnd - xAxisStart

    let yAxisStart = 75
    if (!options.title) yAxisStart = 25
    let yAxisEnd = 525
    if (!options.yTitle) yAxisEnd = 550
    let yAxisWidth = yAxisEnd - yAxisStart

    let graphClass = null
    if (options.graphClass) graphClass = options.graphClass

    function roundToPlace(num, power) {
        return Math.round(num*(10**power))/(10**power)
    }

    //x graph elems
    let xIncs = []
    let xPos = xAxisStart
    let xPosInc = xAxisWidth/options.xInc
    let xInc = (options.xMax - options.xMin)/options.xInc
    let currentX = options.xMin
    for (let i=0; i<=options.xInc; i++) {
        xIncs.push(
            <text 
                x={xPos} y={yAxisEnd + 5} textAnchor="middle" alignmentBaseline="before-edge"
                style={{fontSize: options.labelFontSize, fontFamily: options.fontFamily}} key={keyNum}>
                    {roundToPlace(currentX, options.decimals)}
            </text>
        )
        xPos += xPosInc
        currentX += xInc
        keyNum++
    }

    let xLines = [] //vert grid lines along x axis
    let xLinePosInc = xAxisWidth/options.xLineIncs
    let xLinePos = xAxisStart + xLinePosInc
    for (let i=0; i < (options.xLineIncs - 1); i++) {
        xLines.push(
            <line x1={xLinePos} y1={yAxisEnd} x2={xLinePos} y2={yAxisStart} style={{stroke: "gray", strokeWidth: incWidth}} key={keyNum}/>
        )
        xLinePos += xLinePosInc
        keyNum++
    }

    //y graph elems
    let yIncs = []
    let yPos = yAxisEnd
    let yPosInc = -yAxisWidth/options.yInc
    let yInc = (options.yMax - options.yMin)/options.yInc
    let currentY = options.yMin
    for (let i=0; i<=options.yInc; i++) {
        yIncs.push(
            <text
                x={xAxisStart - 7} y={yPos} textAnchor="end" alignmentBaseline="middle"
                style={{fontSize: options.labelFontSize, fontFamily: options.fontFamily}} key={keyNum}>
                    {roundToPlace(currentY, options.decimals)}
            </text>
        )
        yPos += yPosInc
        currentY += yInc
        keyNum++
    }

    let yLines = [] //vert grid lines along y axis
    let yLinePosInc = -yAxisWidth/options.yLineIncs
    let yLinePos = yAxisEnd + yLinePosInc
    for (let i=0; i < (options.yLineIncs - 1); i++) {
        yLines.push(
            <line x1={xAxisStart} y1={yLinePos} x2={xAxisEnd} y2={yLinePos} style={{stroke: "gray", strokeWidth: incWidth}} key={keyNum}/>
        )
        yLinePos += yLinePosInc
        keyNum++
    }

    //data
    let data = []
    let legend = []

    if (options.data) {
        function convertX(num) { return ((num - options.xMin)/(options.xMax - options.xMin))*xAxisWidth + xAxisStart }   //convert x 
        function convertY(num) { return ((num - options.yMin)/(options.yMax - options.yMin))*-yAxisWidth + yAxisEnd } //and y coords to coords on svg
        function pointToTriangle(x, y, r) { //converts center of tri to string containing all pts of tri
            return `${x},${y-r} ${x+0.866*r},${y + 0.5*r} ${x-0.866*r},${y+0.5*r}`
        }
        function pointToRhombus(x, y, r) { //converts center of rhom to string containing all pts of rhom
            return `${x},${y-r} ${x-r},${y} ${x},${y+r} ${x+r},${y}`
        }

        for (let dataSet of options.data) {
            if (dataSet.x.length!==dataSet.y.length) {
                console.log(
                    `warning for data set ${dataSet.name}: mismatched data
                    ${dataSet.x.length} x values and ${dataSet.y.length} y values`
                )
            }
            if (dataSet.shape==="circle") {
                data.push(
                    <circle
                        cx={convertX(dataSet.x[0])}
                        cy={convertY(dataSet.y[0])}
                        r={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <circle
                            cx={convertX(dataSet.x[i])}
                            cy={convertY(dataSet.y[i])}
                            r={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            } else if (dataSet.shape==="square") {
                data.push(
                    <rect
                        x={convertX(dataSet.x[0]) - dataSet.shapeSize/2}
                        y={convertY(dataSet.y[0]) - dataSet.shapeSize/2}
                        width={dataSet.shapeSize} height={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <rect
                            x={convertX(dataSet.x[i]) - dataSet.shapeSize/2}
                            y={convertY(dataSet.y[i]) - dataSet.shapeSize/2}
                            width={dataSet.shapeSize} height={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            } else if (dataSet.shape==="triangle") {
                data.push(
                    <polygon
                        points={pointToTriangle(convertX(dataSet.x[0]), convertY(dataSet.y[0]), Number(dataSet.shapeSize))}
                        fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <polygon
                            points={pointToTriangle(convertX(dataSet.x[i]), convertY(dataSet.y[i]), Number(dataSet.shapeSize))}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            } else if (dataSet.shape==="rhombus") {
                data.push(
                    <polygon
                        points={pointToRhombus(convertX(dataSet.x[0]), convertY(dataSet.y[0]), Number(dataSet.shapeSize))}
                        fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <polygon
                            points={pointToRhombus(convertX(dataSet.x[i]), convertY(dataSet.y[i]), Number(dataSet.shapeSize))}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            }
        }

        //legend
        if (options.legend) {
            legend.push(
                <text x="737.5" y="90" textAnchor="middle"
                    style={{fontSize: "20px", fontFamily: options.fontFamily}} key={keyNum}>
                        Legend
                </text>
            )
            keyNum++
            for (let i=0; i<options.data.length; i++) {
                let dataSet = options.data[i]
                if (dataSet.shape==="circle") {
                    legend.push(
                        <circle
                            cx="695" cy={35*i + 120}
                            r="6" fill={dataSet.color} key={keyNum}
                        />
                    )
                } else if (dataSet.shape==="square") {
                    legend.push(
                        <rect
                            x="689.5"
                            y={35*i + 114.5}
                            width="11" height="11" fill={dataSet.color} key={keyNum}
                        />
                    )
                } else if (dataSet.shape==="triangle") {
                    legend.push(
                        <polygon
                            points={pointToTriangle(695, (35*i + 121), 8)}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                } else if (dataSet.shape==="rhombus") {
                    legend.push(
                        <polygon
                            points={pointToRhombus(695, (35*i + 120), 7)}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                }
                keyNum++
                legend.push(
                    <line
                        x1="685"
                        y1={35*i + 120}
                        x2="705"
                        y2={35*i + 120}
                        style={{stroke: dataSet.color, strokeWidth: "3"}} key={keyNum}
                    />
                )
                keyNum++
                legend.push(
                    <text x="710" y={35*i + 125}
                        style={{fontSize: "14px", fontFamily: options.fontFamily}} key={keyNum}>
                            {dataSet.name}
                    </text>
                )
                keyNum++
            }
        }
    }

    let outerBorder = []
    if (options.outerBorder!==false) {
        outerBorder = [
            <polygon points="0,0 0,600 800,600 800,0" style={{stroke: "black", strokeWidth: "1", fill: "none"}} key="0"></polygon>
        ]
    }

    return (
        <svg viewBox={`0 0 ${graphicWidth} 600`} className={graphClass}>
            <text x="400" y="50" textAnchor="middle" style={{fontSize: "50px", fontFamily: options.fontFamily}}>{options.title}</text>
            <text x="400" y="585" textAnchor="middle" style={{fontSize: options.labelFontSize, fontFamily: options.fontFamily}}>{options.xTitle}</text>
            <text x="400" y="300" textAnchor="middle" style={{
                    fontSize: options.labelFontSize, fontFamily: options.fontFamily,
                    transform: "rotate(270deg) translateY(-275px) translateX(-700px)" //idk
                }} id="y-title">{options.yTitle}</text>
            {outerBorder}
            <polygon
                points={`${xAxisStart},${yAxisStart} ${xAxisStart},${yAxisEnd} ${xAxisEnd},${yAxisEnd} ${xAxisEnd},${yAxisStart}`}
                style={{stroke: "black", strokeWidth: "1", fill: "white"}}>
            </polygon>
            {xIncs}
            {yIncs}
            {xLines}
            {yLines}
            {data}
            {legend}
        </svg>
    )
}

export default createGraph