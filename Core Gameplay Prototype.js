class CoreGameplayPrototype extends Phaser.Scene {
    constructor() {
        super("CoreGameplayPrototype");
    }

    create() {
        this.cameras.main.setBackgroundColor("#101716");

        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(165, 72, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => this.scene.start("Launcher"));

        const demos = [
            { label: "1. Handle & Lever", scene: "DemoHandleLever" },
            { label: "2. Wire Puzzle", scene: "DemoWirePuzzle" },
            { label: "3. Clock", scene: "DemoClock" },
            { label: "4. Radio", scene: "DemoRadio" },
            { label: "5. Core Mechanic", scene: "Sprite"}
        ];

        this.add.text(960, 200, "Core Gameplay Prototype", {
            fontFamily: "Arial", fontSize: "60px", color: "#f5f1e8"
        }).setOrigin(0.5);

        this.add.text(960, 300, "Select an interaction to demo:", {
            fontFamily: "Arial", fontSize: "32px", color: "#b8c4d4"
        }).setOrigin(0.5);

        demos.forEach((demo, i) => {
            const y = 420 + i * 110;
            const btn = this.add.rectangle(960, y, 500, 80, 0x242a35)
                .setStrokeStyle(3, 0x6f7c91)
                .setInteractive({ useHandCursor: true });
            this.add.text(960, y, demo.label, {
                fontFamily: "Arial", fontSize: "32px", color: "#f5f1e8"
            }).setOrigin(0.5);
            btn.on("pointerover", () => btn.setFillStyle(0x334155));
            btn.on("pointerout", () => btn.setFillStyle(0x242a35));
            btn.on("pointerdown", () => this.scene.start(demo.scene));
        });
    }
}

// ============================================================
// DEMO 5: Core Mechanic
// ============================================================
class Sprite extends Phaser.Scene {
    constructor() { super("Sprite"); } 

    create() {
        this.cameras.main.setBackgroundColor("#101716");
    
        Spritemovement.call(this);
        

    }
} 


// ============================================================
// DEMO 1: Handle & Lever
// ============================================================
class DemoHandleLever extends Phaser.Scene {
    constructor() { super("DemoHandleLever"); }

