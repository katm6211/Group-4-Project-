# Group-4-Project-
## TEAM MEMBERS
- Denis Gamolya
- Katarina Malenovic
- Shiyi Sun

Cinematic Prototype: 
- Non-interactive cinematic: The beginning of our prototype displays the logo of our game studio. 
- Interactive cinematic: A menu screen screen appears after our non-interactive cinematic plays, with "Start game, Settings, and Credits" buttons. Each button is technically interactable by clicking or tapping, and returns feedback to the player by stating the button's currently a prototype. 
- Choreography in code: We have a tween chain for the buttons of the menu screen, where each button fades in after the previous one.

Scene Flow Prototype: 
- Scene types: Your prototype should demonstrate how at least four kinds of distinct types of scenes are used in your game. Every game needs to have a distinct main title screen and a separate credits screen that is easy to access without finishing the game first. The inclusion of other types of scenes can vary between teams. Kinds:
  - Main title scene: We have a placeholder for the Main title scene in the beginning, once you press start on the menu screen. There are tweens places in for the text to fade in. 
  - Credits scene: We've allocated a Credits button on the menu screen, and a credits scene which appears once all of the gameplay scenes are completed. 
  - Gameplay scene: Our gameplay scene titles: ChaseScene PuzzleScene, ClockScene, YoungerSelfScene, AlienRevealScene, & EndingScene. Each of these titles in captioned with additional text such as: ["Escape from the aliens before time runs out!"], ["Find the clock and interact with it."], ["Turn the clock hands. Which direction?"], ["You have been caught. The alien reveals itself."], ["You and your younger self escaped the UFO!"]. 
  - Menu scene: We have a settings screen in our menu which allows the player to adjust the volume and the music of the game. This button is below the credits and start game button. 

- Communication between scenes: We've built an inventory scene and added a placeholder button in the bottom left corner of the screen to allow the player to temporarily access the inventory throughout all of the scenes. The inventory appears in the first gameplay scene, the "ChaseScene" class. There's a test to make sure the inventory works, and then in every scene there's a button dedicated to access the inventory. 

- Reachability: We encorporated this into our gameplay scenes by displaying two buttons on our interface as placeholders. Each button leads to either a good ending or a bad ending. The scenes that display only one button and go back to the title screen are considered to be part of the bad ending. The good endings allow the player to progress into the next scene and eventually reach the end. Each button is captioned with a description of the different outcomes gameplay-wise.

- Transitions: Each scene contains a transition which fades into black, where the next scene fades out of black. 

Core Gameplay Prototype: 
- Audio: The prototype uses at least two different kinds of audio. Kinds:
Continuously looping background sound (e.g. music or environmental audio) from an audio asset file.
Sound effects or voice clips triggered in response to player input or game events, also from an audio asset file.
Dynamically-generated sounds (as opposed to sounds saved in asset files) created using a library like Tone.jsLinks to an external site..
Layering of several synchronized audio loops that create a space of dynamically recomposable sounds from a small library of audio asset files.
[Something else proposed by your team]

- Visual: We have a sprite sheet in the core mechanic and the each of the puzzles are graphically mapped out/prototyped. The sprite sheet is in spritemovement.js and the graphic visuals for the puzzles are in the core gameplay prototype.js file. 

- Motion: Dynamic motion (physics) is exercised through the sprite. For now, you can control the sprite through buttons on the screen: left, right, and up. There's also modifications of animation frames for the sprite, this is all located in spritemovement.js. 

- Prefabs: We have our design presets expressed as a structured block of data inside our core gameplay prototype.js file that drives repeated UI elements : 
        const demos = [
            { label: "1. Handle & Lever", scene: "DemoHandleLever" },
            { label: "2. Wire Puzzle", scene: "DemoWirePuzzle" },
            { label: "3. Clock", scene: "DemoClock" },
            { label: "4. Radio", scene: "DemoRadio" },
            { label: "5. Core Mechanic", scene: "Sprite"}
        ];
        
Two or more notions of prefab objects must be used in your prototype's software implementation. Kinds:
Creation of GameObject subclasses that are subclassed again by other objects in your game so as to share code between them.
Creation of Scene subclasses to model shared design between different sub-types of scenes.
Design presets expressed in program code (e.g. a block of JSON inside of one of your JavaScript files).
Design presets expressed in data files (e.g. a block of JSON or other data language like XML or TOML saved in a separate non-JavaScript text file).