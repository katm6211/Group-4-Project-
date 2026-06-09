// The game scenes in this file are copied from the prototypes.

// create global flag to check if clock puzzle is solved, allowing this to be tracked between scenes
// rewrite as phaser data contained to two scenes?
window.clockPuzzleSolved = Boolean(window.clockPuzzleSolved);
window.radioPuzzleSolved = Boolean(window.radioPuzzleSolved);

const Game_Default_Settings_Values = {
    soundVolume: 0.60,
    musicVolume: 0.20,
    captionsEnabled: false
};

// add new audio assets to list here and define as music or sound
const Game_Audio_Assets = [
    { key: "bgm", path: "assets/music/backgroundmusic.mp3", category: "music" },
    { key: "jump", path: "assets/music/jumpsoundeffect.mp3", category: "sound" },
    { key: "clockticking", path: "assets/music/clockbackgroundmusic.mp3", category: "sound" },
    { key: "radiobeeping", path: "assets/music/radiobeeping.mp3", category: "sound" },
    { key: "talkshow", path: "assets/music/radiotalkshow.mp3", category: "sound" },
    { key: "mobsound", path: "assets/music/mobsound.mp3", category: "sound" },
    { key: "powerboxsound", path: "assets/music/powerboxsound.mp3", category: "sound" }
];

function getGameSettingsValues(scene) {
    let fromStorage = {};
    try { fromStorage = JSON.parse(localStorage.getItem('gameSettings') || '{}'); } catch (e) { }
    const settingsValues = {
        ...Game_Default_Settings_Values,
        ...fromStorage,
        ...(scene.registry.get("settingsValues") || {})
    };

    scene.registry.set("settingsValues", settingsValues);
    return settingsValues;
}

function getGameAudioCategory(key) {
    const asset = Game_Audio_Assets.find((audioAsset) => audioAsset.key === key);
    return asset?.category || "sound";
}

function getGameAudioKeys(category) {
    return Game_Audio_Assets
        .filter((audioAsset) => getGameAudioCategory(audioAsset.key) === category)
        .map((audioAsset) => audioAsset.key);
}

function GameSpritemovement(options = {}) {
    const sprite = this.sprite = this.physics.add.sprite(0, 0, 'sprite').setScale(4);
    sprite.setDepth(options.depth ?? 1000);

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

    sprite.setPosition(options.x ?? sprite.displayWidth / 2, options.y ?? this.scale.height / 2);
    const spriteNewWidth = sprite.displayWidth * 0.5;
    const spriteOffsetX = (sprite.width - spriteNewWidth) / 2;
    sprite.setBodySize(spriteNewWidth, sprite.displayHeight);
    sprite.setOffset(spriteOffsetX, 0);

    this.physics.world.gravity.y = 600;
    this.physics.world.setBounds(0, 0, 1920, 1304);
    sprite.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;

    const SPEED = 200;

    const handlePointerDown = (pointer) => {
        if (!sprite.active || !sprite.body) return;

        if (pointer.y < sprite.y && (sprite.body.blocked.down || sprite.body.touching.down)) {
            const dy = Math.min(sprite.y - pointer.y, 600);
            sprite.setVelocityY(-Math.sqrt(2 * 600 * dy));
            playSoundEffect(this, 'jump');
        }
    };

    const handleUpdate = () => {
        if (!sprite.active || !sprite.body) return;

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
    };

    this.input.on('pointerdown', handlePointerDown);
    if (options.enablePointerMovement !== false) {
        this.events.on('update', handleUpdate);
    }
    this.events.once('shutdown', () => {
        this.input.off('pointerdown', handlePointerDown);
        this.events.off('update', handleUpdate);
    });
}

function startWithFade(scene, nextScene) {
    if (scene.isChangingScenes) return;

    scene.isChangingScenes = true;
    scene.input.enabled = false;
    scene.events.once("shutdown", () => {
        scene.isChangingScenes = false;
        scene.input.enabled = true;
    });
    scene.cameras.main.fadeOut(300, 0, 0, 0);
    scene.cameras.main.once("camerafadeoutcomplete", () => {
        scene.scene.start(nextScene);
    });
}

function addProgressButton(scene, options) {
    const buttonWidth = 300;
    const buttonHeight = 64;
    const button = scene.add.graphics();
    const drawButton = (fill, stroke) => {
        button.clear();
        button.fillStyle(fill, 0.94);
        button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
        button.lineStyle(3, stroke, 1);
        button.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 12);
    };

    const label = scene.add.text(0, 0, options.lockedLabel || "Solve puzzle first", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#8993a4"
    }).setOrigin(0.5);
    const buttonContainer = scene.add.container(1700, 1000, [button, label]);

    let unlocked = false;
    let leaving = false;
    drawButton(0x151d27, 0x4b6174);
    button.setInteractive(
        new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight),
        Phaser.Geom.Rectangle.Contains
    );
    button.input.cursor = "pointer";

    const refresh = () => {
        if (unlocked || !options.isUnlocked()) return;

        unlocked = true;
        drawButton(0x17212b, 0x7dd3fc);
        label.setText(options.unlockedLabel || "Continue").setColor("#f5f1e8");
    };

    button.on("pointerover", () => {
        drawButton(unlocked ? 0x24384a : 0x1d2b38, unlocked ? 0xb7f3ff : 0x4b6174);
        if (unlocked) label.setColor("#ffffff");
    });

    button.on("pointerout", () => {
        buttonContainer.setScale(1);
        drawButton(unlocked ? 0x17212b : 0x151d27, unlocked ? 0x7dd3fc : 0x4b6174);
        label.setColor(unlocked ? "#f5f1e8" : "#8993a4");
    });

    button.on("pointerdown", () => {
        refresh();
        if (!unlocked || leaving) return;

        buttonContainer.setScale(0.92);
        drawButton(0x0f1821, 0xb7f3ff);
        scene.time.delayedCall(90, () => buttonContainer.setScale(1));
        leaving = true;
        options.onContinue();
    });
    button.on("pointerup", () => buttonContainer.setScale(1));

    scene.events.on("update", refresh);
    scene.events.once("shutdown", () => scene.events.off("update", refresh));
    refresh();
    return buttonContainer;
}

function playGameBgm(scene) {
    const settingsValues = getGameSettingsValues(scene);

    const bgm = scene.sound.get("bgm") || scene.sound.add("bgm", {
        loop: true,
        volume: settingsValues.musicVolume
    });
    setMusicVolume(scene, settingsValues.musicVolume);

    if (!bgm.isPlaying) {
        bgm.play();
        showCaption(scene, Audio_Captions['bgm'], 3000);
    }
}

