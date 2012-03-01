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
 
function animate(lastTime, myCircle){
    var canvas = document.getElementById("kmeansCanvas");
    var context = canvas.getContext("2d");
 
    // update
    var date = new Date();
    var time = date.getTime();
    
    
    //glowing effect
    if((myCircle.radius > myCircle.radiusMax) || (myCircle.radius < myCircle.radiusMin)) {
      myCircle.step *= -1;
    }
    
//      myCircle.radius += myCircle.step;
    
    //moving
    var timeDiff = time - lastTime;
    var linearSpeed = 100; // pixels / second
    //var linearDistEachFrame = linearSpeed * timeDiff / 1000;
    var currentX = myCircle.x;
    var currentY = myCircle.y;
    
    if ((currentX >= canvas.width - myCircle.radius - myCircle.borderWidth / 2) ||
      (currentX < myCircle.radius)
    ) {
        myCircle.moveStepX *= -1;        
    }
    
    if ((currentY >= canvas.height - myCircle.radius - myCircle.borderWidth / 2) ||
      (currentY < myCircle.radius)
    ) {
        myCircle.moveStepY *= -1;        
    }
    
    var newX = currentX + myCircle.moveStepX;
    var newY = currentY + myCircle.moveStepY;
    
    myCircle.x = newX;
    myCircle.y = newY;
    
    
    
    lastTime = time;
    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);
 
    // draw
    
    context.beginPath();
    context.arc(myCircle.x, myCircle.y, myCircle.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "#8ED6FF";
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.stroke();
 
    // request new frame
    requestAnimFrame(function(){
         animate(lastTime, myCircle);
    });
}
 
window.onload = function(){
    // initialize stage
    var myCircle = {
        x: 75,
        y: 75,
        radius: 30,
        borderWidth: 5,
        step: 0.5,
	radiusMax: 40,
	radiusMin: 20,
	moveStepX: 3,
	moveStepY: 3,
    };
 
    var date = new Date();
    var time = date.getTime();
    animate(time, myCircle); 
};