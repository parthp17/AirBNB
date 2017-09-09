// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gmapService', [])
    .factory('gmapService', function () {

        // Initialize Variables
        // Service this factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Default Location (initialize to center of America)
        var defaultLat = 39.50;
        var defaultLong = -98.35;

        // Functions
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function (latitude, longitude, data) {

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            defaultLat = latitude;
            defaultLong = longitude;

            // Convert the results into Google Map Format
            locations = convertToMapPoints(data);

            // Then initialize the map.
            initialize();

        };// refresh ends here!

        // Private Inner Functions
        // Convert a JSON of properties into map points
        var convertToMapPoints = function (data) {

            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for (var i = 0; i < data.length; i++) {
                var property = data[i];

                // Create popup windows for each record
                var contentString =
                    '<p><b>Title</b>: ' + property.title +
                    '<br><b>Description</b>: ' + property.description +
                    '<br><b>Price</b>: ' + property.price +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(property.latitude, property.longitude),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    title: property.title,
                    description: property.description,
                    price: property.price
                });
            }

            // location is now an array populated with records in Google Maps format
            return locations;
        };

        // draws an SVG(Scalable Vector Graphics) marker icon
        var drawIcon = function (color) {
            return {
                path: 'M 0,0 L 20,0 L 20,10 L 12,10 L 10,12 L 8,10 L 0,10 Z',
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#000', //black
                strokeWeight: 0.3,
                scale: 2
            };
        };

        // Initializes the map
        var initialize = function () {

            // Uses the selected lat, long as starting point
            var defaultLatLng = {lat: defaultLat, lng: defaultLong};

            // If map has not been created already...
            if (!map) {
                // Create a new map and place in the index.html page
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 12,
                    center: defaultLatLng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }

            // Set initial location as a bouncing red marker
            var initialLocation = new google.maps.LatLng(defaultLat, defaultLong);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // Define the circle
            circle = new google.maps.Circle({
                map: map,
                clickable: false,
                // 10 miles in metres
                radius: 16093.4,
                fillColor: '#fff',
                fillOpacity: .1,
                strokeColor: '#313131',
                strokeOpacity: .4,
                strokeWeight: .8
            });
            // Attach circle to marker
            circle.bindTo('center', marker, 'position');

            var bounds = circle.getBounds();

            // Loop through each location in the array and place a marker
            locations.forEach(function (n, i) {
                if (bounds.contains(n.latlon)) {

                    var marker = new MarkerWithLabel({
                        position: n.latlon,
                        map: map,
                        labelContent: "$" + n.price,
                        labelClass: "price_marker", // the CSS class for the label
                        labelInBackground: false,
                        icon: drawIcon('#FF5A5F')  // airbnb marker color
                    });

                    // For each marker created, add a listener that checks for clicks
                    google.maps.event.addListener(marker, 'click', function (e) {

                        // When clicked, open the selected marker's message
                        currentSelectedMarker = n;
                        n.message.open(map, marker);
                    });

                }
            });

        }; // intialize ends here

        // // Refresh the page upon window load. Use the initial latitude and longitude
        // google.maps.event.addDomListener(window, 'load',
        //     googleMapService.refresh(defaultLat, defaultLong, defaultRes));

        return googleMapService;
    });
