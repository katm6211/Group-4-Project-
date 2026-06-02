// The game scenes in this file are copied from the prototypes.

const GAME_SCENE_KEYS = {
    intro: "Game_StartCinematic",
    menu: "Game_CinematicMainMenu",
    handle: "Game_ChaseScene",
    powerBox: "Game_PowerBox",
    wires: "Game_DemoWirePuzzle",
    clockRoom: "Game_ClockRoom",
    clock: "Game_DemoClock",
    radioRoom: "Game_RadioRoom",
    radio: "Game_DemoRadio",
    credits: "Game_CreditsScene",
    settings: "Game_SettingsOverlay"
};

function GameSpritemovement() {
    const sprite = this.sprite = this.physics.add.sprite(0, 0, 'sprite').setScale(4);

    if (!this.anims.exists('left'))
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('sprite', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    if (!this.anims.exists('right'))
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

    sprite.setPosition(sprite.displayWidth / 2, this.scale.height / 2);
    const spriteNewWidth = sprite.displayWidth * 0.5;
    const spriteOffsetX = (sprite.width - spriteNewWidth) / 2;
    sprite.setBodySize(spriteNewWidth, sprite.displayHeight);
    sprite.setOffset(spriteOffsetX, 0);

    this.physics.world.gravity.y = 600;
    sprite.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;

    const JUMP_THRESHOLD = 80;
    const SPEED = 200;

    this.input.on('pointerdown', (pointer) => {
        if (pointer.y < sprite.y - JUMP_THRESHOLD) {
            if (sprite.body.blocked.down || sprite.body.touching.down) {
                sprite.setVelocityY(-900);
                this.sound.play('jump');
            }
        }
    });

    this.events.on('update', () => {
        const pointer = this.input.activePointer;
        if (pointer.isDown) {
            if (pointer.x > sprite.x) {
                sprite.setVelocityX(SPEED);
                sprite.anims.play('right', true);
            } else if (pointer.x < sprite.x) {
                sprite.setVelocityX(-SPEED);
                sprite.anims.play('left', true);
            }
        } else {
            sprite.setVelocityX(0);
            sprite.anims.stop();
        }
    });
}

function startWithFade(scene, nextScene) {
    scene.cameras.main.fadeOut(300, 0, 0, 0);
    scene.cameras.main.once("camerafadeoutcomplete", () => {
        scene.scene.start(nextScene);
    });
}

function addRoomLabel(scene, roomNumber, title) {
    scene.add.text(960, 155, `Room ${roomNumber} of 4: ${title}`, {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#7dd3fc"
    }).setOrigin(0.5);
}

function addProgressButton(scene, options) {
    const button = scene.add.rectangle(1700, 1000, 300, 64, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true });

    const label = scene.add.text(1700, 1000, options.lockedLabel || "Solve puzzle first", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#8993a4"
    }).setOrigin(0.5);

    let unlocked = false;
    let leaving = false;

    const refresh = () => {
        if (unlocked || !options.isUnlocked()) return;

        unlocked = true;
        button.setFillStyle(0x1a3a2a).setStrokeStyle(3, 0x44ff44);
        label.setText(options.unlockedLabel || "Continue").setColor("#f5f1e8");
    };

    button.on("pointerover", () => {
        if (unlocked) button.setFillStyle(0x24523a);
    });

    button.on("pointerout", () => {
        button.setFillStyle(unlocked ? 0x1a3a2a : 0x242a35);
    });

    button.on("pointerdown", () => {
        refresh();
        if (!unlocked || leaving) return;

        leaving = true;
        options.onContinue();
    });

    scene.events.on("update", refresh);
    scene.events.once("shutdown", () => scene.events.off("update", refresh));
    refresh();
}

function openGameSettingsOverlay(scene) {
    const previousScene = scene.scene.key;

    scene.scene.launch(GAME_SCENE_KEYS.settings, {
        previousScene: previousScene
    });
    scene.scene.bringToTop(GAME_SCENE_KEYS.settings);
    scene.scene.pause(previousScene);
}

function addGameSettingsButton(scene) {
    new MenuButton(scene, 1775, 72, "Settings", () => {
        openGameSettingsOverlay(scene);
    }, 210, 64);
}

