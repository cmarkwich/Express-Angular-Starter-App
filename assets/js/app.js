'use strict';

angular.module('myApp', [
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'assets/templates/home.html',
      controller: 'HomeController'
    })
    .otherwise({
      redirectTo: '/error'
    });
    $locationProvider.html5Mode(true);
  }).directive('navbar', function() {
    return {
      templateUrl: 'assets/templates/partials/navbar.html'
    };
  });