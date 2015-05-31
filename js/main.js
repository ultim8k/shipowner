var openGameModal = function() {
    var $modal = $('.js_modal');
    $modal.removeClass('hidden');
};
var closeGameModal = function() {
    var $modal = $('.js_modal');
    $modal.addClass('hidden');
};

var updateModalMarkup = function(markup) {
    var $modal = $('.js_modal_body');
    $modal.html(markup);
};
var renderFleetItem = function(data) {
    var markup = '';
    markup = '<div class="js_fleet_item fleet-item"><img class="fleet-item__image" src="img/' + data.shipType + '"><span class="fleet-item__vessel-count js_vessel_count">'+ data.shipCount + '</span><span class="fleet-item__vessel-count fleet-item__vessel-count--available js_available_count">' + data.availableCount + '</span></div>';
    return markup;
};

var prepareMap = function(){
    var map = L.map('sea-map', {
        zoomControl: false
    }).setView([37.675, 24.851], 7);

    L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
        attribution: '&#9875;',
        maxZoom: 18
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    // asxhmooooo
    function setUpRoutes(routes){
        var lines = routesLayer.getLayers();
        lines.forEach(function(line){
            var polyline = L.polyline(line._latlngs);
            var latlngs = polyline.getLatLngs();
            var arr = [];
            for (var i = 0; i<latlngs.length-1; i++) {
                var distance = latlngs[i].distanceTo(latlngs[i+1])

                arr.push(Math.floor(distance / 10));

            }
            line.fullDistance = arr.reduce(function(prev,cur){
                return prev + cur;
            }) / 100;
            console.log(line.fullDistance);


            L.Marker.movingMarker(latlngs,arr, {
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
    var portIcon = L.icon({
        iconUrl: 'img/anchor.png',
        iconSize: [32,32]
    });
        // setup Layers
    var portsLayer = L.geoJson(data.ports,{
            onEachFeature: function(feature,layer){
                layer.setIcon(portIcon);
                layer.bindPopup('<h5>'+feature.properties.name+'</h5>');
            }
        }),
        routesLayer = L.geoJson(data.routes),
        shipsLayer = L.layerGroup();

        // add Layers to map
        portsLayer.addTo(map);
        setUpRoutes(routesLayer);
        shipsLayer.addTo(map);

};

var listAvailableShips = function() {
    var markup = '';
    markup = '<div class=""><p><img src="img/cargo13.png"/>You\'ve got 3 cargo ships available.</p></div>';
    updateModalMarkup(markup);
    return false;
};

var listBusyShips = function() {
    var markup = '';
    markup = '<div class=""><p><img src="img/cargo13.png"/>You\'ve got 1 cargo ship on the go from Piraeus to Heraklion.<br>It will be available in <span class="js_remaining_time">1 minute</span>.</p><div class="timed-loader"><div class="timed-loader__percentage js_percentage"></div></div></div>';
    updateModalMarkup(markup);
    updateLoaderBasedOnTime('', '2015-05-30T19:43:35.618Z');
    return false;
};

var listAvailableClients = function() {
    // hey
    return false;
};

listNotifications = function() {
    var markup = '';
    markup = '<div class=""><p>You have no new notifications</p></div>';
    updateModalMarkup(markup);
    return false;
};

var updateLoaderBasedOnTime = function(timeElapsed, totalTimeNeeded) {
    // var startingTime = new Date(timeElapsed);
    var endingTime = new Date(totalTimeNeeded);

    setInterval(function () {
        var currentTime = new Date();
        console.log(currentTime.getSeconds());
        var timeString = endingTime.toISOString();
        console.log(moment(timeString).fromNow());
    }, 6000);
    $('.js_percentage').width('70%');
    return false;
};

var promptToBuyShip = function() {
    var markup = '<div class="js_ship_for_sale">';
    var shipList = Ship.prototype.types;
    shipList.forEach(function (shipType) {
        markup += '<ul class="ship-for-sale__details"><li>Ship type:' + shipType.typeOf + '</li>'+
        '<li>GT:' + shipType.gt +'</li>'+
        '<li>DWT:' + shipType.dwt +'</li>'+
        '<li>LOA:' + shipType.loa +'</li>'+
        '<li>Fuel capacity:' + shipType.fuel.capacity +'</li>'+
        '<li>Fuel consumption:' + shipType.fuel.consumption +'</li>'+
        '<li>COST:' + shipType.purchaseCost +'</li>'+
        '</ul>';
        markup += '<div><span class="buy-ship js_buy_ship" data-ship-type="'+ shipType.typeOf +'">Buy</span></div></div>';
    });

    updateModalMarkup(markup);

    $('.js_buy_ship').off();
    $('.js_buy_ship').on('click', function () {
        var $buy = $(this);
        var shipType = $buy.data('ship-type');
        var shipObj = _.where(Ship.prototype.types, {typeOf: shipType});
        game.player.buyShip(shipObj[0]);
        $buy.text('Ship bought!');
        setTimeout(function () {
            $buy.text('Buy');
        }, 300);
    });

    openGameModal();
};

var loginPlayer = function () {
    var $playerNameField = $('.js_firstname_input');
    var $companyNameField = $('.js_companyname_input');
    var $playerAgeField = $('.js_age_input');
    var playerName = $playerNameField.val();
    var companyName = $companyNameField.val();
    var playerAge = $playerAgeField.val();
    var valid = $playerNameField && $playerNameField.length && $companyNameField && $companyNameField.length && $playerAgeField && $playerAgeField.length && playerName && playerAge && companyName;
    if(!valid) { return false; }
    var player = new Player({
        name: playerName,
        companyName: companyName,
        ageGroup: playerAge
    });
    window.game = new Game(player);
    $('.js_player_name').text(playerName);
    $('.js_company_name').text(companyName);
    $('.js_initial_screen').addClass('hidden');
    promptToBuyShip();
};

var actionsEvents = function() {
    $('.js_ships_on_route').click(function () {
        openGameModal();
        listBusyShips();
    });
    $('.js_ships_available').click(function () {
        openGameModal();
        listAvailableShips();
    });
    $('.js_clients').click(function () {
        openGameModal();
    });
    $('.js_notifications').click(function () {
        openGameModal();
        listNotifications();
    });
    $('.js_close_modal').click(function () {
        closeGameModal();
        updateModalMarkup('');
    });
    $('.js_player_login').click(function () {
        loginPlayer();
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

    this.availableFleet = function(type){
        var totalCount = 0;
        var availableCount = 0;
        this.fleet.forEach(function(ship){
            if (ship.typeOf === type) count ++
            if (ship.isAvailable) availablecount ++
        });

        return {
            shipType: type,
            shipCount: totalCount,
            availableCount: availableCount
        }
    };

    this.fleetChargeMoney = function(){

        var outsideFleet = this.fleet.filter(function(ship){
            return ship.isAvailable === false;
        });
        outsideFleet.forEach(function(ship){
            this.cash -= ship.maintenanceCost();
        });
    }

}

Player.prototype.buyShip = function buyShip (data) {
    var ship = new Ship({
        name: data.name,
    })
    this.cash -= ship.cost;
    this.addToFleet(ship);
}

function Game (player) {
    this.player = player;
}

Game.prototype.init = function init () {


    this.ticks = 0;
    // Game loop

    this._intervalId = setInterval(this.tick, 5000);

}

Game.prototype.tick = function tick () {
    // check ships outside of port
    this.player.fleetChargeMoney();
    var cash = this.player.cash;
    $('.js_user_cash').text(cash);
}

function Ship (data) {
    this.name = data.name;


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
    this.typeOf = data.typeOf;
    this.crew = data.crew;
    this.maintenanceCost = function(){
        var fuelCost = 0;
        var crewCost = this.crew * 45; // euros per day
        var serviceCost = 0;

        if (this.remaining > this.fuel.consumption) {
         fuelCost = this.fuel.consumption * Game.getCommodityPrice('fuel');
        }
        if (this.broken) {serviceCost = 0}

        return fuelCost + crewCost;
    }


}

Ship.prototype.acceptOffer = function acceptOffer (offer) {

    this.startRoute(offer.route);

}

Ship.prototype.types = [
    {
        typeOf: 'Handymax',
        crew: 10,
        purchaseCost: 35000000,
        fuel: {
            consumption: 30,
            remaining: 0,
            capacity: 400
        },
        gt: 35000,
        dwt: 40000,
        loa: 170
    },
    {
        typeOf: 'Panamax',
        crew: 12,
        purchaseCost: 4400000,
        fuel: {
            consumption: 32,
            remaining: 0,
            capacity: 450
        },
        gt: 43000,
        dwt: 65000,
        loa: 210
    },
    {
        typeOf: 'Capesize',
        crew: 16,
        purchaseCost: 55000000,
        fuel: {
            consumption: 35,
            remaining: 0,
            capacity: 500
        },
        gt: 68000,
        dwt: 95000,
        loa: 292
    }
];
Ship.prototype.startRoute = function startRoute (route) {
    this.isAvailable = false;

     // Fuel consumption
}

function Commodity (data) {
    this.name = data.name;
    this.price = data.price;
}

function gameEvent (data) {
    this.title = data.title;
    this.description = data.description;
    this.effect = data.effect;
    this.fire = function(){
        this.effect.call(this.effect);
    }
}

function Decision (data) {

}




// ==========================================================
// ========================== DATA ==========================
// ==========================================================