function playGameBgm(scene) {
    const settingsValues = scene.registry.get("settingsValues") || {
        soundVolume: 1.0,
        musicVolume: 0.2
    };
    scene.registry.set("settingsValues", settingsValues);

    const bgm = scene.sound.get("bgm") || scene.sound.add("bgm", {
        loop: true,
        volume: settingsValues.musicVolume
    });
    setMusicVolume(scene, settingsValues.musicVolume);

    if (!bgm.isPlaying) {
        bgm.play();
    }
}

function showCompletionPanel(scene) {
    const depth = 1000;

    scene.add.rectangle(960, 540, 920, 520, 0x111318, 0.98)
        .setStrokeStyle(4, 0x44ff44)
        .setInteractive()
        .setDepth(depth);

    scene.add.text(960, 400, "Signal received. You escaped!", {
        fontFamily: "Arial",
        fontSize: "54px",
        color: "#f5f1e8"
    }).setOrigin(0.5).setDepth(depth + 1);

    scene.add.text(960, 495, "All four rooms are complete.", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#b8c4d4"
    }).setOrigin(0.5).setDepth(depth + 1);

    const replayButton = scene.add.rectangle(960, 640, 300, 76, 0x1a3a2a)
        .setStrokeStyle(3, 0x44ff44)
        .setInteractive({ useHandCursor: true })
        .setDepth(depth + 1);

    scene.add.text(960, 640, "Play Again", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#f5f1e8"
    }).setOrigin(0.5).setDepth(depth + 2);

    replayButton.on("pointerdown", () => {
        window.playerInventory = [];
        startWithFade(scene, GAME_SCENE_KEYS.intro);
    });
}

class Game_StartCinematic extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.intro);
    }

    preload() {
        this.load.image('logoDraft', 'assets/logodraft4.png');
        this.load.image('placeholder', 'assets/placeholder.png');
        this.load.spritesheet('sprite', 'assets/spritesheet.png', { frameWidth: 29, frameHeight: 38 });
        this.load.audio('bgm', 'assets/backgroundmusic.mp3');
        this.load.audio('jump', 'assets/jumpsoundeffect.mp3');
    }

    create() {
        this.cameras.main.setBackgroundColor("#151923");
        playGameBgm(this);

        this.fadeRect = this.add.image(300, 200, "logoDraft").setScale(2.1);
        this.fadeRect.setOrigin(0, 0);
        this.fadeRect.setDepth(500);
        this.fadeRect.setAlpha(0);

        this.tweens.add({
            targets: this.fadeRect,
            alpha: 1,
            duration: 4000,
            ease: "Linear"
        });

        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: this.fadeRect,
                alpha: 0,
                duration: 1000,
                ease: "Linear",
                onComplete: () => {
                    this.scene.start(GAME_SCENE_KEYS.menu);
                }
            });
        });

    }
}

class Game_CinematicMainMenu extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.menu);
    }

    create() {
        this.cameras.main.setBackgroundColor("#151923");
        playGameBgm(this);

        const placeholder = this.placeholder = this.add.image(0, 0, "placeholder")
            .setOrigin(0, 0)
            .setDisplaySize(1920, 1080);

        this.fadeRect = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 1)
            .setAlpha(0)
            .setDepth(900);

        this.add.rectangle(960, 150, 900, 120, 0x000000, 0.55)
            .setStrokeStyle(3, 0xffffff, 0.35);

        this.add.text(960, 150, "CMPM 120 Final Game", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#fefefe"
        }).setOrigin(0.5);

        const h = screen.height;
        const buttonX = placeholder.width / 2;
        const buttonWidth = 340;
        const buttonHeight = 86;
        const buttonGap = 175;
        const firstButtonY = h / 3.6;
        const textStyle = {
            fontFamily: "Arial",
            fontSize: "34px",
            color: "#f5f1e8"
        };

        const startGame = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        const startGameText = this.add.text(0, 0, "Start Game", textStyle).setOrigin(0.5);
        const startGameContainer = this.add.container(buttonX, firstButtonY, [startGame, startGameText]).setAlpha(0);

        startGame.on("pointerover", () => startGame.setFillStyle(0x334155));
        startGame.on("pointerout", () => startGame.setFillStyle(0x242a35));
        startGame.on("pointerdown", () => {
            window.playerInventory = [];
            this.scene.start(GAME_SCENE_KEYS.handle);
        });

        const settingsY = firstButtonY + buttonGap;
        const settings = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        const settingsText = this.add.text(0, 0, "Settings", textStyle).setOrigin(0.5);
        const settingsContainer = this.add.container(buttonX, settingsY, [settings, settingsText]).setAlpha(0);

        settings.on("pointerover", () => settings.setFillStyle(0x334155));
        settings.on("pointerout", () => settings.setFillStyle(0x242a35));
        settings.on("pointerdown", () => openGameSettingsOverlay(this));

        const creditsY = settingsY + buttonGap;
        const credits = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        const creditsText = this.add.text(0, 0, "Credits", textStyle).setOrigin(0.5);
        const creditsContainer = this.add.container(buttonX, creditsY, [credits, creditsText]).setAlpha(0);

        credits.on("pointerover", () => credits.setFillStyle(0x334155));
        credits.on("pointerout", () => credits.setFillStyle(0x242a35));
        credits.on("pointerdown", () => this.scene.start(GAME_SCENE_KEYS.credits));

        this.tweens.chain({
            tweens: [
                { targets: startGameContainer, alpha: 1, duration: 1500, ease: "Linear" },
                { targets: settingsContainer, alpha: 1, duration: 1500, ease: "Linear" },
                { targets: creditsContainer, alpha: 1, duration: 1500, ease: "Linear" }
            ]
        });
    }
}

