describe('ForecastController', function() {
    'use strict';

    var defer;
    var promise;
    var scope;
    var $geolocation;
    var weatherService;
    var ForecastController;

    beforeEach(module('weather'));

    beforeEach(inject(function($controller, $q, $rootScope) {
        scope = $rootScope.$new();

        function promise() {
            defer = $q.defer();
            return defer.promise;
        }

        $geolocation = {
            getCurrentPosition: promise
        };

        weatherService = {
            getByGeoCoords: promise,
            getByZip: promise
        }

        spyOn($geolocation, 'getCurrentPosition').and.callThrough();
        spyOn(weatherService, 'getByGeoCoords').and.callThrough();
        spyOn(weatherService, 'getByZip').and.callThrough();

        ForecastController = $controller('ForecastController', {
            scope: scope,
            $geolocation: $geolocation
        });

        scope.$apply();
    }));

    describe('#init()', function() {
        it('calls geolocation service', function(done) {
            $geolocation.getCurrentPosition(done())
            ForecastController.init();

            expect($geolocation.getCurrentPosition).toHaveBeenCalled();
        });
    });

    describe('#getLocation()', function() {
        it('calls geolocation service and sets latitude and longitude', function(done) {
            var locationPromise = $geolocation.getCurrentPosition(done());
            var weatherPromise = weatherService.getByGeoCoords(done());
            var response = {
                coords: {
                    lat: 12,
                    lon: -87
                }
            };

            $rootScope.$apply(function(){locationPromise.resolve(response)});
            $rootScope.$apply(function(){weatherPromise.resolve()});

            ForecastController.getLocation();

            expect($geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(ForecastController.latitude).toEqual(12);
            expect(ForecastController.longitude).toEqual(-87);
            expect(weatherPromise.getByGeoCoords).toHaveBeenCalled();
        });
        it('if the geolocation service all fails, it gets weather by zip', function(done) {
            var locationPromise = $geolocation.getCurrentPosition(done());
            var weatherPromise = weatherService.getByZip(done());

            $rootScope.$apply(function(){locationPromise.reject()});

            ForecastController.getLocation();

            expect($geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(ForecastController.latitude).toBeUndefined;
            expect(ForecastController.longitude).toBeUndefined;
            expect(weatherService.getByZip).toHaveBeenCalled();
        });
    });

    describe('#getWeatherByZip()', function() {
        it('sets the weather data when the weather service call is successful with a good zip', function(done) {
            var weatherPromise = weatherService.getByZip(done());
            var response = {
                data:{
                    message: 'a happy message',
                    city: {
                        coords: {
                            lat: 12,
                            lon: -21
                        }
                    }
                }
            };

            $rootScope.$apply(function(){weatherPromise.resolve(response)});

            ForecastController.getWeatherByZip();

            expect(weatherPromise.getByZip).toHaveBeenCalled();
            expect(ForecastController.weatherData).toEqual(response.data);
            expect(ForecastController.latitude).toEqual(response.data.city.coords.lat);
            expect(ForecastController.longitude).toEqual(response.data.city.coords.lat);
        });
        it('sets an error when the call is successful with a bad zip', function(done) {
            var weatherPromise = weatherService.getByZip(done());
            var response = {
                data:{
                    message: 'Error',
                    city: {
                        coords: {
                            lat: 12,
                            lon: -21
                        }
                    }
                }
            };

            $rootScope.$apply(function(){weatherPromise.resolve(response)});

            ForecastController.getWeatherByZip();

            expect(weatherPromise.getByZip).toHaveBeenCalled();
            expect(ForecastController.weatherData).toBeUndefined;
            expect(ForecastController.latitude).toBeUndefined;
            expect(ForecastController.longitude).toBeUndefined;
            expect(ForecastController.zipError).toBeTrue;
        });
        it('sets an error when the call fails', function(done) {
            var weatherPromise = weatherService.getByZip(done());

            $rootScope.$apply(function(){weatherPromise.reject()});

            ForecastController.getWeatherByZip();

            expect(weatherPromise.getByZip).toHaveBeenCalled();
            expect(ForecastController.weatherData).toBeUndefined;
            expect(ForecastController.latitude).toBeUndefined;
            expect(ForecastController.longitude).toBeUndefined;
            expect(ForecastController.zipError).toBeTrue;
        });
    });

    describe('#getWeatherFromUserGeoCoords()', function() {
        it('sets the weather data when the weather service call is successful with a good zip', function(done) {
            var weatherPromise = weatherService.getByGeoCoords(done());
            var response = {
                data:{
                    message: 'a happy message',
                    city: {
                        coords: {
                            lat: 12,
                            lon: -21
                        }
                    }
                }
            };

            $rootScope.$apply(function(){weatherPromise.resolve(response)});

            ForecastController.getWeatherFromUserGeoCoords();

            expect(weatherPromise.getByGeoCoords).toHaveBeenCalled();
            expect(ForecastController.weatherData).toEqual(response.data);
        });
        it('does not set weather data when the call to the weather service fails', function(done) {
            var weatherPromise = weatherService.getByGeoCoords(done());

            $rootScope.$apply(function(){weatherPromise.reject()});

            ForecastController.getWeatherFromUserGeoCoords();

            expect(weatherPromise.getByGeoCoords).toHaveBeenCalled();
            expect(ForecastController.weatherData).toBeUndefined;
        });
    });
});