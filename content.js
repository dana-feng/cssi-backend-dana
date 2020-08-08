// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
console.log("Content Script Running");
let stopNow, playNow, music1;
music1 = new Audio(chrome.runtime.getURL('music.mp3')); 
chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendResponse) {
  if(message.animation==true){
    console.log("start animation");
    stopNow = false;
    rate = message.runTime/ 1000; //rate = 1 min in seconds
    playNow = true;
    var myp5 = new p5(s);
    
  }else if(message.animation == false){
    console.log("stop animation");
    stopNow = true;
    playNow = false;
    myp5 = null;
  } 
}
// implement snowfall
let snow, img, move, ground, groundY, pos, c;
var s = function(sketch) {
  sketch.setup = function() {
    console.log("setting up!");
    document.body.style['userSelect'] = 'none';
    pos = 0;
    c = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    c.position(0, pos);
    c.style('pointer-events', 'none');
    sketch.clear();
    move = 1/(rate/10 + 3); 
    groundY =0;
    img = sketch.loadImage(
      chrome.runtime.getURL('Sketch/snowflake.png')
    );
    ground = sketch.loadImage(
      chrome.runtime.getURL('Sketch/ground.png')
    );
    snow = [];
    for (let j = 0; j < Math.floor(sketch.windowWidth / 10); j++) {
      if (j % 5 == 0) {
        snow.push(new Snowflake(-1));
      } else {
        snow.push(new Snowflake(1));
      }
    }
  };
  sketch.mouseWheel = function(event){
    if ((pos >= 0 && event.delta<0) || (pos < document.body.clientHeight-sketch.windowHeight && event.delta >0)){
      pos += event.delta;
    }
    console.log("changing where animation is!" + pos,document.body.clientHeight-sketch.windowHeight);
  };
  sketch.draw = function() {
    if(stopNow == true){
      sketch.remove();
      music1.pause();
      console.log("removed!");
    }
    if(playNow == true){
      console.log("playing music");
      music1.play();
      music1.loop = true;
    }
    if (playNow == false){
      console.log("stopping music");
      music1.pause();
    }
    console.log("drawing!")
    sketch.clear();
    c.position(0, pos);
    sketch.fill(0);
    sketch.textSize(30);
    sketch.textAlign(sketch.CENTER, sketch.TOP);
    sketch.fill(51, 185, 229);
   
    for (let i = 0; i < snow.length; i++) {
      snow[i].fall();
      snow[i].display();
    }
    groundY = groundY - move;
    sketch.image(ground, 0, groundY, sketch.windowWidth, sketch.windowHeight);
    sketch.fill(255);
    sketch.noStroke();
    sketch.rect(0, groundY + sketch.windowHeight-10, sketch.windowWidth, sketch.windowHeight);
    if (groundY <= -sketch.windowHeight / 1.3) {
      sketch.noLoop();
    }
  };
  class Snowflake {
    //snowflake class that animates and displays snowflakes
    constructor(one) {
      this.x = sketch.random(sketch.windowWidth);
      
      this.y = -10;
      this.width = 100;
      this.height = 50;
      this.fallSpeed = sketch.random(3, 8);
      this.one = one;
    }
  
    fall() {
      this.x += (this.fallSpeed / 2) * this.one;
      this.y += this.fallSpeed;
      if (this.y > sketch.windowHeight) {
        this.y = 0;
        this.x = sketch.random(sketch.windowWidth);
      }
    }
    display() {
      sketch.image(img, this.x, this.y, this.width, this.height);
    }
  };
  
};