class Game_ChaseScene extends Phaser.Scene {
    constructor() {
        super("Game_ChaseScene");
    }

    create() {
        this.escaping = false;
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0d1117");
        addGameSettingsButton(this);
        playGameBgm(this);

        this.add.text(960, 60, "Your goal is ESCAPE!", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#8b0000"
        }).setOrigin(0.5);

        this.add.text(960, 150, "Escape from the aliens before time runs out!", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        this.add.rectangle(960, 1065, 1920, 30, 0x223344);

        const statusText = this.add.text(960, 830, "Find the handle and use it on the lever!", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#b8c4d4",
            align: "center"
        }).setOrigin(0.5);

        GameSpritemovement.call(this);
        const sprite = this.sprite;

        if (!this.game.sound.get("bgm")) {
            const bgm = this.game.sound.add("bgm", { loop: true });
            bgm.play();
        }

        const handleObj = this.add.rectangle(500, 1030, 40, 40, 0xc8a200)
            .setStrokeStyle(2, 0xffd700);
        this.add.text(500, 998, "Handle", {
            fontFamily: "Arial", fontSize: "18px", color: "#ffd700"
        }).setOrigin(0.5);
        this.physics.add.existing(handleObj, true);

        this.physics.add.overlap(sprite, handleObj, () => {
            if (!handleObj.active) return;
            handleObj.setActive(false).setVisible(false);
            handleObj.body.enable = false;
            addInventoryItem("handle");
            statusText.setText("Handle picked up! Find the lever.");
        });

        const leverObj = this.add.rectangle(1300, 1010, 40, 80, 0x556677)
            .setStrokeStyle(2, 0x8899aa)
            .setInteractive({ useHandCursor: true });
        const leverLabel = this.add.text(1300, 968, "Lever", {
            fontFamily: "Arial", fontSize: "18px", color: "#8899aa"
        }).setOrigin(0.5);

        const door = this.add.rectangle(1820, 920, 80, 250, 0x3a1a1a)
            .setStrokeStyle(3, 0x6f7c91);
        this.add.text(1820, 1010, "LOCKED", {
            fontFamily: "Arial", fontSize: "22px", color: "#b8c4d4"
        }).setOrigin(0.5);

        const doorZone = this.add.zone(1820, 920, 80, 250);
        this.physics.add.existing(doorZone, false);
        doorZone.body.setAllowGravity(false);
        doorZone.body.enable = false;

