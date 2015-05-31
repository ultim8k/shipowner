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




// Models

function Player (data) {
    this.name = data.name;
    this.companyName = data.companyName;
    this.cash = 100000000;
    this.ageGroup = data.ageGroup;
    this.fleet = [];
    this.level = 1;

    //methods

    this.addToFleet = function(ship){
        this.fleet.push(ship);
    };

}

function Game () {

}

Game.prototype.init = function init () {

    var playerData = (function(){
        var name = $('#playerName').text(),
            companyName = $('#companyName').text(),
            ageGroup = $('#ageGroup').val(),
            obj = {
                name: name,
                companyName: companyName,
                ageGroup: ageGroup
            };
        return obj;
    })();

    this.player = new Player(playerData);
    this.ticks = 0;
    // Game loop

    this._intervalId = setInterval(this.tick, 1000 / 50);

}

Game.prototype.tick = function tick () {
    this.ticks ++
    console.log('tick' + this.ticks);

}

function Ship (data) {
    this.name = data.name;
    this.timer = function(time,cb) {
        setTimeout()

    }

    this.gt = data.gt;
    this.dwt = data.dwt;
    this.loa = data.loa;
    this.purchaseCost = data.purchaseCost;
    this.fuel = {
        consumption: data.fuel.consumption,
        remaining : data.fuel.consumption,
        capacity : data.fuel.capacity
    };
    this.broken = false;
    this.typeOf = data.class;
    this.crew = data.crew;
    this.maintenanceCost = function(){
        var fuelCost = 0;
        var crewCost = this.crew * 45; // euros per day
        var serviceCost = 0;

        if (this.remaining > this.fuel.consumption) {
         fuelCost = this.fuel.consumption * Game.getCommodityPrice('fuel');
        }
        if (this.broken) {serviceCost = 0}

    }

}

function Commodity (data) {
    this.name = data.name;
    this.price = data.price;
}

function Event (data) {

}

function Decision (data) {

}



// ==========================================================
// ========================== DATA ==========================
// ==========================================================