// win "scene"
function showCompletionPanel(scene) {
    const depth = 1000;

    scene.add.rectangle(960, 540, 920, 520, 0x111318, 0.98)
        .setStrokeStyle(4, 0x44ff44)
        .setInteractive()
        .setDepth(depth);

    scene.add.text(960, 400, "You escaped!", {
        fontFamily: "Arial",
        fontSize: "54px",
        color: "#f5f1e8"
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
        window.clockPuzzleSolved = false;
        window.radioPuzzleSolved = false;
        startWithFade(scene, "Game_StartCinematic");
    });
}

class Game_StartCinematic extends Phaser.Scene {
    constructor() {
        super("Game_StartCinematic");
    }

    preload() {
        this.load.spritesheet('sprite', 'assets/art/spritesheet.png', { frameWidth: 29, frameHeight: 42 });
        this.load.spritesheet('mob', 'assets/art/mobspritesheet.png', { frameWidth: 29, frameHeight: 42 });

        this.load.spritesheet('titlescreen', 'assets/art/titlescreenanim.png', { frameWidth: 249, frameHeight: 135 });

        Game_Audio_Assets.forEach((audioAsset) => {
            this.load.audio(audioAsset.key, audioAsset.path);
        });



        this.load.image('logoDraft', 'assets/art/logo.png');
        this.load.image('grandfatherClock', 'assets/art/grandfather clock.png');
        this.load.image('clockFace', 'assets/art/clock.png');
        this.load.image('powerbox', 'assets/art/powerbox.png');
        this.load.image('radio', 'assets/art/radio.png');
        this.load.image('lever', 'assets/art/lever2.png');
        this.load.image('emptylever', 'assets/art/emptylever.png');
        this.load.image('handle', 'assets/art/handle.png');
        this.load.image('grayBackground', 'assets/art/grayBackground.png');
        this.load.image('border', 'assets/art/border.png');
        this.load.image('door', 'assets/art/door.png');
        this.load.image('jumpscare', 'assets/art/jumpscarescene.png');
        this.load.image('note', 'assets/art/note.png');
        this.load.image('noteDesk', 'assets/art/desk2.png');
        this.load.json('gameData', 'data/levels.json');



    }

    create() {
        this.cameras.main.setBackgroundColor("#000000");
        //playGameBgm(this);

        this.fadeRect = this.add.image(300, 250, "logoDraft").setScale(3);
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
                    this.scene.start("Game_CinematicMainMenu");
                }
            });
        });

    }
}

class Game_CinematicMainMenu extends Phaser.Scene {
    constructor() {
        super("Game_CinematicMainMenu");
    }

    create() {
        this.cameras.main.setBackgroundColor("#151923");


        // Check if the unique key 'bg_loop' already exists in the global manager
        if (!this.anims.exists('bg_loop')) {
            this.anims.create({
                key: 'bg_loop',
                frames: this.anims.generateFrameNumbers('titlescreen', { start: 0, end: 26 }),
                frameRate: 7,
                repeat: -1
            });
        }
        const { width, height } = this.scale;
        const background = this.add.sprite(width / 2, height / 2, 'titlescreen');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        const bestScale = Math.min(scaleX, scaleY);
        background.setScale(bestScale);
        background.play('bg_loop');

        this.fadeRect = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 1)
            .setAlpha(0)
            .setDepth(900);

        this.add.rectangle(960, 150, 900, 120, 0x000000, 0.55)
            .setStrokeStyle(3, 0xffffff, 0.35);

        this.add.text(960, 150, "The Outer Limit", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#fefefe"
        }).setOrigin(0.5);

        const h = height;
        const buttonX = width / 2;
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
            window.clockPuzzleSolved = false;
            window.radioPuzzleSolved = false;
            this.scene.start("Game_ChasingScene");
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
        credits.on("pointerdown", () => this.scene.start("Game_CreditsScene"));

        this.tweens.chain({
            tweens: [
                { targets: startGameContainer, alpha: 1, duration: 1500, ease: "Linear" },
                { targets: settingsContainer, alpha: 1, duration: 1500, ease: "Linear" },
                { targets: creditsContainer, alpha: 1, duration: 1500, ease: "Linear" }
            ]
        });
    }
}
// Shiyi responsible for 
class Game_ChaseScene extends Phaser.Scene {
    constructor() {
        super("Game_ChaseScene");
    }

    create() {
        /*this.time.delayedCall(3000, () => {
            playGameBgm(this);
        }, [], this); */

        this.escaping = false;
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#0d1117");
        this.add.image(960, 540, "grayBackground").setScale(4);
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

        const groundY = 810;
        this.add.rectangle(960, groundY + 10, 1920, 20, 0x223344);

        const statusText = this.add.text(960, 900, "Pick the handle and the lever, then escape!", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#b8c4d4",
            align: "center"
        }).setOrigin(0.5);

        GameSpritemovement.call(this);
        const sprite = this.sprite;

        this.failing = false;