        this.physics.add.overlap(sprite, doorZone, () => {
            if (this.escaping) return;
            this.escaping = true;
            sprite.setVelocity(0, 0);
            window.playerInventory = [];
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("Game_PowerBox"));
        });

        leverObj.on("pointerdown", () => {
            if (!window.playerInventory.includes("handle")) {
                statusText.setText("The lever needs a handle first.");
                return;
            }
            removeInventoryItem("handle");
            leverObj.disableInteractive();
            this.tweens.add({
                targets: leverObj,
                angle: 45,
                duration: 500,
                ease: "Power2",
                onComplete: () => {
                    leverLabel.setText("Lever (used)");
                    door.setFillStyle(0x1a3a2a);
                    statusText.setText("The door is open! Run to it!");
                    doorZone.body.enable = true;
                }
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

class Game_PowerBox extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.powerBox);
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        playGameBgm(this);
        GameSpritemovement.call(this);
        addGameSettingsButton(this);


        this.add.text(860, 340, "Power box").setFontSize(48)
        const powerBox = this.add.rectangle(960, 540, 240, 240, 0xffd700)
            .setInteractive({ useHandCursor: true });

        powerBox.on("pointerdown", () => {
            startWithFade(this, GAME_SCENE_KEYS.wires);
        });
    }
}

class Game_DemoWirePuzzle extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.wires);
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        this.wirePuzzleSolved = false;
        playGameBgm(this);

        addGameSettingsButton(this);

        this.add.text(960, 100, "Demo 2: Wire Puzzle", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 900, "Connect all wires to the correct ports.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const wireColors = [0xff4444, 0x44ff44, 0x4488ff];
        const colorNames = ["red", "green", "blue"];
        const leftNodes = wireColors.map((color, i) => {
            const y = 380 + i * 160;
            const node = this.add.circle(500, y, 28, color)
                .setStrokeStyle(3, 0xffffff)
                .setInteractive({ useHandCursor: true });
            this.add.text(420, y, colorNames[i], {
                fontFamily: "Arial", fontSize: "22px", color: "#f5f1e8"
            }).setOrigin(0.5);
            node.colorIndex = i;
            return node;
        });

        const rightOrder = [1, 2, 0];
        const rightNodes = rightOrder.map((colorIndex, i) => {
            const y = 380 + i * 160;
            const node = this.add.circle(1420, y, 28, wireColors[colorIndex])
                .setStrokeStyle(3, 0xffffff);
            node.colorIndex = colorIndex;
            return node;
        });

        const lines = this.add.graphics();
        this.connected = {};
        this.selectedLeft = null;

        const redraw = () => {
            lines.clear();
            Object.entries(this.connected).forEach(([leftIndex, rightIndex]) => {
                const leftNode = leftNodes[leftIndex];
                const rightNode = rightNodes[rightIndex];
                lines.lineStyle(6, wireColors[leftNode.colorIndex], 1);
                lines.beginPath();
                lines.moveTo(leftNode.x + 28, leftNode.y);
                lines.lineTo(rightNode.x - 28, rightNode.y);
                lines.strokePath();
            });
        };

        const checkSolved = () => {
            this.wirePuzzleSolved = leftNodes.every((leftNode, leftIndex) => {
                const rightIndex = this.connected[leftIndex];
                if (rightIndex === undefined) return false;
                return rightNodes[rightIndex].colorIndex === leftNode.colorIndex;
            });

            if (this.wirePuzzleSolved) {
                statusText.setText("✓ All wires connected correctly! Puzzle solved.");
                statusText.setColor("#44ff44");
            } else {
                statusText.setText("Keep connecting — match the colors.");
                statusText.setColor("#b8c4d4");
            }
        };

        leftNodes.forEach((node, i) => {
            node.on("pointerdown", () => {
                this.selectedLeft = i;
                leftNodes.forEach((leftNode) => leftNode.setStrokeStyle(3, 0xffffff));
                node.setStrokeStyle(4, 0xffff00);
                statusText.setText(`Selected ${colorNames[i]} wire. Now click a port on the right.`);
            });
        });

        rightNodes.forEach((node, rightIndex) => {
            node.setInteractive({ useHandCursor: true });
            node.on("pointerdown", () => {
                if (this.selectedLeft === null) {
                    statusText.setText("Select a wire on the left first.");
                    return;
                }

                Object.keys(this.connected).forEach((leftIndex) => {
                    if (this.connected[leftIndex] === rightIndex) delete this.connected[leftIndex];
                });
                this.connected[this.selectedLeft] = rightIndex;
                this.selectedLeft = null;
                leftNodes.forEach((leftNode) => leftNode.setStrokeStyle(3, 0xffffff));
                redraw();
                checkSolved();
            });
        });

        addRoomLabel(this, 2, "Wire Puzzle");
        addProgressButton(this, {
            isUnlocked: () => this.wirePuzzleSolved,
            onContinue: () => startWithFade(this, GAME_SCENE_KEYS.clockRoom)
        });
    }
}

