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

app.state('profile', {
  url:'/profile',
  resolve: {
    auth: function($state, Users, Auth) {
      return Auth.$requireAuth().catch(function() {
        $state.go('home');
      });
    },
    profile: function(Users, Auth) {
      return Auth.$requireAuth().then(function(auth) {
        return Users.getProfile(auth.uid).$loaded();
      });
    },
    url: '.profile',
    controller: 'ProfileCtrl as profileCtrl',
    templateUrl: 'users/profile.html'
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
    Auth.$createUser(authCtrl.user).then(function(user) {
      authCtrl.login();
    }, function(error) {
      authCtrl.error = error;
    });
  };
});

app.controller('ProfileCtrl', function($state, md5, auth, profile) {
  var profileCtrl = this;

  profileCtrl.profile = profile;

  profileCtrl.updateProfile = function() {
    profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
    profileCtrl.profile.$save();
  };
});

app.factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl) {
  var usersRef = new Firebase(FirebaseUrl + 'users');
  var users = $firebaseArray(usersRef);

  var Users = {
    getProfile: function(uid) {
      return $firebaseObject(usersRef.child(uid));
    },
    getDisplayName: function(uid) {
      return users.$getRecord(uid).displayName;
    },
    getGravatar: function(uid) {
      return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
    },
    all: users
  };

  return Users;
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
