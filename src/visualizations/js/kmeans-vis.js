var initialCentroids = [[3,3], [6, 2], [8, 5]],
DataPoints = [],
centroidPaths = [new Path(), new Path(), new Path()],
centroidColors = ['#598527', '#f7941d', '#03689c'],
centroidMoves = [],
centroidNodes = [];


/* Needed for  Animation and Controls*/
var animLength = 0,
cnt = 0,
animateCentroids = false,
hasFinishedAnimation = false,
isAnimating = false,
isPaused = false,
animCnt = 0;

/* vars for plot scaling - Default values*/
var cW = 600,
cH = 400,
scaleX = 1,
scaleY = 1

/*
* Setup plot scaling, background, and draw points and initial centroids
*/
function setUp(){
    /*Find data range */
    var minMax = findMinMax(inputData);
    cW = view.size.width;
    cH = view.size.height;
    scaleX = cW/minMax.maxx;
    scaleY = cW/minMax.maxy;
    
    
    /* Draw gradient background */
    var topLeft = [0, 0] 
    var bottomRight = view.size
    var path = new Path.Rectangle(topLeft, bottomRight);
    var gradient = new Gradient(['#c2c2c2', '#999', '#777']);
    var gradientColor = new GradientColor(gradient, new Point(view.center.x, 0), new Point(view.center.x, view.size.height));
    
    // Set the fill color of the path to the gradient color:
    path.fillColor = gradientColor;

    
    $('#info').html('0')
    
    drawDataPoints();
    drawCentroids(initialCentroids);
}

/*
* Restart animation only
*/

function restart(){
    cnt = 0;
    animateCentroids = false;

    hasFinishedAnimation = false;
    isAnimating = false;
    isPaused = false;
    $('#info').html('0');
    
    drawDataPoints();
    drawCentroids(initialCentroids);

}


/*
* Draw Data points
*/
function drawDataPoints(){
    DataPoints = [];
    var l = inputData.length
    for (var i=0; i<l; i++){
        var myPoint = new Point(inputData[i][0]*scaleX, cH - (inputData[i][1] * scaleY));
        var myPath = new Path.Circle(myPoint, 2);
        myPath.fillColor = '#003471';
        DataPoints.push(myPath);
    }
}

function updateDataPointColors(centroidNodes){
   console.log('updateDataPointColors')
    var l = centroidNodes.length
    for (var i=0; i<l; i++){
        var m = centroidNodes[i].length;
        for (var j=0; j<m; j++){
            DataPoints[centroidNodes[i][j]].fillColor = centroidColors[i]
        }        
    }
}

/*
* Draw Centroids
*/

function drawCentroids(centroids){
    var l = centroids.length
    for (var i=0; i<l; i++){
        var myPoint = new Point(centroids[i][0]*scaleX, cH - (centroids[i][1] * scaleY));
        centroidPaths[i].removeSegments();
        centroidPaths[i] = new Path.Circle(myPoint, 5);
        centroidPaths[i].strokeColor = '#fff';
        centroidPaths[i].fillColor = centroidColors[i];
        centroidPaths[i].strokeWidth = 3;
        
    }
}

/*
* Find min and max x,y coords of data
* in order to scale
*/
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

/*
* Run the actual Kmeans
*/
function runKmeans(){
    var kmeans = new Kmeans(inputData, initialCentroids, 100, function(cpoints, cnodes){
        centroidMoves.push(cpoints)
        centroidNodes.push(cnodes)
    })
    kmeans.run();
    animLength = centroidMoves.length;
}

/*
* Draw onFrame
*/
function onFrame(event) {
    
    if(animateCentroids){
    isAnimating = true;
    cnt = parseInt(animCnt++ * 0.8) 
         if(cnt < animLength){   
           document.getElementById('info').innerHTML = (cnt+1)
            drawCentroids(centroidMoves[cnt]);
                
        }else{
            drawCentroids(centroidMoves[animLength-1]);
            updateDataPointColors(centroidNodes[animLength-1])
            document.getElementById('info').innerHTML = '100'
             
            hasFinishedAnimation = true;
            animCnt = 0;
            isAnimating = false;
            animateCentroids = false;
            $('#run-btn').html('Restart');
        }
    
    }
}



$(function(){
    setUp();
    runKmeans();
    
        $('#run-btn').live('click', function(e){
        e.preventDefault();
        
        if(hasFinishedAnimation){
            restart();
            $(this).html('Run K-means');
            return;
        }
        
        if(isPaused){ 
            isPaused=false;
            $(this).html('Pause');
            animateCentroids = true;
            return;
        }
        
        if(isAnimating && !hasFinishedAnimation){
            isPaused = true;
            animateCentroids = false;
            $(this).html('Continue');
            return;
        }else{
            isPaused=false;
            $(this).html('Pause');
            animateCentroids = true;
            return;
        }    
       
    })
});

