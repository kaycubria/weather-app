(function (angular) {
    'use strict';

    angular.module('weather', [
        'ngAnimate',
        'ngRoute',
        'ngGeolocation',
        'ui.bootstrap'
        ])
        .config(configure);

    function configure($routeProvider) {
        $routeProvider.when('/forecast', {
            templateUrl: 'partials/forecast.html',
            controller: 'ForecastController',
            controllerAs: 'forecastVM'
        })
        .otherwise({redirectTo: '/forecast'});
    }
}(angular));
