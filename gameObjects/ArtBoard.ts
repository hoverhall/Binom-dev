import app from '../index'
import config from './config';
import { clearInterval } from 'timers';
import Route from '../routes/routes';
import { time } from 'console';

export default class ArtBoard extends PIXI.Sprite {
    private sideLeft: PIXI.Sprite;
    private sideRight: PIXI.Sprite;
    private winArea: PIXI.Sprite;

    private slots: any;
    private coin: any;
    private bet: any;
    private credits: any;
    private bet_volume: any;
    private credits_volume: any;
    private credits_volume_text: any;

    private betBtn: any;
    private betBtnText: any;
    private autoBtn: any;
    private autoBtnText: any;

    private blueBall: any;
    private yellowBall: any;
    private orangeBall: any;

    private ballButtons: any;
    private ballIndex: any;
    private lastBallIndex: any;

    private balanceOut: any;
    private balanceOutText: any;

    private pinHighlight: any;

    private changeState: any;    
    private startStop: any;
    private pins: any;
    private index: any;
    private betVolume: any
    private gameStarted: any;
    private winText: any;
    private winTextVolume: any;
    private infoText: any;

    constructor () {
        super(app.loader.resources[app.assets_url+'artboard.json'].textures['Artboard3.png']);
        console.log(config.service.loginRespons)

        this.ballIndex = 0
        this.lastBallIndex = 0
        
        this.sideLeft = new PIXI.Sprite(app.loader.resources[app.assets_url+'artboard.json'].textures['side_left.png'])
        this.sideRight = new PIXI.Sprite(app.loader.resources[app.assets_url+'artboard.json'].textures['side_right.png'])
        this.winArea = new PIXI.Sprite(app.loader.resources[app.assets_url+'winarea.json'].textures['win_area.png'])

        this.betBtn = new app.components.Button(
            app.loader.resources[app.assets_url+'actionelements.json'].textures,
            'bet',
            -280,
            870,
            ()=>{
                
            }
        );
        this.betBtn.on("pointerdown", () => {
            this.betBtnText.anchor.set(.5, .5);
        })

        this.betBtn.on("pointerup", () => {
            this.betBtnText.anchor.set(.5, .6);
            this.makeBet()
        })

        this.betBtnText = new PIXI.Text('BET', {
            fontFamily: 'bluntreg',            
            fontSize: 45,
            fill: "#fddaac", 
            dropShadow: true,
            dropShadowColor: '#5b7248',
            dropShadowDistance: 0,
            dropShadowBlur: 5
        });
        this.betBtnText.anchor.set(.5, .6);
        this.betBtn.addChild(this.betBtnText);
        this.betBtn.childs.push(this.betBtnText);

        this.changeState = true
        this.startStop = true

        this.infoText = new PIXI.Text("└ DROP THE BALL ┘", {
            fontFamily: "bluntreg",
            fill: "#8A95F1",
            fontSize: 30
        });
        this.infoText.position.set(37, 930)
        this.infoText.anchor.set(.5, 0)

        this.autoBtn = new app.components.Button(
            app.loader.resources[app.assets_url+'actionelements.json'].textures,
            'start',
            280,
            870,
            ()=>{
                
            }
        );
        this.autoBtn.buttonState("hover")
        this.autoBtn.on("pointerout", () => {
            this.changeState && this.autoBtn.buttonState("hover")
        })
        let actionCode = 1

        this.autoBtn.on("pointerdown", () => {
            this.autoBtnText.anchor.set(.5, .5)
        })
        this.autoBtn.on("pointerup", () => {
            switch (actionCode) {
                case 1:
                    this.autoBtn.buttonState("on")
                    this.autoBtnText.text = 'START'
                    this.autoBtnText.style.fontSize = 40
                    config.service.ArtBoard.autoActivated = false
                    config.service.ArtBoard.autoStarted = false
                    this.changeState = false
                    this.infoText.text = "└ SELECT BALL COLORS ┘"
                    this.infoText.style.fontSize = 22.5
                    this.ballButtons.changeState("off", true)
                    this.ballButtons.setInteractive(true)
                    actionCode++
                break;

                case 2:
                    this.autoBtn.buttonState("on")
                    this.autoBtnText.text = 'STOP'
                    this.autoBtnText.style.fontSize = 45
                    config.service.ArtBoard.autoActivated = true
                    config.service.ArtBoard.autoStarted = false
                    // this.changeState = false
                    // this.ballButtons.changeState("off", false)
                    this.ballButtons.setInteractive(false)
                    actionCode++
                break;

                case 3:
                    this.autoBtn.buttonState("hover")
                    this.infoText.text = "└ DROP THE BALL ┘"
                    this.infoText.style.fontSize = 30
                    this.autoBtnText.text = 'AUTO'
                    this.autoBtnText.style.fontSize = 45
                    config.service.ArtBoard.autoStarted = true
                    config.service.ArtBoard.autoActivated = false
                    this.changeState = true
                    this.ballButtons.changeState("on")
                    this.ballButtons.setInteractive(true)
                    this.ballButtons.setVisible(false)
                    actionCode = 1
                break;
            }

            this.autoBtnText.anchor.set(.5, .6);
            this.autoBtn.addChild(this.autoBtnText);
            this.autoBtn.childs.push(this.autoBtnText);

            // this.ballButtons.changeState()
        })

        this.autoBtnText = new PIXI.Text('AUTO', {
            fontFamily: 'bluntreg',            
            fontSize: 45,
            fill: 0xfae2c5,
            dropShadow: true,
            dropShadowColor: '#5b7248',
            dropShadowDistance: 0,
            dropShadowBlur: 5
        });
        this.autoBtnText.anchor.set(.5, .6);
        this.autoBtn.addChild(this.autoBtnText);
        this.autoBtn.childs.push(this.autoBtnText);

        this.bet = new PIXI.Text("BET", {
            fontFamily: "bluntreg",
            fill: "white",
        });

        this.bet.anchor.set(.5, .5) 

        this.bet_volume = new PIXI.Text("0", {
        fontFamily: "bluntreg",
        fill: "#8A95F1",
        });
        this.bet_volume.anchor.set(0, .5)
        this.bet.addChild(this.bet_volume)

        this.credits = new PIXI.Text("CREDITS", {
            fontFamily: "bluntreg",
            fill: "#fddaac", 
        });

        this.credits.anchor.set(.5, .5) 

        this.credits_volume = new PIXI.Text("0", {
            fontFamily: "bluntreg",
            fill: "#8A95F1",
        });
        this.credits_volume.anchor.set(0, .5)
        this.credits.addChild(this.credits_volume)
        this.credits_volume_text = config.service.lastResponse["coin_balance"]

        this.coin = new PIXI.Sprite(app.loader.resources[app.assets_url+'ui.json'].textures['coin_icon.png']);
        this.coin.anchor.set(.5, .5);
        this.coin.addChild(this.bet, this.credits)

        this.ballButtons = new app.gameObjects.BallsButtons(-65, 870, this)
        this.ballButtons.pivot.set(.5, .5)

        this.balanceOut = new PIXI.Sprite(app.loader.resources[app.assets_url+'actionelements.json'].textures['out_of_funds.png']);
        this.balanceOut.visible = false
        this.balanceOutText = new PIXI.Text("NO CREDITS FOR THE BET\nPLEASE REFILL DEPOSITE", {
            fontFamily: "bluntreg",
            fill: "white",
        });
        this.balanceOutText.anchor.set(.5)
        this.balanceOut.addChild(this.balanceOutText)

        this.addChild(this.sideLeft, this.sideRight, this.winArea, this.betBtn, this.autoBtn, this.coin, this.ballButtons, this.balanceOut, this.infoText)

        this.initPayTable()
        this.initPins()

        app.interval(() => {
            if (this.credits_volume.text == "0") {
                this.updateCredits()
            }
            if (config.service.lastResponse["coin_balance"] < config.service.loginRespons["bets"][0] ||
            config.service.lastResponse["coin_balance"] < this.betVolume) {
                // this.betVolume = 0
                // this.bet_volume.text = "10"
                this.ballButtons.setInteractive(false)
                this.autoBtn.interactive = false
                this.balanceOut.visible = true
            } else {
                this.balanceOut.visible = false
                this.ballButtons.setInteractive(true)
                this.autoBtn.interactive = true
            }
        }, 10)
        // app.interval(() => {
        //     if (!this.gameStarted) {
        //         this.ballIndex = 0
        //         config.service.queue = []
        //     }
        // }, 2000)
        let i = 0;
        app.interval(() => {
            if (config.service.ArtBoard.autoActivated && !config.service.ArtBoard.autoStarted) {
                let balls = this.ballButtons.returnState()
                let ball = balls[i]
                let randomPosition = Math.floor(Math.random() * 2)
                if (balls.length > 0) {
                    this.startGame(ball, randomPosition)
                }
                i++
                if (i >= balls.length) {
                    i = 0
                }
            }
        }, 500)
        this.index = 0
        this.makeBet()
        this.changeCredits(config.service.lastResponse)
        
        this.winText = new PIXI.Text("", {
            fontFamily: "bluntreg",
            fill: "#2bff1c",
            fontSize: 18
        });
        this.winText.alpha = 0
        this.winTextVolume = 0
        this.credits_volume.addChild(this.winText)
        this.updateCreditsBeforeEnd()
    }

