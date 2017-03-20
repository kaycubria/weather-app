(function (angular) {
    'use strict';

    angular.module('weather')
        .controller('ForecastController', ForecastController);

    function ForecastController($geolocation, weatherService) {
        var vm = this;

        vm.latitude;
        vm.longitude;
        vm.weatherData;
        vm.zipRegex = new RegExp(/^\d{5}$/)

        vm.init = init;
        vm.getLocation = getLocation;
        vm.getWeatherByZip = getWeatherByZip;
        vm.getWeatherFromUserGeoCoords = getWeatherFromUserGeoCoords;
        vm.parseDate = parseDate;

        vm.init();

        function init() {
            getLocation();
        }

        function getLocation() {
            $geolocation.getCurrentPosition()
                .then(function(position) {
                    vm.latitude = position.coords.latitude;
                    vm.longitude = position.coords.longitude;

                    getWeatherFromUserGeoCoords();
                 })
                .catch(function(err) {
                    console.log('Please check your browser\'s location settings.');
                    getWeatherByZip();
                });
        }

        function getWeatherByZip() {
            var zip = (vm.zip) ? vm.zip : '60661';
            vm.zipError = false;

            weatherService.getByZip(zip)
                .then(function(response) {
                    if (response.data.message != 'Error') {
                        vm.weatherData = response.data;
                        vm.latitude = vm.weatherData.city.coord.lat;
                        vm.longitude = vm.weatherData.city.coord.longitude;
                    } else {
                        vm.zipError = true;
                        console.log('Error');
                    }
                }).catch(function(error) {
                    vm.zipError = true;
                    console.log('something bad happened')
                });
        }

        function getWeatherFromUserGeoCoords() {
           weatherService.getByGeoCoords(vm.latitude, vm.longitude)
                .then(function(response) {
                    vm.weatherData = response.data;
                }).catch(function(error) {
                    console.log('something bad happened')
                });
        }

        function parseDate(date) {
            return new Date(date*1000);
        }
    }
}(angular));