        this.add.rectangle(40, 540, 80, 1080, 0xff0000, 0.25).setDepth(5);
        this.add.rectangle(1880, 540, 80, 1080, 0xff0000, 0.25).setDepth(5);
        this.add.rectangle(960, 30, 1920, 60, 0xff0000, 0.25).setDepth(5);
        this.add.rectangle(960, 1050, 1920, 60, 0xff0000, 0.25).setDepth(5);

        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                if (!this.failing && !this.escaping) this.cameras.main.shake(300, 0.003);
            }
        });

        let timeLeft = 11;
        const timerText = this.add.text(960, 250, '11', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ff4444'
        }).setOrigin(0.5).setDepth(10);

        if (!this.anims.exists('mob-walk')) {
            this.anims.create({ key: 'mob-walk', frames: this.anims.generateFrameNumbers('mob', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
        }

        this.events.once('shutdown', () => {
            const mob = this.sound.get('mobsound');
            if (mob) mob.stop();
        });

        const alienEnter = () => {
            playLoopingSound(this, 'mobsound');
            const alien = this.add.sprite(0, groundY - 50, 'mob').setScale(4).setDepth(5);
            alien.anims.play('mob-walk');
            this.events.on('update', (time, delta) => {
                if (this.failing || this.escaping) return;
                alien.x += 500 * (delta / 1000);
                if (alien.x >= sprite.x - 30) {
                    this.failing = true;
                    this.cameras.main.shake(200, 0.02);
                    this.cameras.main.fade(500, 0, 0, 0);
                    this.time.delayedCall(500, () => this.scene.start('Game_FailScene'));
                }
            });
        };

        this.time.addEvent({
            delay: 1000,
            repeat: 10,
            callback: () => {
                timeLeft--;
                timerText.setText(timeLeft.toString());
                if (timeLeft <= 0) alienEnter();
            }
        });

        const handleObj = this.add.image(500, groundY - 20, 'handle').setDisplaySize(40, 40);
        const handleLabel = this.add.text(500, groundY - 52, "Handle", {
            fontFamily: "Arial", fontSize: "18px", color: "#ffd700"
        }).setOrigin(0.5);
        this.physics.add.existing(handleObj, true);

        this.physics.add.overlap(sprite, handleObj, () => {
            if (!handleObj.active) return;
            handleObj.setActive(false).setVisible(false);
            handleObj.body.enable = false;
            handleLabel.setVisible(false);
            addInventoryItem("handle");
            statusText.setText("Handle picked up! Now find the lever.");
        });

        const leverObj = this.add.image(1300, groundY - 40, 'lever').setDisplaySize(40, 80);
        const leverLabel = this.add.text(1300, groundY - 92, "Lever", {
            fontFamily: "Arial", fontSize: "18px", color: "#8899aa"
        }).setOrigin(0.5);
        this.physics.add.existing(leverObj, true);

        this.physics.add.overlap(sprite, leverObj, () => {
            if (!leverObj.active) return;
            leverObj.setActive(false).setVisible(false);
            leverObj.body.enable = false;
            leverLabel.setVisible(false);
            addInventoryItem("lever");
            statusText.setText("Lever picked up! Use it on the door.");
        });

        const doorHeight = 250;
        const doorY = groundY - doorHeight / 2;
        const door = this.add.image(1820, doorY, 'door').setDisplaySize(80, doorHeight);
        const doorLockedText = this.add.text(1820, groundY - 20, "LOCKED", {
            fontFamily: "Arial", fontSize: "22px", color: "#b8c4d4"
        }).setOrigin(0.5);

        const doorZone = this.add.zone(1820, doorY, 80, doorHeight);
        this.physics.add.existing(doorZone, false);
        doorZone.body.setAllowGravity(false);

        this.physics.add.overlap(sprite, doorZone, () => {
            if (this.escaping) return;
            if (!window.playerInventory.includes("lever")) {
                statusText.setText("The door is locked. Find a lever!");
                return;
            }
            removeInventoryItem("lever");
            this.escaping = true;
            doorLockedText.setText("OPEN");
            door.setAlpha(0.5);
            sprite.setVelocity(0, 0);
            window.playerInventory = [];
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start("Game_PowerBox"));
        });

        addInventoryButton(this);
    }
}

class Game_PowerBox extends Phaser.Scene {
    constructor() {
        super("Game_PowerBox");
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        this.add.image(960, 540, "grayBackground").setScale(4);
        playGameBgm(this);
        //playLoopingSound(this, 'powerboxsound');
        GameSpritemovement.call(this);
        addGameSettingsButton(this);

        /*this.powerboxsound = this.sound.add('powerboxsound', { loop: true });
        this.powerboxsound.play();

        // 2. Add the shutdown listener to turn off this specific track
        this.events.once('shutdown', () => {
            if (this.powerboxsound) {
                this.powerboxsound.stop();
            }
        }); */

        /*this.powerboxsound = this.sound.get('powerboxsound');

        if (!this.powerboxsound) {
            // Create and play it only if it doesn't exist yet
            this.powerboxsound = this.sound.add('powerboxsound', { loop: true });
            this.powerboxsound.play();
        } else if (!this.powerboxsound.isPlaying) {
            this.powerboxsound.play();
        }

        // Only kill the sound if we are NOT going to the wire puzzle scene
        this.events.once('shutdown', () => {
            // Check if the next scene is the puzzle. If it isn't, stop the sound completely.
            if (!this.scene.isActive('Game_DemoWirePuzzle')) {
                const snd = this.sound.get('powerboxsound');
                if (snd) snd.stop();
            }
        }); */



        const notePickedUp = window.playerInventory.includes("decoder");
        //this.add.image(300, 762, "noteDesk").setDisplaySize(80, 100);
        const noteObj = this.add.image(300, 742, "note").setDisplaySize(40, 40)
            .setInteractive({ useHandCursor: true }).setVisible(!notePickedUp);

        noteObj.on("pointerdown", () => {
            addInventoryItem("decoder");
            noteObj.setVisible(false);
        });

        // this.add.text(960, 340, "Power Box").setFontSize(48).setOrigin(0.5);
        const powerBox = this.add.image(960, 540, 'powerbox').setDisplaySize(240, 240)
            .setInteractive({ useHandCursor: true });
        const powerBoxPulse = this.add.image(960, 540, 'powerbox')
            .setDisplaySize(240, 240)
            .setTint(0xffffff)
            .setTintMode(Phaser.TintModes.FILL)
            .setAlpha(0)
            .setDepth(5);
        const powerBoxPulseScaleX = powerBoxPulse.scaleX;
        const powerBoxPulseScaleY = powerBoxPulse.scaleY;

        powerBox.on("pointerdown", () => {
            if (this.isChangingScenes)
                return;

            this.input.enabled = false;
            this.tweens.add({
                targets: powerBoxPulse,
                alpha: 0.85,
                scaleX: powerBoxPulseScaleX * 1.03,
                scaleY: powerBoxPulseScaleY * 1.03,
                duration: 160,
                yoyo: true,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    powerBoxPulse.setScale(powerBoxPulseScaleX, powerBoxPulseScaleY).setAlpha(0);
                    startWithFade(this, "Game_DemoWirePuzzle");
                }
            });
        });

        const backWidth = 230;
        const backHeight = 64;
        const backButton = this.add.graphics();
        const drawBackButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
            backButton.clear();
            backButton.fillStyle(fill, 0.94);
            backButton.fillRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
            backButton.lineStyle(3, stroke, 1);
            backButton.strokeRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
        };
        const backLabel = this.add.text(0, 0, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        const backContainer = this.add.container(165, 72, [backButton, backLabel]).setDepth(10);
        drawBackButton();
        backButton.setInteractive(
            new Phaser.Geom.Rectangle(-backWidth / 2, -backHeight / 2, backWidth, backHeight),
            Phaser.Geom.Rectangle.Contains
        );
        backButton.input.cursor = "pointer";
        backButton.on("pointerover", () => {
            drawBackButton(0x24384a, 0xb7f3ff);
            backLabel.setColor("#ffffff");
        });
        backButton.on("pointerout", () => {
            backContainer.setScale(1);
            drawBackButton();
            backLabel.setColor("#f5f1e8");
        });
        backButton.on("pointerdown", () => {
            backContainer.setScale(0.92);
            drawBackButton(0x0f1821, 0xb7f3ff);
            this.time.delayedCall(90, () => backContainer.setScale(1));
            startWithFade(this, "Game_ChaseScene");
        });
        backButton.on("pointerup", () => backContainer.setScale(1));

        addInventoryButton(this);
    }
}

