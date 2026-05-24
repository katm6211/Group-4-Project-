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

        // return to prototype launcher
        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(165, 72, "Back", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);


        const startButton = this.add.rectangle(165, 150, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(165, 150, "Start", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);


        const JumptoMenu = this.add.rectangle(165, 250, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(165, 250, "Jump to Menu", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        JumptoMenu.on("pointerdown", () => {
            this.scene.start("CinematicMainMenu");
        });


        backButton.on("pointerdown", () => {
            this.scene.start("Launcher");
        });

        startButton.on("pointerdown", () => {
            this.scene.start("Start Cinematic");
        });

    }
}

class StartCinematic extends Phaser.Scene {
    constructor() {
        super("Start Cinematic");
    }

    create() {
        this.cameras.main.setBackgroundColor("#151923");

        this.add.rectangle(960, 540, 300, 600, 0x00f230);
        this.fadeRect = this.add.rectangle(0,0,1920,1080,0x0000000)
        this.fadeRect.setOrigin(0,0);
        this.fadeRect.setDepth(500);
        this.fadeRect.setAlpha(1);

        this.tweens.add({
            targets: this.fadeRect,
            alpha: 0,
            duration: 1000,
            ease:"Linear"
        })


        // return to prototype launcher
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

class CinematicMainMenu extends Phaser.Scene {
    constructor() {
        super("CinematicMainMenu");
    }

    create() {
        this.cameras.main.setBackgroundColor("#151923");

        // return to prototype launcher
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
        

    
        this.add.text(960, 220, "Main Menu", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        
        const StartGame = this.add.rectangle(165, 72, 230, 64, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true });
        
        this.add.text(165, 72, "Start Game", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#f5f1e8"
        }).setOrigin(0.5);    

        StartGame.on("pointerdown", () => {
            this.add.text(960, 540, "Currently a Prototype...", {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#f5f1e8"
            }).setOrigin(0.5);
        });


        
    }
}
