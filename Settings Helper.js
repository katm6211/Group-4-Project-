const Menu_Button_Text = {
    fontFamily: "Arial",
    fontSize: "39px",
    color: "#f5f1e8"
};

const Settings_Title = {
    fontFamily: "Arial",
    fontSize: "72px",
    color: "#f5f1e8"
};

const Settings_Label = {
    fontFamily: "Arial",
    fontSize: "35px",
    color: "#f5f1e8"
};

const Settings_Value = {
    fontFamily: "Arial",
    fontSize: "35px",
    color: "#b8c4d4"
};

// Reusable text-and-rectangle menu button used by settings and overlay actions.
class MenuButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, label, callback, width = 345, height = 96) {
        const button = scene.add.rectangle(0, 0, width, height, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        const buttonText = scene.add.text(0, 0, label, Menu_Button_Text).setOrigin(0.5);

        super(scene, x, y, [button, buttonText]);

        button.on("pointerover", () => button.setFillStyle(0x334155));
        button.on("pointerout", () => button.setFillStyle(0x242a35));
        button.on("pointerdown", (pointer, localX, localY, event) => {
            if (event) {
                event.stopPropagation();
            }

            callback();
        });

        scene.add.existing(this);
    }
}

// Fixed-position Settings button that opens the settings overlay for the current scene.
class SettingsButton extends MenuButton {
    constructor(scene, options = {}) {
        super(scene, 1710, 96, "Settings", () => {
            openSettingsOverlay(scene, options);
        }, 315, 96);
    }
}

// Launches SettingsOverlay above the current scene, then pauses that scene underneath it.
function openSettingsOverlay(scene, options = {}) {
    const previousScene = scene.scene.key;

    scene.scene.launch("SettingsOverlay", {
        previousScene: previousScene,
        mainMenuScene: options.mainMenuScene || "Launcher",
        onOpen: options.onOpen
    });
    scene.scene.bringToTop("SettingsOverlay");
    scene.scene.pause(previousScene);
}


// Adds the standard Settings button to a scene and applies an optional draw depth.
function addSettingsButton(scene, options = {}) {
    const settingsButton = new SettingsButton(scene, options);

    if (options.depth !== undefined) {
        settingsButton.setDepth(options.depth);
    }

    return settingsButton;
}

// Builds the shared settings options for game scenes and the game main menu.
function getGameSettingsOptions(options = {}) {
    return {
        mainMenuScene: "Game_CinematicMainMenu",
        onOpen: options.playBgmOnOpen === false ? undefined : playGameBgm,
        depth: options.depth ?? 1100
    };
}

// Opens the game version of the settings overlay, returning Main Menu to the game menu scene.
function openGameSettingsOverlay(scene, options = {}) {
    openSettingsOverlay(scene, getGameSettingsOptions(options));
}

// Adds the game version of the Settings button, with game-menu routing and default high depth.
function addGameSettingsButton(scene, options = {}) {
    return addSettingsButton(scene, getGameSettingsOptions(options));
}

// Applies a new volume to all active audio categorized as music.
function setMusicVolume(scene, volume) {
    setAudioCategoryVolume(scene, "music", volume);
}

// Returns the saved music volume, falling back to Phaser's global sound volume.
function getMusicVolume(scene) {
    const settingsValues = getGameSettingsValues(scene);
    return Phaser.Math.Clamp(settingsValues.musicVolume ?? scene.sound.volume ?? 1, 0, 1);
}

// Returns the saved sound-effect volume, falling back to Phaser's global sound volume.
function getSoundVolume(scene) {
    const settingsValues = getGameSettingsValues(scene);
    return Phaser.Math.Clamp(settingsValues?.soundVolume ?? scene.sound.volume ?? 1, 0, 1);
}

// Picks the correct current volume value for a specific audio key.
function getAudioVolume(scene, key) {
    return getGameAudioCategory(key) === "music"
        ? getMusicVolume(scene)
        : getSoundVolume(scene);
}

