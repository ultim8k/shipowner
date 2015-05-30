$(document).ready(function () {
    var map = L.map('sea-map', {
        zoomControl: false
    }).setView([37.675, 24.851], 7);

    L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
        attribution: ':)',
        maxZoom: 18
    }).addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // add ports

    portsLayer.addTo(map);
    // map.addLayer(animatedMarker);
    // map.addLayer(line);
    setUpRoutes(routesLayer);
    shipsLayer.addTo(map);

});
// Icons
var shipIcon = L.icon({
    iconUrl: 'img/ship.png',
    iconSize: [48, 48],
    iconAnchor: [22, 48],
    popupAnchor: [-3, -76]
});

// Setting up layers

var portsLayer = L.geoJson(data.ports),
    routesLayer = L.geoJson(data.routes),
    shipsLayer = L.layerGroup();
    // line = L.polyline(routesLayer.getLayers()[0]._latlngs);
    // animatedMarker = L.animatedMarker(line.getLatLngs(), {
    //   icon: shipIcon,
    //   distance: 30000,  // meters
    //   interval: 2000 // milliseconds
      
    // });




function setUpRoutes(routes){
    var lines = routesLayer.getLayers();
    lines.forEach(function(line){
        var polyline = L.polyline(line._latlngs);
        var latlngs = polyline.getLatLngs();
        var arr = [];
        latlngs.forEach(function(count){
            arr.push(2000);
        });
        L.Marker.movingMarker(polyline.getLatLngs(),arr, {
          icon: shipIcon,
          // distance: 30000,  // meters
          // interval: 2000,
          autostart:true // milliseconds 
        }).addTo(shipsLayer);
    });

}
// ==========================================================
// ========================== DATA ==========================
// ==========================================================

