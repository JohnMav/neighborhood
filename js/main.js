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

//Global variables
var map;
var marker;
var markers = [];
var mapElement = document.getElementById('map');

//Default location where the map is initialized & centered.
var defaultLoc = ko.observable( {lat: locations[0].lat, lng: locations[0].lng, title: 'Default Boring'});

//Map options
var mapOptions = {
    center: defaultLoc(),
    zoom: 12
};

//Create map using Google api.
map = new google.maps.Map(mapElement, mapOptions);

var marker2Observable = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

var marker2Google = function(data) {
    return {
        positions: {
             lat: data().lat,
             lng: data().lng
         },
         title: data().title
    }
};

console.log("currentMarker is " + marker2Google(defaultLoc).title);

//var currentMarker = ko.computed(function() {
//    return {
//         positions: {
//             lat: defaultLoc().lat,
//             lng: defaultLoc().lng
//         },
//         title: defaultLoc().title
//    }
//    }, this);


//  VIEW-MODEL
// ==================================================

var initMap = function(pin) {
    console.log("initMap executed");
    // Default Marker
    //==================================================

    //Default location where the map is initialized & centered.  NOT KNOCKUTJS
    //var defaultLoc = ko.observable( {lat: locations[0].lat, lng: locations[0].lng, title: 'Default Boring'});

    //marker = new google.maps.Marker(defaultLoc());
    addMarker(pin);
    showMarkers();


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

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker(location);
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
       console.log(markers[i]);
    }
    console.log("==============");
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

var ViewModel = function () {

    console.log("ViewModel executed");
    var self = this; // Using self to access outer functions.

    // Get Locations
    //==================================================

    //Set current location.
    this.locList = ko.observableArray([]); //Initialize array of locations

    // Take the locations model, filter it through GoogleMarker function (make each property observable),
    // and add to the array of locations
    locations.forEach(function (loc) {
        self.locList.push(new marker2Observable(loc));
        defaultLoc(loc);
        console.log(defaultLoc());

        //console.log(marker2Observable(loc));
        addMarker(defaultLoc());
    });


    this.currentLoc = ko.observable(self.locList()[0]);

    console.log("currentLoc is:" + this.currentLoc().title);

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

        var updateMarker = ko.observable({
            //Calling defaultLoc from model
            position: {
                lat: self.currentLoc().lat,
                lng: self.currentLoc().lng
            },
            title: self.currentLoc().title
        });

        console.log("Markers deleted");
        console.log("clickedLoc = " + clickedLoc);
        addMarker(clickedLoc);
        showMarkers();

        //Really janky way of updating the markers based on clicks.
        //initMap(this.updateMarker());

        //Debug
        //console.log("Clicked Title = " + clickedLoc.title());
        //console.log("Clicked Lat = " + clickedLoc.lat());
        //console.log("Clicked Lng = " + clickedLoc.lng());
        //console.log("Current Title = " + self.currentLoc().title());
        //console.log("Current Lat = " + self.currentLoc().lat());
        //console.log("Current Lng = " + self.currentLoc().lng());
    };
    console.log("Viewmodel ended");
};

ko.applyBindings(new ViewModel);  //I forgot why this is needed vs just "ViewModel.init()";
google.maps.event.addDomListener(window, 'load', initMap(marker2Google(defaultLoc)));