class Game_ClockRoom extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.clockRoom);
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        playGameBgm(this);
        GameSpritemovement.call(this);
        addGameSettingsButton(this);

        this.add.text(860, 200, "Clock").setFontSize(48)
        const clock = this.add.container(960, 540, [
            this.add.rectangle(0, 0, 260, 520, 0x8b5a2b),
            this.add.circle(0, -110, 90, 0xffffff)
        ]);
        clock.setSize(260, 520).setInteractive({ useHandCursor: true });

        const openClock = () => {
            startWithFade(this, GAME_SCENE_KEYS.clock);
        };
        clock.on("pointerdown", openClock);
    }
}

class Game_DemoClock extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.clock);
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        this.clockSolved = false;
        playGameBgm(this);

        addGameSettingsButton(this);

        this.add.text(960, 100, "Demo 3: Clock", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 880, "Drag the clock hand. Counterclockwise = move forward.\nClockwise = go back.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const cx = 960;
        const cy = 520;
        const radius = 220;

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

        let lastAngle = null;
        let totalRotation = 0;

        hitArea.on("dragstart", () => {
            lastAngle = null;
            totalRotation = 0;
        });

        this.input.on("drag", (pointer, gameObject) => {
            if (gameObject !== hitArea) return;
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
        });

        hitArea.on("dragend", () => {
            if (totalRotation > Math.PI) {
                statusText.setText("Clockwise → Going back to previous room.");
                statusText.setColor("#ffaa44");
            } else if (totalRotation < -Math.PI) {
                this.clockSolved = true;
                statusText.setText("Counterclockwise → Moving forward in time!");
                statusText.setColor("#44ff44");
            } else {
                statusText.setText("Turn more to make a choice.");
                statusText.setColor("#b8c4d4");
            }
        });

        addRoomLabel(this, 3, "Clock");
        addProgressButton(this, {
            isUnlocked: () => this.clockSolved,
            onContinue: () => startWithFade(this, GAME_SCENE_KEYS.radioRoom)
        });
    }
}

class Game_RadioRoom extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.radioRoom);
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        playGameBgm(this);
        GameSpritemovement.call(this);
        addGameSettingsButton(this);

        this.add.text(860, 200, "Radio").setFontSize(48);
        const radio = this.add.rectangle(960, 540, 240, 240, 0x808080)
            .setInteractive({ useHandCursor: true });

        radio.on("pointerdown", () => {
            startWithFade(this, GAME_SCENE_KEYS.radio);
        });
    }
}

class Game_DemoRadio extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.radio);
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        playGameBgm(this);

        addGameSettingsButton(this);

        this.add.text(960, 100, "Demo 4: Radio", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 880, "Tune the radio to the correct frequency.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const correctFrequency = 47;
        this.frequency = 30;

        this.add.rectangle(960, 530, 700, 400, 0x222233)
            .setStrokeStyle(5, 0x8899aa);

        const frequencyText = this.add.text(960, 440, `${this.frequency} MHz`, {
            fontFamily: "Arial", fontSize: "56px", color: "#7dd3fc"
        }).setOrigin(0.5);
        const signalText = this.add.text(960, 530, "~ static ~", {
            fontFamily: "Arial", fontSize: "30px", color: "#556677"
        }).setOrigin(0.5);

        const update = () => {
            frequencyText.setText(`${this.frequency} MHz`);
            if (this.frequency === correctFrequency) {
                signalText.setText("◆ SIGNAL FOUND ◆");
                signalText.setColor("#44ff44");
                statusText.setText(`Frequency locked: ${correctFrequency} MHz\nCode: 7-3-9`);
                statusText.setColor("#44ff44");
            } else {
                const difference = Math.abs(this.frequency - correctFrequency);
                if (difference <= 3) {
                    signalText.setText("~ almost... ~");
                    signalText.setColor("#ffaa44");
                } else {
                    signalText.setText("~ static ~");
                    signalText.setColor("#556677");
                }
                statusText.setText("Tune the radio to the correct frequency.");
                statusText.setColor("#b8c4d4");
            }
        };

        const buttonLeft = this.add.rectangle(700, 640, 100, 80, 0x334155)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(700, 640, "◀", {
            fontFamily: "Arial", fontSize: "36px", color: "#f5f1e8"
        }).setOrigin(0.5);
        buttonLeft.on("pointerdown", () => {
            this.frequency = Math.max(20, this.frequency - 1);
            update();
        });

        const buttonRight = this.add.rectangle(1220, 640, 100, 80, 0x334155)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1220, 640, "▶", {
            fontFamily: "Arial", fontSize: "36px", color: "#f5f1e8"
        }).setOrigin(0.5);
        buttonRight.on("pointerdown", () => {
            this.frequency = Math.min(80, this.frequency + 1);
            update();
        });

        const buttonLeftFive = this.add.rectangle(580, 640, 80, 60, 0x242a35)
            .setStrokeStyle(2, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(580, 640, "◀◀", {
            fontFamily: "Arial", fontSize: "24px", color: "#b8c4d4"
        }).setOrigin(0.5);
        buttonLeftFive.on("pointerdown", () => {
            this.frequency = Math.max(20, this.frequency - 5);
            update();
        });

        const buttonRightFive = this.add.rectangle(1340, 640, 80, 60, 0x242a35)
            .setStrokeStyle(2, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1340, 640, "▶▶", {
            fontFamily: "Arial", fontSize: "24px", color: "#b8c4d4"
        }).setOrigin(0.5);
        buttonRightFive.on("pointerdown", () => {
            this.frequency = Math.min(80, this.frequency + 5);
            update();
        });

        update();

        addRoomLabel(this, 4, "Radio");
        addProgressButton(this, {
            lockedLabel: "Find the signal",
            unlockedLabel: "Finish Game",
            isUnlocked: () => this.frequency === correctFrequency,
            onContinue: () => showCompletionPanel(this)
        });
    }
}

