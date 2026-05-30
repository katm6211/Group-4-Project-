function Spritemovement() {

    // loading in sprite 
    const sprite = this.sprite = this.physics.add.sprite(960, 165, 'sprite').setScale(4);
    // animation for sprite 
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


    sprite.setPosition(0 + sprite.displayWidth / 2, 150).setVelocityX(150);
    const spriteNewWidth = sprite.displayWidth * 0.5;
    const spriteOffsetX = (sprite.width - spriteNewWidth) / 2;
    sprite.setBodySize(spriteNewWidth, sprite.displayHeight);
    sprite.setOffset(spriteOffsetX, 0);
    
    // jumping up 
    this.input.on('pointerdown', (pointer) => { 
        if (pointer.y > this.scale.height - 100) return; 

        if (sprite.body.blocked.down || sprite.body.touching.down) { 
            sprite.setVelocityY(-900); 
        } 
    }); 

   this.physics.world.gravity.y = 600;
    sprite.setCollideWorldBounds(true);
    sprite.body.onWorldBounds = true;
    /*this.input.on('pointerdown', () => {
        if (this.sprite.body.blocked.down || this.sprite.body.touching.down) {
            this.sprite.setVelocityY(-900);
        }
    }); */
    const buttonY = this.scale.height - 60; // Place buttons near the bottom screen edge

    // left button
    const leftBtn = this.add.text(100, buttonY, '◀ LEFT', { fill: '#fff', fontSize: '32px', backgroundColor: '#333', padding: 10 })
        .setInteractive()
        .setScrollFactor(0); 

    leftBtn.on('pointerdown', () => {
        sprite.setVelocityX(-200);
        sprite.anims.play('left', true);
    });

    // right button
    const rightBtn = this.add.text(300, buttonY, 'RIGHT ▶', { fill: '#fff', fontSize: '32px', backgroundColor: '#333', padding: 10 })
        .setInteractive()
        .setScrollFactor(0);

    rightBtn.on('pointerdown', () => {
        sprite.setVelocityX(200);
        sprite.anims.play('right', true);
    });

    // jump button
    const jumpBtn = this.add.text(550, buttonY, '▲ JUMP', { fill: '#fff', fontSize: '32px', backgroundColor: '#a00', padding: 10 }) 
        .setInteractive() 
        .setScrollFactor(0); 

    jumpBtn.on('pointerdown', () => { 
        if (sprite.body.blocked.down || sprite.body.touching.down) { 
            sprite.setVelocityY(-400); 
            this.sound.play('jump'); 
        } 
    }); 

    // stop walking

    this.input.on('pointerup', () => {
        sprite.setVelocityX(0);
        sprite.anims.stop();
    }); 

   /* this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        if (body.gameObject === this.sprite && right) {
            this.physics.pause();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.this.start('message2');
            });
        }
    }); */
}