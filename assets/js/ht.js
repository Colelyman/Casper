var app = angular.module('htApp', ['firebase']);

app.controller('ctrl', function($scope, $firbaseAuth) {
  var ref = new Firebase("https://provo166ht.firebaseio.com/");

  var data = $firebaseObject(ref); // this is async

  data.$bindTo($scope, 'data');
});
