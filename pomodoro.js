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




var data = {
    sessionLeft:1800,
    breakLeft:300,
    sessionLength: 1800,
    breakLength:300,
    session:true,
    timeElapsed: function(){
        if (data.session == true) {
            data.sessionLeft--;
            if (data.sessionLeft == 0){
                data.breakLeft = data.breakLength;
                data.session = false;
            }
            var timeLeft = data.convertToMinutes(data.sessionLeft);
            console.log(timeLeft);
        }
        else {
            data.breakLeft--;
            if (data.breakLeft == 0){
                data.sessionLeft = data.sessionLength;
                data.session = true;
            }
            var timeLeft = data.convertToMinutes(data.breakLeft);
            console.log(timeLeft);
        }
    },
    convertToMinutes:function(seconds){
        var minutes = Math.floor(seconds/60);
        var remainder = seconds%60;
        return (minutes + ':'+remainder).toString();
    }
}

var handler = {
    running:false,
    timerButton:function(){
        alert("timerPressed!");
        handler.time();
    },
    restartButton:function(){
        alert("restartPressed!");
        
    },
    time: function(){
        if (handler.running == false){
            handler.running = true;
            console.log("running");
            var timer = setInterval(()=>data.timeElapsed()
            ,1000);
        }
        else{
            handler.running = false;
            clearInterval(timer);
        }
    },
    restart:function(){
        handler.running = false;
    }

}

var view = {
    updateClock:(status, timeLeft)=>{
        var timeLeftHandler = document.getElementById('timeLeft');
        timeLeftHandler.innerHTML = timeLeft; 
        var statusHandler = document.getElementById('status');
        switch(status){
            case 'session':
                statusHandler.innerHTML = 'Session';
                break;
            case 'break':
                statusHandler.innerHTML = 'Break';
                break;
        }
       
    }
}