    makeBet () {
        if (config.service.lastResponse["coin_balance"] >= config.service.loginRespons["bets"][0]) {
            this.index++
            // if (config.service.loginRespons["bets"][this.index - 1] <= config.service.lastResponse["coin_balance"]) {
                if (this.index != config.service.loginRespons["bets"].length) {
                    this.betVolume = config.service.loginRespons["bets"][this.index - 1]
                } else {
                    this.betVolume = config.service.loginRespons["bets"][this.index - 1]
                    this.index = 0
                }
                if (this.betVolume <= 0) {
                    this.betVolume = 0
                    this.bet_volume.text = this.betVolume.toLocaleString('ru')
                } else {
                    this.bet_volume.text = this.betVolume.toLocaleString('ru')
                }
                // this.updateCredits()
            // } else {
            //     this.index = 1
            //     this.betVolume = config.service.loginRespons["bets"][this.index - 1]
            //     this.bet_volume.text = this.betVolume.toLocaleString('ru')
            //     this.changeCredits()
            // }
        }
    }

    startGame (type, randomPosition) {
        console.log(this.betVolume, this.credits_volume_text, this.credits_volume_text - this.betVolume)
        if (this.betVolume != 0 && this.credits_volume_text - this.betVolume >= 0 && this.credits_volume.text != "0") {
            this.gameStarted = true
            let winVolume = 2000;
            let win_position;
            new Promise((resolve) => {
                console.log(type == "orange" ? "red" : type)
                app.request({action: "start", bet: this.betVolume, ball: type == "orange" ? "red" : type}, (responseData) => {
                    console.log(responseData)
                    if (config.service.lastResponse["coin_balance"] -
                        this.betVolume >= 0) {
                            // if (config.service.queue.length < 1) {
                                this.credits_volume_text = this.credits_volume_text
                                                    //    - config.service.response["win"] * config.service.denomination
                                                    //    - config.service.response["bet"]
                                                       - this.betVolume

                                this.credits_volume.text = (this.credits_volume_text
                                                        // - config.service.response["win"] * config.service.denomination 
                                                        // - config.service.response["bet"]
                                                        - this.betVolume
                                                        ).toLocaleString('ru')
                            // } else {
                            //     this.credits_volume_text = config.service.queue[0]["coin_balance"]
                            //                             //    - config.service.response["win"] * config.service.denomination
                            //                             //    - config.service.queue[config.service.queue.length - 1]["bet"] 
                            //                                - this.betVolume

                            //     this.credits_volume.text = (config.service.queue[0]["coin_balance"]
                            //                                 // - config.service.response["win"] * config.service.denomination
                            //                                 // - config.service.queue[config.service.queue.length - 1]["bet"]
                            //                                 - this.betVolume
                            //                                 ).toLocaleString('ru')
                            // }
                    } else {
                        this.changeCredits(config.service.lastResponse)
                    }

                    // config.service.queue.push(Object.assign({}, config.service.response))

                    let balance = 0
                    if (config.service.response["coin_balance"] - 
                    config.service.response["bet"] >= 0) {
                        balance = config.service.response["coin_balance"] - 
                                  config.service.response["bet"]
                    }

                    // app.scene.balance_panel.changeBalanceWithBet(config.service.response["bet"]);
                    winVolume = config.service.response["win"] * config.service.denomination
                    this.ballIndex += 1
                    config.service.queue.push(config.service.response)
                    this.updateCreditsBeforeEnd()
                    let interval = app.interval(() => {
                        if (typeof(config.service.response) !== "undefined") {
                            app.clearTimer(interval)
                            resolve({
                                "win_position": config.service.response["win_position"],
                                "coin_balance": config.service.response["coin_balance"],
                                "real_balance": config.service.response["real_balance"]
                            })
                        }
                    })
                })
            }).then((res) => {
                this.createFallingBall(type, randomPosition, res["win_position"], winVolume, this.ballIndex, res)
            })
        }
    }

