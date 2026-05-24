class CinematicPrototype extends Phaser.Scene {
    constructor() {
        super("CinematicPrototype");
    }

    create() {
        this.cameras.main.setBackgroundColor("#151923");

        this.add.text(960, 220, "Cinematic Prototype", {
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

    }
}
