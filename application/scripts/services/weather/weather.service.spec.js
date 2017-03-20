describe('weatherService', function() {
    'use strict';

    var weatherService;
    var $httpBackend;
    var mockResponse = {
        data: 'it\s FREEZING'
    };

    beforeEach(module('weather'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        weatherService = $injector.get('weatherService');
    }));

    afterEach(function() {
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getByGeoCoords', function() {
        it('gets the weather data for the specified coordinates', function() {
            var lat = 55;
            var lon = -81;

            $httpBackend
                .expectGET(weatherService.endpoint + '?lat=' + lat + '&lon=' + lon + weatherService.unitsParam + weatherService.keyParam)
                .respond(200, mockResponse);

            weatherService.getByGeoCoords(lat, lon)
                .then(function(response) {
                    expect(response.data).toEqual(mockResponse);
                });
        });
    });

    describe('#getByGeoCoords', function() {
        it('gets the weather data for the specified zipcode', function() {
            var zip = 60661;

            $httpBackend
                .expectGET(weatherService.endpoint + '?zip=' + zip + ',us' + weatherService.unitsParam + weatherService.keyParam)
                .respond(200, mockResponse);

            weatherService.getByZip(zip)
                .then(function(response) {
                    expect(response.data).toEqual(mockResponse);
                });
        });
    });
});