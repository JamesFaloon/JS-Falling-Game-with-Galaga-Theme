import zim from "https://zimjs.org/cdn/016/zim";

// import spirtes to use 
const pics = ["bad1.png", "bad2.png", "bad3.png"]
const bullets = ["bullet.png"]
const sounds = ["death.mp3", "fire.mp3", "gameover.mp3"];
const assets = [...pics, ...sounds, ...bullets, "icon.png", "galaga-background.png"]

// See Docs under Frame for FIT, FILL, FULL, and TAG
new Frame(FIT, 1024, 768, dark, black, ready, assets, "Assets/");
function ready() {

    //// Importing assets for use 

    // used to track score 
    let scoreCounter = 0;

    // import background first 
    const background = new Pic("galaga-background.png").scaleTo().center().alp(.4);

    // Make sure the background is Scorlling 
    new Scroller(background, null, -1, false);

    // import audio for Killing an enemy or dying yourself 
    const death = new Aud("death.mp3");

    // Sound that plays when you fire a laser 
    const fire = new Aud("fire.mp3");

    // When you die play the gameover theme from galaga 
    const gameOver = new Aud("gameover.mp3");


    // Import a Label that tracks score 
    let score = new Label("Score : " + scoreCounter, 100, null, white).pos(0, 50, CENTER);

    // import the main character 
    const fighter = new Sprite("icon.png").reg(CENTER).center().sca(1.5).pos(0, 50, CENTER, BOTTOM);

    // import conatiner for enemys to fall from 
    const container = new Container(W, H).addTo().sca(1);

    // container to shoot bullets from 
    const bulletContainer = new Container(W, H).addTo().sca(1);

    // import enemy 
    const enemy = new Pic("bad1.png").sca(1.5);

    // import the bullet picture 
    const bullet = new Pic("bullet.png");

    // import the button to shot from 
    const button = new Button(100, 30, "FIRE!!", "black").pos(0, 740);


    // import emitter to represent expolsions 
    const emitter = new Emitter({ startPaused: true });

    // how you controll your character 
    new MotionController(fighter, "keydown", 10, HORIZONTAL, S);

    // when you click the button 
    button.on("click", () => {
        // create a laser
        new Pic(bullets)
            // put it into the container for bullets 
            .addTo(bulletContainer)
            // have the start location from the fighters location 
            .loc(fighter.loc())
            // have the bullet move til it reaches a postion then dispose 
            .animate({ y: - 200 }, 1, "linear", (target) => { target.dispose(); });
        // play the fire audio 
        fire.play()
    });


    // start an interval that goes between .1 - 2 seconds 
    interval({ min: .1, max: 2 }, () => {
        // spawn an enemy 
        new Pic(pics)
            // set the enemy to a certain size 
            .sca(1.5)
            // start a random postion from the top and place into container for enemines 
            .loc(Math.random() * W, -100, container)
            // animate til it reaches the bottom then diospose 
            .animate({ y: H + 100 }, 3, "linear", (target) => { target.dispose(); })
    }, null, true); // run right away 



    // check for objects that are moving on there own 
    Ticker.add(() => {
        // loop forever 
        container.loop((enemy) => {
            // if the fighter hits an enemy 
            if (fighter.hitTestCircles(enemy)) {
                // play the death audio 
                death.play();
                // add an expolsion effect 
                emitter.loc(fighter).spurt(10);
                // get rid of tthe fighter 
                fighter.dispose();
                // get rid of the old score 
                score.dispose();
                // get ride of the fire button 
                button.dispose();
                // put a game over screen 
                score = new Label("Game Over", 100, null, white).pos(0, 50, CENTER);
                // wait 2 seconds 
                timeout(2, () => {
                    // play gameover soundtrack from galaga 
                    gameOver.play();

                })
            }
            // in the same container loop start another loop the runs forever for the bullet container 
            bulletContainer.loop((bullet) => {
                // if the enemy from the previous container touchs a bullet from this container 
                if (enemy.hitTestCircles(bullet)) {
                    // play the death sound 
                    death.play();
                    // 100 points 
                    scoreCounter += 100
                    // remove the enemy 
                    enemy.dispose();
                    // remove the bullet 
                    bullet.dispose();
                    // remove the old score 
                    score.dispose();
                    // add expolsion on enemy location 
                    emitter.loc(enemy).spurt(10);
                    // update score 
                    score = new Label("Score: " + scoreCounter, 100, null, white).pos(0, 50, CENTER);
                }
            }, true) // true for loop backwards 
        }, true) // true for loop backwards
    })



} // end ready
