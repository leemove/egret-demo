var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var FruitBox = (function (_super) {
    __extends(FruitBox, _super);
    function FruitBox() {
        var _this = _super.call(this) || this;
        _this.touchEnabled = true;
        return _this;
    }
    FruitBox.prototype.show = function () {
        this.graphics.beginFill(0xff00ff, 0);
        this.graphics.drawRect(0, 80, this.stage.width, this.stage.height - 160);
        this.graphics.endFill();
    };
    return FruitBox;
}(egret.Shape));
__reflect(FruitBox.prototype, "FruitBox");
