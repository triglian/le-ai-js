/**
 * The Kmeans class computes centroids according to the k-means algorithm 
 * @param array_of_arrays inputData          The input data as an array of arrays
 * @param array initialCentroids   The initialCentroids
 * @param int maxIters           max iterations of kmeans
*/
var Kmeans = function(inputData, initialCentroids, maxIters) {
  this.inputData = inputData || [];
  this.centroids = initialCentroids || [];
  this.maxIters = maxIters || 0;
  
  /**
   * @var array_of_ints myCentroid Represents the membership of inputData 
   * to centroids
   */
  this.myCentroid = [];
  
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
}


function isInt(n) {
   return typeof n == 'number' && n % 1 == 0;
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
    if(x.length != y.length) {
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
   * The function takes arguments instead of getting them from
   * the class so that it can be overriden really easily
   * @param array_of_arrays inputData The data points
   * @param array_of_arrays centroids The centroids
   * @return array with the index(referring to centroids) of
   * the closest centroid of the ith data point
  */ 
  findClosestCentroids: function(inputData, centroids) {
    var i, j;
    var numData = inputData.length;
    var K = centroids.length;
    var myCentroid = [];
    //For each data point
    for(i = 0; i < numData; i++){
      var curMin = this.distance(inputData[i], centroids[0]);
      myCentroid[i] = [0];
      //For each centroid
      for(j = 1; j < K; j++) {
	var curDist = this.distance(inputData[i], centroids[j]);	
	if(curDist < curMin) {
	  curMin = curDist;
	  myCentroid[i] = [j];
	}
      }
    }
    return myCentroid;
  }

}