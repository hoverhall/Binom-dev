import app from '../index';
import config from './config';
export default class BalancePanel extends PIXI.Sprite {
    private back_panel: PIXI.Sprite;

    private options: PIXI.Sprite;
    private games: PIXI.Sprite;
    private credits_panel: any; // more than container
    private coin: PIXI.Sprite;

    private balance: PIXI.Text;
    private real_balance: PIXI.Text;
    private interfaceButtons: any;

    private add: any; // Components.Button
    private add_text: PIXI.Text;

    private currency_name: string;

    constructor() {
        super(app.loader.resources[app.assets_url+'ui.json'].textures['menu_bar.png']);

        this.anchor.set(0, .5);
        this.position.set(0, 35);

        this.back_panel = new PIXI.Sprite(app.loader.resources[app.assets_url+'ui.json'].textures['menu_bar.png']);
        this.back_panel.anchor.set(0, .5);
        this.back_panel.width = this.width*2;
        this.addChild(this.back_panel);

        this.options = new app.components.Button(
            app.loader.resources[app.assets_url+'ui.json'].textures,
            'options',
            40,
            0,
            ()=>{
            });
        this.options.interactive = false;

        this.games = new app.components.Button(
            app.loader.resources[app.assets_url+'ui.json'].textures,
            'games',
            40+this.options.width*1.25,
            0,
            ()=>{
            });
        this.games.interactive = false;

        this.credits_panel = new PIXI.Container();
        this.credits_panel.panel = new PIXI.Sprite(app.loader.resources[app.assets_url+'ui.json'].textures['credits_panel.png']);
        this.credits_panel.panel.anchor.set(0, 0.5);
        this.credits_panel.position.set(150, 1);
        this.credits_panel.addChild(this.credits_panel.panel);

        this.coin = new PIXI.Sprite(app.loader.resources[app.assets_url+'ui.json'].textures['coin_icon.png']);
        this.coin.anchor.set(.5);
        this.coin.x = 10;

        this.balance = new PIXI.Text('0', {
            fontFamily: 'tofbold',
            fontSize: '48px',
            fill: 0xfae2c5
        });
        this.balance.anchor.set(0, .5);
        this.balance.scale.set(.5);
        this.balance.position.set(this.credits_panel.panel.width/6, -5);

        this.real_balance = new PIXI.Text('0', {
            fontFamily: 'tofmedium',            
            fontSize: '24px',
            fill: 0x4e4a60
        });
        this.real_balance.anchor.set(0, .5);
        this.real_balance.scale.set(.5);
        this.real_balance.position.set(this.balance.x, 14);

        this.add = new app.components.Button(
            app.loader.resources[app.assets_url+'ui.json'].textures,
            'add',
            this.credits_panel.panel.width-45,
            0,
            ()=>{
                app.response.cashier();
            }
        );

        this.add_text = new PIXI.Text('ADD', {
            fontFamily: 'tofbold',            
            fontSize: '16px',
            fill: 0xfae2c5,
            dropShadow: true,
            dropShadowColor: '#5b7248',
            dropShadowDistance: 0,
            dropShadowBlur: 5
        });
        this.add_text.anchor.set(.5);
        this.add.addChild(this.add_text);
        this.add.childs.push(this.add_text);

        this.addChild(/*this.options, this.games,*/ this.credits_panel);
        this.credits_panel.addChild(this.coin, this.add, this.balance, this.real_balance);
    }

    changeBalance(lastResponse) {
        if(lastResponse.currency) {
            this.currency_name = lastResponse.currency;
        }
        if(!lastResponse.coin_balance || lastResponse.coin_balance == 0) lastResponse.coin_balance = 0;
        this.balance.text = lastResponse.coin_balance.toLocaleString('ru');
        this.real_balance.text = lastResponse.real_balance.toLocaleString('ru')+'  '+this.currency_name;
    }

    changeBalanceWithBet (balance) {
        if (parseInt(this.balance.text) - balance >= 0) {
            this.balance.text = (parseInt(this.balance.text) - balance).toLocaleString('ru');
            this.real_balance.text = (parseInt(this.balance.text) / config.service.denomination - balance).toLocaleString('ru')+'  '+this.currency_name;
        } else {
            this.balance.text = "0";
            this.real_balance.text = "0";
        }

    }

    resize (scale) {
        const width = app.screen.width;
        const height = app.screen.height;

        this.width = width
        this.height = height * .2

        this.scale.set(scale * 1.2);
        this.y = this.height/3;
        this.back_panel.width = width/this.scale.x * 2;

        app.landscape && this.credits_panel.position.set(150, 1);
        app.portrait && this.credits_panel.position.set(20, 1);
    }
}