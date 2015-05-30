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
