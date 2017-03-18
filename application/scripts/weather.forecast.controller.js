(function (angular) {
    'use strict';

    angular.module('weather')
        .controller('ForecastController', ForecastController);

    function ForecastController($geolocation, weatherService) {
        var vm = this;

        vm.latitude;
        vm.longitude;
        vm.weatherData;

        vm.getLocation = getLocation;

        init();

        function init() {
            getLocation();
        }

        function getLocation() {
            $geolocation.getCurrentPosition()
                .then(function(position) {
                    vm.latitude = position.coords.latitude;
                    vm.longitude = position.coords.longitude;

                    getUsersCurrentWeather();
                 })
                .catch(function(err) {
                    console.log('Please check your browser\'s location settings.');
                    getDefaultLocationWeather();
                });
        }

        function getDefaultLocationWeather() {
            weatherService.getByZip('60661')
                .then(function(response) {
                    vm.weatherData = response.data;
                    vm.latitude = weatherData.city.coord.lat;
                    vm.longitude = weatherData.city.coord.longitude;
                }).catch(function(error) {
                    console.log('something bad happened')
                });
        }

        function getUsersCurrentWeather() {
           weatherService.getByGeoCoords(vm.latitude, vm.longitude)
                .then(function(response) {
                    vm.weatherData = response.data;
                }).catch(function(error) {
                    console.log('something bad happened')
                });
        }
    }
}(angular));
