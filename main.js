class Launcher extends Phaser.Scene {
    constructor() {
        super("Launcher");
    }

    preload() {
        this.load.image('logoDraft', 'assets/logodraft4.png');
        this.load.image('placeholder', 'assets/placeholder.png');

    }

    create() {
        this.cameras.main.setBackgroundColor("#111318");

        this.add.text(960, 165, "Prototype Launcher", {
            fontFamily: "Arial",
            fontSize: "76px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        this.add.text(960, 250, "Select a prototype", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const options = [
            { label: "1  Cinematic Prototype", scene: "CinematicPrototype" },
            { label: "2  Core Gameplay Prototype", scene: "CoreGameplayPrototype" },
            { label: "3  Scene Flow Prototype", scene: "SceneFlowPrototype" }
        ];

        options.forEach((option, index) => {
            const y = 410 + index * 135;
            const button = this.add.rectangle(960, y, 780, 92, 0x242a35)
                .setStrokeStyle(3, 0x6f7c91)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(960, y, option.label, {
                fontFamily: "Arial",
                fontSize: "36px",
                color: "#f5f1e8"
            }).setOrigin(0.5);

            button.on("pointerover", () => {
                button.setFillStyle(0x334155);
                label.setColor("#ffffff");
            });

            button.on("pointerout", () => {
                button.setFillStyle(0x242a35);
                label.setColor("#f5f1e8");
            });

            button.on("pointerdown", () => {
                this.scene.start(option.scene);
            });
        });

        this.input.keyboard.on("keydown-ONE", () => this.scene.start("CinematicPrototype"));
        this.input.keyboard.on("keydown-TWO", () => this.scene.start("CoreGameplayPrototype"));
        this.input.keyboard.on("keydown-THREE", () => this.scene.start("SceneFlowPrototype"));
    }
}

const config = {
    type: Phaser.AUTO,
    parent: document.body,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [
        Launcher,
        CinematicPrototype,
        CoreGameplayPrototype,
        SceneFlowPrototype,
        StartCinematic,
        CinematicMainMenu,
        SettingsOverlay,
        CreditsScene,
        ChaseScene,
        PuzzleScene,
        ClockScene,
        YoungerSelfScene,
        AlienRevealScene,
        EndingScene,
        Inventory
    ],
    title: "Prototype Launcher"
};

const game = new Phaser.Game(config);
