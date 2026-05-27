class SceneFlowPrototype extends Phaser.Scene {
    constructor() {
        super("SceneFlowPrototype");
    }

    create() {
        this.cameras.main.setBackgroundColor("#18151c");

        this.add.text(960, 220, "Scene Flow Prototype", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#f5f1e8"
        }).setOrigin(0.5);


        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(165, 72, "Back", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        backButton.on("pointerdown", () => {
            this.scene.start("Launcher");
        });
        const creditsButton = this.add.rectangle(960, 500, 400, 80, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(960, 500, "Credits", {
            fontFamily: "Arial",
            fontSize: "36px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        creditsButton.on("pointerdown", () => {
            this.scene.start("CreditsScene");
        });
    }
}
class CreditsScene extends Phaser.Scene {
    constructor() {
        super("CreditsScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#18151c")
        this.add.text(960, 200, "Credits", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        this.add.text(960, 380, "Production Lead",{
            fontFamily: "Arial",
            fontSize:"26px",
            color:"#75a1d7"
        }).setOrigin(0.5);
        this.add.text(960, 430, "Denis Gamolya", {
            fontFamily: "Arial",
            fontSize: "38px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        this.add.text(960, 520, "Technology Lead", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#7593b7"
        }).setOrigin(0.5);

        this.add.text(960, 570, "Shiyi Sun", {
            fontFamily: "Arial",
            fontSize: "38px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        this.add.text(960, 660, "Testing Lead", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#758dab"
        }).setOrigin(0.5);
        this.add.text(960, 710, "Katarina Malenovic", {
            fontFamily: "Arial",
            fontSize: "38px",
            color: "#f5f1e8"
        }).setOrigin(0.5);   
        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(165, 72, "Back", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => {
            this.scene.start("Launcher");
        }); 
    }
}
