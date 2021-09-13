let GameLayer = cc.Layer.extend({
    _time:null,
    _timeFruit: null,
    _snake:null,
    _fruit: null,
    _score: 0,
    lbScore: null,

    ctor:function (){
        this._super();
        this._timeFruit = null;
        this._time = null;
        this._fruit = null;
        this._snake = null;
        this._score = 0;
        this.lbScore = null;
        this.init();
    },

    init:function (){
        // GAME SPEED
        GameConfig.SPEED = 0.4;
        //ADD BACKGROUND
        let background = new cc.Sprite("res/rock_bg.png");
        background.setPosition(400, 400);
        this.addChild(background);

        // ADD POINT LABEL
        this.lbScore = new cc.LabelTTF(this._score.toString(), "Arial", 50);
        this.lbScore.x = 400;
        this.lbScore.y = 700;
        this.lbScore.color = cc.color(255, 0, 0);
        this.addChild(this.lbScore,100);

        // ADD SNAKE
        this._snake = new Snake();
        for (let i = 0; i < this._snake.length; i++){
            this.addChild(this._snake.body[i],1);
        }

        // ADD FRUIT
        this._fruit = [];

        let newFruit = this.createFruit();
        if (newFruit) {
            this._fruit[0] = newFruit;
            this.addChild(this._fruit[0], 1);
        }

        // LISTENER AND LOOP GAME
        this.addKeyboardListener();
        this.scheduleUpdate();
        return true;
    },
    createFruit: function (){
        let typeFruit = Math.floor(Math.random() * 10) % 5;
        let newPos = this.getNewPosition();
        if (!newPos) return null;
        let newFruitArg = {
            type: BlockType[typeFruit].type,
            textureName: BlockType[typeFruit].textureName,
            x: newPos.x,
            y: newPos.y,
        }

        let newFruit = Block.create(newFruitArg);
        return newFruit;
    },

    getNewPosition: function (){
        let x = Math.floor(Math.random() * 16) * 50;
        let y = Math.floor(Math.random() * 16) * 50;
        while (x < GameConfig.MAP.START_X || x > GameConfig.MAP.WIDTH){
            x = Math.floor(Math.random() * 16) * 50;
        }
        while (y < GameConfig.MAP.START_X || y > GameConfig.MAP.WIDTH){
            y = Math.floor(Math.random() * 16) * 50;
        }
        for (let i = 0; i < this._snake.length; i++)
            if (this._snake.body[i].x == x && this._snake.body[i].y == y) return null;

        for (let i = 0; i < this._fruit.length; i++){
            if (this._fruit[i].x == x && this._fruit[i].y == y) return null;
        }

        let newPos = {
            x : x,
            y: y
        }
        return newPos;
    },

    update:function(dt){
        this._time += dt;
        this._timeFruit += dt;
        if (this._time > GameConfig.SPEED) {
            // UPDATE SNAKE POSITION
            let tailPos = {
                x: this._snake.body[this._snake.length - 1].x,
                y: this._snake.body[this._snake.length - 1].y
            }
            for (let i = this._snake.length - 1; i > 0; i--){
                this._snake.body[i].x = this._snake.body[i-1].x;
                this._snake.body[i].y = this._snake.body[i-1].y;
            }

            switch (this._snake.direction){
                case GameConfig.DIRECTION.RIGHT:
                    this._snake.body[0].x += 50;
                    break;
                case GameConfig.DIRECTION.DOWN:
                    this._snake.body[0].y -= 50;
                    break;
                case GameConfig.DIRECTION.LEFT:
                    this._snake.body[0].x -= 50;
                    break;
                case GameConfig.DIRECTION.UP:
                    this._snake.body[0].y += 50;
                    break;
            }

            // CHECK SNAKE EAT FRUIT
            for (let j = 0; j < this._fruit.length; j++) {
                if (this._fruit[j].visible == true && this._fruit[j].x == this._snake.body[0].x && this._fruit[j].y == this._snake.body[0].y) {
                    // BOOST SPEED
                    GameConfig.SPEED -= 0.02;
                    if (GameConfig.SPEED < GameConfig.LIMIT_SPEED) GameConfig.SPEED = GameConfig.LIMIT_SPEED;
                    // CALCULATE POINT
                    if (this._fruit[j].type == -1){
                        this._score = Math.floor(this._score / 2);
                        let lengthToRemove = Math.floor(this._snake.length / 2);

                        for (let i = lengthToRemove + 1; i < this._snake.length; i++){
                            cc.log("part :" + i);
                            this._snake.body[i].visible = false;
                        }
                        this._snake.body.splice(lengthToRemove + 1, lengthToRemove);
                        cc.log("length : " + this._snake.body.length);
                        this._snake.length = this._snake.body.length;
                    }else{
                        this._score += this._fruit[j].type;
                        this._snake.length++;
                        let newBlock = {
                            type: BlockType[0].type,
                            textureName: BlockType[0].textureName,
                            x: tailPos.x,
                            y: tailPos.y
                        }
                        // cc.log(newBlock.textureName);
                        this._snake.body[this._snake.length - 1] = Block.create(newBlock);
                        this.addChild(this._snake.body[this._snake.length - 1], 1);
                    }

                    this.lbScore.setString(this._score.toString());
                    // LENGTHEN SNAKE


                    // RESET FRUIT
                    let newPos = this.getNewPosition();
                    while (!newPos){
                        newPos = this.getNewPosition;
                    }

                    this._fruit[j].setPosition(newPos.x, newPos.y);
                }

                this._time = 0;

                // CHECK DEAD
                for (let i = 1; i < this._snake.length; i++) {
                    if (this._snake.body[0].x == this._snake.body[i].x && this._snake.body[0].y == this._snake.body[i].y) {
                        GameConfig.SCORE = this._score;
                        this.onGameOver();
                    }
                }
                if (this._snake.body[0].x < GameConfig.MAP.START_X || this._snake.body[0].x > GameConfig.MAP.WIDTH || this._snake.body[0].y < GameConfig.MAP.START_Y || this._snake.body[0].y > GameConfig.MAP.HEIGHT) {
                    GameConfig.SCORE = this._score;
                    this.onGameOver();
                }
            }
        }

        if (this._timeFruit > 4){
            this._timeFruit = 0;
            let newFruit = this.createFruit();
            if (newFruit){
                this._fruit.push(newFruit);
                this.addChild(newFruit);
            }
        }
    },

    addKeyboardListener: function (){
        let self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event){
                // cc.log(self._snake.direction);
                switch (key){
                    case (cc.KEY.down):
                        if (self._snake.direction == GameConfig.DIRECTION.UP && self._snake.length > 1) break;
                        self._snake.direction = GameConfig.DIRECTION.DOWN;
                        break;
                    case (cc.KEY.right):
                        if (self._snake.direction == GameConfig.DIRECTION.LEFT && self._snake.length > 1) break;
                        self._snake.direction = GameConfig.DIRECTION.RIGHT;
                        break;
                    case (cc.KEY.up):
                        if (self._snake.direction == GameConfig.DIRECTION.DOWN && self._snake.length > 1) break;
                        self._snake.direction = GameConfig.DIRECTION.UP;
                        break;
                    case (cc.KEY.left):
                        if (self._snake.direction == GameConfig.DIRECTION.RIGHT && self._snake.length > 1) break;
                        self._snake.direction = GameConfig.DIRECTION.LEFT;
                        break;
                    default:
                        break;
                }

            },
            onKeyReleased: function (key, event){

            }
        }, this);
        //cc.log("listen " + this._snake.direction);
    },
    onGameOver : function (){
        let scene = new cc.Scene();
        scene.addChild(new GameOver());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
});
//
// GameLayer.scene = function () {
//     let scene = new cc.Scene();
//     let layer = new GameLayer();
//     scene.addChild(layer, 1);
//     return scene;
// }