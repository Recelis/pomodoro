/*
pomodoro.js
by Jacky Lui
data{
    calculates amount of time left to the second
}

handler{
    controls input to data
}

view{
    changes output  
    output when done
    updates setTimer buttons
}

*/

// global value
var timer;
var breakSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var pomoSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");

var data = {
	sessionLeft:1500,
	breakLeft:300,
	sessionLength: 1500,
	breakLength:300,
	status:"session",
	timeElapsed: ()=>{
		if (data.status == "session") {
			data.sessionLeft--;
			if (data.sessionLeft == 0){
				data.breakLeft = data.breakLength;
				breakSound.play();
				data.status = "break";
				// get Date
				let date = new Date();
				let day = date.getDate();
				let month = date.getMonth()+1;
				let year = date.getFullYear();
				firebase.database().ref("counter/" + year + "-"+month+"-" + day).once("value").then((snapshot)=>{
					let count = snapshot.val();
					count++;
					firebase.database().ref("counter/" + + year + "-"+month+"-" + day).set(count);
				});
			}
			var timeLeft = data.convertToMinutes(data.sessionLeft);
		}
		else if (data.status == "break"){
			data.breakLeft--;
			if (data.breakLeft == 0){
				data.sessionLeft = data.sessionLength;
				pomoSound.play();
				data.status = "session";
			}
			var timeLeft = data.convertToMinutes(data.breakLeft);
		} else{ // pause
			var timeLeft = data.convertToMinutes(data.sessionLeft);
		} 
		view.updateClock(data.status, timeLeft);
	},
	convertToMinutes:(seconds)=>{
		var minutes = Math.floor(seconds/60);
		var remainder = seconds%60;
		if (remainder < 10) return (minutes + ":0"+remainder).toString();
		return (minutes + ":"+remainder).toString();
	}
};

var handler = {
	running:false,
	lastStatus:"session",
	time: ()=>{
		if (handler.running == false){
			handler.running = true;
			data.status = handler.lastStatus;
			timer = setInterval(()=>data.timeElapsed(),1000);
			pomoSound.play();
		}
		else{
			handler.running = false;
			clearInterval(timer);
			handler.lastStatus = data.status;
			data.status = "pause";
			data.timeElapsed();
		}
	},
	restart:()=>{
		handler.running = false;
		clearInterval(timer);
		data.breakLeft = data.breakLength;
		data.sessionLeft = data.sessionLength;
		data.status = "session";
		view.updateClock(data.status, "start");
		pomoSound.play();
	},
	changeBreakLength:(object)=>{
		if (handler.running != true){
			if (object.id == "decreaseBreak") {
				data.breakLength-=60;
				if (data.breakLength < 0) data.breakLength == 0;
			}
			if (object.id == "increaseBreak") data.breakLength+=60;
			handler.restart();
			view.updateLengths();
		}
	},
	changeSessionLength:(object)=>{
		if (handler.running != true){
			if (object.id == "decreaseSession") {
				data.sessionLength-=60;
				if (data.sessionLength < 0) data.sessionLength = 0;
			}
			if (object.id == "increaseSession") data.sessionLength+=60;
			handler.restart();
			view.updateLengths();
		}
	}

};

var view = {
	heightFill:100,
	updateClock:(status, timeLeft)=>{
		var timeLeftHandler = document.getElementById("timeLeft");
		timeLeftHandler.innerHTML = timeLeft; 
		var statusHandler = document.getElementById("status");
		switch(status){
		case "session":
			statusHandler.innerHTML = "session";
			break;
		case "break":
			statusHandler.innerHTML = "break";
			break;
		case "pause":
			statusHandler.innerHTML = "paused";
			break;
		}
		// fill clock
		view.calculateFillHeight();
		document.getElementById("fill").style.height = (view.heightFill + "%").toString();
	},
	calculateFillHeight:()=>{
		view.heightFill = Math.floor(data.sessionLeft/data.sessionLength*100);
	},
	updateLengths:()=>{
		document.getElementById("breakTime").innerHTML = data.convertToMinutes(data.breakLength);
		document.getElementById("sessionTime").innerHTML = data.convertToMinutes(data.sessionLength);        
	},
};


