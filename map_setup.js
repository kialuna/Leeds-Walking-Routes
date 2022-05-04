/*
 * Project: Web Based GIS Assignment 2
 * File: map_setup.js
 * File Created: Sunday, 1st May 2022 2:35:02 pm
 * Student Number: 201578549
 * -----
 * Last Modified: Wednesday, 4th May 2022 12:24:00 pm
 * -----
 * License: MIT
 */


var lat = 53.82028051341155;  // Lat and Long coords on which initial map view will be centered, and initial zoom level
var lng = -1.5443547457634423;
var initialZoom = 13;
var sidebar;
userRoutes=new Array();
userRoutesLayer=L.layerGroup()

function initialise() {

    /** Add route info to routes panel*/
    function openRouteInfo(e) {
        sidebar.open("routes")
        document.getElementById('routes_info').innerHTML = "<h1>" + e.target.feature.properties.Description +
            "</h1><br><br><b>Length: </b>" + String(e.target.feature.properties.Length) + " km <br><br><img id='images' src="
            + e.target.feature.properties.Image + ">";
    }
    /** Set style of highlighted route */
    function highlightRoute(e) {
        e.target.setStyle({
            weight: 5,
            color: '#fa8072'
        })
    }
    /** Reset style of route */
    function unhighlightRoute(e) {
        e.target.setStyle(myStyle)
    }
    /** Zoom to bounds of route clicked on, with left-hand padding to allow for sidebar */
    function zoomRoute(e) {

        bounds = e.target.getBounds();
        console.log(String(bounds));
        map.fitBounds(bounds, { paddingTopLeft: [400, 0] });
    }
    /** Functions which apply to each feature
     *  Citation: https://leafletjs.com/examples/geojson/
     */
    function onEachFeature(feature, layer) {
        layer.on("click", function (e) {
            zoomRoute(e);
            openRouteInfo(e);
        });
        layer.on({
            mouseover: highlightRoute,
            mouseout: unhighlightRoute
        });
    }

    // calling map
    var map = L.map("map").setView([lat, lng], initialZoom);

    /** Load tiles from open street map and Google */
    var basemaps = [
        L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
            maxZoom: 20
        }),

        // Citation: https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer

        L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        })

    ]
    /** Add plugin basemap control */
    map.addControl(L.control.basemaps({
        basemaps: basemaps,
        tileX: 0,
        tileY: 0,
        tileZ: 1
    }));

    /** Set route style */
    myStyle = {
        weight: 2,
        color: '#ff4040'
    }
    /** Pass routes into four geoJSON layers  */
    var allRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle
    }).addTo(map)

    var longRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle,
        filter: function (feature, layer) {
            if (feature.properties.Length >= 4)
                return true
        }
    });

    var medRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle,
        filter: function (feature, layer) {
            if (feature.properties.Length < 4 && feature.properties.Length >= 2)
                return true
        }
    });

    var shortRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle,
        filter: function (feature, layer) {
            if (feature.properties.Length < 2)
                return true
        }
    });

    /**
     * The following section of code is an attempt to fetch the user's submitted routes, 
     * then turn them back into GeoJSON features to be displayed on the map. 
     * This is not currently working, and I suspect it might be because of all the weird characters 
     * in the 'stringified' geojson feature groups interfere with the code.
     */
    // console.log('hello?')
    // $.getJSON("fetchRoutes.php", function(results){
    //     console.log(results.length)
    //     for (var i=0; i<results.length; i++){
    //         userRoutes.push({
    //             route: results[i].route,
    //             description: results[i].description
    //         });
    //     }

    //     console.log(userRoutes)

    //     routeParse();
    //     userRoutesLayer.addTo(map)
    // })

    // function routeParse(){
    //     for (var i=0; i<userRoutes.length; i++){
    //         console.log(userRoutes[i].route)
    //         userRoutesLayer.addLayer(
    //             L.geoJSON(JSON.parse(userRoutes[i].route))

    //         )


    //     }
    // }

    /** Create layers variable with each layer given proper names */
    var layers = {
        "All Routes": allRoutes,
        "&gt 4 km": longRoutes,
        "2 km - 4 km": medRoutes,
        "&lt 2 km": shortRoutes,
        "User Routes": userRoutesLayer
    }
    /** Add layer control */
    L.control.layers(layers, null, { collapsed: false }).addTo(map);

    /**
     * Geolocation code based on : https://leafletjs.com/examples/mobile/
    The below code adds geolocation functionality which unfortunately does not work on insecure sites. 
    This code may be added in future if site is moved to HTTPS.

    function onLocationFound(e) {
        L.marker(e.latlng).addTo(map)
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);
    map.on('onLocationFound',onLocationFound);

    map.locate() 
    */

    /** Create the sidebar instance and add it to the map 
     * Citation: https://github.com/noerw/leaflet-sidebar-v2
     * */
    var sidebar = L.control.sidebar({ container: 'sidebar', autopan: true })
        .addTo(map)
        .open('home');


    /**
     * Initialise the FeatureGroup to store editable layers
     * Citation: https://stackoverflow.com/questions/42939633/how-to-draw-a-polyline-using-the-mouse-and-leaflet-js
     */
    var drawnRoute = new L.FeatureGroup();
    map.addLayer(drawnRoute);

    var options = {
        position: 'topleft',
        draw: {
            polyline: {
                shapeOptions: { // Set style
                    color: '#0000ff',
                    weight: 2
                }
            },
            // disable toolbar items by setting them to false
            circle: false,
            polygon: false,
            marker: false,
            rectangle: false,
        },
        edit: {
            featureGroup: drawnRoute,
            remove: true
        }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);

    function submitRoute(layer) {
        var stringRoute = JSON.stringify(layer.toGeoJSON());
        console.log(stringRoute)
    }

    map.on('draw:created', function (e) {
        var layer = e.layer;
        var type = e.layerType;
        drawnRoute.addLayer(layer);

        // Citation: https://gis.stackexchange.com/questions/422864/getting-total-length-of-polyline-from-leaflet-draw
        var coords = layer.getLatLngs();
        console.log(coords.length)
        var dist = 0;
        for (var i = 0; i < coords.length - 1; i++) {
            dist += coords[i].distanceTo(coords[i + 1]);
            console.log(dist);
        }
        sidebar.open("drawRoute")
        document.getElementById('draw_text').innerHTML = "<h3>Your route is " + String((dist / 1000).toFixed(2)) +
            " km long.</h3> ";

      
        document.getElementById('routeForm').style.display = "block";

        var stringRoute = JSON.stringify(layer.toGeoJSON());
            console.log(stringRoute);
        $("#froute").val(stringRoute)
        //document.getElementById('submitRouteButton').onclick=submitRoute(layer)


        // var shape = layer.toGeoJSON()
        // var shape_for_db = JSON.stringify(shape);
        // console.log(shape_for_db)
        // // restore
        // L.geoJSON(JSON.parse(shape_for_db)).addTo(map);


    });


}
