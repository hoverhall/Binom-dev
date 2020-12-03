import app from '../index';

export default class GameArea extends PIXI.Container {
    public artboard: any;

    constructor () {
        super()

        this.artboard = new app.gameObjects.ArtBoard()
        this.addChild(this.artboard)
    }

    resize (scale) {
        let width = app.screen.width;
        let height = app.screen.height;

        if (app.portrait) {
            this.position.set(width / 2, app.scene.balance_panel.height + 40)
        }
        if (app.landscape) {
            this.position.set(width / 2, app.scene.balance_panel.height * 1.5)
        }

        this.artboard.resize(scale)
    }
}