    changeCredits(response) {
        if (!this.gameStarted) {
            if (this.credits_volume_text - this.betVolume < 0) {
                this.credits_volume.text = "0"
                this.credits_volume_text = 0
            } else {
                console.log((parseInt(this.credits_volume.text.replace(" ", "")) - this.betVolume))
                this.credits_volume_text = response["coin_balance"]
                this.credits_volume.text = (this.credits_volume_text).toLocaleString('ru')
            }
            app.scene.balance_panel.changeBalance(response);
        }
    }

    updateCredits() {
        if (config.service.lastResponse["coin_balance"] - this.betVolume < 0) {
            this.credits_volume.text = "0"
            this.credits_volume_text = 0
        } else {
            this.credits_volume.text = (config.service.lastResponse["coin_balance"] - this.betVolume).toLocaleString('ru')
            this.credits_volume_text = config.service.lastResponse["coin_balance"] - this.betVolume
        }
        // app.scene.balance_panel.changeBalance(config.service.lastResponse);
    }

    updateCreditsBeforeEnd () {
        if (this.credits_volume_text - this.betVolume < 0) {
            this.credits_volume.text = "0"
            this.credits_volume_text = 0
        } else {
            console.log((parseInt(this.credits_volume.text.replace(" ", "")) - this.betVolume))
            // this.credits_volume_text = response["coin_balance"] - this.betVolume
            this.credits_volume.text = (this.credits_volume_text).toLocaleString('ru')
        }
    }

