let Block = cc.Sprite.extend({
    iD: 0,
    type: 0,
    textureName: null,
    ctor:function (arg){
        // cc.log("new x: " + arg.x);
        // cc.log("new y: " + arg.y);

        this._super(arg.textureName);
        this.textureName = arg.textureName;
        this.type = arg.type;
        this.x = arg.x;
        this.y = arg.y;
        this.setAnchorPoint(0, 0);
    }
});

Block.create = function (arg){
    let block = new Block(arg);
    GameConfig.CONTAINER.BLOCK.push(block);
    return block;
}