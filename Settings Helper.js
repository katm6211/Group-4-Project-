const Menu_Button_Text = {
    fontFamily: "Arial",
    fontSize: "26px",
    color: "#f5f1e8"
};

const Settings_Title = {
    fontFamily: "Arial",
    fontSize: "48px",
    color: "#f5f1e8"
};

const Settings_Label = {
    fontFamily: "Arial",
    fontSize: "23px",
    color: "#f5f1e8"
};

const Settings_Value = {
    fontFamily: "Arial",
    fontSize: "23px",
    color: "#b8c4d4"
};

class MenuButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, label, callback, width = 230, height = 64) {
        const button = scene.add.rectangle(0, 0, width, height, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        const buttonText = scene.add.text(0, 0, label, Menu_Button_Text).setOrigin(0.5);

        super(scene, x, y, [button, buttonText]);

        button.on("pointerover", () => button.setFillStyle(0x334155));
        button.on("pointerout", () => button.setFillStyle(0x242a35));
        button.on("pointerdown", callback);

        scene.add.existing(this);
    }
}

class SettingsButton extends MenuButton {
    constructor(scene) {
        super(scene, 1775, 72, "Settings", () => {
            openSettingsOverlay(scene);
        }, 210, 64);
    }
}

// helper to call instead of launching scene
// it gets the scene key of previous scene to pause and launches the overlay on top
function openSettingsOverlay(scene) {
    const previousScene = scene.scene.key;

    scene.scene.launch("SettingsOverlay", {
        previousScene: previousScene
    });
    scene.scene.bringToTop("SettingsOverlay");
    scene.scene.pause(previousScene);
}


// function to automatically add settings button to a scene
function addSettingsButton(scene) {
    new SettingsButton(scene);
}

// Currently does not actually change sound settings.
class SettingsOverlay extends Phaser.Scene {
    constructor() {
        super("SettingsOverlay");
    }

    init(data = {}) {
        this.previousScene = data.previousScene;
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0,0,0,0.5)");

        this.settingsValues = this.registry.get("settingsValues") || {
            soundVolume: 0.7,
            musicVolume: 0.7
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

            this.scene.start("Launcher");
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
