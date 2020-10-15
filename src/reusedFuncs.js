import createGraph from './createGraph.js'

const f = {
    distanceToDamage: function (d, wep) {
        let tmpDrop = Math.min(1, (1 - ((1 - (d / wep.range)) * wep.range) / (wep.range - wep.dropStart)));
        let tmpDMG = wep.damage - (wep.dmgDrop * tmpDrop);
        return Math.round(tmpDMG * 1000)/1000
    },
    damageToDistance: function(dmg, wep) {
        let actualRange = wep.range
        if (wep.dmgDrop===0) actualRange = 0
        if (dmg <= wep.damage - wep.dmgDrop) return `${actualRange}+`
        else if (dmg < wep.damage - wep.dmgDrop || dmg > f.distanceToDamage(0, wep)) return 'N/A'
        let dist = ((((1 + (dmg - wep.damage) / wep.dmgDrop) * (wep.range - wep.dropStart)) / wep.range) - 1) * -wep.range
        return Math.round(100 * dist)/100
    },
    calcTTK: function(dmg, wep, hp, dist) {
        let BTK = Math.ceil(hp / dmg)
        if (!wep.velocity) return f.BTKtoTTK(BTK, wep)
        else return f.BTKtoTTK(BTK, wep) + (1000/wep.velocity) * dist
    },
    BTKtoTTK: function(btk, wep) {
        if (!wep.burst) return (btk - 1) * wep.timeBetweenShots
        else return Math.floor((btk - 1)/3) * (wep.burst + wep.timeBetweenShots * 2) + ((btk - 1)%3) * wep.timeBetweenShots
    },
    shotsToBTK: function(mults, mult, dmg, hp) {
        let totalDamage = 0
        let btk = 0
        while (totalDamage < hp) {
            if (btk <= mults.length) totalDamage += mults[btk] * dmg
            else totalDamage += mult * dmg
            btk++
        }
        return btk
    },
    genAlgTTKData: function(wep, mlt, hp) {
        let mult = mlt
        if (wep.pellets) mult = mlt * wep.pellets
        let currentDamage = mult * f.distanceToDamage(0, wep)
        let currentBTK =  Math.ceil(hp / currentDamage)
        if (currentBTK > wep.magSize) return
        let ttkXData = [0]
        let ttkYData = [f.BTKtoTTK(currentBTK, wep)]
        currentDamage = hp / currentBTK
        while (
            currentDamage > mult * (wep.damage - wep.dmgDrop) && //damage no longer dropping, so ttk will remain the same (stop)
            f.damageToDistance((1 / mult) * currentDamage, wep) <= 600 //dist at which this dmg is done is past 600 (where graph ends, stop)
        ) {
            let dist = f.damageToDistance((1 / mult) * currentDamage, wep)
            ttkXData.push(dist)
            ttkYData.push(f.BTKtoTTK(currentBTK, wep))
            currentBTK++
            if (currentBTK > wep.magSize) break;
            ttkXData.push(dist)
            let upperTTK = f.BTKtoTTK(currentBTK, wep)
            if (upperTTK < 5000) ttkYData.push(upperTTK)
            else {ttkYData.push(5000); break}
            currentDamage = hp / currentBTK
        }
        if (
            ttkXData[ttkXData.length - 1] < 600 &&
            ttkYData[ttkYData.length - 1]!==5000 &&
            currentBTK <= wep.magSize
        ) {
            ttkXData.push(600)
            ttkYData.push(f.calcTTK((mult * f.distanceToDamage(600, wep)), wep, hp, 600))
        }
        return [ttkXData, ttkYData]
    },
    genItrTTKData: function(wep, hp, hitAreas, wallbangs) {
        let maxBTK = hitAreas.length  //inherit maxBTK from # of blobs
        let mults = []
        let p = wep.pellets || 1

        for (let i=0; i < maxBTK; i++) mults[i] = Number(wallbangs[i]) * Number(hitAreas[i]) * p
        let minBTK = f.shotsToBTK(mults, undefined, f.distanceToDamage(0, wep), hp)
        if (minBTK > wep.magSize) return
        let ttkXData = [0]
        let ttkYData = [f.BTKtoTTK(minBTK, wep)]

        for (let currentBTK = minBTK; currentBTK < maxBTK; currentBTK++) {
            //create pairs of points, one above the other
            //represents the jump in TTK as BTK increases by 1
            let multSum = 0
            for (let i=0; i < currentBTK; i++) multSum += mults[i]
            let dist = f.damageToDistance((hp / multSum), wep)  //this is the dist where these shots begin to no longer kill
            ttkXData.push(dist)
            ttkYData.push(f.BTKtoTTK(currentBTK, wep))
            if (currentBTK + 1 > wep.magSize) break;
            ttkXData.push(dist)
            let upperTTK = f.BTKtoTTK(currentBTK + 1, wep)
            if (upperTTK < 5000) ttkYData.push(upperTTK)
            else {ttkYData.push(5000); break}
        }
        if (
            ttkXData[ttkXData.length - 1] < 600 &&
            ttkYData[ttkYData.length - 1]!==5000 &&
            maxBTK <= wep.magSize
        ) {
            ttkXData.push(600)
            ttkYData.push(f.BTKtoTTK(maxBTK, wep))
        }
        return [ttkXData, ttkYData]
    },
    createLargeTTKGraph: function(array) { //[{id, wep, hitArea, wallbang, hitAreas, wallbangs, hp, shotsType}, {...]
        let ttkData = []
        let dataSets = []
        let yBounds = [0, 100]
        let yMin;
        let yMax;
        for (let line of array) {
            let finalMult = Number(line.wallbang) * (Number(line.hitArea))
            if (finalMult===0) continue;
            if (line.shotsType==="individual") {
                ttkData[line.id] = f.genItrTTKData(line.wep, line.hp, line.hitAreas, line.wallbangs)
            } else if (finalMult!==0) {
                ttkData[line.id] = f.genAlgTTKData(line.wep, finalMult, line.hp)
            }
            if (!ttkData[line.id]) continue;

            if (!yMin && !yMax) { 
                yMin = ttkData[line.id][1][0]
                yMax = ttkData[line.id][1][ttkData[line.id][1].length - 1]
            } else {
                if (ttkData[line.id][1][0] < yMin) yMin = ttkData[line.id][1][0]
                if (ttkData[line.id][1][ttkData[line.id][1].length - 1] > yMax) {
                    yMax = ttkData[line.id][1][ttkData[line.id][1].length - 1] //oof
                }
            }
            let lineColor;
            switch (line.id) {
                default: lineColor = "red"; break;
                case 1: lineColor = "blue"; break;
                case 2: lineColor = "green"; break;
            }

            let squareSize = 3
            if (line.wep.velocity) squareSize = 0

            dataSets.push(
                {
                    name: line.wep.shortName || line.wep.name, //smg long name 2 long
                    color: lineColor,
                    lineWidth: 3,
                    shapeSize: squareSize,
                    shape: "square",
                    x: ttkData[line.id][0],
                    y: ttkData[line.id][1]
                }
            )
        }

        if (dataSets.length > 0) yBounds = f.setYBounds(yMin, yMax, 100, 100)

        let graphOptions = {
            title: "Time to Kill",
            fontFamily: "Arial",
            decimals: 2,
            legend: Math.abs(dataSets.length - 1) + dataSets.length - 1, //{length <= 1} => false, {length > 1} => true
            xTitle: "Distance (units)",
            xInc: 6,
            xMin: 0,
            xMax: 600,
            xLineIncs: 6,
            xStart: 77,
            yTitle: "TTK (ms)",
            yMin: yBounds[0],
            yInc: 5,
            yMax: yBounds[1],
            yLineIncs: 5,
            outerBorder: false,
            graphClass: "large-graph",
            data: dataSets
        }

        return createGraph(graphOptions)
    },
    createLargeDMGGraph: function(array) { //[{id, wep, finalMult}]
        let dmgData = []
        let dataSets = []
        let yBounds = [0, 100]
        let yMin;
        let yMax;
        for (let line of array) {
            let i = dataSets.length

            dmgData[i] = f.genDamageData(line.wep, line.finalMult)
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
            switch (line.id) {
                default: lineColor = "red"; break;
                case 1: lineColor = "blue"; break;
                case 2: lineColor = "green"; break;
            }
            dataSets.push(
                {
                    name: line.wep.shortName || line.wep.name, //smg long name 2 long
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
    },
    setYBounds: function(min, max, minInc, roundBounds) {
        let highestY = roundBounds * Math.ceil(max/roundBounds)
        let lowestY = roundBounds * Math.floor(min/roundBounds)
        let yRange = highestY - lowestY
        let yAxisRange = Math.max(minInc, Math.ceil(yRange/minInc)*minInc)
        let yRangeDif = yAxisRange - yRange
        let returnArray = [Math.max(0, lowestY - Math.round(yRangeDif/2))]
        returnArray[1] = returnArray[0] + yAxisRange
        return returnArray
    },
    genDamageData: function(wep, mult) {
        let damageXData = [0]
        if (wep.range < 600) damageXData.push(wep.range)
        damageXData.push(600)

        let damageYData = []
        for (let i=0; i<damageXData.length; i++) {
            damageYData[i] = mult * f.distanceToDamage(damageXData[i], wep)
        }
        return [damageXData, damageYData]
    },
    stringSplice: function(baseString, index, rep, addString) { //works like array splice
        return baseString.slice(0, index) + addString + baseString.slice(index + Math.abs(rep));
    },
    supplementProps: {
        name: {
            title: "",
        },
        pictureURL: {skip: true},
        damage: {
            title: "Max Damage",
            value: function(wep) {return f.distanceToDamage(0, wep)},
            prefer: "higher",
            moreProps: [
                {
                    title: "Min Damage",
                    value: function(wep) {return wep.damage - wep.dmgDrop},
                    prefer: "higher"
                },
                {
                    title: "Max DPS",
                    value: function(wep) {
                        let dmg = f.distanceToDamage(0, wep)
                        if (wep.burst) return Math.round(((3000/(wep.timeBetweenShots * 2 + wep.burst)) * dmg)*100)/100
                        else if (wep.pellets) return Math.round(((1000/wep.timeBetweenShots) * dmg * wep.pellets)*100)/100
                        else return Math.round(((1000/wep.timeBetweenShots) * dmg)*100)/100
                    },
                    prefer: "higher"
                }
            ]
        },
        timeBetweenShots: {
            title: "Time Between Shots",
            units: "ms",
            prefer: "lower",
            moreProps: [
                {
                    title: "Rate of Fire",
                    units: "rpm",
                    value: function(wep) {
                        if (!wep.burst) return Math.round((60000/wep.timeBetweenShots)*100)/100
                        else return Math.round((180000/(wep.timeBetweenShots * 2 + wep.burst))*100)/100
                    },
                    prefer: "higher"
                }
            ]
        },
        reloadTime: {
            title: "Reload Time",
            units: "ms",
            prefer: "lower"
        },
        swapTime: {
            title: "Swap Time",
            units: "ms",
            prefer: "lower"
        },
        range: {
            title: "Range",
            units: " units",
            prefer: "higher"
        },
        spread: {
            title: "Hipfire Spread",
            prefer: "lower"
        },
        magSize: {
            title: "Mag Size",
            value: function(wep) {
                let endLetter = "s"
                if (wep.magSize===1) endLetter = ""
                let projectile = "round"
                if (wep.name==="Blaster") projectile = "laser"
                else if (wep.name==="Crossbow") projectile = "bolt"
                else if (wep.name==="Rocket Launcher") projectile = "rocket"
                else if (wep.name==="Shotgun") projectile = "cartridge"
                return wep.magSize + " " + projectile + endLetter
            },
            numValue: function(wep) {return wep.magSize},
            prefer: "higher"
        },
        zoom: {
            title: "Zoom",
            units: "x",
            prefer: "lower"
        },
        headshotMult: {
            title: "Headshot Mult.",
            units: "x",
            prefer: "higher"
        },
        pierce: {
            skip: true,
            moreProps: [
                {
                    title: "Wallbang Mult.",
                    units: "x",
                    value: function(wep) {return 1 - (0.5 * wep.pierce)},
                    prefer: "higher"
                }
            ]
        },
        aimSpeed: {
            title: "Aim Speed",
            units: "ms",
            prefer: "lower"
        },
        speedMultiplier: {
            title: "Speed Mult.",
            units: "x",
            prefer: "higher"
        },
        dmgDrop: {skip: true},
        dropStart: {skip: true},
        velocity: {
            title: "Bullet Velocity",
            value: function(wep) {if (wep.velocity) return "~" + wep.velocity + " units/s"; else return "Hitscan" },
            numValue: function(wep) { if (wep.velocity) return wep.velocity; else return 1e10 },
            prefer: "higher"
        },
        fireMode: {
            title: "Fire Mode",
            numValue: function(wep) {
                if (wep.fireMode==="Auto") return 2
                else if (wep.fireMode==="Burst") return 1
                else if (wep.fireMode==="Single") return 0
            },
            prefer: "higher"
        }
    }
}

export default f;