    initPayTable() {
        let x = this.winArea.width / 2 * -1 + 24
        let y = this.winArea.height / 2 * -1 + 30

        config.service.lastResponse["pay_table"].forEach((element, i) => {
            element.forEach((item, n) => {
                let fill;
                switch (i) {
                    case 0:
                        fill = "#5CB0FF"
                        break;
                    
                    case 1:
                        fill = "#FEC745"
                        break;

                    case 2:
                        fill = "#EB3B50"
                        break;
                }

                let text = new PIXI.Text(item, {
                    fontFamily: "bluntcon",
                    fill: fill,
                    fontSize: 21
                });
        
                text.anchor.set(.5, .5)
                text.x = x
                text.y = y
                text["id"] = `${i}${n}`
                this.winArea.addChild(text)
                x += 48
            })
            x = this.winArea.width / 2 * -1 + 24
            y += 32
        })
    }

    initPins () {
        this.pins = []
        let pinCount = 0;
        let count = 3;
        for (let i = 0; 14 > i; i++) {
            let subPins = []
            for (let n = 0; count -1 >= n; n++) {
                subPins.push({pin: `${i}/${n}`, texture:
                                        app.loader.
                                        resources[app.assets_url+'artboard.json'].
                                        textures['pin_highlight.png']
                            })
            }
            this.pins.push(subPins)
            pinCount += count
            count++;
        }

        let x = -47.1;
        let y = 16;
        let i = 23

        this.pins.forEach((element) => {
            element.forEach((item) => {
                let sprite = new PIXI.Sprite(item.texture)
                sprite.anchor.set(.5)
                sprite["pin"] = item.pin
                sprite.alpha = 0
                sprite.x = x;
                x += 48.2
                sprite.y = y;
                item["sprite"] = sprite
                this.addChild(sprite)
            })
            x = -47.1 - i
            i += 24.2
            y += 48
        })
    }

