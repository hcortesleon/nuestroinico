var map = L.map('map', {
    zoomControl:true, maxZoom:28, minZoom:1
}).fitBounds([[14.100862501736053,-87.21510876701394],[14.11425583506945,-87.18967817534717]]);
var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
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
document.querySelector(".leaflet-popup-pane").addEventListener("load", function(event) {
  var tagName = event.target.tagName,
    popup = map._popup;
  // Also check if flag is already set.
  if (tagName === "IMG" && popup && !popup._updated) {
    popup._updated = true; // Set flag to prevent looping.
    popup.update();
  }
}, true);
var bounds_group = new L.featureGroup([]);
function setBounds() {
}
map.createPane('pane_GoogleHybrid_0');
map.getPane('pane_GoogleHybrid_0').style.zIndex = 400;
var layer_GoogleHybrid_0 = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    pane: 'pane_GoogleHybrid_0',
    opacity: 1.0,
    attribution: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 20
});
layer_GoogleHybrid_0;
map.addLayer(layer_GoogleHybrid_0);
function pop_vacas_ejem_1(feature, layer) {
    var imagesHTML = feature.properties['Images'];
    var popupContent = '<table>\
            <tr>\
                <td colspan="2">' + (feature.properties['fid'] !== null ? autolinker.link(feature.properties['fid'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Fecha</th>\
                <td class="visible-with-data" id="Fecha">' + (feature.properties['Fecha'] !== null ? autolinker.link(feature.properties['Fecha'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Hora</th>\
                <td class="visible-with-data" id="Hora">' + (feature.properties['Hora'] !== null ? autolinker.link(feature.properties['Hora'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
              <td>' + (feature.properties['Imagen'] !== null ? '<img src="images/' + String(feature.properties['Imagen']).replace(/[\\/:]/g, '_').trim() + '">' : '') + '</td>\
            </tr>\
        </table>';
    layer.bindPopup(popupContent, {maxHeight: 200});

    // Add image to sidebar
    layer.on('click', function (e) {
      var url = imagesHTML.match(/src\s*=\s*"(.+?)"/)[1];
      document.getElementById('photo').innerHTML = '<img src="' + url + '" width="300" height="225">';
  });


    var popup = layer.getPopup();
    var content = popup.getContent();
    var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
    popup.setContent(updatedContent);
}

function style_vacas_ejem_1_0() {
    return {
        pane: 'pane_vacas_ejem_1',
        radius: 4.0,
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
var layer_vacas_ejem_1 = new L.geoJson(json_vacas_ejem_1, {
    attribution: '',
    interactive: true,
    dataVar: 'json_vacas_ejem_1',
    layerName: 'layer_vacas_ejem_1',
    pane: 'pane_vacas_ejem_1',
    onEachFeature: pop_vacas_ejem_1,
    pointToLayer: function (feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.circleMarker(latlng, style_vacas_ejem_1_0(feature));
    },
});
bounds_group.addLayer(layer_vacas_ejem_1);
map.addLayer(layer_vacas_ejem_1);
var baseMaps = {};
var overlaysTree = [
    {label: '<img src="legend/vacas_ejem_1.png" /> vacas_ejem', layer: layer_vacas_ejem_1},
    {label: "Google Hybrid", layer: layer_GoogleHybrid_0},]
var lay = L.control.layers.tree(null, overlaysTree,{
    //namedToggle: true,
    //selectorBack: false,
    //closedSymbol: '&#8862; &#x1f5c0;',
    //openedSymbol: '&#8863; &#x1f5c1;',
    //collapseAll: 'Collapse all',
    //expandAll: 'Expand all',
    collapsed: true,
});
lay.addTo(map);
setBounds();
