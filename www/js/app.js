// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//https://openexchangerates.org/api/latest.json?app_id=e6a09e74be554a06a4fa999ebe97af3a
angular
.module('starter', ['ionic'])
.controller('AppCtrl', appCtrl )
.factory('AppFactory', factoryApp)
.run(runApp);

runApp.$inject = ['$ionicPlatform'];
function runApp($ionicPlatform) {
    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
        StatusBar.styleDefault();
    }
    });
}

appCtrl.$inject = ['$scope', '$window', '$log', 'AppFactory', '$ionicLoading'];
function appCtrl ( $scope, $window, $log, AppFactory, $ionicLoading) {

    if (!$window.localStorage.totalSpend) {
        var spends = [];
        spends.push("0");
        $window.localStorage.totalSpend = JSON.stringify(spends);
    }

    if ( !$window.localStorage.mxnInClp ) {
        $window.localStorage.mxnInClp = 41;
    }
    $scope.mxnToCLP = $window.localStorage.mxnInClp;
    $log.debug("$window.localStorage[mxnInClp] = " + $window.localStorage.mxnInClp);

    $scope.mxnInput = 0;
    $scope.outputCLP = 0;

    $scope.updateCLP =  function(mxnInput) {
        $scope.outputCLP = mxnInput * $scope.mxnToCLP;
    };

    $scope.updateCurrency =  function() {
        $log.debug("updateCurrency");
        $ionicLoading.show({
          template: 'Loading...'
        });

        AppFactory.getValues()
        .success(function(data){
            var clp = data.rates.CLP;
            var mxn = data.rates.MXN;

            //clp = new Number(clp);
            //mxn = new Number(mxn);

            mxnInClp = clp / mxn;
            mxnInClp = mxnInClp.toFixed(2);
            $log.debug("clp = " + clp);
            $log.debug("mxn = " + mxn);
            $log.debug("mxnInClp = " + mxnInClp);

            $window.localStorage.mxnInClp = mxnInClp;
            $scope.mxnToCLP = $window.localStorage.mxnInClp;
            $ionicLoading.hide();
        })
        .error(function(err){
            $log.debug(err);
            $ionicLoading.hide();
        });
    };

    $scope.saveSpend = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        var todaySpend = "" + dd + mm + yyyy + "|" + $scope.outputCLP;
        $log.debug(todaySpend);

        var storedSpends = JSON.parse($window.localStorage.totalSpend);
        storedSpends.push(todaySpend);
        $window.localStorage.totalSpend = JSON.stringify(storedSpends);
    };
}

factoryApp.$inject = ['$http'];
function factoryApp($http){
    var service = {
        getValues : getValues
    };
    return service;

    function getValues() {
        return $http.get('https://openexchangerates.org/api/latest.json?app_id=e6a09e74be554a06a4fa999ebe97af3a');
    }
}
