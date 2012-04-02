var initialCentroids = [[3,3], [6, 2], [8, 5]],
centroidPaths = [new Path(), new Path(), new Path()],
centroidColors = ['#ff000', '#00ff00', '#0000ff']
centroidMoves = [];
/*Find Range */
var minMax = findMinMax(inputData),
cW = 600,
cH = 400,
norX = cW/minMax.maxx,
norY = cW/minMax.maxy;

/*
* Draw Data points
*/

function drawDataPoints(){
    var l = inputData.length
    for (var i=0; i<l; i++){
        var myPoint = new Point(inputData[i][0]*norX, cH - (inputData[i][1] * norY));
        var myPath = new Path.Circle(myPoint, 2);
        myPath.fillColor = '#03689c';
        
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
        centroidPaths[i].strokeColor = '#8c6239';
        centroidPaths[i].fillColor = centroidColors[i];
        centroidPaths[i].strokeWidth = 2;
        
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

drawDataPoints();
drawCentroids(initialCentroids);

var kmeans = new Kmeans(inputData, initialCentroids, 100, function(cpoints){
    centroidMoves.push(cpoints)
})

kmeans.run();


var l = centroidMoves.length;
var cnt = 0
animateCentroids = true


function onFrame(event) {
    if(animateCentroids){
    
    //drawCentroids(centroidMoves[cnt]);
    cnt =  Math.floor(event.time / 0.1)
     if(cnt < l){   
        drawCentroids(centroidMoves[cnt]);
            
    }else{
        animateCentroids = false
    }
    //console.log (cnt)
/*     animateCentroids = false */
    // the number of times the frame event was fired:
/*     console.log(event.count); */

    // The total amount of time passed since
    // the first frame event in seconds:
/*     console.log(event.time); */

    // The time passed in seconds since the last frame event:
/*     console.log(event.delta); */

    
    }
}