// Sets volume on a Phaser sound instance across sound-manager implementations.
function setSoundInstanceVolume(sound, volume) {
    if (!sound) return;

    if (typeof sound.setVolume === "function") {
        sound.setVolume(volume);
    } else {
        sound.volume = volume;
    }
}

// Plays a one-shot sound using the volume for its audio category.
function playSoundEffect(scene, key, config = {}) {
    scene.sound.play(key, {
        ...config,
        volume: getAudioVolume(scene, key)
    });
}

// Gets or creates a looping sound, applies category volume, and starts it if needed.
function playLoopingSound(scene, key, config = {}) {
    const sound = scene.sound.get(key) || scene.sound.add(key, {
        ...config,
        loop: true
    });

    setSoundInstanceVolume(sound, getAudioVolume(scene, key));

    if (!sound.isPlaying) {
        sound.play();
    }

    return sound;
}

// Updates every currently active sound instance in the requested category.
function setAudioCategoryVolume(scene, category, volume) {
    const clampedVolume = Phaser.Math.Clamp(volume, 0, 1);

    getGameAudioKeys(category).forEach((key) => {
        const sounds = typeof scene.sound.getAll === "function"
            ? scene.sound.getAll(key)
            : [scene.sound.get(key)].filter(Boolean);

        sounds.forEach((sound) => {
            setSoundInstanceVolume(sound, clampedVolume);
        });
    });
}

// Applies a new volume to all active audio categorized as sound effects.
function setSoundVolume(scene, volume) {
    setAudioCategoryVolume(scene, "sound", volume);
}

// Pause-menu style overlay scene that owns the settings UI and slider interactions.
class SettingsOverlay extends Phaser.Scene {
    constructor() {
        super("SettingsOverlay");
    }

    init(data = {}) {
        this.previousScene = data.previousScene;
        this.mainMenuScene = data.mainMenuScene || "Launcher";
        this.onOpen = data.onOpen;
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");

        if (typeof this.onOpen === "function") {
            this.onOpen(this);
        }

        this.settingsValues = getGameSettingsValues(this);

        this.add.rectangle(960, 540, 1050, 840, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91);

        this.add.text(960, 180, "Settings", Settings_Title).setOrigin(0.5);

        this.createVolumeSlider(960, 375, "Sound Volume", "soundVolume");
        this.createVolumeSlider(960, 525, "Music Volume", "musicVolume");

        new MenuButton(this, 750, 780, "Close", () => {
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }

            this.scene.stop();
        }, 360, 105);

        new MenuButton(this, 1170, 780, "Main Menu", () => {
            if (this.previousScene) {
                this.scene.stop(this.previousScene);
            }

            this.scene.start(this.mainMenuScene);
        }, 360, 105);
    }

    // Creates one draggable volume slider and syncs changes to the settings registry.
    createVolumeSlider(x, y, label, settingsKey) {
        const sliderWidth = 540;
        const trackX = x - sliderWidth / 2;
        const valueText = this.add.text(x + 398, y, "", Settings_Value).setOrigin(0.5);

        this.add.text(x - 398, y, label, Settings_Label).setOrigin(0.5);

        const track = this.add.rectangle(x, y, sliderWidth, 15, 0x111318)
            .setStrokeStyle(2, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        const fill = this.add.rectangle(trackX, y, sliderWidth, 15, 0x7dd3fc)
            .setOrigin(0, 0.5);
        const knob = this.add.circle(trackX, y, 24, 0xf5f1e8)
            .setStrokeStyle(5, 0x6f7c91)
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
            } else if (settingsKey === "soundVolume") {
                setSoundVolume(this, clampedValue);
            }
        };

        const setValueFromPointer = (pointer) => {
            setValue((pointer.x - trackX) / sliderWidth);
        };

        const initialValue = settingsKey === "musicVolume"
            ? getMusicVolume(this)
            : getSoundVolume(this);
        setValue(initialValue);

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
