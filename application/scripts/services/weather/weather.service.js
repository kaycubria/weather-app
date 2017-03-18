(function (angular) {
    'use strict';

    angular.module('weather')
        .service('weatherService', weatherService);

    // @ngInject
    function weatherService($http) {
        /* jshint validthis: true */
        var self = this;
        self.endpoint = 'http://api.openweathermap.org/data/2.5/forecast'
        self.keyParam = '&APPID=aa2ce7e2d9549825754939ba43e0927d'

        self.getByGeoCoords = getByGeoCoords;
        self.getByZip = getByZip;

        function getByGeoCoords(lat, lon) {
            var queryParams = '?lat=' + lat + '&lon=' + lon + self.keyParam ;
            var request = {
                url: self.endpoint + queryParams,
                method: 'GET'
            };

            return $http(request);
        }

        function getByZip(zip) {
            var queryParams = '?zip=' + zip + ',us' + self.keyParam;
            var request = {
                url: self.endpoint + queryParams,
                method: 'GET'
            };

            return $http(request);
        }
    }
}(angular));
