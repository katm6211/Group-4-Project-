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
        startButton.on("pointerdown", () => this.scene.start("ChaseScene"));
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
            this.scene.start("Launcher");
        });
    }
}

class ChaseScene extends Phaser.Scene {
    constructor() {
        super("ChaseScene");
    }

    create() {
        // Chase scene: player escapes from aliens, reach next room before timer runs out
        // On success: go to PuzzleScene
        // On fail: go to AlienRevealScene (jumpscare)
        this.cameras.main.setBackgroundColor("#0d1117");

        this.add.text(960, 200, "[Scene 1: Chase Scene]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        this.add.text(960, 320, "Escape from the aliens before time runs out!", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);


        const winButton = this.add.rectangle(620, 550, 400, 80, 0x1a3a2a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(620, 550, "Escape (Win)", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out 
        winButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("PuzzleScene"));
        });

        const failButton = this.add.rectangle(1300, 550, 400, 80, 0x3a1a1a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1300, 550, "Caught (Fail)", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out
        failButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("SceneFlowPrototype"));
        });
    }
}
class PuzzleScene extends Phaser.Scene {
    constructor() {
        super("PuzzleScene");
    }

    create() {
        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        // Player explores the room and finds a giant clock
        // Only one exit: interact with the clock to go to ClockScene
        // No fail state in this room
        this.cameras.main.setBackgroundColor("#1a1520");

        this.add.text(960, 200, "[Scene 2: Puzzle Room]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        this.add.text(960, 320, "Find the clock and interact with it.", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const clockButton = this.add.rectangle(960, 550, 400, 80, 0x1a2a3a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(960, 550, "Interact with clock", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out
        clockButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("ClockScene"));
        });

    }
}

class ClockScene extends Phaser.Scene {
    constructor() {
        super("ClockScene");
    }

    create() {
        // Fade in 
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#12101a");

        this.add.text(960, 200, "[Scene 3: Giant Clock]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        // Player must turn the clock hands
        // Clockwise: go back to PuzzleScene (time resets)
        // Counterclockwise: progress to YoungerSelfScene (time reverses)
        this.add.text(960, 320, "Turn the clock hands. Which direction?", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const cwButton = this.add.rectangle(620, 550, 400, 80, 0x2a1a0a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(620, 550, "Clockwise (back)", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out
        cwButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("PuzzleScene"));
        });

        const ccwButton = this.add.rectangle(1300, 550, 400, 80, 0x0a1a2a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1300, 550, "Counterclockwise (forward)", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out
        ccwButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("YoungerSelfScene"));
        });
    }
}
class YoungerSelfScene extends Phaser.Scene {
    constructor() {
        super("YoungerSelfScene");
    }

    create() {
        // Fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0f1a0f");

        this.add.text(960, 200, "[Scene 4: Younger Self]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        // A younger version of the player appears through a portal
        // Player must solve a puzzle with their younger self to escape
        // On success: go to EndingScene (good ending)
        this.add.text(960, 320, "Your younger self appears. Solve the puzzle together!", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const endButton = this.add.rectangle(960, 550, 400, 80, 0x1a3a2a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(960, 550, "Solve puzzle (Win)", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out 
        endButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("EndingScene"));
        });
    }
}
class AlienRevealScene extends Phaser.Scene {
    constructor() {
        super("AlienRevealScene");
    }

    create() {
        // Fade in 
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#1a0000");

        // Bad ending: player gets caught by aliens
        // Alien reveals its true form (jumpscare)
        // Player can return to title screen
        this.add.text(960, 300, "[Alien Reveal - Bad Ending]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#ff4444"
        }).setOrigin(0.5);

        this.add.text(960, 430, "You have been caught. The alien reveals itself.", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const backButton = this.add.rectangle(960, 600, 400, 80, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(960, 600, "Back to Title", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => this.scene.start("SceneFlowPrototype"));
        // Fade out 
        backButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("SceneFlowPrototype"));
        });
    }
}
class EndingScene extends Phaser.Scene {
    constructor() {
        super("EndingScene");
    }

    create() {
        // Fade in 
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0d1a0d");

        // Good ending: player escapes the UFO with their younger self
        // Player can view credits or return to title
        this.add.text(960, 200, "[Good Ending]", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#a8d8a8"
        }).setOrigin(0.5);

        this.add.text(960, 320, "You and your younger self escaped the UFO!", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const creditsButton = this.add.rectangle(620, 550, 400, 80, 0x1a2a3a)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(620, 550, "View Credits", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        creditsButton.on("pointerdown", () => this.scene.start("CreditsScene"));
        // Fade out 
        creditsButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("CreditsScene"));
        });

        const titleButton = this.add.rectangle(1300, 550, 400, 80, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1300, 550, "Back to Title", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        // Fade out
        titleButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("SceneFlowPrototype"));
        });
    }
}