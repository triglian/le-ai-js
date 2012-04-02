var initialCentroids = [[3,3], [6, 2], [8, 5]];
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
    for (var i=0; i<inputData.length; i++){
        var myPoint = new Point(inputData[i][0]*norX, cH - (inputData[i][1] * norY));
        var myPath = new Path.Circle(myPoint, 2);
        myPath.fillColor = '#03689c';
        
    }
}

/*
* Draw Centroids
*/

function drawCentroids(centroids){
    for (var i=0; i<centroids.length; i++){
        var myPoint = new Point(centroids[i][0]*norX, cH - (centroids[i][1] * norY));
        var myPath = new Path.Circle(myPoint, 5);
        myPath.strokeColor = '#8c6239';
        myPath.fillColor = '#ed145b';
        myPath.strokeWidth = 2;
        
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

drawDataPoints()
drawCentroids(initialCentroids)

