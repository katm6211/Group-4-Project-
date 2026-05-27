function openSettingsOverlay(scene) {
    const previousScene = scene.scene.key;

    scene.scene.launch("SettingsOverlay", {
        previousScene: previousScene
    });
    scene.scene.bringToTop("SettingsOverlay");
    scene.scene.pause(previousScene);
}

function addSettingsButton(scene) {
    const settingsButton = scene.add.rectangle(130, 72, 210, 64, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true });

    scene.add.text(130, 72, "Settings", {
        fontFamily: "Arial",
        fontSize: "26px",
        color: "#f5f1e8"
    }).setOrigin(0.5);

    settingsButton.on("pointerdown", () => {
        openSettingsOverlay(scene);
    });
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

        this.add.rectangle(960, 540, 700, 500, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91);

        this.add.text(960, 330, "Settings", {
            fontFamily: "Arial",
            fontSize: "48px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        this.createVolumeSlider(960, 460, "Sound Volume", "soundVolume");
        this.createVolumeSlider(960, 560, "Music Volume", "musicVolume");

        const closeButton = this.add.text(960, 680, "Close", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#f5f1e8"
        }).setOrigin(0.5).setInteractive();

        closeButton.on("pointerdown", () => {
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }

            this.scene.stop();
        });
    }

    createVolumeSlider(x, y, label, settingsKey) {
        const sliderWidth = 360;
        const trackX = x - sliderWidth / 2;
        const valueText = this.add.text(x + 265, y, "", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#b8c4d4"
        }).setOrigin(0.5);

        this.add.text(x - 265, y, label, {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

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
