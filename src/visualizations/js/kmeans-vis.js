var initialCentroids = [[3,3], [6, 2], [8, 5]],
DataPoints = [],
centroidPaths = [new Path(), new Path(), new Path()],
centroidColors = ['#598527', '#f7941d', '#03689c'],
centroidMoves = [],
centroidNodes = [];


/* Needed for */
var animLength = 0,
cnt = 0,
animateCentroids = false;

var hasRunKmeans = false;
var hasFinishedAnimation = false;
var isAnimating = false;
var isPaused = false;



/*Find Range */
var minMax = findMinMax(inputData),
cW = 600,
cH = 400,
norX = cW/minMax.maxx,
norY = cW/minMax.maxy;

/*
* Draw Data points
*/

// Define two points which we will be using to construct
// the path and to position the gradient color:
var topLeft = [0, 0] 
var bottomRight = view.size

// Create a rectangle shaped path between
// the topLeft and bottomRight points:
var path = new Path.Rectangle(topLeft, bottomRight);

// Create the gradient, passing it an array of colors to be converted
// to evenly distributed color stops:
var gradient = new Gradient(['#c2c2c2', '#999', '#777']);

// Have the gradient color run between the topLeft and
// bottomRight points we defined earlier:
var gradientColor = new GradientColor(gradient, new Point(view.center.x, 0), new Point(view.center.x, view.size.height));

// Set the fill color of the path to the gradient color:
path.fillColor = gradientColor;

function drawDataPoints(){
    var l = inputData.length
    for (var i=0; i<l; i++){
        var myPoint = new Point(inputData[i][0]*norX, cH - (inputData[i][1] * norY));
        var myPath = new Path.Circle(myPoint, 2);
        myPath.fillColor = '#003471';
        DataPoints.push(myPath);
        
    }
}

function updateDataPointColors(centroidNodes){
   
    var l = centroidNodes.length
    for (var i=0; i<l; i++){
        var m = centroidNodes[i].length;
        //console.log(centroidNodes[i])
        for (var j=0; j<m; j++){
/*             console.log(centroidNodes[i]) */
            DataPoints[centroidNodes[i][j]].fillColor = centroidColors[i]
        }        
    }
}

/*
* Draw Centroids
*/

function drawCentroids(centroids){
    var l = centroids.length
    for (var i=0; i<centroids.length; i++){
        var myPoint = new Point(centroids[i][0]*norX, cH - (centroids[i][1] * norY));
        centroidPaths[i].removeSegments();
        centroidPaths[i] = new Path.Circle(myPoint, 5);
        centroidPaths[i].strokeColor = '#fff';
        centroidPaths[i].fillColor = centroidColors[i];
        centroidPaths[i].strokeWidth = 3;
        
    }
}


function findMinMax(data){
    minx = data[0][0]
    miny = data[0][1]
    maxx = data[0][0]
    maxy = data[0][1]
    for (i in data){
        if(i[0] < minx ) minx = i[0]
        if(i[1] < miny ) miny = i[1]
        if(i[0] > maxx ) maxx = i[0]
        if(i[1] > maxy ) maxy = i[1]
    }
    return {'minx':minx, 'miny': miny, 'maxx': maxx, 'maxy': maxy}
}





function runKmeans(){
    var kmeans = new Kmeans(inputData, initialCentroids, 100, function(cpoints, cnodes){
        centroidMoves.push(cpoints)
        centroidNodes.push(cnodes)
    })
    kmeans.run();
    animLength = centroidMoves.length;
    cnt = 0
    animateCentroids = true;
}


function onFrame(event) {
    if(animateCentroids){
    isAnimating = true;
    drawCentroids(centroidMoves[cnt]);
    cnt =  Math.floor(event.time / 0.06)
         if(cnt < animLength){   
           document.getElementById('info').innerHTML = (cnt+1)
            drawCentroids(centroidMoves[cnt]);
                
        }else{
            drawCentroids(centroidMoves[animLength-1]);
            updateDataPointColors(centroidNodes[animLength-1])
            console.log('animLength: ' + animLength)
            document.getElementById('info').innerHTML = '100'
             
            hasFinishedAnimation = true;
            isAnimating = false;
            animateCentroids = false;
            $('#run-btn').html('Restart');
        }
    
    }
}

function setUp(){
   /*
 DataPoints = [],
    centroidMoves = [],
    centroidNodes = [];
*/
     
    animLength = 0;
    cnt = 0;
    animateCentroids = false;


    var hasRunKmeans = false;
    var hasFinishedAnimation = false;
    var isAnimating = false;
    var isPaused = false;
    
    $('#info').html('0')
    
    drawDataPoints();
    drawCentroids(initialCentroids);


}

$(function(){
    setUp();
    
        $('#run-btn').live('click', function(e){
        e.preventDefault();
        
        if(hasFinishedAnimation){
            console.log('bhka')
            setUp();
            hasRunKmeans = true;
            animLength = centroidMoves.length;
    cnt = 0
    animateCentroids = true;
            //runKmeans();
            $(this).html('Pause');
        }else if(! hasRunKmeans){
            hasRunKmeans = true;
            runKmeans();
             $(this).html('Pause');
        }else{
            console.log('isPaused: ', isPaused)
            if(isPaused){
                isPaused=false;
                $(this).html('Pause');
                animateCentroids = true;
            }
            else if(isAnimating && !hasFinishedAnimation){
                isPaused = true;
                animateCentroids = false;
                $(this).html('Continue');
            }
        }
       
        
        
    })
});

