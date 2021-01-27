class Fruit extends egret.Shape{
    r: number
    constructor (public v: number, private factor: number) {
        super() 
        this.r = this.v*this.factor
        this.graphics.beginFill(0xffff00)
        this.graphics.drawCircle(0,0, this.r)
        this.graphics.endFill()
    }
}