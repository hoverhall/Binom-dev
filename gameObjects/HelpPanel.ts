import app from '../index';
import config from './config';

export default class HelpPanel extends PIXI.Container {
    public showRequest: boolean = false;

    private sprite: PIXI.mesh.NineSlicePlane;
    private map: PIXI.Sprite;
    private text: PIXI.Text;
    private container: PIXI.Container;
    private loaders: any;
    private closeText: any;

    constructor() {
        super();
        this.loaders = { // loader_prg_bg.png
            bg: app.loader.resources[app.assets_url+'info.json'].textures['help_bg.png'],
            tableHorizontal: app.loader.resources[app.assets_url+'info.json'].textures['paytable_horizontal.png'],
            tableVertical: app.loader.resources[app.assets_url+'info.json'].textures['paytable_vertical.png'],
        }
        let textStart;
        if (app.portrait) {
            this.interactive = true;
            this.showRequest = false;
            this.on('pointertap', () => {
                this.visible = false;
                app.soundController.play('click_interface');
            });
    
            this.sprite = new PIXI.mesh.NineSlicePlane(this.loaders.bg, 20, 20, 20, 20);
            this.sprite.width = app.screen.width - app.screen.width / 9
            this.sprite.height = app.screen.height - app.screen.height / 9
    
            this.map = new PIXI.Sprite(this.loaders.tableVertical)
            this.map.position.set(this.sprite.width / 2, this.sprite.height / 1.8)
            this.map.scale.set()
            this.map.width = this.sprite.width / 1.2
            this.map.height = this.sprite.height / 2.3
            textStart = this.sprite.width*.08;

        } else if (app.landscape) {
            this.position.set((app.screen.width / 9) / 2, -30);
    
            this.interactive = true;
            this.showRequest = false;
            this.on('pointertap', () => {
                this.visible = false;
    
                app.soundController.play('click_interface');
            });
    
            this.sprite = new PIXI.mesh.NineSlicePlane(this.loaders.bg, 20, 20, 20, 20);
            this.sprite.width = app.screen.width - app.screen.width / 9
            this.sprite.height = app.screen.height - app.screen.height / 9
    
            this.map = new PIXI.Sprite(this.loaders.tableHorizontal)
            this.map.position.set(this.sprite.width / 2, this.sprite.height / 1.6)
            this.map.scale.set()
            this.map.width = this.sprite.width / 1.8
            this.map.height = this.sprite.height / 1.8
            textStart = this.sprite.width*.08;
        }

        this.text = new PIXI.Text(
            `Drop balls of different colors on the field with pins. Watch them fall`+
            ` into baskets in the bottom of the field. Each ball matches only to`+
            ` basket of same color. There is a bet multiplier on each basket`,
            {
                fontFamily: 'tofmedium',
                fontSize: '38px',
                fill: "#FBE5C2",
            }
        );
        this.text.scale.set(.5);
        this.text.position.set(textStart, this.sprite.height*.12);
        this.text.resolution = 2;
        this.text.style.wordWrap = true;
        this.text.style.wordWrapWidth = this.sprite.width*1.75;

        const title = new PIXI.Text("Symbols", {
            fontFamily: 'tofsemibold',
            fontSize: '60px',
            fill: "#FBE5C2"
        });
        title.anchor.set(.5);
        title.scale.set(.5);
        title.position.set(this.sprite.width/2, this.text.y+this.text.height+20);
        title.resolution = 2;

        this.sprite.addChild(this.text, this.map)

        this.addChild(this.sprite);

        this.sprite.height = this.height + 15;

        let _this = this

        window.addEventListener("orientationchange", function() {
            _this.resize(1)
        });
        this.visible = false
    }

