//Background script to keep track of the timer and relay information to the popup and the content scripts
console.log('background running');
let timerLength, dontRun, breakLength, startTime, timerOn = false, startSnowAnimation, timedSnowAnimation, breakTime = false, timeLeft, ticker, tickerFunction
let study = true;
let breaktime = false;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("recieved variables");
        timerLength = request.timerLength * 60 * 1000
        breakLength = request.breakLength * 60 * 1000
        if (request.clickedSButton === true){
            console.log("from background: knows user clicked start");
            dontRun = false;
            messagePopUp({'stillRunning': true});
            studyNow();   
        }
        else if (request.clickedSButton === false){
            console.log("cleared background data!");
            dontRun = true;
            messagePopUp({'stillRunning': false});
        }
    });
//everything is in milliseconds
//start timer used https://www.w3schools.com/howto/howto_js_countdown.asp        
function studyNow(){
    console.log("from background: received variables and now logging them");
    console.log("now logging timerLength");
    console.log(timerLength);
    let startTime= new Date().getTime();
    let countdown = setInterval(function(){
        let now = new Date().getTime();
        console.log("total study time" + timerLength);
        let distance = timerLength + ((startTime - now));
        console.log(Math.floor((distance  / 1000)));
        if (dontRun == true){
            clearInterval(countdown);
            return;
        }
        if (Math.floor((distance /1000) <= 1)){
            clearInterval(countdown);
            study = false;
            breaktime = true;
            console.log("restarted ")
            snowAnimation();
            breakNow(); 
            return;
        }
        let hours = Math.floor(((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        messagePopUp({'stillRunning': true,'hours': hours, 'minutes': minutes, 'seconds': seconds, "startNow": true, "showStudyTime": true, "showBreak": false});
    }, 1000);
}
function breakNow(){
    console.log("from background: received variables and now logging them");
    console.log("now starting break");
    console.log(breakLength);
    let startTime= new Date().getTime();
    let countdown2 = setInterval(function(){
        let now = new Date().getTime();
        let distance = breakLength + ((startTime - now));
        console.log(Math.floor((distance  / 1000)));
        if (dontRun == true){
            clearInterval(countdown2);
            stopAnimation();
            return;
        }
        if (Math.floor((distance  / 1000 <= 1))){
            clearInterval(countdown2);
            study = true;
            breaktime = false;
            console.log("restarted going to study time now ")
            //clearInterval();
            stopAnimation();
            studyNow(); 
            return;
        }
        let hours = Math.floor(((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        messagePopUp({'stillRunning': true, 'hours': hours, 'minutes': minutes, 'seconds': seconds, "startNow": true, "showBreak": true, "showStudyTime": false });
                  
    }, 1000);   
}
function messagePopUp(message){
    console.log("from background: sent a message to popup");
    chrome.runtime.sendMessage(message, function(response) {
        console.log(response);
    });
}
function snowAnimation() {
    messageContent({ "animation": true, "runTime": breakLength});
    console.log("sent");
}
function stopAnimation() {
    messageContent({ "animation": false});
    console.log("stopped");
}
function messageContent(message) {
    let params = {
        active: true
    }
chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
        console.log("got tabs");
        console.log(tabs);
        for (let i = 0; i < tabs.length; i++) {
            console.log("from background: sent message to content");
            chrome.tabs.sendMessage(tabs[i].id, message);
        }
    }
}         