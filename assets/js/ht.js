var app = angular.module('htApp', ['firebase', 'ngMessages']);

app.constant('FirebaseUrl', 'https://provo166ht.firebaseio.com/');

app.state('login', {
  url:'/htlogin',
  controller: 'AuthCtrl as authCtrl',
  templateUrl: 'htlogin.html',
  resolve: {
    requireNoAuth: function($state, Auth) {
      return Auth.$requireAuth().then(function(auth) {
        $state.go('home');
      }, function(error) {
        return;
      });
    }
  }
});

app.state('register', {
  url:'/register',
  controller: 'AuthCtrl as authCtrl',
  templateUrl: 'htregister.html',
  resolve: {
    requireNoAuth: function($state, Auth) {
      return Auth.$requireAuth().then(function(auth) {
        $state.go('home');
      }, function(error) {
        return;
      });
    }
  }
});

app.factory('Auth', function($firebaseAuth, FirebaseUrl) {
  var ref = new Firebase(FirebaseUrl);
  var auth = $firebaseAuth(ref);

  return auth;
});

app.controller('AuthCtrl', function(Auth, $state) {
  var authCtrl = this;

  authCtrl.user = {
    email: '',
    password: ''
  };

  authCtrl.login = function() {
    Auth.$authWithPassword(authCtrl.user).then(function(auth) {
      $state.go('home');
    }, function(error) {
      authCtrl.error = error;
    });
  };

  authCtrl.register = function() {
    Auth.$createUser(authCtrl.user).then(functino(user) {
      authCtrl.login();
    }, function(error) {
      authCtrl.error = error;
    });
  };
});



app.controller('ctrl', function($scope, $firebaseArray, $firebaseAuth) {

  var auth = $firebaseAuth(new Firebase(FirebaseUrl));

  /*auth.$authWithOAuthPopup('google').then(function(error, authData) {
    if(error) {
      console.log("Login Failed!", error);
    }
    else {
      console.log("Authenticated successfully with payload:", authData);
    }
    var ref = new Firebase("https://provo166ht.firebaseio.com/");

    $scope.data = $firebaseArray(ref); // this is sync
  }).catch(function(err) {
    console.log('Authentication failed: ', err);
  });*/

  $scope.monthSelect = null;

  $scope.group = {};
  $scope.group.htees = [{id: 'htee1'}, {id: 'htee2'}];

  $scope.addHtee = function() {
    var newHteeNumber = $scope.group.htees.length + 1;
    $scope.group.htees.push({'id': 'htee' + newHteeNumber});
  };

  $scope.addGroup = function() {
    var newHtees = [];
    $scope.group.family = [];
    var report = [
      {month: 'January', visited: false, concerns: ''},
      {month: 'February', visited: false, concerns: ''},
      {month: 'March', visited: false, concerns: ''},
      {month: 'April', visited: false, concerns: ''}
    ];
    for(var i = 0; i < $scope.group.htees.length; i++) {
      $scope.group.htees[i].report = report;
      console.log(i)
    }
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