class Game_CreditsScene extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.credits);
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#18151c");
        playGameBgm(this);
        addGameSettingsButton(this);

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

    }
}

class Game_SettingsOverlay extends Phaser.Scene {
    constructor() {
        super(GAME_SCENE_KEYS.settings);
    }

    init(data = {}) {
        this.previousScene = data.previousScene;
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");
        playGameBgm(this);

        this.settingsValues = this.registry.get("settingsValues") || {
            soundVolume: 0.7,
            musicVolume: 0.5
        };
        this.registry.set("settingsValues", this.settingsValues);

        this.add.rectangle(960, 540, 700, 560, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91);
        this.add.text(960, 300, "Settings", Settings_Title).setOrigin(0.5);

        this.createVolumeSlider(960, 430, "Sound Volume", "soundVolume");
        this.createVolumeSlider(960, 530, "Music Volume", "musicVolume");

        new MenuButton(this, 820, 700, "Close", () => {
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }
            this.scene.stop();
        }, 240, 70);

        new MenuButton(this, 1100, 700, "Main Menu", () => {
            if (this.previousScene) {
                this.scene.stop(this.previousScene);
            }
            this.scene.start(GAME_SCENE_KEYS.menu);
        }, 240, 70);
    }

    createVolumeSlider(x, y, label, settingsKey) {
        const sliderWidth = 360;
        const trackX = x - sliderWidth / 2;
        const valueText = this.add.text(x + 265, y, "", Settings_Value).setOrigin(0.5);

        this.add.text(x - 265, y, label, Settings_Label).setOrigin(0.5);

        const track = this.add.rectangle(x, y, sliderWidth, 10, 0x111318)
            .setStrokeStyle(2, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        const fill = this.add.rectangle(trackX, y, sliderWidth, 10, 0x7dd3fc)
            .setOrigin(0, 0.5);
        const knob = this.add.circle(trackX, y, 16, 0xf5f1e8)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        const setValue = (value) => {
            const clampedValue = Phaser.Math.Clamp(value, 0, 1);
            this.settingsValues[settingsKey] = clampedValue;
            this.registry.set("settingsValues", this.settingsValues);

            fill.scaleX = clampedValue;
            knob.x = trackX + sliderWidth * clampedValue;
            valueText.setText(Math.round(clampedValue * 100) + "%");

            if (settingsKey === "musicVolume") {
                setMusicVolume(this, clampedValue);
            }
        };

        const setValueFromPointer = (pointer) => {
            setValue((pointer.x - trackX) / sliderWidth);
        };

        setValue(this.settingsValues[settingsKey]);

        track.on("pointerdown", setValueFromPointer);
        knob.on("pointerdown", setValueFromPointer);
        knob.on("pointerover", () => knob.setFillStyle(0xffffff));
        knob.on("pointerout", () => knob.setFillStyle(0xf5f1e8));

        this.input.setDraggable(knob);
        this.input.on("drag", (pointer, gameObject, dragX) => {
            if (gameObject === knob) {
                setValue((dragX - trackX) / sliderWidth);
            }
        });
    }
}

