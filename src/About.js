import React from 'react'
import icons from './img/icons.js'

class About extends React.Component {
    constructor() {
        super()
        this.state = {
            prop: "val"
        }
    }

    render() {
        
        return (
            <div id="about-box">
                <h3>What is this?</h3>
                <p className="about-par">
                    Krunker Weapon Stats intended to provide in depth information about the weapons of <a href="http://krunker.io">Krunker.io</a>,
                    which is a first person shooter game playable within web browsers. Every weapon has different attributes and statistics
                    that affect how it performs in game such as number of bullets per magazine or reload time. One of these attributes, damage,
                    changes over distance in a way that was not clearly documented before (or at least I couldn't find much on it).
                </p>
                <p className="about-par">
                    The point of this app is to give players the tools to make informed decision when it comes to choosing and using weapons in game
                    from the perspective of game science. This app was created as a personal project for fun.
                </p>

                <h3>What do the icons on the Charts tab mean?</h3>
                <p className="about-par">
                    If you are on a computer, you can hover over the icons to get a small popup that will tell you what the icon means.
                </p>

                <p className="about-par">Alternatively, here is a list of all of the icons and what they mean:</p>

                <div className="icon-desc">
                    <img className="icon" src={icons.magSize} alt="icon"/><label>Magasize Size/Ammo</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.timeBetweenShots} alt="icon"/><label>Time Between Shots</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.reloadTime} alt="icon"/><label>Reload Time</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.swapTime} alt="icon"/><label>Swap Time</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.zoom} alt="icon"/><label>Zoom</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.aimSpeed} alt="icon"/><label>Aim Speed</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.headshotMult} alt="icon"/><label>Headshot Multiplier</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.wallbangMult} alt="icon"/><label>Wallbang Multiplier</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.speedMultiplier} alt="icon"/><label>Speed Multiplier</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.velocity} alt="icon"/><label>Bullet/Projectile Velocity</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.fireModeAuto} alt="icon"/><label>Fire Mode</label>
                </div>
                <div className="icon-desc">
                    <img className="icon" src={icons.spread} alt="icon"/><label>Hipfire Spread</label>
                </div>

                <h3>Where did you get this information/these data?</h3>
                <p className="about-par">
                    Reddit user <a href="http://reddit.com/u/SLxTnT">SLxTnT</a> was very helpful in the early stages with providing info and game
                    code to get the project started. A lot of the data behind this app is actually acquired from the <a href="http://krunker.io/social.html">
                    Krunker Hub</a> site by inspecting the page.
                </p>
                <p className="about-par">
                    If things don't seem quite right, check that the top of the page matches up with the current game version, which can be
                    found <a href="https://krunker.io/docs/versions.txt">here</a> or seen in game.
                </p>

                <h3>What is "Time to Kill?"</h3>
                <p className="about-par">
                    <strong>Time to Kill (TTK)</strong> is simply the amount of time, usually measured in milliseconds (ms), that it takes to kill
                    another player (in theory). Time begins when the first shot is fired and ends when the final bullet hits the enemy. Since most
                    weapons in Krunker are <a href="https://en.wikipedia.org/wiki/Hitscan">hitscan</a>, the first bullet takes 0ms to hit the target,
                    resulting in an instantaneous kill for weapons such as the Shotgun and Sniper. Most weapons have "jumps" in TTK because as
                    distance increases, damage decreases until a critical point where the weapon requires an additional bullet to kill the target player.
                </p>
                <p className="about-par">
                    Weapons that do not have jumps in their TTK graphs usually have constant damage, or at least damage that does not change enough to
                    cause <strong>Bullets to Kill (BTK)</strong> (the number of shots it takes to kill a target player at a given range) to change.
                    This is true of all three projectile weapons (Crossbow, Blaster, and Rocket Launcher) since they all have constant damage. TTK
                    for these weapons does increase over time linearly as distance increases because the projectile takes more and more time to
                    reach the target.
                </p>

                <h3>What assumptions are made in TTK Calculations?</h3>
                <p className="about-par">
                    The TTK calculations as shown are only theoretical and based off of the following assumptions:
                </p>
                <ul>
                    <li>The weapon is being fired at its maxium rate of fire (this is impractical for semi-auto weapons)</li>
                    <li>All shots are hit (except when this is accounted for by configuring individual shots)</li>
                    <li>The target has 100hp (unless another hp value is specified)</li>
                    <li>The target is only hit in the body (unless other hit areas are specified)</li>
                </ul>

                <h3>Why are some TTK graphs blank and why do some end abruptly?</h3>
                <p className="about-par">
                    TTK graphs are based on <strong>Bullets to Kill (BTK)</strong>, and the graph ends when BTK is greater than the
                    mag size for that weapon. This is because I personally don't see TTK as an important measurement once the mag
                    is empty. This is especially noticable for the Sawed Off secondary shotgun since it only does 60 damage maximum
                    and only has a one shell magazine. This means that this weapon cannot kill the enemy before the mag is empty and
                    thus the graph is blank.
                </p>

                <h3>How are classes different beyond the stats of weapons?</h3>
                <p className="about-par">
                    Classes themselves (not just weapons) have different stats that affect things like player speed
                    and HP.
                    I am not sure what some of these stats are exactly (HP Regen for example) and how they translate to gameplay,
                    and I removed a few like text lines, colors, and "segs" (?) but I thought I would add them anyway.
                    In the future I might find a way to better integrate this info into this app, but for now I will just display
                    it below.
                </p>
                <div>
                    <h4>Triggerman</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 100,
                        Speed: 1.05
                    </p>
                    <h4>Hunter</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 60,
                        Speed: 1.05
                    </p>
                    <h4>Run N Gun</h4>
                    <p className="about-par">
                        Wall Jumping: Yes,
                        HP: 100,
                        Speed: 1.18
                    </p>
                    <h4>Spray N Pray</h4>
                    <p className="about-par">
                        HP: 170,
                        HP Regen: .05,
                        Speed: .95
                    </p>
                    
                    <h4>Vince</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 90,
                        Speed: 1
                    </p>
                    
                    <h4>Detective</h4>
                    <p className="about-par">
                        HP: 100,
                        Speed: 1
                    </p>
                    
                    <h4>Marksman</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 90,
                        Speed: 1
                    </p>
                    
                    <h4>Rocketeer</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 130,
                        Speed: .86
                    </p>
                    
                    <h4>Agent</h4>
                    <p className="about-par">
                        Wall Jumping: Yes,
                        HP: 100,
                        Speed: 1.2
                    </p>
                    
                    <h4>Runner</h4>
                    <p className="about-par">
                        Wall Jumping: Yes,
                        HP: 120,
                        Knife Throw Charge: 600,
                        HP Regen: .2,
                        Speed: 1
                    </p>
                    
                    <h4>Deagler</h4>
                    <p className="about-par">
                        HP: 60,
                        Speed: 1
                    </p>
                    
                    <h4>Bowman</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 100,
                        Speed: 1
                    </p>
                    
                    <h4>Commando</h4>
                    <p className="about-par">
                        Secondary: Yes,
                        HP: 100,
                        Speed: 1
                    </p>
                    
                    <h4>Trooper</h4>
                    <p className="about-par">
                        Wall Jumping: Yes,
                        HP: 100,
                        Speed: 1
                    </p>
                    
                </div>

                <h3>I've found a bug/I have feedback. How do I let you know?</h3>
                <p className="about-par">
                    Please send bug reports, feedback, and feature ideas <a href="https://forms.gle/Z4y93t4kM4FP4yqA7">here</a>.
                </p>
            </div>
        )
    }
}

export default About;