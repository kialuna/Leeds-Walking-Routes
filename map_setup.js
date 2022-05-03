// standard leaflet map setup
var lat = 53.82028051341155;  // Lat and Long coords on which initial map view will be centered, and initial zoom level
var lng = -1.5443547457634423;
var initialZoom = 13;
var sidebar;

function initialise() {

    function openRouteInfo(e) {
        sidebar.open("routes")
        document.getElementById('routes_info').innerHTML = "<h1>" + e.target.feature.properties.Description +
            "</h1><br><br><b>Length: </b>" + String(e.target.feature.properties.Length) + " km <br><br><img id='images' src="
            + e.target.feature.properties.Image + ">";
    }

    function highlightRoute(e) {
        e.target.setStyle({
            weight: 5,
            color: '#fa8072'
        })
    }
    function unhighlightRoute(e) {
        e.target.setStyle(myStyle)
    }

    function zoomRoute(e) {

        bounds = e.target.getBounds();
        console.log(String(bounds));
        map.fitBounds(bounds, { paddingTopLeft: [400, 0] });
    }

    // // Citation: https://leafletjs.com/examples/geojson/
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

    //Load tiles from open street map (you maybe have mapbox tiles here- this is fine) 
    // 



    var basemaps = [
        L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
            maxZoom: 18
            //add the basetiles to the map object	
        }),

        // Citation: https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
        // Code written by user capie69
        // Accessed on: 03/05/2022

        L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        })

    ]

    map.addControl(L.control.basemaps({
        basemaps: basemaps,
        tileX: 0,
        tileY: 0,
        tileZ: 1
    }));


    myStyle = {
        weight: 2,
        color: '#ff4040'
    }

    var allRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle
    }).addTo(map)

    var longRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle,
        filter: function (feature, layer) {
            if (feature.properties.Length > 4)
                return true
        }
    });

    var medRoutes = L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle,
        filter: function (feature, layer) {
            if (feature.properties.Length < 3)
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

    // Give layers proper names
    var layers = {
        "All Routes": allRoutes,
        "Long Routes": longRoutes,
        "Medium Routes": medRoutes,
        "Short Routes": shortRoutes
    }
    // Add layer control
    L.control.layers(layers, null, { collapsed: false }).addTo(map);

    // Geolocation code based on : https://leafletjs.com/examples/mobile/
    // The below code adds geolocation functionalitym which unfortunately does not work on insecure sites. This code may be added in future if site is moved to HTTPS

    // function onLocationFound(e) {
    //     L.marker(e.latlng).addTo(map)
    // }

    // function onLocationError(e) {
    //     alert(e.message);
    // }

    // map.on('locationerror', onLocationError);
    // map.on('onLocationFound',onLocationFound);

    // map.locate()






    // create the sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar', autopan: true })
        .addTo(map)
        .open('home');


    // CODE BASED ON https://stackoverflow.com/questions/42939633/how-to-draw-a-polyline-using-the-mouse-and-leaflet-js
    // Initialise the FeatureGroup to store editable layers
    var drawnRoute = new L.FeatureGroup();
    map.addLayer(drawnRoute);

    var options = {
        position: 'topleft',
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#0000ff',
                    weight: 2
                }
            },
            // disable toolbar item by setting it to false
            circle: false, // Turns off this drawing tool
            polygon: false,
            marker: false,
            rectangle: false,
        },
        edit: {
            featureGroup: drawnRoute, //REQUIRED!!
            remove: true
        }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        var layer = e.layer;
        var type=e.layerType;
        drawnRoute.addLayer(layer);

        // Citation: https://gis.stackexchange.com/questions/422864/getting-total-length-of-polyline-from-leaflet-draw
        var coords = layer.getLatLngs();
        console.log(coords.length)
        var dist = 0;
        for (var i = 0; i < coords.length - 1; i++) {
            dist += coords[i].distanceTo(coords[i + 1]);
            console.log(dist);
        }
        sidebar.open("routes")
        document.getElementById('routes_info').innerHTML = "<br><h3>Your route of length " + String((dist / 1000).toFixed(2)) + " km </h3>";

        // var shape = layer.toGeoJSON()
        // var shape_for_db = JSON.stringify(shape);
        // console.log(shape_for_db)
        // // restore
        // L.geoJSON(JSON.parse(shape_for_db)).addTo(map);


    });

    function onSubmit(){
        document.getElementById('routes_info').innerHTML = "Thanks for your feedback!";

    }

}