class Game_DemoWirePuzzle extends Phaser.Scene {
    constructor() {
        super("Game_DemoWirePuzzle");
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        this.wirePuzzleSolved = false;
        playGameBgm(this);

        /*this.powerboxsound = this.sound.get('powerboxsound');

        if (!this.powerboxsound) {
            this.powerboxsound = this.sound.add('powerboxsound', { loop: true });
            this.powerboxsound.play();
        } else if (!this.powerboxsound.isPlaying) {
            this.powerboxsound.play();
        }

        // Only kill the sound if we are NOT returning to the main powerbox scene
        this.events.once('shutdown', () => {
            if (!this.scene.isActive('Game_PowerBox')) {
                const snd = this.sound.get('powerboxsound');
                if (snd) snd.stop();
            }
        }); */

        //playLoopingSound(this, 'powerboxsound');

        /*this.powerboxsound = this.sound.add('powerboxsound', { loop: true });
        this.powerboxsound.play();

        // 2. Add the shutdown listener to turn off this specific track
        this.events.once('shutdown', () => {
            if (this.powerboxsound) {
                this.powerboxsound.stop();
            }
        }); */



        addGameSettingsButton(this);
        addInventoryButton(this);

        // this.add.text(960, 80, "Wire Puzzle", {
        //     fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        // }).setOrigin(0.5);

        const statusText = this.add.text(960, 900, "Connect each symbol to its correct terminal. Check your inventory for the decoder.", {
            fontFamily: "Arial", fontSize: "24px", color: "#b8c4d4", align: "center", wordWrap: { width: 1200 }
        }).setOrigin(0.5);

        const { symbols, rightCodes, rightSymOrder, correctPairs } = this.cache.json.get('gameData').wirePuzzle;
        const leftX = 460, rightX = 1460, yStart = 280, yGap = 150;

        const leftNodes = symbols.map((sym, i) => {
            const y = yStart + i * yGap;
            const node = this.add.circle(leftX, y, 28, 0x4a90d9)
                .setStrokeStyle(3, 0xffffff).setInteractive({ useHandCursor: true });
            this.add.text(leftX - 55, y, sym, {
                fontFamily: "Arial", fontSize: "38px", color: "#f5f1e8"
            }).setOrigin(0.5);
            return node;
        });

        const rightNodes = rightSymOrder.map((si, i) => {
            const y = yStart + i * yGap;
            const node = this.add.circle(rightX, y, 28, 0x334455)
                .setStrokeStyle(3, 0xaabbcc).setInteractive({ useHandCursor: true });
            this.add.text(rightX + 50, y, rightCodes[si], {
                fontFamily: "Arial", fontSize: "26px", color: "#f5f1e8"
            }).setOrigin(0, 0.5);
            return node;
        });

        const lines = this.add.graphics();
        this.connected = {};
        this.selectedLeft = null;
        this.wirePuzzleSolved = false;

        const redraw = () => {
            lines.clear();
            Object.entries(this.connected).forEach(([li, ri]) => {
                lines.lineStyle(5, 0x4a90d9, 1);
                lines.beginPath();
                lines.moveTo(leftX + 28, yStart + li * yGap);
                lines.lineTo(rightX - 28, yStart + ri * yGap);
                lines.strokePath();
            });
        };

        const checkSolved = () => {
            const done = symbols.every((_, i) => this.connected[i] !== undefined);
            if (!done) return;
            const correct = symbols.every((_, i) => this.connected[i] === correctPairs[i]);
            if (correct) {
                this.wirePuzzleSolved = true;
                statusText.setText("✓ All circuits connected! Puzzle solved.").setColor("#44ff44");
            } else {
                statusText.setText("Incorrect — resetting...").setColor("#ff6644");
                this.time.delayedCall(1500, () => {
                    this.connected = {};
                    redraw();
                    leftNodes.forEach(n => n.setStrokeStyle(3, 0xffffff));
                    statusText.setText("Try again. Check your inventory for the decoder.").setColor("#b8c4d4");
                });
            }
        };

        leftNodes.forEach((node, i) => {
            node.on("pointerdown", () => {
                this.selectedLeft = i;
                leftNodes.forEach(n => n.setStrokeStyle(3, 0xffffff));
                node.setStrokeStyle(4, 0xffff00);
                statusText.setText(`"${symbols[i]}" selected — click or drag to a terminal on the right.`).setColor("#ffff00");
            });
            this.input.setDraggable(node);
        });

        const dragLine = this.add.graphics().setDepth(5);
        this.input.on("drag", (pointer, obj) => {
            const i = leftNodes.indexOf(obj);
            if (i === -1) return;
            dragLine.clear();
            dragLine.lineStyle(4, 0xffffff, 0.5);
            dragLine.beginPath();
            dragLine.moveTo(leftX + 28, yStart + i * yGap);
            dragLine.lineTo(pointer.x, pointer.y);
            dragLine.strokePath();
        });

        this.input.on("dragend", (pointer, obj) => {
            dragLine.clear();
            const i = leftNodes.indexOf(obj);
            if (i === -1) return;
            const hit = rightNodes.findIndex(n => Phaser.Math.Distance.Between(pointer.x, pointer.y, n.x, n.y) < 50);
            if (hit !== -1) {
                Object.keys(this.connected).forEach(li => { if (this.connected[li] === hit) delete this.connected[li]; });
                this.connected[i] = hit;
                this.selectedLeft = null;
                leftNodes.forEach(n => n.setStrokeStyle(3, 0xffffff));
                redraw();
                checkSolved();
            }
        });

        rightNodes.forEach((node, ri) => {
            node.on("pointerdown", () => {
                if (this.selectedLeft === null) return;
                Object.keys(this.connected).forEach(li => { if (this.connected[li] === ri) delete this.connected[li]; });
                this.connected[this.selectedLeft] = ri;
                this.selectedLeft = null;
                leftNodes.forEach(n => n.setStrokeStyle(3, 0xffffff));
                redraw();
                checkSolved();
            });
        });

        const decoderOverlay = this.add.container(960, 540).setDepth(20).setVisible(false);
        const bg = this.add.rectangle(0, 0, 480, 360, 0x101010).setStrokeStyle(3, 0xffd700);
        const title = this.add.text(0, -140, "— Decoder Note —", { fontFamily: "Arial", fontSize: "26px", color: "#ffd700" }).setOrigin(0.5);
        const body = this.add.text(0, -30, "△  =  TZ-3\n○  =  AL-0\n□  =  XR-1\n✕  =  QM-2", {
            fontFamily: "Arial", fontSize: "30px", color: "#f5f1e8", lineSpacing: 14, align: "center"
        }).setOrigin(0.5);
        const close = this.add.text(0, 145, "[ Close ]", { fontFamily: "Arial", fontSize: "22px", color: "#aaaaaa" })
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        close.on("pointerdown", () => decoderOverlay.setVisible(false));
        decoderOverlay.add([bg, title, body, close]);

        window.inventoryItemActions = window.inventoryItemActions || {};
        window.inventoryItemActions["decoder"] = () => decoderOverlay.setVisible(true);
        this.events.once("shutdown", () => { delete window.inventoryItemActions["decoder"]; });

        const backWidth = 230;
        const backHeight = 64;
        const backButton = this.add.graphics();
        const drawBackButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
            backButton.clear();
            backButton.fillStyle(fill, 0.94);
            backButton.fillRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
            backButton.lineStyle(3, stroke, 1);
            backButton.strokeRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
        };
        const backLabel = this.add.text(0, 0, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        const backContainer = this.add.container(165, 72, [backButton, backLabel]).setDepth(10);
        drawBackButton();
        backButton.setInteractive(
            new Phaser.Geom.Rectangle(-backWidth / 2, -backHeight / 2, backWidth, backHeight),
            Phaser.Geom.Rectangle.Contains
        );
        backButton.input.cursor = "pointer";
        backButton.on("pointerover", () => {
            drawBackButton(0x24384a, 0xb7f3ff);
            backLabel.setColor("#ffffff");
        });
        backButton.on("pointerout", () => {
            backContainer.setScale(1);
            drawBackButton();
            backLabel.setColor("#f5f1e8");
        });
        backButton.on("pointerdown", () => {
            backContainer.setScale(0.92);
            drawBackButton(0x0f1821, 0xb7f3ff);
            this.time.delayedCall(90, () => backContainer.setScale(1));
            startWithFade(this, "Game_PowerBox");
        });
        backButton.on("pointerup", () => backContainer.setScale(1));

        addProgressButton(this, {
            isUnlocked: () => this.wirePuzzleSolved,
            onContinue: () => startWithFade(this, "Game_ClockRoom")
        });
    }
}

