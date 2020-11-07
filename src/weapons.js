import weaponImages from './img/weaponImages.js'

const weapons = {
    AR: {
        name: "Assault Rifle",
        pictureURL: weaponImages.AR,
        damage: 23,
        timeBetweenShots: 110,
        fireMode: "Auto",
        magSize: 30,
        reloadTime: 1400,
        swapTime: 300,
        velocity: undefined,
        range: 700,
        spread: 100,
        zoom: 1.6,
        headshotMult: 1.5,
        pierce: 1,
        aimSpeed: 130,
        speedMultiplier: 0.95,
        dmgDrop: 5,
        dropStart: 0
    },
    sniper: {
        name: "Sniper Rifle",
        pictureURL: weaponImages.sniper,
        damage: 100,
        timeBetweenShots: 900,
        fireMode: "Single",
        magSize: 3,
        reloadTime: 1500,
        swapTime: 300,
        range: 1000,
        spread: 260,
        zoom: 2.7,
        headshotMult: 1.5,
        pierce: 0.2,
        aimSpeed: 120,
        speedMultiplier: 0.95,
        dmgDrop: 30,
        dropStart: 230
    },
    SMG: {
        name: "Submachine Gun",
        shortName: "SMG",
        pictureURL: weaponImages.SMG,
        damage: 18,
        timeBetweenShots: 90,
        fireMode: "Auto",
        magSize: 34,
        reloadTime: 1000,
        swapTime: 300,
        range: 700,
        spread: 70,
        zoom: 1.65,
        headshotMult: 1.5,
        pierce: 1,
        aimSpeed: 110,
        speedMultiplier: 1.04,
        dmgDrop: 12,
        dropStart: 0
    },
    LMG: {
        name: "Machine Gun",
        pictureURL: weaponImages.LMG,
        damage: 18,
        timeBetweenShots: 130,
        fireMode: "Auto",
        magSize: 60,
        reloadTime: 3400,
        swapTime: 700,
        range: 700,
        spread: 300,
        zoom: 1.3,
        headshotMult: 1.5,
        pierce: 1,
        aimSpeed: 200,
        speedMultiplier: 0.79,
        dmgDrop: 10,
        dropStart: 0
    },
    shotgun: {
        name: "Shotgun",
        pictureURL: weaponImages.shotgun,
        damage: 50,
        timeBetweenShots: 450,
        fireMode: "Single",
        pellets: 5,
        magSize: 2,
        reloadTime: 1100,
        swapTime: 300,
        range: 160,
        spread: 180,
        zoom: 1.25,
        headshotMult: 1.5,
        pierce: 2,
        aimSpeed: 120,
        speedMultiplier: 1,
        dmgDrop: 50,
        dropStart: 0
    },
    revolver: {
        name: "Revolver",
        pictureURL: weaponImages.revolver,
        damage: 66,
        timeBetweenShots: 390,
        fireMode: "Single",
        magSize: 6,
        reloadTime: 900,
        swapTime: 200,
        range: 700,
        spread: 100,
        zoom: 1.45,
        headshotMult: 1.5,
        pierce: .85,
        aimSpeed: 110,
        speedMultiplier: 1.04,
        dmgDrop: 10,
        dropStart: 0
    },
    semiAuto: {
        name: "Semi Auto",
        pictureURL: weaponImages.semiAuto,
        damage: 32,
        timeBetweenShots: 120,
        fireMode: "Single",
        magSize: 8,
        reloadTime: 1500,
        swapTime: 300,
        range: 1000,
        spread: 250,
        zoom: 2.1,
        headshotMult: 1.5625,
        pierce: 0.2,
        aimSpeed: 120,
        speedMultiplier: 1,
        dmgDrop: 0,
        dropStart: 0
    },
    rocketLauncher: {
        name: "Rocket Launcher",
        pictureURL: weaponImages.rocketLauncher,
        damage: 85,
        timeBetweenShots: 350,
        fireMode: "Single",
        magSize: 3,
        reloadTime: 1500,
        swapTime: 400,
        range: 1500,
        spread: 120,
        zoom: 1.5,
        headshotMult: 1,
        limbMult: 1,
        pierce: 2,
        aimSpeed: 200,
        speedMultiplier: 0.9,
        dmgDrop: 0,
        dropStart: 0,
        velocity: 713
    },
    uzi: {
        name: "Akimbo Uzi",
        pictureURL: weaponImages.uzi,
        damage: 14,
        timeBetweenShots: 70,
        fireMode: "Auto",
        magSize: 18,
        reloadTime: 1300,
        swapTime: 300,
        range: 700,
        spread: 40,
        zoom: 1.5, //?
        headshotMult: 1.5,
        pierce: 1,
        aimSpeed: 120, //?
        speedMultiplier: 1.04,
        dmgDrop: 13,
        dropStart: 0
    },
    //knife
    crossbow: {
        name: "Crossbow",
        pictureURL: weaponImages.crossbow,
        damage: 200,
        timeBetweenShots: 150,
        fireMode: "Single",
        magSize: 1,
        reloadTime: 900,
        swapTime: 200,
        range: 1500,
        spread: 120,
        zoom: 1.4,
        headshotMult: 1,
        limbMult: 1,
        pierce: 2,
        aimSpeed: 120,
        speedMultiplier: 1,
        dmgDrop: 0,
        dropStart: 0,
        velocity: 646
    },
    famas: {
        name: "Famas",
        pictureURL: weaponImages.famas,
        damage: 28,
        timeBetweenShots: 90,
        fireMode: "Burst",
        burst: 280,
        magSize: 30,
        reloadTime: 1200,
        swapTime: 300,
        range: 900,
        spread: 90,
        zoom: 1.5,
        headshotMult: 1.5,
        pierce: 1,
        aimSpeed: 130,
        speedMultiplier: 0.95,
        dmgDrop: 5,
        dropStart: 0
    },
    blaster: {
        name: "Blaster",
        pictureURL: weaponImages.blaster,
        damage: 35,
        timeBetweenShots: 160,
        fireMode: "Auto",
        magSize: 16,
        reloadTime: 1600,
        swapTime: 300,
        range: 500, //max range
        spread: 100,
        zoom: 1.6,
        headshotMult: 1,
        limbMult: 1,
        pierce: 2,
        aimSpeed: 130,
        speedMultiplier: 0.95,
        dmgDrop: 0,
        dropStart: 0,
        velocity: 950
    },
    pistol: {
        name: "Pistol",
        pictureURL: weaponImages.pistol,
        damage: 20,
        timeBetweenShots: 150,
        fireMode: "Single",
        magSize: 10,
        reloadTime: 700,
        swapTime: 260,
        range: 700,
        spread: 60,
        zoom: 1.4,
        headshotMult: 1.5,
        pierce: 2,
        aimSpeed: 110,
        speedMultiplier: 1.05,
        dmgDrop: 10,
        dropStart: 0
    },
    deagle: {
        name: "Desert Eagle",
        pictureURL: weaponImages.deagle,
        damage: 50,
        timeBetweenShots: 400,
        fireMode: "Single",
        magSize: 6,
        reloadTime: 1000,
        swapTime: 200,
        range: 700,
        spread: 150,
        zoom: 1.4,
        headshotMult: 1.5,
        pierce: 0.85,
        aimSpeed: 110,
        speedMultiplier: 1,
        dmgDrop: 10,
        dropStart: 0
    },
    sawedOff: {
        name: "Sawed Off",
        pictureURL: weaponImages.sawedOff,
        damage: 12,
        timeBetweenShots: 400,
        fireMode: "Single",
        pellets: 5,
        magSize: 1,
        reloadTime: 1100,
        swapTime: 200,
        range: 210,
        spread: 120,
        zoom: 1.25,
        headshotMult: 1.5,
        pierce: 2,
        aimSpeed: 100,
        speedMultiplier: 1,
        dmgDrop: 12,
        dropStart: 0
    },
    autoPistol: {
        name: "Auto Pistol",
        pictureURL: weaponImages.autoPistol,
        damage: 16,
        timeBetweenShots: 100,
        fireMode: "Auto",
        magSize: 15,
        reloadTime: 1000,
        swapTime: 200,
        range: 700,
        spread: 150,
        zoom: 1.3,
        headshotMult: 1, //comes from separate value: noHeadshot: true
        pierce: 0.95,
        aimSpeed: 100,
        speedMultiplier: 1,
        dmgDrop: 2,
        dropStart: 0
    },
    alienBlaster: {
        name: "Alien Blaster",
        pictureURL: weaponImages.alienBlaster,
        damage: 50,
        timeBetweenShots: 170,
        fireMode: "Single",
        magSize: 4,
        reloadTime: 1500,
        swapTime: 200,
        range: 700,
        spread: 150,
        zoom: 1.4,
        headshotMult: 1.5,
        pierce: 0.85,
        aimSpeed: 120,
        speedMultiplier: 1,
        dmgDrop: 10,
        dropStart: 0
    }
}

export default weapons;