var numtimes = -1;
var current = 0;
var myCircle = {};
var linestops = [];
var startButton = "";
var clearButton = "";

window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();
 
function animate(lastTime, myCircle, linestops, playAnimation){
    if(!playAnimation.animate) {
      return;
    }
    if(numtimes > 0){
        if(current < numtimes){
            current++ ;
        }else{
            return;
        }
    }
    var canvas = document.getElementById("kmeansCanvas");
    var context = canvas.getContext("2d");
 
    // update
    var date = new Date();
    var time = date.getTime();
    
    
    //glowing effect
    if((myCircle.radius > myCircle.radiusMax) || (myCircle.radius < myCircle.radiusMin)) {
      myCircle.step *= -1;
    }
    
    myCircle.radius += myCircle.step;
    
    //moving
    var timeDiff = time - lastTime;
    var linearSpeed = 100; // pixels / second
    //var linearDistEachFrame = linearSpeed * timeDiff / 1000;
    var currentX = myCircle.x;
    var currentY = myCircle.y;
    
    var lent = linestops.length;
     
    if ((currentX >= canvas.width - myCircle.radiusMax - myCircle.borderWidth / 2) ||
      (currentX < myCircle.radiusMax)
    ) {
        myCircle.moveStepX *= -1;
        linestops.push({x:myCircle.x, y:myCircle.y,  color: get_random_color()})
        if(lent > 50){
        linestops.splice(0,1);
        }      
    }
    
    if ((currentY >= canvas.height - myCircle.radiusMax - myCircle.borderWidth / 2) ||
      (currentY < myCircle.radiusMax)
    ) {
        myCircle.moveStepY *= -1;        
        linestops.push({x:myCircle.x, y:myCircle.y, color: get_random_color()})
        if(lent > 50){
            linestops.splice(0,1);
        }   
    }
    
    var newX = currentX + myCircle.moveStepX;
    var newY = currentY + myCircle.moveStepY;
    
    myCircle.x = newX;
    myCircle.y = newY;
    
    
    
    lastTime = time;
    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);
 
    // draw
    
   
    
    
    context.lineWidth = 2;
   
    var len = linestops.length;
    for (var i=0; i<len -1; i++)
    {
        var from = linestops[i];
        var to = linestops[i + 1]
         context.beginPath();
         context.strokeStyle = from.color;
        context.moveTo(from.x, from.y);
        context.lineTo( to.x, to.y);
         context.stroke();
    }
   
    context.beginPath();
    var last = linestops[len -1];
    context.strokeStyle = last.color;
    context.moveTo(last.x, last.y);
    context.lineTo( myCircle.x, myCircle.y);
       context.stroke();
    
     context.beginPath();
    context.arc(myCircle.x, myCircle.y, myCircle.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "#8ED6FF";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
    
   // context.moveTo(0,0);
    //context.lineTo( myCircle.x - myCircle.radius, myCircle.y);
 
 
    // request new frame
    requestAnimFrame(function(){
         animate(lastTime, myCircle, linestops, playAnimation);
    });
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

 
window.onload = function(){
     // initialize stage
     resetSettings();
    
    /*
     * make the animation properties an object
     * so that it can be modified by reference
     * from an event
     */
    var animProp = {
        animate: false
    };
    startButton = document.getElementById("start");
    clearButton = document.getElementById("clear");
    
    startButton.addEventListener("click", function(){
      var date = new Date();
      var time = date.getTime();
      animProp.animate = !animProp.animate;
      startButton.innerHTML = startButton.innerHTML == "Play" ? "Pause" : "Play";
      animate(time, myCircle, linestops, animProp); 
   });
    
     clearButton.addEventListener("click", function(){
       resetSettings();
     });
};

var resetSettings = function() {
   myCircle = {
        x: 75,
        y: 205,
        radius: 15,
        borderWidth: 5,
        step: 0.2,
	radiusMax: 25,
	radiusMin: 7,
	moveStepX: 3,
	moveStepY: 3,
    };
    
    linestops = [{x: myCircle.x, y: myCircle.y, color: get_random_color()}];
    startButton.innerHTML = "Play";
    var canvas = document.getElementById("kmeansCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
};