    public resize(scale) {
        let textStart;
        if (app.portrait) {
            setTimeout(() => {
                this.sprite.removeChildren()
                this.sprite.width = app.screen.width - app.screen.width / 6
                this.sprite.height = app.screen.width - app.screen.width / 18

                textStart = this.sprite.width*.08;
                this.sprite.x = - (this.sprite.width / 2)
                this.sprite.y = - (this.sprite.height / 2)
                console.log(this.getGlobalPosition().y)
                this.map = new PIXI.Sprite(this.loaders.tableVertical)
        
                this.interactive = true;
                this.showRequest = false;

                this.text = new PIXI.Text(
                    `Drop balls of different colors on the field with pins. Watch them fall`+
                    ` into baskets in the bottom of the field. Each ball matches only to`+
                    ` basket of same color. There is a bet multiplier on each basket`,
                    {
                        fontFamily: 'tofmedium',
                        fontSize: this.sprite.width * 0.030,
                        fill: "#FBE5C2",
                    }
                );
                this.text.anchor.set(.5, 0)
                // this.text.scale.set(.45);
                this.text.position.set(this.sprite.width / 2, this.sprite.height*.12);
                this.text.resolution = 2;
                this.text.style.wordWrap = true;
                this.text.style.wordWrapWidth = this.sprite.width * 0.75;
                this.text.style.align = "left"
        
                this.map.position.set(this.sprite.width / 2, this.sprite.height / 1.75)
                this.map.scale.set(this.sprite.width * 0.0007)

                this.closeText = new PIXI.Text(
                    `TAP HERE TO CLOSE IT`,
                    {
                        fontFamily: 'bluntreg',
                        fontSize: this.sprite.width * 0.040,
                        fill: "#a48bc4",
                    }
                );
                this.closeText.anchor.set(.5, .5)
                // this.text.scale.set(.45);
                this.closeText.position.set(this.sprite.width / 2, this.sprite.height - this.closeText.height);
                this.closeText.style.align = "center"

                this.sprite.addChild(this.text, this.map)
            }, 200)
        } else if (app.landscape) {
            textStart = this.sprite.width*.15;
            setTimeout(() => {
                this.sprite.removeChildren()
                this.sprite.width = app.screen.height - app.screen.height / 4
                this.sprite.height = app.screen.height - app.screen.height / 4

                this.sprite.x = - (this.sprite.width / 2)
                this.sprite.y = - (this.sprite.height / 2)
                this.map = new PIXI.Sprite(this.loaders.tableHorizontal)
        
                this.interactive = true;
                this.showRequest = false;

                this.text = new PIXI.Text(
                    `Drop balls of different colors on the field with pins. Watch them fall`+
                    ` into baskets in the bottom of the field. Each ball matches only to`+
                    ` basket of same color. There is a bet multiplier on each basket`,
                    {
                        fontFamily: 'tofmedium',
                        fontSize: this.sprite.width * 0.025,
                        fill: "#FBE5C2",
                    }
                );
                this.text.anchor.set(.5, 0)
                // this.text.scale.set(.45);
                this.text.position.set(this.sprite.width / 2, this.sprite.height*.12);
                this.text.resolution = 2;
                this.text.style.wordWrap = true;
                this.text.style.wordWrapWidth = this.sprite.width * 0.80;
                this.text.style.align = "left"
        
                this.map.position.set(this.sprite.width / 2, this.sprite.height / 1.65)
                this.map.scale.set(this.sprite.width * 0.0007)

                this.closeText = new PIXI.Text(
                    `TAP HERE TO CLOSE IT`,
                    {
                        fontFamily: 'bluntreg',
                        fontSize: this.sprite.width * 0.035,
                        fill: "#a48bc4",
                    }
                );
                this.closeText.anchor.set(.5, .5)
                // this.text.scale.set(.45);
                this.closeText.position.set(this.sprite.width / 2, this.sprite.height - this.closeText.height);
                this.closeText.style.align = "center"
                
                this.sprite.addChild(this.text, this.map)
            }, 200)
        }

        const width = app.screen.width;
        const height = app.screen.height;
        this.position.set(width/2, height/2);
        if(PIXI.utils.isMobile.any) {
            this.sprite.width = width*.975;
            this.sprite.height = height*.92;
        }
    }
}