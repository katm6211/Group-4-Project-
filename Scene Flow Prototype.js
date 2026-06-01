class SceneFlowPrototype extends Phaser.Scene {
    constructor() {
        super("SceneFlowPrototype");
    }

    create() {
        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
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
        const startButton = this.add.rectangle(960, 400, 400, 80, 0x1a3a2a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(960, 400, "Start Game", {
            fontFamily: "Arial",
            fontSize: "36px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // startButton.on("pointerdown", () => this.scene.start("MainTitleScene"));

        startButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("MainTitleScene"));
        });

        const settingsButton = this.add.rectangle(960, 600, 400, 80, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(960, 600, "Settings", {
            fontFamily: "Arial",
            fontSize: "36px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        settingsButton.on("pointerdown", () => {
            openSettingsOverlay(this);
        });
    }
}

class MainTitleScene extends Phaser.Scene {
    constructor() {
        super("MainTitleScene");
    }

    create() {

        // Fade in 
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#18151c");

        // Main Title Text
        const gameTitle = this.add.text(960, 250, "MY GAME TITLE", {
            fontFamily: "Arial",
            fontSize: "80px",
            color: "#ffcc00",
            fontWeight: "bold"
        }).setAlpha(0).setOrigin(0.5); 

        const startText = this.add.text(960, 360, "Press START to Begin", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#b8c4d4"
        }).setAlpha(0).setOrigin(0.5);

        // Start Game Button
        const startButton = this.add.rectangle(0, 0, 300, 70, 0x224466)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        const startButtonText = this.add.text(0, 0, "START", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        const startButtonContainer = this.add.container(960, 550, [startButton, startButtonText]).setAlpha(0);


        startButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {

                this.scene.start("ChaseScene");
            });
        });
        // Fade in animation tween for text 
        this.tweens.chain({
            tweens: [
                {
                    targets: gameTitle,
                    alpha: 1,
                    duration: 1500,
                    ease: "Linear"
                },
                {
                    targets: startText,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Linear'
                },
                {
                    targets: startButtonContainer, 
                    alpha: 1,
                    duration: 1500,
                    ease: 'Linear'
                }
            ]
        });
    }
}

class CreditsScene extends Phaser.Scene {
    constructor() {
        super("CreditsScene");
    }

    create() {
        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#18151c")
        this.add.text(960, 200, "Credits", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        this.add.text(960, 380, "Production Lead", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#75a1d7"
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
            this.scene.start("CinematicMainMenu");
        });
    }
}

