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

        this.fadeRect = this.add.image(1000, 750, "gamelogonamedraft").setScale(0.8)
        this.fadeRect = this.add.image(800, 200, "logoDraft").setScale(0.8)
        this.fadeRect.setOrigin(0,0);
        this.fadeRect.setDepth(500);
        this.fadeRect.setAlpha(0);

        // fade in: ↑ become transparent
        this.tweens.add({
            targets: this.fadeRect,
            alpha: 1,
            duration: 1000,
            ease:"Linear"
        });
        //fade out to main menu after 2 second
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: this.fadeRect,
                alpha: 0,
                duration: 1000,
                ease: "Linear",
                onComplete: () => {
                    this.scene.start("CinematicMainMenu");
                }
            })
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
            // fade out before going back to launcher
            this.tweens.add({
                targets: this.fadeRect,
                alpha:1,
                duration:1000,
                ease:"Linear",
                onComplete: () => {
                    this.scene.start("Launcher");
                }
            });
        });
        

    
        this.add.text(960, 220, "CMPM 120 Final Game", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#f5f1e8"
        }).setOrigin(0.5);


        const w = screen.width;
        const h = screen.height;
        const buttonX = w / 1.8;
        const buttonWidth = 340;
        const buttonHeight = 86;
        const buttonGap = 175;
        const firstButtonY = h / 3.6;
        const textStyle = {
            fontFamily: "Arial",
            fontSize: "34px",
            color: "#f5f1e8"
        };

        // start game button currently does nothing
        const StartGame = this.add.rectangle(buttonX, firstButtonY, buttonWidth, buttonHeight, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true });
        
        this.add.text(buttonX, firstButtonY, "Start Game", textStyle).setOrigin(0.5); 
           
        StartGame.on("pointerover", () => {
            StartGame.setFillStyle(0x334155);
        });
        StartGame.on("pointerout", () => {
            StartGame.setFillStyle(0x242a35);
        });

        StartGame.on("pointerdown", () => {
            this.add.text(w/2 - 150, firstButtonY, "Currently a Prototype...", {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#f5f1e8"
            }).setOrigin(0.5);
        });

        // settings button currently does nothing
        const settingsY = firstButtonY + buttonGap;
        const Settings = this.add.rectangle(buttonX, settingsY, buttonWidth, buttonHeight, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true });
        
        this.add.text(buttonX, settingsY, "Settings", textStyle).setOrigin(0.5);    

        Settings.on("pointerover", () => {
            Settings.setFillStyle(0x334155);
        });
        Settings.on("pointerout", () => {
            Settings.setFillStyle(0x242a35);
        });

        Settings.on("pointerdown", () => {
            this.add.text(w/2 - 150, settingsY, "Currently a Prototype...", {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#f5f1e8"
            }).setOrigin(0.5);

            this.scene.launch("SettingsOverlay");
        });

        // credits button currently does nothing
        const creditsY = settingsY + buttonGap;
        const Credits = this.add.rectangle(buttonX, creditsY, buttonWidth, buttonHeight, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true });
        
        this.add.text(buttonX, creditsY, "Credits", textStyle).setOrigin(0.5); 
           
        Credits.on("pointerover", () => {
            Credits.setFillStyle(0x334155);
        });
        Credits.on("pointerout", () => {
            Credits.setFillStyle(0x242a35);
        });

        Credits.on("pointerdown", () => {
            this.add.text(w/2 - 150, creditsY, "Currently a Prototype...", {
                fontFamily: "Arial",
                fontSize: "28px",
                color: "#f5f1e8"
            }).setOrigin(0.5);
        });
        
    }
}
class SettingsOverlay extends Phaser.Scene {
    constructor() {
        super("SettingsOverlay");
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");


    const closeButton = this.add.text(960, 680, "Close", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5).setInteractive();

        closeButton.on("pointerdown", () => {
            this.scene.stop();
        });



    }

}
