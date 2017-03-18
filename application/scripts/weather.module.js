(function (angular) {
    'use strict';

    angular.module('weather', [
        'ngRoute',
        'ngGeolocation'
        ])
        .config(configure);

    function configure($routeProvider) {
        $routeProvider.when('/forecast', {
            templateUrl: 'partials/forecast.html',
            controller: 'ForecastController',
            controllerAs: 'ForecastVM'
        })
        .otherwise({redirectTo: '/forecast'});
    }
}(angular));
