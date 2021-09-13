let GameOver = cc.Layer.extend({

    ctor: function (){
        this._super();
        this.init();
    },

    init: function (){
        GameConfig.BEST = Math.max(GameConfig.BEST, GameConfig.SCORE);
        let lbBest = cc.LabelTTF("BEST: " + GameConfig.BEST.toString(), "Arial", 80);
        lbBest.color = cc.color(0, 255, 255);
        lbBest.setPosition(400, 600);
        this.addChild(lbBest);

        let lbScore = cc.LabelTTF(GameConfig.SCORE.toString(), "Arial", 100);
        lbScore.x = 400;
        lbScore.y = 400;
        lbScore.color = cc.color(255, 0, 0);
        this.addChild(lbScore);

        let playAgainButton = ccui.Button();
        playAgainButton.setTitleText("Play Again");
        playAgainButton.setTitleFontSize(40);
        playAgainButton.setPosition(400, 200);
        playAgainButton.addClickEventListener(this.onPlayAgain.bind(this));
        this.addChild(playAgainButton);
    },

    onPlayAgain: function (){
        let scene = new cc.Scene();
        scene.addChild(new GameLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
});

GameOver.scene = function (){
    let scene = new cc.Scene();
    let layer = new GameOver();
    scene.addChild(layer);
    return scene;
}