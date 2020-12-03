import app from '../index';
import config from './config';

export default class BallsButtons extends PIXI.Container {
    private blueBallBtn: any;
    private yellowBallBtn: any;
    private orangeBallBtn: any;

    private blueState: any;
    private yellowState: any;
    private orangeState: any;

    private blueSelector: any;
    private yellowSelector: any;
    private orangeSelector: any;

    private artBoard: any;

    constructor(x, y, parent) {
        super();

        this.x = x;
        this.y = y;

        // this.artBoard = app.

        let selector = app.loader.resources[app.assets_url+'actionelements.json'].textures["selector.png"]

        this.blueSelector = new PIXI.Sprite(selector)
        this.blueSelector.anchor.set(.5)
        this.blueSelector.visible = false
        this.yellowSelector = new PIXI.Sprite(selector)
        this.yellowSelector.anchor.set(.5)
        this.yellowSelector.visible = false
        this.orangeSelector = new PIXI.Sprite(selector)
        this.orangeSelector.anchor.set(.5)
        this.orangeSelector.visible = false

        this.blueState = false
        this.blueBallBtn = new app.components.Button(
            app.loader.resources[app.assets_url+'balls.json'].textures,
            'blue',
            0,
            0,
            ()=>{
                
            }
        );

        this.blueBallBtn.addChild(this.blueSelector)

        this.blueBallBtn.on("pointerover", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.blueState && this.blueBallBtn.buttonState("off")
                this.blueBallBtn.interactive = true
                this.blueBallBtn.addChild(this.blueSelector)
            }
        })
        this.blueBallBtn.on("pointerout", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.blueState && this.blueBallBtn.buttonState("off")
                this.blueBallBtn.interactive = true
                this.blueBallBtn.addChild(this.blueSelector)
            }
            
        })
        this.blueBallBtn.on("pointerup", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.blueState && this.blueBallBtn.buttonState("on")
                this.blueSelector.visible = this.blueState;
                this.blueBallBtn.addChild(this.blueSelector)
                this.blueState = !this.blueState
            } else {
                if (config.service.buttonClick) {
                    config.service.buttonClick = false
                    // config.service.loginRespons["pay_table"][line].length
                    let randomPosition = Math.floor(Math.random() * 2)
                    parent.startGame("blue", randomPosition)
                    // app.timeout(() => {
                        config.service.buttonClick = true
                    // }, 500)
                }
            }
            
        })

        this.yellowState = false
        this.yellowBallBtn = new app.components.Button(
            app.loader.resources[app.assets_url+'balls.json'].textures,
            'yellow',
            this.blueBallBtn.width + 10,
            0,
            ()=>{
                
            }
        );
        
        this.yellowBallBtn.addChild(this.yellowSelector)

        this.yellowBallBtn.on("pointerover", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.yellowState && this.yellowBallBtn.buttonState("off")
                this.yellowBallBtn.interactive = true
                this.yellowBallBtn.addChild(this.yellowSelector)
            }
            
        })
        this.yellowBallBtn.on("pointerout", () => {
            console.log(config.service.ArtBoard.autoStarted)
            if (!config.service.ArtBoard.autoStarted) {
                this.yellowState && this.yellowBallBtn.buttonState("off")
                this.yellowBallBtn.interactive = true
                this.yellowBallBtn.addChild(this.yellowSelector)
            }
            
        })
        this.yellowBallBtn.on("pointerup", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.yellowState && this.yellowBallBtn.buttonState("on")
                this.yellowSelector.visible = this.yellowState;
                this.yellowBallBtn.addChild(this.yellowSelector)
                this.yellowState = !this.yellowState
            } else {
                if (config.service.buttonClick) {
                    config.service.buttonClick = false
                    let randomPosition = Math.floor(Math.random() * 2)
                    parent.startGame("yellow", randomPosition)
                    // app.timeout(() => {
                        config.service.buttonClick = true
                    // }, 500)
                }
            }
            
        })

        

        this.orangeState = false
        this.orangeBallBtn = new app.components.Button(
            app.loader.resources[app.assets_url+'balls.json'].textures,
            'red',
            (this.blueBallBtn.width + 10) * 2,
            0,
            ()=>{
                
            }
        );

        this.orangeBallBtn.addChild(this.orangeSelector)

        this.orangeBallBtn.on("pointerover", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.orangeState && this.orangeBallBtn.buttonState("off")
                this.orangeBallBtn.interactive = true
                this.orangeBallBtn.addChild(this.orangeSelector)
            }
            
        })
        this.orangeBallBtn.on("pointerout", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.orangeState && this.orangeBallBtn.buttonState("off")
                this.orangeBallBtn.interactive = true
                this.orangeBallBtn.addChild(this.orangeSelector)
            }
            
        })
        this.orangeBallBtn.on("pointerup", () => {
            if (!config.service.ArtBoard.autoStarted) {
                this.orangeState && this.orangeBallBtn.buttonState("on")
                this.orangeSelector.visible = this.orangeState;
                this.orangeBallBtn.addChild(this.orangeSelector)
                this.orangeState = !this.orangeState
            } else {
                if (config.service.buttonClick) {
                    config.service.buttonClick = false
                    let randomPosition = Math.floor(Math.random() * 2)
                    let winNumber = Math.floor(Math.random() * 15)
                    parent.startGame("orange", randomPosition)
                    // app.timeout(() => {
                        config.service.buttonClick = true
                    // }, 500)
                }
            }
            
        })

        this.addChild(this.blueBallBtn, this.yellowBallBtn, this.orangeBallBtn)
    }

    changeState(state, bool) {
        this.blueState = bool
        this.yellowState = bool
        this.orangeState = bool

        if (state === "off" || state === "on") {
            this.blueBallBtn.buttonState(state)
            this.blueBallBtn.interactive = true
    
            this.yellowBallBtn.buttonState(state)
            this.yellowBallBtn.interactive = true
    
            this.orangeBallBtn.buttonState(state)
            this.orangeBallBtn.interactive = true
        } else if (state === "offset") {
            this.blueBallBtn.interactive = true
            this.yellowBallBtn.interactive = true
            this.orangeBallBtn.interactive = true
        }
    }

    setInteractive (boolean) {
        this.blueBallBtn.interactive = boolean
        this.yellowBallBtn.interactive = boolean
        this.orangeBallBtn.interactive = boolean
    }

    setVisible (boolean) {
        this.blueSelector.visible = boolean
        this.yellowSelector.visible = boolean
        this.orangeSelector.visible = boolean
    }

    returnState () {
        let types = []
        if (this.blueSelector.visible) {
            types.push("blue")
        }
        if (this.yellowSelector.visible) {
            types.push("yellow")
        }
        if (this.orangeSelector.visible) {
            types.push("orange")
        }

        return types;
    }

    resize (scale) {

    }
    
}