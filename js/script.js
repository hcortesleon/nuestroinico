document.addEventListener('DOMContentLoaded', function () {
    // Crear el mapa
    var map = L.map('map', {
        zoomControl: true, maxZoom: 28, minZoom: 1
    }).fitBounds([[14.100862501736053, -87.21510876701394], [14.11425583506945, -87.18967817534717]]);

    var hash = new L.Hash(map);

    map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot');

    var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

    // Definir el sidebar
    var sidebar = document.getElementById('sidebar');

    // Función para mostrar las fotos y comentarios en el sidebar
    function updateSidebarWithPhotos(features, markers) {
        var photosContainer = document.getElementById('photos-container');
        if (!photosContainer) {
            console.error("photosContainer no encontrado");
            return;
        }

        photosContainer.innerHTML = ''; // Limpiar el contenedor

        features.forEach(function (feature, index) {
            var url = 'images/' + String(feature.properties['Imagen']).replace(/[\\/:]/g, '_').trim();
            var comment = feature.properties['Comentario'] !== null ? feature.properties['Comentario'] : '';

            var photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = '<img src="' + url + '" width="300" height="225" title="' + comment + '">\
                                   <div class="photo-comment">' + comment + '</div>';

            // Añadir evento para resaltar marcador y foto
            photoItem.addEventListener('mouseover', function () {
                var marker = markers[index];
                marker.setStyle({ color: 'blue', fillColor: 'yellow' });
                map.setView(marker.getLatLng(), 16);
            });

            photoItem.addEventListener('mouseout', function () {
                var marker = markers[index];
                marker.setStyle(style_vacas_ejem_1_0());
            });

            photosContainer.appendChild(photoItem);

            // Añadir referencia de la foto al marcador
            markers[index].photoItem = photoItem;
        });
    }

    // Función para filtrar y obtener las características
    function getFeatures() {
        return json_vacas_ejem_1.features; // Obtener todas las características del GeoJSON
    }

    // Definir la función removeEmptyRowsFromPopupContent
    function removeEmptyRowsFromPopupContent(content, feature) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        var rows = tempDiv.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var td = rows[i].querySelector('td.visible-with-data');
            var key = td ? td.id : '';
            if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
                rows[i].parentNode.removeChild(rows[i]);
            }
        }
        return tempDiv.innerHTML;
    }

    // Definir la función pop_vacas_ejem_1 y agregar los eventos
    function pop_vacas_ejem_1(feature, layer) {
        var popupContent = '<div class="popup-content">\
                <p><strong>Fecha:</strong> ' + (feature.properties['Fecha'] !== null ? autolinker.link(feature.properties['Fecha'].toLocaleString()) : '') + '</p>\
                <p><strong>Hora:</strong> ' + (feature.properties['Hora'] !== null ? autolinker.link(feature.properties['Hora'].toLocaleString()) : '') + '</p>\
            </div>';
        layer.bindPopup(popupContent, {maxHeight: 200});

        var popup = layer.getPopup();
        var content = popup.getContent();
        var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
        popup.setContent(updatedContent);

        // Añadir evento para resaltar foto correspondiente al pasar el ratón sobre el marcador
        layer.on('mouseover', function () {
            if (layer.photoItem) {
                layer.photoItem.style.border = '2px solid blue';
                layer.photoItem.style.backgroundColor = 'yellow';
            }
        });

        layer.on('mouseout', function () {
            if (layer.photoItem) {
                layer.photoItem.style.border = '';
                layer.photoItem.style.backgroundColor = '';
            }
        });

        // Añadir evento para centrar la foto al hacer clic en el marcador
        layer.on('click', function () {
            if (layer.photoItem) {
                layer.photoItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Definir el estilo y agregar el layer
    function style_vacas_ejem_1_0() {
        return {
            pane: 'pane_vacas_ejem_1',
            radius: 6.0,
            opacity: 1,
            color: 'rgba(35,35,35,1.0)',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1,
            fill: true,
            fillOpacity: 1,
            fillColor: 'rgba(183,72,75,1.0)',
            interactive: true,
        }
    }

    map.createPane('pane_vacas_ejem_1');
    map.getPane('pane_vacas_ejem_1').style.zIndex = 401;
    map.getPane('pane_vacas_ejem_1').style['mix-blend-mode'] = 'normal';

    var markers = [];
    var layer_vacas_ejem_1 = new L.geoJson(json_vacas_ejem_1, {
        attribution: '',
        interactive: true,
        dataVar: 'json_vacas_ejem_1',
        layerName: 'layer_vacas_ejem_1',
        pane: 'pane_vacas_ejem_1',
        onEachFeature: function (feature, layer) {
            pop_vacas_ejem_1(feature, layer);
            markers.push(layer);
        },
        pointToLayer: function (feature, latlng) {
            var context = {
                feature: feature,
                variables: {}
            };
            return L.circleMarker(latlng, style_vacas_ejem_1_0(feature));
        },
    });

    var bounds_group = new L.featureGroup([]);
    bounds_group.addLayer(layer_vacas_ejem_1);
    map.addLayer(layer_vacas_ejem_1);

    var baselayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var esri_img = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var humanitarian_layer = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">' +
            'OpenStreetMap Contributors </a> Tiles \u00a9 HOT'
    }).addTo(map);

    var baseMaps = {};
    var overlaysTree = [
        {label: '<img src="legend/vacas_ejem_1.png" /> Lugares Visitados', layer: layer_vacas_ejem_1},
        {label: "OpenStreetMap Humanitario", layer: humanitarian_layer},
        {label: "OpenStreetMap Comun", layer: baselayer},
        {label: "ESRI", layer: esri_img},
    ];

    var lay = L.control.layers.tree(null, overlaysTree, {
        selectorBack: true,
        closedSymbol: '&#8862; &#x1f5c0;',
        collapsed: true,
    });
    lay.addTo(map);

    // Inicializar el sidebar con las fotos y comentarios
    updateSidebarWithPhotos(getFeatures(), markers);
});

