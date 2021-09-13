let AboutLayer = cc.Layer.extend({
    ctor: function (){
        this._super();
        this.init();
    },
    init: function (){

        for (let i = 0; i < BlockType.length; i++){
            let block = new cc.Sprite(BlockType[i].textureName);
            let lbPoint = null;
            if (BlockType[i].type >= 0) {
                lbPoint = new cc.LabelTTF("+ " + BlockType[i].type.toString());
            }else{
                lbPoint = new cc.LabelTTF("/ 2");
            }
            lbPoint.setFontSize(30);
            lbPoint.color = cc.color(255, 255, 255);
            block.setPosition(350, 600 - i * 100);
            lbPoint.setPosition(450, 600 - i*100);
            this.addChild(block);
            this.addChild(lbPoint);
        }

        let btnHome = ccui.Button();
        btnHome.setTitleText("Main menu");
        btnHome.setTitleFontSize(30);
        btnHome.setPosition(400, 100);
        btnHome.setPressedActionEnabled(true);
        this.addChild(btnHome);
        btnHome.addClickEventListener(this.onMenu.bind(this));
    },

    onMenu: function (){
        let scene = new cc.Scene();
        scene.addChild(new SysMenu());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
})