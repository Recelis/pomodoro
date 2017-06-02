/*
data{
    calculates amount of time left to the second
}

handler{
    controls input to data
}

view{
    changes output  
    output when done
}

*/

// global value
var timer;

var data = {
    sessionLeft:1800,
    breakLeft:300,
    sessionLength: 1800,
    breakLength:300,
    status:'session',
    timeElapsed: ()=>{
        if (data.status == 'session') {
            data.sessionLeft--;
            if (data.sessionLeft == 0){
                data.breakLeft = data.breakLength;
                data.status = 'break';
            }
            var timeLeft = data.convertToMinutes(data.sessionLeft);
            console.log(timeLeft);
        }
        else {
            data.breakLeft--;
            if (data.breakLeft == 0){
                data.sessionLeft = data.sessionLength;
                data.status = 'session';
            }
            var timeLeft = data.convertToMinutes(data.breakLeft);
            console.log(timeLeft);
        } 
        view.updateClock(data.status, timeLeft);
    },
    convertToMinutes:(seconds)=>{
        var minutes = Math.floor(seconds/60);
        var remainder = seconds%60;
        if (remainder < 10) return (minutes + ':0'+remainder).toString();
        return (minutes + ':'+remainder).toString();
    }
}

var handler = {
    running:false,
    time: ()=>{
        if (handler.running == false){
            handler.running = true;
            console.log("running");
            timer = setInterval(()=>data.timeElapsed(),1000);
            
        }
        else{
            handler.running = false;
            clearInterval(timer);
            data.timeElapsed(pause);
        }
    },
    restart:()=>{
        handler.running = false;
        clearInterval(timer);
        data.breakLeft = data.breakLength;
        data.sessionLeft = data.sessionLength;
        data.status = 'session';
        view.updateClock(data.status, "Start!");
    },
    changeBreakLength:(object)=>{
        if (handler.running != true){
            console.log(object.id);
            if (object.id == 'decreaseBreak') {
                data.breakLength-=60;
                if (data.breakLength < 0) data.breakLength == 0;
            }
            if (object.id == 'increaseBreak') data.breakLength+=60;
            console.log(data.breakLength);
            handler.restart();
            view.updateLengths();
        }
    },
    changeSessionLength:(object)=>{
        if (handler.running != true){
            console.log(object.id);
            if (object.id == 'decreaseSession') {
                data.sessionLength-=60;
                if (data.sessionLength < 0) data.sessionLength = 0;
            }
            if (object.id == 'increaseSession') data.sessionLength+=60;
            console.log(data.sessionLength);
            handler.restart();
            view.updateLengths();
        }
    }

}

var view = {
    updateClock:(status, timeLeft)=>{
        var timeLeftHandler = document.getElementById('timeLeft');
        timeLeftHandler.innerHTML = timeLeft; 
        var statusHandler = document.getElementById('status');
        console.log(status);
        switch(status){
            case 'session':
                statusHandler.innerHTML = 'Session';
                break;
            case 'break':
                statusHandler.innerHTML = 'Break';
                break;
            case 'pause':
                statusHandler.innerHTML = 'Paused';
                break;
        }
    },
    updateLengths:()=>{
        document.getElementById("breakTime").innerHTML = data.convertToMinutes(data.breakLength);
        document.getElementById("sessionTime").innerHTML = data.convertToMinutes(data.sessionLength);        
    }
}

