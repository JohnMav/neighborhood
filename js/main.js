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

var GoogleMarker = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};


//Default location where the map is initialized & centered.  NOT KNOCKUTJS
var defaultLoc = ko.observable( {lat: locations[0].lat, lng: locations[0].lng, title: 'Default Boring'});

var currentMarker = ko.observable({
    //Calling defaultLoc from model
    position: {
        lat: defaultLoc().lat,
        lng: defaultLoc().lng
    },
    title: defaultLoc().title
});

var mapOptions = {
    center: defaultLoc(),
    zoom: 12
};

//  GOOGLE MAP
// ==================================================
var initMap = function(pin) {
    var map;
    var marker;
    var mapElement = document.getElementById('map');

    //Create map using Google api.
    map = new google.maps.Map(mapElement, mapOptions);


    // Default Marker
    //==================================================


    marker = ko.observable(new google.maps.Marker(pin));
    marker().setMap(map);

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
    //console.log(ViewModel.c);
    //var markerCurrent = {
    //
    //    //Calling defaultLoc from model
    //    position: {
    //        lat: ViewModel.currentLoc().lat(),
    //        lng: ViewModel.currentLoc().lng()
    //    },
    //    title: ViewModel.init().currentLoc().title()
    //};
    //
    //marker = new google.maps.Marker(markerDefault);
    //marker.setMap(map);
};

//  VIEW-MODEL
// ==================================================

var ViewModel = function () {
    var self = this; // Using self to access outer functions.

    // Get Locations
    //==================================================

    //Set current location.
    this.locList = ko.observableArray([]); //Initialize array of locations

    this.currentLoc = ko.observable(self.locList()[0]);

    // Take the locations model, filter it through GoogleMarker function (make each property observable),
    // and add to the array of locations
    locations.forEach(function (loc) {
        self.locList.push(new GoogleMarker(loc));
    });

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

    //With a click, set the current location, and update the currentLoc.
    this.setLoc = function (clickedLoc) {
        self.currentLoc(clickedLoc);
        //currentMarker(clickedLoc);

        this.updateMarker = ko.observable({
            //Calling defaultLoc from model
            position: {
                lat: self.currentLoc().lat(),
                lng: self.currentLoc().lng()
            },
            title: self.currentLoc().title()
        });

        initMap(this.updateMarker());

        //Debug
        console.log("Clicked Title = " + clickedLoc.title());
        console.log("Clicked Lat = " + clickedLoc.lat());
        console.log("Clicked Lng = " + clickedLoc.lng());
        console.log("Current Title = " + self.currentLoc().title());
        console.log("Current Lat = " + self.currentLoc().lat());
        console.log("Current Lng = " + self.currentLoc().lng());
    };
};

// Capture clicks below.  TODO: This can be moved to a 'Update' object.

ko.applyBindings(new ViewModel);  //I forgot why this is needed vs just "ViewModel.init()";
google.maps.event.addDomListener(window, 'load', initMap(currentMarker()));
