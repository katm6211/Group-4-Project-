window.playerInventory = window.playerInventory || [];
window.playInventoryButtonEffect = window.playInventoryButtonEffect || null;

class Inventory extends Phaser.Scene {
    constructor() {
        super("Inventory");
    }

    create() {

        const panel = this.add.graphics();
        panel.fillStyle(0x17212b, 0.96);
        panel.fillRoundedRect(420, 120, 1080, 840, 18);
        panel.lineStyle(6, 0x7dd3fc, 1);
        panel.strokeRoundedRect(420, 120, 1080, 840, 18);
        panel.setInteractive(
            new Phaser.Geom.Rectangle(420, 120, 1080, 840),
            Phaser.Geom.Rectangle.Contains
        );

        this.add.text(960, 210, "Inventory", {
            fontFamily: "Arial",
            fontSize: "69px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        if (!window.playerInventory.length) {
            this.add.text(960, 540, "No items yet.", {
                fontFamily: "Arial", fontSize: "45px", color: "#b8c4d4"
            }).setOrigin(0.5);
        } else {
            window.playerInventory.forEach((item, i) => {
                const y = 360 + i * 90;
                const btn = this.add.text(960, y, item, {
                    fontFamily: "Arial", fontSize: "42px", color: "#b8c4d4"
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                btn.on("pointerover", () => btn.setColor("#ffffff"));
                btn.on("pointerout", () => btn.setColor("#b8c4d4"));
                btn.on("pointerdown", () => {
                    const action = window.inventoryItemActions?.[item];
                    if (action) {
                        this.scene.stop("Inventory");
                        setTimeout(action, 50);
                    }
                });
            });
        }

        const closeWidth = 330;
        const closeHeight = 93;
        const closeButton = this.add.graphics();
        const drawCloseButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
            closeButton.clear();
            closeButton.fillStyle(fill, 0.94);
            closeButton.fillRoundedRect(-closeWidth / 2, -closeHeight / 2, closeWidth, closeHeight, 16);
            closeButton.lineStyle(5, stroke, 1);
            closeButton.strokeRoundedRect(-closeWidth / 2, -closeHeight / 2, closeWidth, closeHeight, 16);
        };
        const closeLabel = this.add.text(0, 0, "Close", {
            fontFamily: "Arial",
            fontSize: "42px",
            color: "#f5f1e8"
        }).setOrigin(0.5);
        const closeContainer = this.add.container(960, 870, [closeButton, closeLabel]);
        drawCloseButton();
        closeButton.setInteractive(
            new Phaser.Geom.Rectangle(-closeWidth / 2, -closeHeight / 2, closeWidth, closeHeight),
            Phaser.Geom.Rectangle.Contains
        );
        closeButton.input.cursor = "pointer";

        closeButton.on("pointerover", () => {
            drawCloseButton(0x24384a, 0xb7f3ff);
            closeLabel.setColor("#ffffff");
        });
        closeButton.on("pointerout", () => {
            closeContainer.setScale(1);
            drawCloseButton();
            closeLabel.setColor("#f5f1e8");
        });
        closeButton.on("pointerdown", () => {
            closeContainer.setScale(0.92);
            drawCloseButton(0x0f1821, 0xb7f3ff);
            this.time.delayedCall(90, () => {
                closeContainer.setScale(1);
                this.scene.stop("Inventory");
            });
        });
        closeButton.on("pointerup", () => closeContainer.setScale(1));

        this.input.keyboard.on("keydown-ESC", () => this.scene.stop("Inventory"));
    }
}

function addInventoryButton(scene) {
    const buttonDepth = 1100;
    const inventoryWidth = 255;
    const inventoryHeight = 87;
    const inventoryButton = scene.add.graphics();
    const drawInventoryButton = (fill = 0x17212b, stroke = 0x7dd3fc) => {
        inventoryButton.clear();
        inventoryButton.fillStyle(fill, 0.94);
        inventoryButton.fillRoundedRect(-inventoryWidth / 2, -inventoryHeight / 2, inventoryWidth, inventoryHeight, 16);
        inventoryButton.lineStyle(5, stroke, 1);
        inventoryButton.strokeRoundedRect(-inventoryWidth / 2, -inventoryHeight / 2, inventoryWidth, inventoryHeight, 16);
    };
    const inventoryLabel = scene.add.text(0, 0, "Inventory", {
        fontFamily: "Arial",
        fontSize: "36px",
        color: "#f5f1e8"
    }).setOrigin(0.5);
    const inventoryContainer = scene.add.container(153, 996, [inventoryButton, inventoryLabel])
        .setDepth(buttonDepth);
    drawInventoryButton();
    inventoryButton.setInteractive(
        new Phaser.Geom.Rectangle(-inventoryWidth / 2, -inventoryHeight / 2, inventoryWidth, inventoryHeight),
        Phaser.Geom.Rectangle.Contains
    );
    inventoryButton.input.cursor = "pointer";

    inventoryButton.on("pointerover", () => {
        drawInventoryButton(0x24384a, 0xb7f3ff);
        inventoryLabel.setColor("#ffffff");
    });

    inventoryButton.on("pointerout", () => {
        inventoryContainer.setScale(1);
        drawInventoryButton();
        inventoryLabel.setColor("#f5f1e8");
    });

    inventoryButton.on("pointerdown", () => {
        inventoryContainer.setScale(0.92);
        drawInventoryButton(0x0f1821, 0xb7f3ff);
        scene.time.delayedCall(90, () => {
            inventoryContainer.setScale(1);
            scene.scene.launch("Inventory");
            scene.scene.bringToTop("Inventory");
        });
    });
    inventoryButton.on("pointerup", () => inventoryContainer.setScale(1));

    const playInventoryButtonEffect = () => {
        if (!inventoryContainer.active || !scene.tweens) return;

        scene.tweens.killTweensOf(inventoryContainer);
        inventoryContainer.setScale(1);
        scene.tweens.add({
            targets: inventoryContainer,
            scale: 1.14,
            duration: 120,
            yoyo: true,
            repeat: 1,
            ease: "Sine.easeInOut"
        });
    };

    window.InButtonEffect = playInventoryButtonEffect;
    scene.events.once("shutdown", () => {
        if (window.playInventoryButtonEffect === playInventoryButtonEffect) {
            window.playInventoryButtonEffect = null;
        }
    });
}

// adds item to inventory if player does not have it already
function addInventoryItem(item) {
    if (!window.playerInventory.includes(item)) {
        window.playerInventory.push(item);
        if (typeof window.playInventoryButtonEffect === "function") {
            window.playInventoryButtonEffect();
        }
    }
}

// removes item from inventory only if player has it
function removeInventoryItem(item) {
    window.playerInventory = window.playerInventory.filter((inventoryItem) => inventoryItem !== item);
}
