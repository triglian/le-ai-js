module('Kmeans tests')
test('findClosestCentroids()', function() {
  var expectedVal = [
    { id: 1, name: 'Joe'},
    { id: 3, name: 'Sam'},
    { id: 8, name: 'Eve'}
];
  deepEqual(findClosestCentroids(), expectedVal, 'findClosestCentroids returns the expected centroids');
});