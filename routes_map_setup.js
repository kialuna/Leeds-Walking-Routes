/*
Javascript for Blue Plaques website (Task 5.3)
Student number: 201578549
*/



// First some global variables are defined



var lat = 53.82028051341155;  // Lat and Long coords on which initial map view will be centered, and initial zoom level
var lng = -1.5443547457634423;
var initialZoom = 11;
var map;
//var sidebar;


// Citation: https://leafletjs.com/examples/geojson/
// function onEachFeature(feature, layer) {
//     // does this feature have a property named popupContent?
//     if (feature.properties) {
//         layer.bindPopup("<b>Description:</b>" + feature.properties.Description +
//             "<br><b>Length: </b>" + String(feature.properties.Length) + " km");
//     }
//     //layer.on("click",function(e){
//        // sidebar.setContent('hi');
    
//     // coords=feature.getLatLngs()
//     // console.log(coords)
// }


function onEachFeature(feature, layer) {
    layer.on("click",function(e){
        document.getElementById("sidebar").innerHTML="testy test test";
        sidebar.show()
    });

}

// Initialize function creates the map onload 

function initialise() {
    // calling map
    var map = L.map("map").setView([lat, lng], initialZoom);

    // Adding sidebar citation: https://github.com/Turbo87/leaflet-sidebar
    var sidebar = L.control.sidebar(document.getElementById("sidebar"), {
        position: 'left'
        
    });

    //document.getElementById("sidebar").innerHTML="Walks in Leeds";
    
    map.addControl(sidebar);

    

    setTimeout(function () {
        sidebar.show();
    }, 500);

    map.on('click', function () {
        sidebar.toggle();
    })
    


    //Load tiles from open street map (you maybe have mapbox tiles here- this is fine) 
    L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
        maxZoom: 18
        //add the basetiles to the map object	
    }).addTo(map);

    L.geoJSON(routes, {
        onEachFeature: onEachFeature
    }).addTo(map);



    // CODE BASED ON https://stackoverflow.com/questions/42939633/how-to-draw-a-polyline-using-the-mouse-and-leaflet-js
    // Initialise the FeatureGroup to store editable layers
    var drawnRoute = new L.FeatureGroup();
    map.addLayer(drawnRoute);

    var options = {
        position: 'topleft',
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#f357a1',
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
        drawnRoute.addLayer(layer);
        // Citation: https://gis.stackexchange.com/questions/422864/getting-total-length-of-polyline-from-leaflet-draw
        var coords = layer.getLatLngs();
        console.log(coords.length)
        var dist = 0;

        for (var i = 0; i < coords.length - 1; i++) {
            dist += coords[i].distanceTo(coords[i + 1]);
            console.log(dist);
        }
        layer.bindPopup("Your route of length " + String((dist / 1000).toFixed(2) + "km")).openPopup();


    });

}
