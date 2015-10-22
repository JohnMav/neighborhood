//  GLOBAL FUNCTIONS / VARIABLES
// ==================================================


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

//Default location where the map is initialized & centered.
var defaultLoc = {lat: locations[0].lat, lng: locations[0].lng};

var mapOptions = {
    center: defaultLoc,
    zoom: 12
};

//  GOOGLE MAP
// ==================================================
var initMap = function() {
    var map;
    var marker;
    var mapElement = document.getElementById('map');

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

        // FILTER RESULTS
        // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
        // ==================================================

        // Create utility function TODO: Move into Utility section?
        var stringStartsWith = function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        };

        this.listSearch = ko.observable('');

        this.filteredRecords = ko.computed(function() {
            var filter = self.listSearch().toLowerCase();
            return ko.utils.arrayFilter(self.locList(), function(item){
                return (self.listSearch().length == 0 || stringStartsWith(item.title().toLowerCase(), filter))
            });
        });

        //TODO: this needs to be fixed below.
        self.setLoc = function (clickedLoc) {
            ViewModel.init().currentLoc(clickedLoc);
            console.log(this.init().currentLoc().title());
            console.log(this.init().currentLoc().lat());

            //TODO: What happens after it's clicked?
        };

    }
};

google.maps.event.addDomListener(window, 'load', initMap);
ko.applyBindings(new ViewModel.init());
//var app = new ViewModel.init();

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