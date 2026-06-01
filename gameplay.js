class ChaseScene extends Phaser.Scene {
    constructor() {
        super("ChaseScene");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0d1117");
        addSettingsButton(this);

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
        failButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("CinematicMainMenu"));
        });

        const testItem = this.add.text(960, 430, "test_item", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#f5f1e8"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        testItem.on("pointerdown", () => {
            addInventoryItem("test_item");
            testItem.disableInteractive();
            this.tweens.add({
                targets: testItem,
                alpha: 0,
                duration: 500,
                onComplete: () => testItem.destroy()
            });
        });

        const inventoryButton = this.add.rectangle(110, 1010, 170, 58, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(110, 1010, "Inventory", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        inventoryButton.on("pointerdown", () => {
            this.scene.launch("Inventory");
            this.scene.bringToTop("Inventory");
        });
    }
}

class PuzzleScene extends Phaser.Scene {
    constructor() {
        super("PuzzleScene");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#1a1520");
        addSettingsButton(this);

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
        clockButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("ClockScene"));
        });

        const inventoryButton = this.add.rectangle(110, 1010, 170, 58, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(110, 1010, "Inventory", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        inventoryButton.on("pointerdown", () => {
            this.scene.launch("Inventory");
            this.scene.bringToTop("Inventory");
        });
    }
}

class ClockScene extends Phaser.Scene {
    constructor() {
        super("ClockScene");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#12101a");
        addSettingsButton(this);

        this.add.text(960, 100, "[Scene 3: Giant Clock]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 880, "Turn the clock hands. Which direction?", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#b8c4d4",
            align: "center"
        }).setOrigin(0.5);

        const cx = 960, cy = 520, radius = 220;

        this.add.circle(cx, cy, radius, 0x1a1a2e).setStrokeStyle(6, 0x8899aa);

        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x8899aa, 0.6);
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = cx + Math.cos(angle) * (radius - 20);
            const y1 = cy + Math.sin(angle) * (radius - 20);
            const x2 = cx + Math.cos(angle) * radius;
            const y2 = cy + Math.sin(angle) * radius;
            graphics.beginPath();
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
            graphics.strokePath();
        }

        this.handAngle = -Math.PI / 2;
        const handGraphics = this.add.graphics();

        const drawHand = () => {
            handGraphics.clear();
            handGraphics.lineStyle(8, 0xffd700, 1);
            handGraphics.beginPath();
            handGraphics.moveTo(cx, cy);
            handGraphics.lineTo(
                cx + Math.cos(this.handAngle) * (radius - 30),
                cy + Math.sin(this.handAngle) * (radius - 30)
            );
            handGraphics.strokePath();
            handGraphics.fillStyle(0xffd700);
            handGraphics.fillCircle(cx, cy, 12);
        };
        drawHand();

        const hitArea = this.add.circle(cx, cy, radius, 0x000000, 0)
            .setInteractive({ useHandCursor: true });
        this.input.setDraggable(hitArea);

        const overlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000).setAlpha(0).setDepth(10);
        const overlayText = this.add.text(960, 540, "", {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#f5f1e8"
        }).setOrigin(0.5).setAlpha(0).setDepth(11);

        const transition = (label, nextScene) => {
            overlayText.setText(label);
            this.tweens.add({
                targets: [overlay, overlayText],
                alpha: 1,
                duration: 600,
                onComplete: () => {
                    this.time.delayedCall(400, () => {
                        this.cameras.main.fade(600, 0, 0, 0);
                        this.time.delayedCall(600, () => this.scene.start(nextScene));
                    });
                }
            });
        };

        let lastAngle = null;
        let totalRotation = 0;
        let triggered = false;

        this.input.on("dragstart", (pointer, gameObject) => {
            if (gameObject !== hitArea) return;
            lastAngle = null;
            totalRotation = 0;
        });

        this.input.on("drag", (pointer, gameObject) => {
            if (gameObject !== hitArea || triggered) return;
            const angle = Math.atan2(pointer.y - cy, pointer.x - cx);
            if (lastAngle !== null) {
                let delta = angle - lastAngle;
                if (delta > Math.PI) delta -= Math.PI * 2;
                if (delta < -Math.PI) delta += Math.PI * 2;
                this.handAngle += delta;
                totalRotation += delta;
            }
            lastAngle = angle;
            drawHand();

            if (totalRotation > Math.PI) {
                triggered = true;
                hitArea.disableInteractive();
                statusText.setText("Clockwise → Going back...");
                statusText.setColor("#ffaa44");
                transition("Going back...", "PuzzleScene");
            } else if (totalRotation < -Math.PI) {
                triggered = true;
                hitArea.disableInteractive();
                statusText.setText("Counterclockwise → Moving forward in time!");
                statusText.setColor("#44ff44");
                transition("Moving forward in time...", "YoungerSelfScene");
            }
        });

        this.input.on("dragend", (pointer, gameObject) => {
            if (gameObject !== hitArea || triggered) return;
            statusText.setText("Turn more to make a choice.");
            statusText.setColor("#b8c4d4");
        });

        const inventoryButton = this.add.rectangle(110, 1010, 170, 58, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(110, 1010, "Inventory", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        inventoryButton.on("pointerdown", () => {
            this.scene.launch("Inventory");
            this.scene.bringToTop("Inventory");
        });
    }
}

class YoungerSelfScene extends Phaser.Scene {
    constructor() {
        super("YoungerSelfScene");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0f1a0f");
        addSettingsButton(this);

        this.add.text(960, 200, "[Scene 4: Younger Self]", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

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
        endButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("EndingScene"));
        });

        const inventoryButton = this.add.rectangle(110, 1010, 170, 58, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(110, 1010, "Inventory", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        inventoryButton.on("pointerdown", () => {
            this.scene.launch("Inventory");
            this.scene.bringToTop("Inventory");
        });
    }
}

class AlienRevealScene extends Phaser.Scene {
    constructor() {
        super("AlienRevealScene");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#1a0000");

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
        backButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("CinematicMainMenu"));
        });
    }
}

class EndingScene extends Phaser.Scene {
    constructor() {
        super("EndingScene");
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0d1a0d");

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
        titleButton.on("pointerdown", () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("CinematicMainMenu"));
        });
    }
}
