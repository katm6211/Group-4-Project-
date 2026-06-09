# The Outer Limit

Latest [ release ] ( ./../tree/RC2 ).

# Introduction

## Play the Game
[Main Game]( https://katm6211.github.io/Group-4-Project-/) - A touchscreen is recommended. On mobile, open Settings in-game to enter fullscreen. On iOS, tap Share then Add to Home Screen for fullscreen.

## Prototypes
* Cinematic Prototype: https://katm6211.github.io/Group-4-Project-/testing-check-1/cinematics-1.html
* Scene Flow Prototype: https://katm6211.github.io/Group-4-Project-/testing-check-1/scene-flow-1.html
* Core Gameplay Prototype: https://katm6211.github.io/Group-4-Project-/testing-check-1/core-gameplay-1.html

# Theme "nearby in space, but distant in time"
The concept of our game revolves around the player, who is represented by an alien character, being trapped in a UFO in space. So the game follows a sci-fi theme which fits the nearby in space statement. We also integrated time related puzzles in our game. The clock room has a mechanic where the player can't progress unless they "travel back in time" by turning the clock hands counter-clockwise. We also have a timer set in some of the scenes. 

# Selectable Requirements

1. Data-driven experience progression: Puzzle configurations including wire puzzle symbol mappings and room descriptions are defined in data/levels.json and loaded at runtime. You can edit puzzle design details in that file without touching the game code.
2. Procedural graphics: The wire puzzle connection lines and the clock puzzle hands and tick marks are drawn with Phaser's Graphics API in code. No image files are used for these visuals.
3. Complete closed captioning: Every sound in the game is described with on-screen text when it plays, including background music, sound effects, and ambient loops.

# Contributors: 
* Denis Gamolya - Production lead
* Shiyi Sun - Technology lead
* Katarina Malenovic - Testing lead

# Asset Credits
* All third-party assets are credited in ASSETS.md.
* Original art assets was created by Katarina Malenovic using Piskel.
