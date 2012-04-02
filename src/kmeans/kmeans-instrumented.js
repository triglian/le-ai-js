/**
 * This is the instrumented version of kmeans
 * 
 * The Kmeans class computes centroids according to the k-means algorithm 
 * @param array_of_arrays inputData The input data as an array of arrays
 * @param array initialCentroids The initialCentroids
 * @param int maxIters max iterations of kmeans
 * @param function onCentroidMove callback for each movement of centroids
 * 
*/
var Kmeans = function(inputData, initialCentroids, maxIters, onCentroidMove) {
  this.inputData = inputData || [];
  this.centroids = initialCentroids || [];
  this.maxIters = maxIters || 0;
   
  /**
   * @var array_of_ints centroidNodes - lookup table for which nodes are members
   * of the ith centroid
   */
  this.centroidNodes = [];
  
  /**
   * @var array_of_ints myCentroids - lookup table to which centroid the 
   * data point belongs
   */
  this.myCentroids = [];
  
  //Do some sanity checking
  if(this.inputData.length == 0) {
    throw('Given inputData cannot be empty');
    /*We don't actually check the sanity of inputData
     * contents for performance reasons
     */
  }
  if(this.centroids.length == 0) {
    throw('Given initialCentroids cannot be empty');
    /*We don't actually check the sanity of initialCentroids
     * contents for performance reasons
     */
  }
  if(!isInt(this.maxIters) || this.maxIters <= 0) {
    throw('maxIters must be an integer > 0');
  }  
  
  /*Centroid Movement callback for the instrumented version of kmeans*/
  if(typeof onCentroidMove != 'function') {
    throw('onCentroidMove must be a function');
  }
  
  this.onCentroidMove = onCentroidMove;  
}


function isInt(n) {
   return typeof n == 'number' && n % 1 == 0;
}

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}

Kmeans.prototype = {
  
  /**
   * This is the default distance function used.
   * x,y must be of the same dimension otherwise
   * distance is a separate function so that it can
   * be overriden really easily.
   * @param array x
   * @param array y
   * @return euclidean distance between x and y
  */
  distance: function(x, y) {
    if(!x || x.length != y.length) {
      console.log("x");
      console.debug(x);
      console.log("y");
      console.debug(y);
      throw('Distance function accepts 2 parameters of identical dimension');
    }
    var sum = 0;
    var i;
    for(i = 0; i < x.length; i++) {
      sum += (x[i] - y[i]) * (x[i] - y[i]);
    }
    return Math.sqrt(sum);
  },

  /**
   * Find closest centroid for each data point
   * @return array with the index(referring to centroids) of
   * the closest centroid of the ith data point
  */ 
  findClosestCentroids: function() {
    var i, j;
    var numData = this.inputData.length;
    var K = this.centroids.length;
    var myCentroid = [];

    //For each data point
    for(i = 0; i < numData; i++){
      var curMin = this.distance(this.inputData[i], this.centroids[0]);
      myCentroid[i] = [0];
      
      //For each centroid
      for(j = 1; j < K; j++) {
	var curDist = this.distance(this.inputData[i], this.centroids[j]);	
	if(curDist < curMin) {
	  curMin = curDist;
	  myCentroid[i] = [j];	  
	}	
      }
      //Update the lookup table for centroids to nodes
      (this.centroidNodes[myCentroid[i]] === undefined) && (this.centroidNodes[myCentroid[i]] = []);
      this.centroidNodes[myCentroid[i]].push(i);
    }
    this.myCentroids = myCentroid;
    return myCentroid;
  },
  
  /**
   * Moves centroids to the average of the distance
   * @return array_of_arrays The centroids moved
   */ 
  computeCentroids: function() {
    K = this.centroids.length;
    inputData = this.inputData;
    /**
     * TODO: The line below is subject to elimination
     */
    if(!this.centroids || this.centroids.length == 0 || !K) {
      return [];
    }
    
    var i, j, l;
    var newCentroids = [];
    //We consider the number of dimensions as the
    //number of dimensions of the first centroid
    var numDim = this.centroids[0].length;
    
    //init newCentroids to 0
    for(i = 0; i < K; i++) {
      for(j = 0; j < numDim; j++) {
	(newCentroids[i] === undefined) && (newCentroids[i] = []);
	newCentroids[i][j] = 0;
      }
    }
         
    //For each centroid
    for(i = 0; i < K; i++) {
      //Average the centroid members
      var nodes = this.centroidNodes[i];
      var numNodes = nodes.length;
      for(j = 0; j < numNodes; j++) {
	var curNode = inputData[nodes[j]];
	
	for(l = 0; l < numDim; l++) {
	  newCentroids[i][l] += curNode[l];
	}
      }
      //Normalize
      if(numNodes > 0) {
        for(l = 0; l < numDim; l++) {
	  newCentroids[i][l] /= numNodes;
        }
      }
    }
    this.centroids = newCentroids;
    return newCentroids;    
  },
  
  /**
   * Runs k-means with the parameters taken by the constructor
   */ 
  run: function() {
    var i;
    for(i = 0; i < this.maxIters; i++) {
      this.findClosestCentroids();
      this.computeCentroids();
      this.onCentroidMove(this.centroids, this.centroidNodes);
    }
    return this.centroids;
  }

}