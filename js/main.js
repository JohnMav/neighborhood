var Model = [];

var ViewModel = {

    init: function() {
        var map; //Initialize Google Maps
    },

    // Google Maps.  Called from html JS.
    googleMap: function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 47.6063889, lng: -122.3308333},
                zoom: 8
        });
    }
};

var View = {
    init: function() {
    }
};

//Start the JS code
ViewModel.init();





