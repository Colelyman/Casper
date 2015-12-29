var app = angular.module('htApp', ['firebase']);

app.controller('ctrl', function($scope, $firebaseArray) {
  var ref = new Firebase("https://provo166ht.firebaseio.com/");

  $scope.data = $firebaseArray(ref); // this is sync

  //data.$bindTo($scope, 'data');

  $scope.monthSelect = null;

  $scope.addGroup = function() {
    $scope.group.report = [
      {month: 'January', visited: false, concerns: ''},
      {month: 'February', visited: false, concerns: ''},
      {month: 'March', visited: false, concerns: ''},
      {month: 'April', visited: false, concerns: ''}
    ];
    $scope.data.$add($scope.group);
    $scope.group = null;
  };

  $scope.updateConcerns = function(group) {
    $scope.data.$save(group);
  };

  $scope.updateVisitStatus = function(group, visited) {
    console.log(JSON.stringify(group));
    console.log(visited);
  }
});

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});
