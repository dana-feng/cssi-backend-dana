let slider1,
  slider2,
  studyTime,
  breakTime,
  button,
  settings,
  timerValue,
  timeInSeconds,
  studyTimeSec,
  breakTimeSec,
  studyTimerMode,
  hours,
  minutes,
  seconds,
  bMinutes,
  bSeconds,
  exit, start, showStudy, showBreak, currentHours, currentMinutes, currentSeconds;
  let stillRunning;
  
  //creates slider
  function createSlider1() {
    fill(0);
    slider1 = createSlider(0, 90, 100);
    slider1.position(width * 0.45, 150);
    slider1.style("width", "80px");
    slider1.size(width / 2);
  };
  //creates slider
  function createSlider2() {
    fill(0);
    slider2 = createSlider(0, 10, 100);
    slider2.position(width * 0.45, 250);
    slider2.style("width", "80px");
    slider2.size(width / 2);
  };
 //click start studying button, starts with studying
  function mouseClicked() {
   
    if (
      mouseX > 200 &&
      mouseX < 300 &&
      mouseY > 350 &&
      mouseY < 390 &&
      settings == false
    ) {
      settings = true;
      studyTimerMode = true;
      console.log("variables to store sent to background");
      messageBackground({"timerLength": studyTime, "breakLength": breakTime, "reset":true,"timerOn": true, "clickedSButton": true })
    }
    //Click exit button FIX THIS
    else if (
      mouseX > 200 &&
      mouseX < 300 &&
      mouseY > 350 &&
      mouseY < 390 &&
      settings == true
    ) {
      settings = false;
      studyTimerMode = false;
      messageBackground({"timerLength": studyTime, "breakLength": breakTime, "reset":false,"timerOn":false, "clickedSButton": false})
    }
  };

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log("seconds received");
      currentHours = request.hours;
      currentMinutes = request.minutes;
      currentSeconds = request.seconds;
      start = request.startNow;
      showBreak = request.showBreak;
      showStudy = request.showStudyTime;
      stillRunning = request.stillRunning;
    }
  
  );
  



//called once
function setup(){
    //start = false;
    createCanvas(500, 500);
    colorMode(HSB, 360, 100, 100);
    settings = false;
    
    studyTimerMode = false;
    createSlider1();
    createSlider2();
}


function draw() {
    background(210, 95, 100);
    //textStyle(BOLD)
    fill (255);
    textAlign(CENTER);
    textFont('Helvetica');
    text("Time to Chill", 0, 20, width)
    console.log("look!" + stillRunning);
    if(stillRunning == true){
      settings = true;
    }
    if (stillRunning == false){
      settings = false;
    }
    //Creates landing page for popup and start button with sliders
    if (settings == false ) {
      textAlign(LEFT);
      text(
        "Set your desired screen time and how long you want a break!",
        20,
        80
      );
      studyTime = slider1.value();
      textSize(14);
      text(`Screen time for ${studyTime} minutes`, 20, 150);
  
      breakTime = slider2.value();
      textSize(14);
      text(`Take a break for ${breakTime} minutes`, 20, 250);
  
      studyTimeSec = studyTime * 60; //in seconds
      breakTimeSec = breakTime * 60; //in seconds
      makeButton();
      //messageBackground({"getData":true, "timerLength": studyTime, "breakLength": breakTime});
    }
    
    if (settings == false) {
      slider1.show();
      slider2.show();
    }
    
    if (settings == true) {
      slider1.hide();
      slider2.hide();
      exitButton();
     
      
    }
    if(settings == true && showStudy== true){
      textSize(20);
      textAlign(CENTER);
      fill(255);
      //text("Rest your eyes, stand up, and move around until the snow fills the screen.",0, 30, width );
      text(`Screen/Study Time Left: ${currentHours} hours, ${currentMinutes} min, ${currentSeconds} sec`, 0, height/4, width);
    }
    if(settings == true && showBreak== true){
      textSize(20);
      fill(255);
      textAlign(CENTER);
      textSize(15);
      text("Rest your eyes, stand up, and move around until the snow reaches the top of your screen.",0, 90, width );
      text("Make sure to click off the popup and click anywhere on the tab window you are currently on to hear some cheerful break music!", 0, height-70, width);
      textSize(20);
      text(`Break Time Left: ${currentHours} hours, ${currentMinutes} min, ${currentSeconds} sec`, 0, (height/2) - 30, width);
    }
  
  
 
  
  function makeButton() {
    textSize(15);
    noStroke();
    //textAlign(CENTER);
    button = rect(200, 350, 100, 40);
    fill(210, 200, 200);
    text("START!", 225, 374);
  }
  
  function exitButton() {
    textSize(15);
    noStroke();
    textAlign(LEFT);
    exit = rect(200, 350, 100, 40);
    fill(210, 200, 200);
    text("EXIT!", 225, 374);
  }
  
  
  
  
  
  
  

}

function messageBackground(message){
  console.log("from popup: sent the variables");
  chrome.runtime.sendMessage(message, function(response) {
        
        console.log(response);

      });
}