// have some visual effects in the room when you return after solving the clock puzzle
class Game_ClockRoom extends Phaser.Scene {
    constructor() {
        super("Game_ClockRoom");
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        playGameBgm(this);
        GameSpritemovement.call(this);
        addGameSettingsButton(this);
        addInventoryButton(this);

        this.add.image(960, 540, "grayBackground").setScale(4);
        this.add.image(960, 540, "border").setScale(2.1);
        this.add.image(965, 544, "grandfatherClock").setScale(11).setSize(260, 520);

        const clockNoteOverlay = this.add.container(960, 540).setDepth(20).setVisible(false);
        const clockNoteBg = this.add.rectangle(0, 0, 620, 300, 0x101010).setStrokeStyle(3, 0xffd700);
        const clockNoteTitle = this.add.text(0, -105, "— Clock Note —", {
            fontFamily: "Arial", fontSize: "28px", color: "#ffd700"
        }).setOrigin(0.5);
        const clockNoteBody = this.add.text(0, 0, "Only one hand can unwind time.", {
            fontFamily: "Arial", fontSize: "34px", color: "#f5f1e8", align: "center", wordWrap: { width: 520 }
        }).setOrigin(0.5);
        const clockNoteClose = this.add.text(0, 105, "[ Close ]", {
            fontFamily: "Arial", fontSize: "22px", color: "#aaaaaa"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        clockNoteClose.on("pointerdown", () => clockNoteOverlay.setVisible(false));
        clockNoteOverlay.add([clockNoteBg, clockNoteTitle, clockNoteBody, clockNoteClose]);

        window.inventoryItemActions = window.inventoryItemActions || {};
        window.inventoryItemActions["Clock Note"] = () => clockNoteOverlay.setVisible(true);
        this.events.once("shutdown", () => { delete window.inventoryItemActions["Clock Note"]; });

        const clockNotePickedUp = window.playerInventory.includes("Clock Note");
        const clockNoteObj = this.add.image(1325, 710, "note")
            .setDisplaySize(40, 40)
            .setInteractive({ useHandCursor: true })
            .setVisible(!clockNotePickedUp);

        clockNoteObj.on("pointerdown", () => {
            addInventoryItem("Clock Note");
            clockNoteObj.setVisible(false);
        });

        // make global so this can be called / used by other scenes
        const clockPulse = this.add.image(965, 544, "grandfatherClock")
            .setScale(11)
            .setTint(0xffffff)
            .setTintMode(Phaser.TintModes.FILL)
            .setAlpha(0)
            .setDepth(5);

        if (window.clockTimeRewindEffect) {
            window.clockTimeRewindEffect = false;
            const timeFlash = this.add.rectangle(960, 540, 1920, 1080, 0xb7f3ff, 0.55)
                .setDepth(6)
                .setScrollFactor(0);

            this.tweens.add({
                targets: clockPulse,
                alpha: 0.85,
                scale: 11.35,
                duration: 220,
                yoyo: true,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    clockPulse.setScale(11).setAlpha(0);
                }
            });

            this.tweens.add({
                targets: timeFlash,
                alpha: 0,
                duration: 650,
                ease: "Sine.easeOut",
                onComplete: () => {
                    timeFlash.destroy();
                }
            });
        }

        const isClockPuzzleSolved = () => window.clockPuzzleSolved === true;
        const doorGlowColor = isClockPuzzleSolved() ? 0x44ff44 : 0xff3333;
        const door = this.add.image(1665, 590, "door").setScale(11);
        door.enableFilters().filters.external.addGlow(doorGlowColor, 2, 1, 1, false, 10, 12);

        // move when new background added
        const doorArea = this.add.zone(1665, 590, 190, 330).setInteractive({ useHandCursor: true });

        // add visual debug for clickable areas
        // this.add.rectangle(1665, 590, 190, 330).setStrokeStyle(2, 0xffd700).setAlpha(0.5);
        this.physics.add.existing(doorArea, true);

        doorArea.on("pointerdown", () => {
            if (!isClockPuzzleSolved() || !this.physics.overlap(this.sprite, doorArea))
                return;

            startWithFade(this, "Game_RadioRoom");
        });

        // create clickable hitbox around the clock
        const clockArea = this.add.zone(965, 540, 260, 520).setInteractive({ useHandCursor: true });

        // add visual debug for clickable areas
        // this.add.rectangle(965, 540, 260, 520).setStrokeStyle(2, 0xffd700).setAlpha(0.5);
        this.physics.add.existing(clockArea, true);

        clockArea.on("pointerdown", () => {
            if (!this.physics.overlap(this.sprite, clockArea) || this.isChangingScenes)
                return;

            this.input.enabled = false;
            this.tweens.add({
                targets: clockPulse,
                alpha: 0.85,
                scale: 11.35,
                duration: 160,
                yoyo: true,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    clockPulse.setScale(11).setAlpha(0);
                    startWithFade(this, "Game_DemoClock");
                }
            });
        });
    }
}

