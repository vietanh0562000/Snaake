

var SysMenu = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {

        let winSize = cc.director.getWinSize();
        cc.log(winSize)
        this.initBackGround();

        let btnNewGame = ccui.Button();
        btnNewGame.setTitleText("New Game");
        btnNewGame.setTitleFontSize(32);
        btnNewGame.setZoomScale(0.1);
        btnNewGame.setPosition(winSize.width / 2, winSize.height / 2);
        btnNewGame.setPressedActionEnabled(true);
        this.addChild(btnNewGame);
        btnNewGame.addClickEventListener(this.onNewGame.bind(this));

        let btnAbout = ccui.Button();
        btnAbout.setTitleText("About");
        btnAbout.setTitleFontSize(32);
        btnAbout.setPosition(winSize.width / 2, winSize.height / 2 - 100);
        btnAbout.setPressedActionEnabled(true);
        this.addChild(btnAbout);
        btnAbout.addClickEventListener(this.onAbout.bind(this));

        this.schedule(this.update, 0.1);

        return true;
    },
    initBackGround:function()
    {
        //Add code here
    },

    onNewGame:function (pSender) {
        //load resources
        cc.log("Start");
        cc.LoaderScene.preload(g_maingame, function () {
            let scene = new cc.Scene();
            scene.addChild(new GameLayer());
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },
    onAbout:function (){
        let scene = new cc.Scene();
        scene.addChild(new AboutLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    update:function () {

    },

});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};
