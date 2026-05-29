function Spritemovement(scene) { 

    // loading in sprite 
    const sprite = scene.sprite = scene.physics.add.sprite(bg.x, bg.y, 'sprite').setScale(4);
    // animation for sprite 
    if (!scene.anims.exists('left'))
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('sprite', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

 
    if (!scene.anims.exists('right'))
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('sprite', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

    // mouse physics 
    scene.input.on('pointerup', (pointer) => {
        sprite.body.reset(sprite.x, sprite.y);
        sprite.anims.stop();
    });
    scene.input.on('pointerdown', (pointer) => {
        scene.physics.moveToObject(sprite, pointer, 200);

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