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
var Fruit = (function (_super) {
    __extends(Fruit, _super);
    function Fruit(v, factor) {
        var _this = _super.call(this) || this;
        _this.v = v;
        _this.factor = factor;
        _this.r = _this.v * _this.factor;
        _this.graphics.beginFill(0xffff00);
        _this.graphics.drawCircle(0, 0, _this.r);
        _this.graphics.endFill();
        return _this;
    }
    return Fruit;
}(egret.Shape));
__reflect(Fruit.prototype, "Fruit");