    createRoute (number?, type?, position?) {
        let pins = this.pins
        let line = 0
        let route = []
        let curNumber = number
        let pinWay = 0.210
        let upperLimit = position == 0 ? 1 : 0
        let lowerLimit = position == 0 ? 0 : 1
        let startPosition = 0;
        if (type != null) {
            switch (type) {
                case "blue":
                    line = 0
                break;
                case "yellow":
                    line = 1
                break;
                case "orange":
                    line = 2
                break;
            }
        }

        for (let i = 0; config.service.loginRespons["pay_table"][line].length > i; i++) {
            // let item = config.service.loginRespons["pay_table"][line][i]
            if (i == number) {
                for (let n = this.pins.length -1; 0 <= n; n--) {
                    let item = Object.assign([], this.pins[n])
                    let p = 0
                    let way = Math.floor(Math.random() * 2)
                    switch (way) {
                        case 0:
                            item.pop();
                            if (curNumber != 0) {
                                curNumber -= 1
                                p = pinWay
                            } else {
                                curNumber = curNumber
                                p = pinWay * -1
                            }
                        break;
                        case 1:
                            item.shift();
                            if (curNumber >= this.pins[n].length - 1) {
                                curNumber -= 1
                                p = pinWay
                            } else {
                                if (curNumber < lowerLimit) {
                                    curNumber -= 1
                                    p = pinWay
                                } else {
                                    curNumber = curNumber
                                    p = pinWay * -1
                                }
                            }
                        break;
                    }
                    if (curNumber < 0) {
                        curNumber = 0
                    }
                    startPosition = curNumber
                    try {
                        route.unshift({pin: item[curNumber >= 0 ? curNumber : 0].pin, turn: p, way: way})
                    } catch (e) {
                        route.unshift({pin: item[curNumber - 1].pin, turn: p, way: way})
                    }
                }
            }
        }
        return {route: route, start: startPosition};
    }