class Game_DemoClock extends Phaser.Scene {
    constructor() {
        super("Game_DemoClock");
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        playGameBgm(this);
        addGameSettingsButton(this);
        addInventoryButton(this);


        const statusText = this.add.text(960, 980, "Drag the clock hand.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const clockFace = this.add.image(960, 520, "clockFace").setScale(12);
        const clockCenter = clockFace.getCenter();
        const cx = clockCenter.x + 13;
        const cy = clockCenter.y - 10;
        const radius = 160;


        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x3d3a36, 0.6);
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = cx + Math.cos(angle) * (radius - 20);
            const y1 = cy + Math.sin(angle) * (radius - 20);
            const x2 = cx + Math.cos(angle) * (radius + 97);
            const y2 = cy + Math.sin(angle) * (radius + 97);
            graphics.beginPath();
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
            graphics.strokePath();
        }

        this.handAngle = -Math.PI / 2;
        const handLength = 173;
        const handGraphics = this.add.graphics();
        const drawHand = () => {
            handGraphics.clear();
            handGraphics.lineStyle(8, 0x99643f, 1);
            handGraphics.beginPath();
            handGraphics.moveTo(cx, cy);
            handGraphics.lineTo(
                cx + Math.cos(this.handAngle) * handLength,
                cy + Math.sin(this.handAngle) * handLength
            );
            handGraphics.strokePath();
            handGraphics.fillStyle(0x99643f);
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
                // clockwise = "unsolve" the puzzle
                window.clockPuzzleSolved = false;
                statusText.setText("Clockwise rotation");
                statusText.setColor("#ffaa44");
            } else if (totalRotation < -Math.PI) {
                // counterclockwise = solved the puzzle
                window.clockPuzzleSolved = true;
                statusText.setText("Counterclockwise rotation");
                statusText.setColor("#44ff44");
            } else {
                // if not enough rotation, nothing happens
                statusText.setText("Turn more to make a choice.");
                statusText.setColor("#b8c4d4");
            }
        });

        const backWidth = 255;
        const backHeight = 64;
        const backButton = this.add.graphics();
        const drawBackButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
            backButton.clear();
            backButton.fillStyle(fill, 0.94);
            backButton.fillRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
            backButton.lineStyle(3, stroke, 1);
            backButton.strokeRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
        };
        const backLabel = this.add.text(0, 0, "Back to Clock Room", {
            fontFamily: "Arial", fontSize: "22px", color: "#f5f1e8"
        }).setOrigin(0.5);
        const backContainer = this.add.container(153, 540, [backButton, backLabel]);
        drawBackButton();
        backButton.setInteractive(
            new Phaser.Geom.Rectangle(-backWidth / 2, -backHeight / 2, backWidth, backHeight),
            Phaser.Geom.Rectangle.Contains
        );
        backButton.input.cursor = "pointer";
        backButton.on("pointerover", () => {
            drawBackButton(0x24384a, 0xb7f3ff);
            backLabel.setColor("#ffffff");
        });
        backButton.on("pointerout", () => {
            backContainer.setScale(1);
            drawBackButton();
            backLabel.setColor("#f5f1e8");
        });
        backButton.on("pointerdown", () => {
            backContainer.setScale(0.92);
            drawBackButton(0x0f1821, 0xb7f3ff);
            this.time.delayedCall(90, () => backContainer.setScale(1));
            if (window.clockPuzzleSolved === true) {
                window.clockTimeRewindEffect = true;
            }
            startWithFade(this, "Game_ClockRoom");
        });
        backButton.on("pointerup", () => backContainer.setScale(1));
    }
}

class Game_RadioRoom extends Phaser.Scene {
    constructor() {
        super("Game_RadioRoom");
    }
    

    create() {
        this.cameras.main.setBackgroundColor("#101716");
        GameSpritemovement.call(this);
        addGameSettingsButton(this, { playBgmOnOpen: false });

        const bgm = this.sound.get('bgm');
        if (bgm) {
            bgm.stop();
        }
        this.radiobeeping = playLoopingSound(this, 'radiobeeping');

        this.add.image(960, 540, "grayBackground").setScale(4);
        this.add.image(960, 540, "border").setScale(2.1);
        this.add.image(1160, 450, "radio").setScale(5).setDepth(2);
        const radioPulse = this.add.image(1160, 450, "radio")
            .setScale(5)
            .setTint(0xffffff)
            .setTintMode(Phaser.TintModes.FILL)
            .setAlpha(0)
            .setDepth(5);

        const isRadioPuzzleSolved = () => window.radioPuzzleSolved === true;
        const doorGlowColor = isRadioPuzzleSolved() ? 0x44ff44 : 0xff3333;
        const door = this.add.image(1665, 590, "door").setScale(11);
        door.enableFilters().filters.external.addGlow(doorGlowColor, 2, 1, 1, false, 10, 12);

        const doorArea = this.add.zone(1665, 590, 190, 330).setInteractive({ useHandCursor: true });
        this.physics.add.existing(doorArea, true);

        doorArea.on("pointerdown", () => {
            if (!isRadioPuzzleSolved() || !this.physics.overlap(this.sprite, doorArea) || this.completionShown)
                return;

            this.completionShown = true;
            const talkshow = this.sound.get('talkshow');
            if (talkshow) {
                talkshow.stop();
            }
            const radiobeeping = this.sound.get('radiobeeping');
            if (radiobeeping) {
                radiobeeping.stop();
            }
            showCompletionPanel(this);
        });

        // draw table
        const tableGraphics = this.add.graphics();
        tableGraphics.fillStyle(0x000000, 0.28);

        // table top, legs
        tableGraphics.fillRoundedRect(942, 536, 660, 34, 8);
        tableGraphics.fillRoundedRect(1024, 568, 36, 220, 6);
        tableGraphics.fillRoundedRect(1484, 568, 36, 220, 6);

        // table top border
        tableGraphics.fillStyle(0x6b4226);
        tableGraphics.lineStyle(4, 0x3f2718);
        tableGraphics.fillRoundedRect(930, 523, 660, 34, 8);
        tableGraphics.strokeRoundedRect(930, 523, 660, 34, 8);

        // table legs border
        tableGraphics.fillStyle(0x4f2f1b);
        tableGraphics.lineStyle(3, 0x2a170d);
        tableGraphics.fillRoundedRect(1012, 555, 36, 220, 6);
        tableGraphics.strokeRoundedRect(1012, 555, 36, 220, 6);
        tableGraphics.fillRoundedRect(1472, 555, 36, 220, 6);
        tableGraphics.strokeRoundedRect(1472, 555, 36, 220, 6); 


        // small nails / bolts
        tableGraphics.fillStyle(0x2b160b, 0.7);
        tableGraphics.fillCircle(965, 540, 3);
        tableGraphics.fillCircle(1555, 540, 3);
        tableGraphics.fillCircle(1030, 585, 3);
        tableGraphics.fillCircle(1030, 745, 3);
        tableGraphics.fillCircle(1490, 585, 3);
        tableGraphics.fillCircle(1490, 745, 3);


        // radio hitbox
        const radioArea = this.add.zone(1160, 450, 200, 150).setInteractive({ useHandCursor: true });
        this.physics.add.existing(radioArea, true);

        // debug visual for zone
        //this.add.rectangle(1160, 450, 200, 150).setStrokeStyle(2, 0xffd700).setAlpha(0.5);

        radioArea.on("pointerdown", () => {
            if (!this.physics.overlap(this.sprite, radioArea) || this.isChangingScenes)
                return;

            this.input.enabled = false;
            this.tweens.add({
                targets: radioPulse,
                alpha: 0.85,
                scale: 5.16,
                duration: 160,
                yoyo: true,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    radioPulse.setScale(5).setAlpha(0);
                    startWithFade(this, "Game_DemoRadio");
                }
            });
        });
    }
}

