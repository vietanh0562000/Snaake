let Snake = cc.Class.extend({
    name: 'Snake',
    properties: {
        id: 0,
        body: Block[100],
        length: 1,
        direction: GameConfig.DIRECTION.RIGHT
    },
    ctor: function (){
        this.body = [];
        this.body[0] = Block.create(BlockType[0]);
        this.direction = GameConfig.DIRECTION.RIGHT;
        this.length = 1;
    }
})