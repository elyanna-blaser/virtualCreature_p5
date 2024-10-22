export default function sketch(p5) {
  let monsterProperties = {
    shape: "slime",
    mood: 1,
    posX: 0,
    posY: 0,
  };

  // set project variables
  let amplitude;
  let cHour;
  let pet; // Declare the virtual pet object
  let feedButton, playButton, restButton; // Buttons for interacting with the pet
  let darkG = "#081820";
  let seaG = "#e0f8d0";
  let dayLight = true;

  // Setup function
  p5.setup = function () {
    p5.createCanvas(320, 160);
    pet = new VirtualPet("Fluffy");

    // Feed button
    feedButton = p5.createButton("Feed");
    feedButton.position(20, 350);
    feedButton.mousePressed(() => pet.feed());

    // Play button
    playButton = p5.createButton("Play");
    playButton.position(80, 350);
    playButton.mousePressed(() => pet.play());

    // Rest button
    restButton = p5.createButton("Rest");
    restButton.position(140, 350);
    restButton.mousePressed(() => pet.rest());

    // generateMonster();
    p5.noStroke();
  };

  // Main draw loop
  p5.draw = function () {
    getLightState();
    if (dayLight === true) {
      p5.background(seaG);
    } else {
      p5.background(darkG);
    }

    pet.update();
    pet.display();

    // Display status bars
    displayStatusBar("Hunger", pet.hunger, 20, 50, p5.color(255, 100, 100));
    displayStatusBar("Happiness", pet.happiness, 20, 90, p5.color(100, 255, 100));
    displayStatusBar("Energy", pet.energy, 20, 130, p5.color(100, 100, 255));
  };

  // Virtual Pet Class
  class VirtualPet {
    constructor(name) {
      this.name = name;
      this.hunger = 100; // Hunger level (0-100)
      if (dayLight) {
        this.happiness = 95; // Happiness level (0-100)
      }
      else {
        this.happiness = 70;
      }
      this.energy = 100; // Energy level (0-100)
      this.lastFeedTime = p5.millis();
      this.lastPlayTime = p5.millis();
      this.lastRestTime = p5.millis();
    }

    // Decrease stats over time
    update() {
      // Hunger decreases every 3 seconds
      if (p5.millis() - this.lastFeedTime > 3000) {
        this.hunger = p5.max(this.hunger - 1, 0);
        this.lastFeedTime = p5.millis();
      }

      // Happiness decreases when amplitude rises
      if (amplitude >= 100) {
        this.happiness = p5.max(this.happiness - 1, 0);
        this.lastPlayTime = p5.millis();
      }


      // Energy decreases every 4 seconds unless the pet is resting
      if (p5.millis() - this.lastRestTime > 4000 && this.energy > 0) {
        this.energy = p5.max(this.energy - 1, 0);
        this.lastRestTime = p5.millis();
      }
    }

    // Display the pet on screen
    display() {
      p5.fill(200, 100, 200);
      p5.ellipse(p5.width / 2+100, p5.height / 2, 100, 100); // Simple pet as a circle
      p5.fill(0);
      p5.textAlign(p5.CENTER);
      p5.text(this.name, p5.width / 2+100, p5.height / 2 - 60);
    }

    // Feed the pet (increases hunger level)
    feed() {
      this.hunger = p5.min(this.hunger + 20, 100);
    }

    // Play with the pet (increases happiness level)
    play() {
      if (this.energy > 0) {
        this.happiness = p5.min(this.happiness + 20, 100);
        this.energy = p5.max(this.energy - 10, 0); // Playing reduces energy
      }
    }

    // Let the pet rest (increases energy level)
    rest() {
      this.energy = p5.min(this.energy + 20, 100);
    }
  }

  function displayStatusBar(label, value, x, y, barColor) {
    p5.fill(255);
    p5.textAlign(p5.LEFT);
    p5.fill(0);
    p5.text(label, x, y - 10);
    p5.fill(barColor);
    p5.rect(x, y, p5.map(value, 0, 100, 0, 100), 10);
    p5.fill(0);
    p5.text(value + "%", x + 110, y + 10);
  }

  function getLightState() {
    cHour = p5.hour();
    if (cHour >= 7 && cHour <= 18) {
      dayLight = true;
    }
  }

  // this special function receives data from App.jsx withTracker
  p5.updateWithProps = (props) => {
    if (props.amplitude) {
     amplitude=props.amplitude;
    }
    if (props.amplitude !== undefined) {
      console.log("p5 received new amplitude:", props.amplitude);
      amplitude = props.amplitude;
    }
  };

}