class Game_DemoRadio extends Phaser.Scene {
    constructor() {
        super("Game_DemoRadio");
    }
    /**
     * Update closeup visual asset / create
     * randomize the frequency you need to find
     * use radiotalkshow.mp3? 
     * becomes louder / quieter based on how close you are
     * Once you get it right do something
     * 
     */
    create() {
        this.cameras.main.setBackgroundColor("#101716");

        const bgm = this.sound.get('bgm');
        if (bgm) {
            bgm.stop();
        }

        addGameSettingsButton(this, { playBgmOnOpen: false });
        addInventoryButton(this);
        this.talkshow = playLoopingSound(this, 'talkshow');



        const statusText = this.add.text(960, 880, "Tune the radio to the correct frequency.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const correctFrequency = Phaser.Math.Between(20, 160);
        this.frequency = 30;
        window.radioPuzzleSolved = false;

        this.add.image(960, 430, "radio").setScale(23).setDepth(2);

        const frequencyText = this.add.text(960, 310, `${this.frequency} MHz`, {
            fontFamily: "Arial", fontSize: "56px", color: "#7dd3fc"
        }).setOrigin(0.5).setDepth(3);
        const signalText = this.add.text(960, 780, "~ static ~", {
            fontFamily: "Arial", fontSize: "30px", color: "#556677"
        }).setOrigin(0.5).setDepth(3);

        const update = () => {
            const difference = Math.abs(this.frequency - correctFrequency);
            setSoundInstanceVolume(this.talkshow, Phaser.Math.Clamp(1 - (difference / 100), 0, 1));
            frequencyText.setText(`${this.frequency} MHz`);
            if (this.frequency === correctFrequency) {
                window.radioPuzzleSolved = true;
                signalText.setText("◆ SIGNAL FOUND ◆");
                signalText.setColor("#44ff44");
                statusText.setText(`Frequency locked: ${correctFrequency} MHz`);
                statusText.setColor("#44ff44");
            } else {
                window.radioPuzzleSolved = false;
                if (difference <= 5) {
                    signalText.setText("~ the signal gets louder ~");
                    signalText.setColor("#ffaa44");
                } else {
                    signalText.setText("~ static ~");
                    signalText.setColor("#556677");
                }
                statusText.setText("Tune the radio to the correct frequency.");
                statusText.setColor("#b8c4d4");

            }
        };

        const createTuningButton = (x, y, width, height, drawIcon, onClick) => {
            const button = this.add.graphics();
            const icon = this.add.graphics();
            const container = this.add.container(x, y, [button, icon]).setDepth(3);
            const drawButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
                button.clear();
                button.fillStyle(fill, 0.94);
                button.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
                button.lineStyle(3, stroke, 1);
                button.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
            };

            drawButton();
            drawIcon(icon);
            button.setInteractive(
                new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
                Phaser.Geom.Rectangle.Contains
            );
            button.input.cursor = "pointer";
            button.on("pointerover", () => drawButton(0x24384a, 0xb7f3ff));
            button.on("pointerout", () => {
                container.setScale(1);
                drawButton();
            });
            button.on("pointerdown", () => {
                container.setScale(0.92);
                drawButton(0x0f1821, 0xb7f3ff);
                this.time.delayedCall(90, () => container.setScale(1));
                onClick();
            });
            button.on("pointerup", () => container.setScale(1));

            return button;
        };

        const buttonLeft = createTuningButton(520, 460, 100, 80, (icon) => {
            icon.fillStyle(0xf5f1e8);
            icon.fillTriangle(-25, 0, 20, -25, 20, 25);
        }, () => {
            this.frequency = Math.max(20, this.frequency - 1);
            update();
        });

        const buttonRight = createTuningButton(1420, 460, 100, 80, (icon) => {
            icon.fillStyle(0xf5f1e8);
            icon.fillTriangle(25, 0, -20, -25, -20, 25);
        }, () => {
            this.frequency = Math.min(160, this.frequency + 1);
            update();
        });

        const buttonLeftFive = createTuningButton(520, 670, 80, 60, (icon) => {
            icon.fillStyle(0xb8c4d4);
            icon.fillTriangle(-28, 0, -5, -18, -5, 18);
            icon.fillTriangle(2, 0, 25, -18, 25, 18);
        }, () => {
            this.frequency = Math.max(20, this.frequency - 5);
            update();
        });

        const buttonRightFive = createTuningButton(1420, 670, 80, 60, (icon) => {
            icon.fillStyle(0xb8c4d4);
            icon.fillTriangle(-25, -18, -25, 18, -2, 0);
            icon.fillTriangle(5, -18, 5, 18, 28, 0);
        }, () => {
            this.frequency = Math.min(160, this.frequency + 5);
            update();
        });

        update();

        const backWidth = 255;
        const backHeight = 64;
        const backButton = this.add.graphics();
        const drawBackButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
            backButton.clear();
            backButton.fillStyle(fill, 0.94);
            backButton.fillRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
            backButton.lineStyle(3, stroke, 1);
            backButton.strokeRoundedRect(-backWidth / 2, -backHeight / 2, backWidth, backHeight, 12);
        };
        const backLabel = this.add.text(0, 0, "Back to Radio Room", {
            fontFamily: "Arial", fontSize: "22px", color: "#f5f1e8"
        }).setOrigin(0.5);
        const backContainer = this.add.container(153, 540, [backButton, backLabel]);
        drawBackButton();
        backButton.setInteractive(
            new Phaser.Geom.Rectangle(-backWidth / 2, -backHeight / 2, backWidth, backHeight),
            Phaser.Geom.Rectangle.Contains
        );
        backButton.input.cursor = "pointer";
        backButton.on("pointerover", () => {
            drawBackButton(0x24384a, 0xb7f3ff);
            backLabel.setColor("#ffffff");
        });
        backButton.on("pointerout", () => {
            backContainer.setScale(1);
            drawBackButton();
            backLabel.setColor("#f5f1e8");
        });
        backButton.on("pointerdown", () => {
            backContainer.setScale(0.92);
            drawBackButton(0x0f1821, 0xb7f3ff);
            this.time.delayedCall(90, () => backContainer.setScale(1));
            startWithFade(this, "Game_RadioRoom");
        });
        backButton.on("pointerup", () => backContainer.setScale(1));
    }
}

