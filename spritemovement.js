function Spritemovement() { 

    // loading in sprite 
    const sprite = this.sprite = this.physics.add.sprite(960, 165, 'sprite').setScale(4);
    // animation for sprite 
    if (!this.anims.exists('left'))
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

 
    if (!this.anims.exists('right'))
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('sprite', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

    // mouse physics 
    this.input.on('pointerup', (pointer) => {
        sprite.body.reset(sprite.x, sprite.y);
        sprite.anims.stop();
    });
    this.input.on('pointerdown', (pointer) => {
        this.physics.moveToObject(sprite, pointer, 200);

        if (pointer.x == sprite.x && pointer.y < sprite.y) {
            sprite.anims.play('front', true);
        } else if (pointer.x == sprite.x && pointer.y > sprite.y) {
            sprite.anims.play('back', true);  
        } else {
            const slope = Math.abs((pointer.y - sprite.y) / (pointer.x - sprite.x))
            if (pointer.x < sprite.x && slope <= 1) {
                sprite.anims.play('left', true);
            } else if (pointer.x > sprite.x && slope <= 1) {
                sprite.anims.play('right', true);
            }
            if (pointer.y < sprite.y && slope > 1) {
                sprite.anims.play('back', true);
            } else if (pointer.y > sprite.y && slope > 1) {
                sprite.anims.play('front', true);
            }
        }
    });
}