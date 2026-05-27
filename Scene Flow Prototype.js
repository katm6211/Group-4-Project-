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


        const startButton = this.add.rectangle(165, 150, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(165, 150, "Start", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        startButton.on("pointerdown", () => {
            this.scene.start("CinematicPrototype");
        });


    }
}