class Game_ChasingScene extends Phaser.Scene {
    constructor() {
        super("Game_ChasingScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#0d1117");
        this.add.image(960, 540, "grayBackground").setScale(4);
        this.transitioning = false;
        addGameSettingsButton(this);

        const groundY = 810;
        this.add.rectangle(960, groundY + 10, 1920, 20, 0x223344);
        this.physics.world.gravity.y = 600;
        this.physics.world.setBounds(0, 0, 1920, 1304);

        this.add.image(1870, groundY - 100, 'door').setDisplaySize(60, 200);
        const doorZone = this.add.zone(1870, groundY - 100, 60, 200);
        this.physics.add.existing(doorZone, true);

        const sprite = this.physics.add.sprite(200, 400, 'sprite').setScale(4);
        if (!this.anims.exists('right'))
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        sprite.anims.play('right');
        const sw = sprite.displayWidth * 0.5;
        sprite.setBodySize(sw, sprite.displayHeight);
        sprite.setOffset((sprite.width - sw) / 2, 0);
        sprite.setCollideWorldBounds(true);
        sprite.setVelocityX(0);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < sprite.y - 80 && (sprite.body.blocked.down || sprite.body.touching.down)) {
                const dy = Math.min(sprite.y - pointer.y, 500);
                sprite.setVelocityY(-Math.sqrt(2 * 600 * dy));
                playSoundEffect(this, "jump");
            }
        });

        this.physics.add.overlap(sprite, doorZone, () => {
            if (this.transitioning) return;
            this.transitioning = true;
            const mob = this.sound.get('mobsound');
            if (mob) mob.stop();
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('Game_ChaseScene'));
        });

        this.events.once('shutdown', () => {
            const mob = this.sound.get('mobsound');
            if (mob) mob.stop();
        });

        const jumpscareRect = this.add.image(960, 540, 'jumpscare')
            .setDisplaySize(1920, 1080).setDepth(100).setAlpha(0);
        const flashOverlay = this.add.rectangle(960, 540, 1920, 1080, 0xff0000, 0.4)
            .setDepth(101).setAlpha(0);

        if (!this.anims.exists('mob-walk')) {
            this.anims.create({ key: 'mob-walk', frames: this.anims.generateFrameNumbers('mob', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
        }
        const alien = this.physics.add.sprite(-30, groundY - 80, 'mob').setScale(4);
        alien.anims.play('mob-walk');
        alien.body.setAllowGravity(false);
        alien.body.enable = false;

        this.time.delayedCall(300, () => {
            jumpscareRect.setAlpha(1);
            flashOverlay.setAlpha(1);
            this.cameras.main.shake(200, 0.02);
            this.time.delayedCall(3000, () => {
                this.tweens.add({
                    targets: [jumpscareRect, flashOverlay],
                    alpha: 0,
                    duration: 400,
                    onComplete: () => {
                        sprite.setVelocityX(200);
                        sprite.anims.play('right', true);
                        alien.body.enable = true;
                        alien.body.velocity.x = 195;
                        playLoopingSound(this, 'mobsound');
                    }
                });
            });
        });
    }
}

class Game_FailScene extends Phaser.Scene {
    constructor() {
        super("Game_FailScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#000000");

        const failText = this.add.text(960, 430, "", {
            fontFamily: "Arial",
            fontSize: "72px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        const fullMessage = "you failed";
        let revealed = 0;

        this.time.addEvent({
            delay: 130,
            repeat: fullMessage.length - 1,
            callback: () => {
                revealed++;
                failText.setText(fullMessage.slice(0, revealed));

                if (revealed === fullMessage.length) {
                    const colorShift = { progress: 0 };

                    this.tweens.add({
                        targets: failText,
                        scale: 1.3,
                        duration: 600,
                        ease: "Sine.easeOut"
                    });

                    this.tweens.add({
                        targets: colorShift,
                        progress: 100,
                        duration: 600,
                        onUpdate: () => {
                            const blended = Phaser.Display.Color.Interpolate.ColorWithColor(
                                Phaser.Display.Color.ValueToColor("#b8c4d4"),
                                Phaser.Display.Color.ValueToColor("#ff2222"),
                                100,
                                colorShift.progress
                            );
                            failText.setColor(Phaser.Display.Color.RGBToString(blended.r, blended.g, blended.b));
                        },
                        onComplete: () => {
                            this.tweens.add({
                                targets: failText,
                                scale: 1.34,
                                duration: 220,
                                hold: 480,
                                yoyo: true,
                                repeat: -1,
                                ease: "Sine.easeInOut"
                            });

                            this.tweens.add({
                                targets: failText,
                                x: failText.x + 3,
                                y: failText.y + 3,
                                duration: 90,
                                yoyo: true,
                                repeat: -1,
                                ease: "Sine.easeInOut"
                            });
                        }
                    });
                }
            }
        });

        const button = this.add.rectangle(960, 600, 300, 80, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(960, 600, "Continue", {
            fontFamily: "Arial",
            fontSize: "36px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        button.on("pointerdown", () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start("Game_PowerBox"));
        });
    }
}

class Game_CreditsScene extends Phaser.Scene {
    constructor() {
        super("Game_CreditsScene");
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
