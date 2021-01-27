//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
    world: p2.World;
    currentFruit: Fruit;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        // await platform.login();
        // const userInfo = await platform.getUserInfo();
        // console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.log('网络加载错误')
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.createBackground()
        this.createScore()
        var factor: number = this.width / 24;
        const fruitBox = new FruitBox();
        this.addChild(fruitBox)
        fruitBox.show()
        // let fruit = this.addFruitTop()
        this.currentFruit = this.createFruit(factor)
        this.stage.addChild(this.currentFruit)

        const world = this.createPhysics(factor)

        fruitBox.addEventListener('touchEnd', (e) => {
            var self = this;

            if (!self.currentFruit) {return}
            //鼠标点击添加刚体
            const {stageWidth, stageHeight} =this.stage
            function addOneBox(e: egret.TouchEvent): void {
                let positionX: number = Math.floor(Math.min(e.stageX, stageWidth - 40) / factor);
                let positionY: number = Math.floor((self.stage.stageHeight - 160 ) / factor);
                let boxShape = new p2.Circle({ radius: self.currentFruit.v });
                let boxBody: p2.Body = new p2.Body({ mass: 1, position: [positionX, positionY] });
                boxBody.addShape(boxShape);
                world.addBody(boxBody);
                function createBall(r: number){
                    var shape = new egret.Shape();
                    shape.graphics.beginFill(0xfff000);
                    shape.graphics.drawCircle(r, r, r);
                    shape.graphics.endFill();
                    return shape;
                }
                let display = createBall(boxShape.radius * factor);
                display.anchorOffsetX = display.width / 2;
                display.anchorOffsetY = display.height / 2;
                self.stage.addChild(display)
                self.stage.removeChild(self.currentFruit)
                self.currentFruit = null;
                boxBody.displays = [display];
                (boxBody as any).rolling = true;
            }
            addOneBox(e)
            setTimeout(() => {
                self.currentFruit = self.createFruit(self.stage.width / 24);
                self.stage.addChild(self.currentFruit)
            }, 300);
        }, this)
    }


    

    createFruit (factor: number) {
        const fruit = new Fruit(Math.floor(Math.random() * 4) + 1, factor)
        fruit.x  = (this.stage.stageWidth / 2)
        fruit.y  = 20
        return fruit
    }

    downFruit () {

    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        // let parser = new egret.HtmlTextParser();

        // let textflowArr = result.map(text => parser.parse(text));
        // let textfield = this.textfield;
        // let count = -1;
        // let change = () => {
        //     count++;
        //     if (count >= textflowArr.length) {
        //         count = 0;
        //     }
        //     let textFlow = textflowArr[count];

        //     // 切换描述内容
        //     // Switch to described content
        //     textfield.textFlow = textFlow;
        //     let tw = egret.Tween.get(textfield);
        //     tw.to({ "alpha": 1 }, 200);
        //     tw.wait(2000);
        //     tw.to({ "alpha": 0 }, 200);
        //     tw.call(change, this);
        // };

        // change();
    }

    private createScore () {
        let score = new egret.TextField()
        score.text = '0'
        score.x = 10
        score.y = 10
        this.addChild(score)
    }

    createPhysics (factor) {
        //创建world
        var world: p2.World = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        world.gravity = [0, -50]
        function createPlane(angle:number=Math.PI,x:number,y:number):p2.Body
        {
            var shape = new p2.Plane();
            var body = new p2.Body({mass:0});
            body.addShape(shape);
            body.angle = angle;
            body.position[0]=x;
            body.position[1]=y;
            body.displays = []
            world.addBody(body);
            return body;
        }
        createPlane(0,0,0)
        createPlane(-Math.PI/2,0,0);//最左边
        createPlane(Math.PI/2,this.stage.stageWidth /factor,0);//最左边
        const self = this;
        egret.Ticker.getInstance().register(function(dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            world.step(dt / 1000);

            var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
            var l = world.bodies.length;
            for (var i: number = 0; i < l; i++) {
                var boxBody: p2.Body = world.bodies[i];
                var box: egret.DisplayObject = boxBody.displays[0];
                if (box) {
                    box.x = boxBody.position[0] * factor;
                    box.y = (stageHeight - 85) - boxBody.position[1] * factor;
                    // box.y = boxBody.position[1] * factor
                    box.rotation = 360 - (boxBody.angle + boxBody.shapes[0].angle) * 180 / Math.PI;
                    if (boxBody.sleepState == p2.Body.SLEEPING && (boxBody as any).rolling) {
                        // box.alpha = 0.5;
                        (boxBody as any).rolling = false;
                       
                    }
          
                }
            }

        }, this);
        return world
    }

    private createBackground () {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let background = new egret.Shape()
        background.graphics.beginFill(0xcd853f)
        background.graphics.drawRect(0,0,stageW,stageH)
        background.graphics.lineStyle(5, 0xf4a460)

        // 虚线
        let start = 0;
        while(start <= stageW) {
            const end = Math.min(start + 20, stageW)
            background.graphics.moveTo(start, 80)
            background.graphics.lineTo(end, 80)
            start = end + 10;

        }
        
        background.graphics.moveTo(0, stageH - 80)
        background.graphics.lineTo(stageW, stageH - 80)
        background.graphics.beginFill(0xffd700)
        background.graphics.lineStyle(0)
        background.graphics.drawRect(0,0,stageW, stageH -80)
        this.addChild(background)
    }
}