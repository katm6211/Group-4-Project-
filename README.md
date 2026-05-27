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