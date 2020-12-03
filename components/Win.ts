import app from '../index';
export default class Win extends PIXI.Container {
    public jackpot_win: any; // PIXI.Container with animation
    public continue_button: any; // Component.Button
    public conf_left: any; // PIXI.Container with animation
    public conf_right: any; // PIXI.Container with animation

    private jackpot: any;

    constructor(end: number, win: number) {
        super();

        this.jackpot = new PIXI.Text('0', {
            fontFamily: 'gilroy_extra_bold',
            fontSize: '64px',
            fill: 0xaff9fe,
            fontWeight: '900'
        });
        this.jackpot.anchor.set(.5);

        this.continue_button = new app.components.Button(
            'button_continue',
            0,
            100,
            ()=>{
                app.soundController.play('click_interface');

                app.curtain.jackpotFlag = false;
                app.curtain.jackpot_curtain.parent.removeChild(app.curtain.jackpot_curtain);
                this.parent.removeChild(this);
                this.jackpot_win.group.destroy({texture:true,baseTexture:true});
                this.destroy({texture:true,baseTexture:true});

                setTimeout(()=>{
                    app.scene.screen.children.forEach(item => {
                        item.interactiveChildren = true;
                    });
                }, 500);
            },
            new PIXI.Text('CONTINUE', {
                fontFamily: 'gilroy_extra_bold',
                fontSize: '22px',
                fill: 0xffffff,
            }),
        );
        this.continue_button.scale.set(1.5);
        this.continue_button.visible = false;
        this.continue_button.label.y = 0;

        let win_type: string;
        if(end >= 8 && end <= 15) win_type = 'big_win';
        if(end >= 1 && end <= 7) win_type = 'huge_win';

        this.jackpot_win = app.animationManager.parserAnimation({
            keyframes: app.animations[win_type],
            prefix: '',
            infinite: false,
            textures: app.resources[app.assets_url+"wins.json"].textures
        });
        this.jackpot_win.group.position.set(-365, -860);

        this.position.set(0, -15);

        this.on('added', ()=>{
            app.resizeHandler();

            this.addChild(this.jackpot_win.group, this.jackpot, this.continue_button);
            this.addConfetti('left');
            this.addConfetti('right');
            this.jackpotGrowing(win, win_type);

            app.soundController.play('pre_big_huge_win');
        });
    }

    jackpotGrowing(maxNumber: number, win_type: string) {
        const _this = this;
        this.jackpot.text = 0;
        let win_string = maxNumber.toString();
        let time_step: number = 20;
        let all_time: number;
        switch(win_string.length) {
            case 1:
                all_time = 0.5;
            break;
            case 2:
                all_time = 0.8;
            break;
            case 3:
                all_time = 1.5;
            break;
            case 4:
                all_time = 2;
            break;
            case 5:
                all_time = 3.5;
                time_step = 24;
            break;
            case 6:
                all_time = 5;
                time_step = 28;
            break;
            case 7:
                all_time = 7;
                time_step = 29;
            break;
            case 8:
                all_time = 8;
                time_step = 30;
            break;
        }

        const win = parseInt(win_string);
        const scale = (win/all_time/time_step);
        setTimeout(function run() {
            const jackpot = _this.jackpot.text.replace(/\s/g,'')*1;
            if(parseInt(_this.jackpot.text) < win) {
                _this.jackpot.text = Math.floor((jackpot+scale)).toString();

                setTimeout(run, time_step);
            } else {
                _this.jackpot.text = maxNumber.toLocaleString('ru');
                app.soundController.play(win_type);

                setTimeout(()=>{
                    _this.continue_button.visible = true;
                }, 1000);
            }
        });
        app.resizeHandler();
    }

    addConfetti(side: string) { // left or right        
        const displayContainer = new PIXI.Container();
        displayContainer.position.set(side == 'left' ? -350: 350, -10);
        this.addChild(displayContainer);
        this[`conf_${side}`] = displayContainer;

        const emitter = app.scene[`conf_${side}`].getParticleEmitter('Confetti');
        setTimeout(()=>{
            emitter.init(displayContainer);
        }, 1500);

        app.allTimeouts.push(setTimeout(() => {
            app.curtCont.removeChild(displayContainer);
            displayContainer.destroy({texture:true, baseTexture:true});
            this[`conf_${side}`] =  '';
        }, 5000));
    }
}