

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
        title: "Store",
        lat: 47.6363889,
        lng: -122.3208333
    },
    {
        title: "Work",
        lat: 47.5563889,
        lng: -122.3308333
    }
];

//Default location where the map is initialized & centered.
var defaultLoc = {lat: locations[0].lat, lng: locations[0].lng, title: "Default & Boring"};

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


    // Default Marker
    //==================================================
    var markerDefault = {

        //Calling defaultLoc from model
        position: {
            lat: defaultLoc.lat,
            lng: defaultLoc.lng
        },
        title: defaultLoc.title
    };

    marker = new google.maps.Marker(markerDefault);
    marker.setMap(map);

    // All Markers in Model
    //==================================================
    //Putting all markers on the map
    //for (var i = 0; i < locations.length; i ++) {
    //    var markersFromList = {
    //        position: {
    //            lat: locations[i].lat,
    //            lng: locations[i].lng
    //        },
    //        title: locations[i].title
    //    };
    //    marker = new google.maps.Marker(markersFromList);
    //    marker.setMap(map);
    //}

    // Clicked Marker
    //==================================================
    //var markerCurrent = {
    //
    //    //Calling defaultLoc from model
    //    position: {
    //        lat: ViewModel.init().currentLoc().lat(),
    //        lng: ViewModel.init().currentLoc().lng()
    //    },
    //    title: ViewModel.init().currentLoc().title()
    //};
    //
    //marker = new google.maps.Marker(markerDefault);
    //marker.setMap(map);
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

        this.locList = ko.observableArray([]); //Initialize array of locations

        // Take the locations model, filter it through GoogleMarker function (make each property observable),
        // and add to the array of locations
        locations.forEach(function (loc) {
            self.locList.push(new GoogleMarker(loc));
        });

        // Set the default current location to the 1st one.
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

        this.listSearch = ko.observable("");

        this.filteredRecords = ko.computed(function() {
            var filter = self.listSearch().toLowerCase();
            return ko.utils.arrayFilter(self.locList(), function(item){
                return (self.listSearch().length == 0 || stringStartsWith(item.title().toLowerCase(), filter));
            });
        });

        // Capture clicks below.  TODO: This can be moved to a 'Update' object.
        this.setLoc = function (clickedLoc) {
            self.currentLoc(clickedLoc);




            //Debug
            console.log("Clicked Title = " + clickedLoc.title());
            console.log("Clicked Lat = " + clickedLoc.lat());
            console.log("Clicked Lng = " + clickedLoc.lng());
            console.log("Current Title = " + self.currentLoc().title());
            console.log("Current Lat = " + self.currentLoc().lat());
            console.log("Current Lng = " + self.currentLoc().lng());
        };
    }
};

google.maps.event.addDomListener(window, 'load', initMap);
ko.applyBindings(new ViewModel.init());  //I forgot why this is needed vs just "ViewModel.init()";