    create() {

        this.cameras.main.setBackgroundColor("#101716");
        this.handlePickedUp = false;
        this.leverUsed = false;

        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(165, 72, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => this.scene.start("CoreGameplayPrototype"));

        this.add.text(960, 100, "Demo 1: Handle & Lever", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 800, "Find the handle and use it on the lever to open the door.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        // Handle
        const handle = this.add.rectangle(400, 580, 80, 80, 0xc8a200)
            .setStrokeStyle(3, 0xffd700)
            .setInteractive({ useHandCursor: true });
        const handleLabel = this.add.text(400, 650, "Handle\n(click to pick up)", {
            fontFamily: "Arial", fontSize: "20px", color: "#ffd700", align: "center"
        }).setOrigin(0.5);

        handle.on("pointerdown", () => {
            if (this.handlePickedUp) return;
            this.handlePickedUp = true;
            addInventoryItem("handle");
            this.tweens.add({
                targets: [handle, handleLabel], alpha: 0, duration: 400,
                onComplete: () => { handle.destroy(); handleLabel.destroy(); }
            });
            statusText.setText("You picked up the handle!\nNow use it on the lever.");
        });

        // Lever
        const lever = this.add.rectangle(1400, 580, 60, 160, 0x556677)
            .setStrokeStyle(3, 0x8899aa)
            .setInteractive({ useHandCursor: true });
        this.add.text(1400, 680, "Lever\n(click to use)", {
            fontFamily: "Arial", fontSize: "20px", color: "#8899aa", align: "center"
        }).setOrigin(0.5);

        lever.on("pointerdown", () => {
            if (this.leverUsed) return;
            if (!window.playerInventory.includes("handle")) {
                statusText.setText("The lever is missing its handle.\nFind the handle first.");
                return;
            }
            this.leverUsed = true;
            removeInventoryItem("handle");
            this.tweens.add({
                targets: lever, angle: 45, duration: 500, ease: "Power2",
                onComplete: () => {
                    statusText.setText("The door is open! You can proceed.");
                    door.setFillStyle(0x1a3a2a);
                    doorLabel.setText("Door\n(OPEN)");
                }
            });
        });

        // Door
        const door = this.add.rectangle(1750, 540, 100, 220, 0x3a1a1a)
            .setStrokeStyle(3, 0x6f7c91);
        const doorLabel = this.add.text(1750, 650, "Door\n(locked)", {
            fontFamily: "Arial", fontSize: "20px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        // Inventory
        const inventoryButton = this.add.rectangle(110, 1010, 170, 58, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(110, 1010, "Inventory", {
            fontFamily: "Arial", fontSize: "24px", color: "#f5f1e8"
        }).setOrigin(0.5);
        inventoryButton.on("pointerdown", () => {
            this.scene.launch("Inventory");
            this.scene.bringToTop("Inventory");
        });
    }
}

// ============================================================
// DEMO 2: Wire Puzzle
// ============================================================
class DemoWirePuzzle extends Phaser.Scene {
    constructor() { super("DemoWirePuzzle"); }

    create() {
        
        this.cameras.main.setBackgroundColor("#101716");

        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(165, 72, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => this.scene.start("CoreGameplayPrototype"));

        this.add.text(960, 100, "Demo 2: Wire Puzzle", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 900, "Connect all wires to the correct ports.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        // 左边的线头（输出端），右边的接口（输入端）
        // 颜色对应：红→红，绿→绿，蓝→蓝
        const wireColors = [0xff4444, 0x44ff44, 0x4488ff];
        const colorNames = ["red", "green", "blue"];

        // 左边节点
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

        // 右边节点（顺序打乱：绿、蓝、红）
        const rightOrder = [1, 2, 0];
        const rightNodes = rightOrder.map((colorIdx, i) => {
            const y = 380 + i * 160;
            const node = this.add.circle(1420, y, 28, wireColors[colorIdx])
                .setStrokeStyle(3, 0xffffff);
            node.colorIndex = colorIdx;
            return node;
        });

        // 连线图形
        const lines = this.add.graphics();
        this.connected = {}; // { leftIndex: rightIndex }
        this.selectedLeft = null;
        this.selectedLeftGraphic = null;

        const redraw = () => {
            lines.clear();
            Object.entries(this.connected).forEach(([li, ri]) => {
                const lNode = leftNodes[li];
                const rNode = rightNodes[ri];
                const color = wireColors[lNode.colorIndex];
                lines.lineStyle(6, color, 1);
                lines.beginPath();
                lines.moveTo(lNode.x + 28, lNode.y);
                lines.lineTo(rNode.x - 28, rNode.y);
                lines.strokePath();
            });
        };

        // 点左边节点 → 选中
        leftNodes.forEach((node, i) => {
            node.on("pointerdown", () => {
                this.selectedLeft = i;
                leftNodes.forEach(n => n.setStrokeStyle(3, 0xffffff));
                node.setStrokeStyle(4, 0xffff00);
                statusText.setText(`Selected ${colorNames[i]} wire. Now click a port on the right.`);
            });
        });

        // 点右边节点 → 连线
        rightNodes.forEach((node, ri) => {
            node.setInteractive({ useHandCursor: true });
            node.on("pointerdown", () => {
                if (this.selectedLeft === null) {
                    statusText.setText("Select a wire on the left first.");
                    return;
                }
                // 移除已有的连到这个右侧节点的线
                Object.keys(this.connected).forEach(li => {
                    if (this.connected[li] === ri) delete this.connected[li];
                });
                this.connected[this.selectedLeft] = ri;
                this.selectedLeft = null;
                leftNodes.forEach(n => n.setStrokeStyle(3, 0xffffff));
                redraw();
                checkSolved();
            });
        });

        const checkSolved = () => {
            // 正确答案：左i连到右边colorIndex相同的节点
            const correct = leftNodes.every((lNode, li) => {
                const ri = this.connected[li];
                if (ri === undefined) return false;
                return rightNodes[ri].colorIndex === lNode.colorIndex;
            });
            if (correct) {
                statusText.setText("✓ All wires connected correctly! Puzzle solved.");
                statusText.setColor("#44ff44");
            } else {
                statusText.setText("Keep connecting — match the colors.");
                statusText.setColor("#b8c4d4");
            }
        };
    }
}

// ============================================================
// DEMO 3: Clock
// ============================================================
class DemoClock extends Phaser.Scene {
    constructor() { super("DemoClock"); }

    create() {
        this.cameras.main.setBackgroundColor("#101716");

        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(165, 72, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => this.scene.start("CoreGameplayPrototype"));

        this.add.text(960, 100, "Demo 3: Clock", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 880, "Drag the clock hand. Counterclockwise = move forward.\nClockwise = go back.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const cx = 960, cy = 520, radius = 220;

        // 表盘
        this.add.circle(cx, cy, radius, 0x1a1a2e).setStrokeStyle(6, 0x8899aa);

        // 刻度
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

        // 指针
        this.handAngle = -Math.PI / 2; // 12点方向
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
            // 中心圆
            handGraphics.fillStyle(0xffd700);
            handGraphics.fillCircle(cx, cy, 12);
        };
        drawHand();

        // 拖动区域（整个表盘可交互）
        const hitArea = this.add.circle(cx, cy, radius, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        this.input.setDraggable(hitArea);

        let lastAngle = null;
        let totalRotation = 0; // 正数=顺时针，负数=逆时针

        hitArea.on("dragstart", () => { lastAngle = null; totalRotation = 0; });

        this.input.on("drag", (pointer, gameObject) => {
            if (gameObject !== hitArea) return;
            const angle = Math.atan2(pointer.y - cy, pointer.x - cx);
            if (lastAngle !== null) {
                let delta = angle - lastAngle;
                // 处理跨越±π的边界
                if (delta > Math.PI) delta -= Math.PI * 2;
                if (delta < -Math.PI) delta += Math.PI * 2;
                this.handAngle += delta;
                totalRotation += delta;
            }
            lastAngle = angle;
            drawHand();
        });

        hitArea.on("dragend", () => {
            // 超过半圈才算有效操作
            if (totalRotation > Math.PI) {
                statusText.setText("Clockwise → Going back to previous room.");
                statusText.setColor("#ffaa44");
            } else if (totalRotation < -Math.PI) {
                statusText.setText("Counterclockwise → Moving forward in time!");
                statusText.setColor("#44ff44");
            } else {
                statusText.setText("Turn more to make a choice.");
                statusText.setColor("#b8c4d4");
            }
        });
    }
}

// ============================================================
// DEMO 4: Radio
// ============================================================
class DemoRadio extends Phaser.Scene {
    constructor() { super("DemoRadio"); }

    create() {
        this.cameras.main.setBackgroundColor("#101716");

        const backButton = this.add.rectangle(165, 72, 230, 64, 0x242a35)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(165, 72, "Back", {
            fontFamily: "Arial", fontSize: "28px", color: "#f5f1e8"
        }).setOrigin(0.5);
        backButton.on("pointerdown", () => this.scene.start("CoreGameplayPrototype"));

        this.add.text(960, 100, "Demo 4: Radio", {
            fontFamily: "Arial", fontSize: "44px", color: "#f5f1e8"
        }).setOrigin(0.5);

        const statusText = this.add.text(960, 880, "Tune the radio to the correct frequency.", {
            fontFamily: "Arial", fontSize: "26px", color: "#b8c4d4", align: "center"
        }).setOrigin(0.5);

        const correctFreq = 47; // 正确频率，可以改
        this.frequency = 30;    // 初始频率

        // 收音机外壳
        this.add.rectangle(960, 530, 700, 400, 0x222233)
            .setStrokeStyle(5, 0x8899aa);

        // 频率显示
        const freqText = this.add.text(960, 440, `${this.frequency} MHz`, {
            fontFamily: "Arial", fontSize: "56px", color: "#7dd3fc"
        }).setOrigin(0.5);

        // 静态/信号状态显示
        const signalText = this.add.text(960, 530, "~ static ~", {
            fontFamily: "Arial", fontSize: "30px", color: "#556677"
        }).setOrigin(0.5);

        const update = () => {
            freqText.setText(`${this.frequency} MHz`);
            if (this.frequency === correctFreq) {
                signalText.setText("◆ SIGNAL FOUND ◆");
                signalText.setColor("#44ff44");
                statusText.setText(`Frequency locked: ${correctFreq} MHz\nCode: 7-3-9`);
                statusText.setColor("#44ff44");
            } else {
                const diff = Math.abs(this.frequency - correctFreq);
                if (diff <= 3) {
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

        // 左按钮（-1）
        const btnLeft = this.add.rectangle(700, 640, 100, 80, 0x334155)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(700, 640, "◀", {
            fontFamily: "Arial", fontSize: "36px", color: "#f5f1e8"
        }).setOrigin(0.5);
        btnLeft.on("pointerdown", () => {
            this.frequency = Math.max(20, this.frequency - 1);
            update();
        });

        // 右按钮（+1）
        const btnRight = this.add.rectangle(1220, 640, 100, 80, 0x334155)
            .setStrokeStyle(3, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1220, 640, "▶", {
            fontFamily: "Arial", fontSize: "36px", color: "#f5f1e8"
        }).setOrigin(0.5);
        btnRight.on("pointerdown", () => {
            this.frequency = Math.min(80, this.frequency + 1);
            update();
        });

        // 快速调节（-5 / +5）
        const btnLeft5 = this.add.rectangle(580, 640, 80, 60, 0x242a35)
            .setStrokeStyle(2, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(580, 640, "◀◀", {
            fontFamily: "Arial", fontSize: "24px", color: "#b8c4d4"
        }).setOrigin(0.5);
        btnLeft5.on("pointerdown", () => {
            this.frequency = Math.max(20, this.frequency - 5);
            update();
        });

        const btnRight5 = this.add.rectangle(1340, 640, 80, 60, 0x242a35)
            .setStrokeStyle(2, 0x6f7c91)
            .setInteractive({ useHandCursor: true });
        this.add.text(1340, 640, "▶▶", {
            fontFamily: "Arial", fontSize: "24px", color: "#b8c4d4"
        }).setOrigin(0.5);
        btnRight5.on("pointerdown", () => {
            this.frequency = Math.min(80, this.frequency + 5);
            update();
        });

        update();
    }
}