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

        const items = window.playerInventory.length
            ? window.playerInventory.map((item) => item)
            : "No items yet.";

        this.add.text(660, 400, items, {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#b8c4d4",
            lineSpacing: 18
        });

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
