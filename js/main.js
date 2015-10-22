//  MODEL
// ==================================================

var locations = [
    {
        title: "Home",
        lat: 47.6063889,
        lng: -122.3308333
    },
    {
        title: "School",
        lat: 47.6563889,
        lng: -122.3308333
    },
    {
        title: "Work",
        lat: 47.5563889,
        lng: -122.3308333
    }
];

//  GOOGLE MAP
// ==================================================

var initMap = function() {
    var map;
    var marker;

    //Default location where the map is initialized & centered.
    var defaultLoc = {lat: locations[0].lat, lng: locations[0].lng};
    var mapElement = document.getElementById('map');
    var mapOptions = {
        center: defaultLoc,
        zoom: 12
    };

    //Create map using Google api.
    map = new google.maps.Map(mapElement, mapOptions);

    //Create a marker and set its position.
    var markerCurrent = {
        //map: map,
        position: {lat: app.currentLoc().lat(), lng: app.currentLoc().lng()},
        title: app.currentLoc().title()
    };
    marker = new google.maps.Marker(markerCurrent);
    marker.setMap(map);
};

//  VIEW-MODEL
// ==================================================
var GoogleMarker = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

var ViewModel = {
    init: function () {
        var self = this; // Using self to access outer functions.

        this.locList = ko.observableArray([]);

        locations.forEach(function (loc) {
            self.locList.push(new GoogleMarker(loc));
        });

        this.currentLoc = ko.observable(this.locList()[0]);


        //TODO: this needs to be fixed below.
        this.setLoc = function (clickedLoc) {
            ViewModel.init().currentLoc(clickedLoc);
            console.log(this.init().currentLoc().title());

            //TODO: What happens after it's clicked?
        };

    }
};

google.maps.event.addDomListener(window, 'load', initMap);
ko.applyBindings(new ViewModel.init());
var app = new ViewModel.init();

//  NEED TO CLEAN UP CODE BELOW
// ==================================================

//var ViewModel = {
//    init: function() {
//        var self = this; // Using self to access outer functions.
//
//        this.locList = ko.observableArray([]);
//
//        locations.forEach(function (loc) {
//            self.locList.push(new GoogleMarker(loc));
//        });
//
//        this.currentLoc = ko.observable(this.locList()[0]);
//
//        //console.log(ViewModel.update());
//        //this.update();
//    },
//    update: function() {
//        var self = this; // Using self to access outer functions.
//
//        this.setLoc = function (clickedLoc) {
//            ViewModel.init().currentLoc(clickedLoc);
//            console.log(this.init().currentLoc().title());
//
//            //What happens after it's clicked?
//        };
//    }
//};