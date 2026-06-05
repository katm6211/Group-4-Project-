window.playerInventory = window.playerInventory || [];

class Inventory extends Phaser.Scene {
    constructor() {
        super("Inventory");
    }

    create() {

        const panel = this.add.rectangle(960, 540, 720, 560, 0x18151c)
            .setStrokeStyle(4, 0x6f7c91)
            .setInteractive();

        this.add.text(960, 320, "Inventory", {
            fontFamily: "Arial",
            fontSize: "46px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        if (!window.playerInventory.length) {
            this.add.text(960, 540, "No items yet.", {
                fontFamily: "Arial", fontSize: "30px", color: "#b8c4d4"
            }).setOrigin(0.5);
        } else {
            window.playerInventory.forEach((item, i) => {
                const y = 420 + i * 60;
                const btn = this.add.text(960, y, item, {
                    fontFamily: "Arial", fontSize: "28px", color: "#b8c4d4"
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

        const closeButton = this.add.rectangle(960, 760, 220, 62, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });

        this.add.text(960, 760, "Close", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#f5f1e8"
        }).setOrigin(0.5);

        closeButton.on("pointerdown", () => this.scene.stop("Inventory"));

        this.input.keyboard.on("keydown-ESC", () => this.scene.stop("Inventory"));
    }
}

function addInventoryButton(scene) {
    const buttonDepth = 1100;
    const inventoryButton = scene.add.rectangle(110, 1010, 170, 58, 0x242a35)
        .setStrokeStyle(3, 0x6f7c91)
        .setInteractive({ useHandCursor: true })
        .setDepth(buttonDepth);

    const inventoryLabel = scene.add.text(110, 1010, "Inventory", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#f5f1e8"
    }).setOrigin(0.5).setDepth(buttonDepth + 1);

    inventoryButton.on("pointerover", () => {
        inventoryButton.setFillStyle(0x334155);
        inventoryLabel.setColor("#ffffff");
    });

    inventoryButton.on("pointerout", () => {
        inventoryButton.setFillStyle(0x242a35);
        inventoryLabel.setColor("#f5f1e8");
    });

    inventoryButton.on("pointerdown", () => {
        scene.scene.launch("Inventory");
        scene.scene.bringToTop("Inventory");
    });
}

// adds item to inventory if player does not have it already
function addInventoryItem(item) {
    if (!window.playerInventory.includes(item)) {
        window.playerInventory.push(item);
    }
}

// removes item from inventory only if player has it
function removeInventoryItem(item) {
    window.playerInventory = window.playerInventory.filter((inventoryItem) => inventoryItem !== item);
}