    createFallingBall(type, position, winNumber, winVolume, ballIndex, obj) {
        let routeGrear = this.createRoute(winNumber, type, position);
        // let route = routeGrear.route
        let route;
        new Promise((res) => {
            route = Route(winNumber)
            setTimeout(() => {
                    res()
            }, 80)
        })
        .then(() => {

            let start = routeGrear.start
            let ball: PIXI.Sprite
            switch (type) {
                case "blue":
                    ball = new PIXI.Sprite(app.loader.resources[app.assets_url+'balls.json'].textures["ball_blue.png"])
                    dropBall.call(this, ball)
                break;

                case "yellow":
                    ball = new PIXI.Sprite(app.loader.resources[app.assets_url+'balls.json'].textures["ball_yellow.png"])
                    dropBall.call(this, ball)
                break;
                
                case "orange":
                    ball = new PIXI.Sprite(app.loader.resources[app.assets_url+'balls.json'].textures["ball_red.png"])
                    dropBall.call(this, ball)
                break
            }
            ball.anchor.set(.5)
            ball.y = -40;
            if (winNumber == 0) {
                ball.x -= 23
            } else if (winNumber == config.service.loginRespons["pay_table"][0].length) {
                ball.x += 24
            } else {
                switch (start) {
                    case 0:
                        ball.x -= 23
                    break;
        
                    case 1:
                        ball.x += 24
                    break;
                }
            }
            
            function dropBall (Sprite) {
                new Promise((resolve) => {
                    if (route.length !== 0) {
                        this.addChild(Sprite)
                        let p = 0.224
                        let curPin;
                        let index = 1;
                        let indexI = 0;
                        let indexN = 0;
                        let stepY = 1.05
                        let stepX = 0
                        let way = 0;
                        let turn = 0;
                        let stop = 0
                        Sprite.alpha = 0
                        let interval = app.interval(() => {
                            if (route.length !== 0) {
                                for (let i = 0; this.pins.length > i; i++) {
                                    let pin = this.pins[i]
                                    for (let n = 0; pin.length > n; n++) {
                                        if (route[index].p == pin[n]["pin"]) {
                                            curPin = pin[n]["sprite"]
                                        }
                                    }
                                }

                                Sprite.x = route[index].x - 506.5
                                Sprite.y = route[index].y - 60
                                if (Sprite.y >= -10) Sprite.alpha = 1

                                if (route[index].p != "-" && typeof(curPin) != "undefined") {
                                    for (let i = 0; this.pins.length > i; i++) {
                                        let pin = this.pins[i]
                                        for (let n = 0; pin.length > n; n++) {
                                                pin[n]["sprite"].alpha = 0
                                        }
                                    }
                                    curPin.alpha = 1
                                    setTimeout(() => {
                                        curPin.alpha = 0
                                    }, 100)
                                }
                
                                if (index >= route.length-1) {
                                    for (let i = 0; this.pins.length > i; i++) {
                                        let pin = this.pins[i]
                                        for (let n = 0; pin.length > n; n++) {
                                                pin[n]["sprite"].alpha = 0
                                        }
                                    }
                                    app.clearTimer(interval)
                                    resolve()
                                }
                                index++
                            }
                        }, 17)
                    } else {
                        console.error(`ProcessingError: Can not ${this}. Caused by route of length ${route.length}`);
                    }
                }).then(() => {
                    new Promise((resolve) => {
                        let stop = Sprite.y;
                        resolve()
                    }).then(() => {
                        new Promise((resolve) => {
                            let stop = Sprite.y - 5
                            let interval = app.interval(() => {
                                Sprite.y -= 1
                                if (Sprite.y <= stop) {
                                    app.clearTimer(interval)
                                    resolve()
                                }
                            }, 1)
                        }).then(() => {
                            let stop = Sprite.y + 5
                            let interval = app.interval(() => {
                                Sprite.y += 1
                                if (Sprite.y >= stop) {
                                    app.clearTimer(interval)
                                    app.timeout(() => {
                                        this.removeChild(Sprite)
                                        this.switchWin(type, winNumber, winVolume, ballIndex, obj)
                                    }, 10)
                                }
                            }, 1)
                        })
                    })
                })

                function lightOff(pin) {
                    let index = 0;
                    let interval = app.interval(() => {
                        pin.alpha -= 0.125
                        index += 47.05
                        if (index >= 800) {
                            app.clearTimer(interval)
                        }
                    }, 17)
                }
            }
        })
    }

    switchWin (type, winPosition, winVolume, ballIndex, obj) {
        let i;
        let linkOnTexture;
        switch (type) {
            case 'blue':
                linkOnTexture = app.loader.resources[app.assets_url+'winarea.json'].textures['win_blue.png']
                i = 0
                break;
            
            case 'yellow':
                linkOnTexture = app.loader.resources[app.assets_url+'winarea.json'].textures['win_yellow.png']
                i = 1
                break;

            case 'orange':
                linkOnTexture = app.loader.resources[app.assets_url+'winarea.json'].textures['win_red.png']
                i = 2
                break;
        }

        let id = `${i}${winPosition}`

        this.winArea.children.forEach((child: PIXI.Text, index) => {
            if (child["id"] == id) {
                let highlight = new PIXI.Sprite(linkOnTexture)
                let text = new PIXI.Text(child.text, {
                    fontFamily: "bluntcon",
                    fill: child.style.fill,
                    fontSize: 21
                });
                text.anchor.set(.5, .5)
                highlight.anchor.set(.5, .6)

                child.addChild(highlight)
                child.addChild(text)

                new Promise((resolve) => {
                    this.winOverflow(winVolume, ballIndex, obj)
                    let i = 0;
                    let scale = 1
                    let interval = app.interval(() => {
                        switch (type) {
                            case "blue":
                                text.y -= 0.5
                                break;
                            case "yellow":
                                text.y -= 2.1
                                break;
                            case "orange":
                                text.y -= 3.6
                                break;
                        }
                        text.y -= 0.5
                        highlight.alpha -= 0.05
                        text.scale.set(scale)
                        if (i > 20) {
                            app.clearTimer(interval)
                            resolve()
                        }
                        i++
                        scale += 0.025
                    }, 10)
                }).then(() => {
                    let i = 0;
                    let interval = app.interval(() => {
                        text.y -= 1
                        text.alpha -= 0.025
                        if (i > 40) {
                            app.clearTimer(interval)
                            child.removeChildren()
                            // addToCredits.call(this)
                        }
                        i++
                    }, 30)
                })
            }
        })
    }

