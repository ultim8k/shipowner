var openGameModal = function() {
    var $modal = $('.js_modal');
    $modal.removeClass('hidden');
};
var closeGameModal = function() {
    var $modal = $('.js_modal');
    $modal.addClass('hidden');
};
var prepareMap = function(){
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
    
    // asxhmooooo
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
    // Icons

    var shipIcon = L.icon({
        iconUrl: 'img/ship.png',
        iconSize: [48, 48],
        iconAnchor: [22, 48],
        popupAnchor: [-3, -76]
    });
        // setup Layers
    var portsLayer = L.geoJson(data.ports),
        routesLayer = L.geoJson(data.routes),
        shipsLayer = L.layerGroup();

        // add Layers to map
        portsLayer.addTo(map);
        setUpRoutes(routesLayer);
        shipsLayer.addTo(map);

};

var actionsEvents = function() {
    $('.js_ships_on_route').click(function () {
        openGameModal();
    });
    $('.js_close_modal').click(function () {
        closeGameModal();
    });
};



$(document).ready(function () {
    prepareMap();
    actionsEvents();
});







// ==========================================================
// ========================== DATA ==========================
// ==========================================================

