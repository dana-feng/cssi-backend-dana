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
            //messageContent({'stillRunning': true});
            studyNow();
            
            
            
        }
        else if (request.clickedSButton === false){
            console.log("cleared background data!");
            dontRun = true;
            // clearInterval(countdown);
            // clearInterval(countdown2);
            messagePopUp({'stillRunning': false});
           // messageContent({'stillRunning': false});
            
            // function messagePopUp(message){
            //     console.log("from background: sent countdown to popup");
            //     chrome.runtime.sendMessage(message, function(response) {
    
            //           console.log(response);
            //     });
            //     }
        }
        
    });
 
                //everything is in milliseconds
                //start timer used https://www.w3schools.com/howto/howto_js_countdown.asp
            
                function studyNow(){
                    //clearInterval(interval);
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
                            //clearInterval();
                            breakNow(); 
                            
                            return;
                        }
                        let hours = Math.floor(((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        
                        //console.log(hours + "h" + minutes + 'm' + seconds + "s");
                        messagePopUp({'stillRunning': true,'hours': hours, 'minutes': minutes, 'seconds': seconds, "startNow": true, "showStudyTime": true, "showBreak": false});
                        //messageContent({'stillRunning': true});
                        //messageContent({'minutes': minutes, 'seconds': seconds, 'startSnow': false})
                        // function messagePopUp(message){
                        //     console.log("from background: sent countdown to popup");
                        //     chrome.runtime.sendMessage(message, function(response) {
                
                        //         console.log(response);
                                
                        
                        //         });
                        
                        //     }
                            // function messageContent(message2){
                            //     console.log("from background sent to content");
                            //     chrome.runtime.sendMessage(message2);
                            // }

                    
                    }, 1000);
            }
           
            function breakNow(){
                //clearInterval(countdown2);
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
                    
                    //console.log(hours + "h" + minutes + 'm' + seconds + "s");
                    messagePopUp({'stillRunning': true, 'hours': hours, 'minutes': minutes, 'seconds': seconds, "startNow": true, "showBreak": true, "showStudyTime": false });
                   // messageContent({'stillRunning': true});
                    //messageContent({'minutes': minutes, 'seconds': seconds, 'startSnow': true})
                    // function messagePopUp(message){
                    //     console.log("from background: sent countdown to popup");
                    //     chrome.runtime.sendMessage(message, function(response) {
            
                    //           console.log(response);
                    //     });
                    //     }
                    // function messageContent(message2){
                    //     console.log("from background sent to content");
                    //     chrome.runtime.sendMessage(message2);
                    // }
                }, 1000);

        
       
    }
    
  

    function messagePopUp(message){
        console.log("from background: sent a message to popup");
        chrome.runtime.sendMessage(message, function(response) {

            console.log(response);
            
    
            });
    
        }

              

function snowAnimation() {
   //timedSnowAnimation = setTimeout(stopAnimation, breakLength*1000*60);
   
    messageContent({ "animation": true, "runTime": breakLength});
   
   //breakTime = true
    console.log("sent");
}
function stopAnimation() {
    
    messageContent({ "animation": false});
    
   // startSnowAnimation = setTimeout(snowAnimation, timerLength * 1000 * 60)
    //breakTime = false
    console.log("stopped");

}
 


//{animation:true/false}
//true to start it, false to stop it
function messageContent(message) {
    let params = {
        active: true
        //currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
        console.log("got tabs");
        console.log(tabs);
        // send a message to the content script


        for (let i = 0; i < tabs.length; i++) {
            console.log("from background: sent message to content");
            chrome.tabs.sendMessage(tabs[i].id, message);

        }
    }

}
            