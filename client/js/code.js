var map;

var map_theme = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#dde6e8"},{"visibility":"on"}]}];

function displayCurrentLocation(zoom) {
    GMaps.geolocate({
        success: function (position) {
            map.setCenter(position.coords.latitude, position.coords.longitude);
            if(zoom) {
                map.setZoom(14);
            }
        },
        error: function (error) {
            console.log('Geolocation failed: ' + error.message);
        },
        not_supported: function () {
            console.log("Your browser does not support geolocation");
        }
    });
}

function loadResults (data) {
    var items, markers_data = [];
    if (data.length > 0) {
        items = data;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item.lat != undefined && item.long != undefined) {
                var icon = url_website + 'assets/images/marker.png';

                markers_data.push({
                    id : item.id,
                    lat : item.lat,
                    lng : item.long,
                    //title : item.name,
                    icon : {
                        size : new google.maps.Size(32, 32),
                        url : icon
                    },
                    infoWindow: {
                        content: '<p>' + item.complete + '</p>'
                    }
                });
            }
        }
    }

    map.addMarkers(markers_data);
}

$(document).ready(function () {
    map = new GMaps({
        div: '#map',
        lat: -34.6036844,
        lng: -58.381559100000004,
        scrollwheel: false,
        zoom: 9
    });

    map.addStyle({
        styledMapName:"Styled Map",
        styles: map_theme,
        mapTypeId: "map_style"
    });

    map.setStyle("map_style");

    var xhr = $.getJSON(url_website + 'places');
    xhr.done(loadResults);

    displayCurrentLocation(false);

    // resize map height
    $(window).on("resize", function() {
        $('#map').css({'height': window.innerHeight - 160});
    });

    // trigger resize
    $(window).resize();

    $('.timepicker').timepicker();

    GMaps.prototype.markerById=function(id){
        for(var m=0;m<this.markers.length;++m){
            if(this.markers[m].get('id')===id){
                return this.markers[m];
            }
        }
        return new google.maps.Marker();
    }

    $.get(url_website + 'places', function(data){
        $(".search-places").typeahead({
            source: data,
            updater: function(item) {
                map.setCenter(item.lat, item.long);
                map.setZoom(15);
                google.maps.event.trigger(map.markerById(item.id), 'click');
                $('.search-places').blur();
                $('.search-places').delay(500).val('');
            },
            templates: {
                empty: [
                    '<div class="empty-message">No se encontraron centros</div>'
                ].join('\n')
            }
        });
    },'json');

    $('.show-form').on('click', function() {
        $('.floating-form').toggleClass('active');
        if($('.floating-about').hasClass('active')) {
            $('.floating-about').toggleClass('active');
        }
    });

    $('.show-info').on('click', function() {
        $('.floating-about').toggleClass('active');
    });

    $('.current-location').on('click', function() {
        displayCurrentLocation(true);
    });
});
