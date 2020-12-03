import app from '../index';
export default class Button extends PIXI.Container {
    private off_color: string = '';
    private react: Function;
    private label: PIXI.Text;

    private offf: PIXI.Sprite;
    private hover: PIXI.Sprite;
    private unhover: PIXI.Sprite;
    private onn: PIXI.Sprite;
    private pressed: PIXI.Sprite;

    private childs: Array<PIXI.Text> = [];

    public state: string = '';

    constructor(
        resources: any,
        name: string, // text name for load
        positionX: number,
        positionY: number,
        react: Function, // click
        label?: PIXI.Text,
        off_color?: string,       
        ) {
        super();
        if(off_color) this.off_color = off_color;
        this.react = react;
        
        if (name == "bats_clear" || name == "bats_undo") {
            this.unhover = new PIXI.Sprite(resources[`${name}.png`]);
            
        } else {
            this.hover = new PIXI.Sprite(resources[`${name}_hover.png`]);
            this.hover.anchor.set(.5)
            this.offf = new PIXI.Sprite(resources[`${name}_off.png`]);   
            this.offf.anchor.set(.5);
            this.onn = new PIXI.Sprite(resources[`${name}_on.png`]);
            this.onn.anchor.set(.5);
            this.pressed = new PIXI.Sprite(resources[`${name}_pressed.png`]);
            this.pressed.anchor.set(.5);
        }

        this.position.set(positionX, positionY);
        this.state = '';
        if (name == "bats_clear" || name == "bats_undo") {
            this.on("mouseover", (event) => {
                this.buttonState('hover');
                if(this.state == 'pressed') {
                    this.react();
                }
            })
            this.on("mouseout", (event) => {
                this.buttonState('!hover');
                if(this.state == 'pressed') {
                    this.react();
                }
            })
        } else {
            this.on('pointerover', (event) => {
                this.buttonState('hover');
            });
            this.on('pointerdown', (event) => {
                this.buttonState('pressed');
            });
            this.on('pointerout', (event) => {
                // if(this.state == 'pressed') {
                    this.buttonState('on');
                // }
            });
            this.on('pointerup', (event) => {
                if(this.state == 'pressed') {
                    this.buttonState('on');
                    this.react();
                }
            });
        }

        this.childs = []; // for button name (may be two or more text items)
        if(label) {
            this.label = label;
            this.label.y = -1;
            this.label.anchor.set(.5);
            this.add(label);
        }

        this.buttonState('on');
    }

    add(child: any) {
        child.off_color = this.off_color;
        child.on_color = child.style.fill;
        child.pressed_color = child.style.fill;

        this.childs.push(child);
        this.addChild(child);
    }

    buttonState(i: string) {
        this.state = i;
        this.removeChildren();
        if(this.label && this.label.y != 0) {
            this.label.y = -3;
        }
        
        switch(i) {
            case 'hover':
                this.addChild(this.hover);
                this.interactive = this.buttonMode = true;
            break;
            case 'off':
                this.addChild(this.offf);
                this.interactive = this.buttonMode = false;
            break;
            case 'on':
                this.addChild(this.onn);
                this.interactive = this.buttonMode = true;      
            break;
            case 'pressed':
                this.addChild(this.pressed);
                this.interactive = this.buttonMode = true;

                if(this.label) {
                    this.label.y += 5;
                }
            break;
        }

        if(this.childs.length>0 && this.state != '') {
            this.childs.forEach(item => {
                if(this.off_color != '') item.style.fill = item[`${i}_color`];
                this.addChild(item);
            });
        }
    }
}