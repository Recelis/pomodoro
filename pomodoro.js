/*
data{
    calculates amount of time left
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
    sessionLeft:30,
    breakLeft:5,
    sessionLength: 30,
    breakLength:5,
    timeElapsed: function(){

    },
}

var handler = {
    timerButton:function(){
        alert("timerPressed!");
    },
    restartButton:function(){
        alert("restartPressed!");
    },
    start: function(){

    },
    pause: function(){

    },
    restart:function(){

    }

}

var view = {
    running:function(){

    },
    finished:function(){

    }
}

