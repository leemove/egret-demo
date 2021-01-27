class FruitBox extends egret.Shape {

    constructor () {
        super()
        this.touchEnabled = true;
    }

    show() {
        this.graphics.beginFill(0xff00ff, 0)
        this.graphics.drawRect(0, 80, this.stage.width, this.stage.height - 160)
        this.graphics.endFill()

    }
}