    winOverflow(winVolume, ballIndex, obj) {
        if (this.winTextVolume == 0) {
            if (winVolume != 0) {
                this.winText.alpha = 1
                let scale = 0;
                this.winTextVolume == 0 && this.winText.scale.set(0)
                this.winTextVolume += winVolume
                this.winText.text = `+${this.winTextVolume.toLocaleString("ru")}`
                this.winText.anchor.set(0, .5)
                this.winText.x = this.credits_volume.width / 2 + 150
                // this.credits_volume.addChild(this.winText)
                let counter = 0;
                new Promise((resolve) => {
                    resolve()
                    if (this.winText.text != '') {
                        let createWin = app.interval(() => {
                            scale += 0.05
                            this.winText.scale.set(scale)
                            // winText.x -= 5
                            if (counter > 20) {
                                app.clearTimer(createWin)
                                resolve()
                            }
                            counter++
                        }, 10)
                    } else {
                        app.timeout(() => {
                            resolve()
                        }, 200)
                    }
                }).then(() => {
                    let timeOut = 1500
                    // if (config.service.ArtBoard.autoActivated) {
                    //     timeOut = 1500
                    // } else {
                    //     timeOut = 1200
                    // }
                    let creditScale = 1
                    app.timeout(() => {
                        this.winTextVolume = 0
                        let mergeWin = app.interval(() => {
                            scale -= 0.05
                            this.winText.scale.set(scale)
                            if (counter > 5 && counter < 10) {
                                creditScale += 0.025
                                this.credits_volume.scale.set(creditScale)
                            } else if (counter <= 5) {
                                creditScale -= 0.025
                                this.credits_volume.scale.set(creditScale)
                            }
                            this.winText.alpha -= 0.025
                            this.winText.x -= 5
                            if (counter < 0) {
                                app.clearTimer(mergeWin)
                                this.winText.text = ''
                                this.credits_volume.scale.set(1)
                                // this.credits_volume.removeChildren()
                                // this.winText.alpha = 0
                                this.gameStarted = false
                                
                                let balance = config.service.response["coin_balance"] - 
                                              this.winTextVolume
                                
                                // app.scene.balance_panel.changeBalanceWithBet(balance);                                
                                this.winTextVolume = 0
                                
                                console.log(config.service.queue[ballIndex < this.lastBallIndex ? this.lastBallIndex - 1 : ballIndex - 1])
                                this.changeCredits(config.service.queue[ballIndex < this.lastBallIndex ? this.lastBallIndex - 1 : ballIndex - 1])
                                this.lastBallIndex = ballIndex
                                // this.updateCredits()
                            }
                            counter--
                        })
                    }, timeOut)
                })
            } else {
                this.changeCredits(config.service.queue[ballIndex - 1])
            }
        } else {
            this.winText.x = this.credits_volume.width / 2 + 150
            this.winText.alpha = 1
            this.winTextVolume += winVolume
            this.winText.text = `+${this.winTextVolume.toLocaleString("ru")}`
        }
    }

    resize(scale) {
        this.anchor.set(.5, 0)
        if (app.portrait) {
            this.scale.set(scale*1.1)
        }
        if (app.landscape) {
            // this.height = app.screen.height / 1.8
            // this.width = app.screen.height / 1.5
            this.scale.set(app.screen.height / 1300)
        }

        this.coin.x = -320
        this.coin.y = 785
        this.coin.scale.set(0.6)

        this.bet.x = 80
        this.bet.scale.set(1.7)
        this.bet_volume.x = 40

        this.credits.x = 480
        this.credits.scale.set(1.7)
        this.credits_volume.x = 70


        this.sideLeft.anchor.set(0.98, .02)
        this.sideRight.anchor.set(0.02, .02)

        this.balanceOut.position.set(125, 870)

        // this.winArea.anchor.set(.5, 0)

        this.winArea.y = 695 // + this.winArea.height

        // this.winArea.position.set(0, this.height / 2 + this.winArea.height)
    }
} 