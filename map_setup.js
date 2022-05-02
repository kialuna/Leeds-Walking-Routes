// standard leaflet map setup
var lat = 53.82028051341155;  // Lat and Long coords on which initial map view will be centered, and initial zoom level
var lng = -1.5443547457634423;
var initialZoom = 11;
var sidebar;

function initialise() {

    function openRouteInfo(e) {
        sidebar.open("routes")
        console.log(e.target.feature.properties.Image)
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

    // // Citation: https://leafletjs.com/examples/geojson/
    function onEachFeature(feature, layer) {
        layer.on({
            click: openRouteInfo,
            mouseover: highlightRoute,
            mouseout: unhighlightRoute
        })
    }

    // calling map
    var map = L.map("map").setView([lat, lng], initialZoom);

    //Load tiles from open street map (you maybe have mapbox tiles here- this is fine) 
    // 
    


    // Citation for satellite image link: http://bl.ocks.org/d3noob/8663620
    mapLink =
        '<a href="http://www.esri.com/">Esri</a>';
    wholink =
        'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    var basemaps=[
    L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
        maxZoom: 18
        //add the basetiles to the map object	
    }),
     L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; ' + mapLink + ', ' + wholink,
        maxZoom: 18,
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

    L.geoJSON(routes, {
        onEachFeature: onEachFeature,
        style: myStyle
    }).addTo(map);



    // create the sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar' })
        .addTo(map)
        .open('home');

    // add panels dynamically to the sidebar
    // sidebar
    //     .addPanel({
    //         id: 'js-api',
    //         tab: '<i class="fa fa-gear"></i>',
    //         title: 'JS API',
    //         pane: '<p>The Javascript API allows to dynamically create or modify the panel state.<p/><p><button onclick="sidebar.enablePanel(\'mail\')">enable mails panel</button><button onclick="sidebar.disablePanel(\'mail\')">disable mails panel</button></p><p><button onclick="addUser()">add user</button></b>',
    //     })
    //     // add a tab with a click callback, initially disabled
    //     .addPanel({
    //         id: 'mail',
    //         tab: '<i class="fa fa-envelope"></i>',
    //         title: 'Messages',
    //         button: function () { alert('opened via JS callback') },
    //         disabled: true,
    //     })

    // be notified when a panel is opened
    // sidebar.on('content', function (ev) {
    //     switch (ev.id) {
    //         case 'autopan':
    //             sidebar.options.autopan = true;
    //             break;
    //         default:
    //             sidebar.options.autopan = false;
    //     }
    // });

    // var userid = 0
    // function addUser() {
    //     sidebar.addPanel({
    //         id: 'user' + userid++,
    //         tab: '<i class="fa fa-user"></i>',
    //         title: 'User Profile ' + userid,
    //         pane: '<p>user ipsum dolor sit amet</p>',
    //     });
    // }




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
