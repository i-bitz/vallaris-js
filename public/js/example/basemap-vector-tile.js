var setting = {
    center: [100.4833, 13.7500],
    zoom: 6,
    vector: [
        {
            "layer_label": "Vallaris Day",
            "layer_name": "VallarisDay",
            "url": "https://tile.i-bitz.co.th/data/v3/{z}/{x}/{y}.pbf",
            "style": "data/VallarisMapStyleDay.json"
        },
        {
            "layer_label": "Vallaris Night",
            "layer_name": "VallarisNight",
            "url": "https://tile.i-bitz.co.th/data/v3/{z}/{x}/{y}.pbf",
            "style": "data/VallarisMapStyleNight.json"
        }
    ]
};

new vallaris.maps.Map(setting);

// var tilegrid = ol.tilegrid.createXYZ({
//   tileSize: 512,
//   maxZoom: 12
// });
// var layer = new ol.layer.VectorTile({
//   source: new ol.source.VectorTile({
//     attributions: '© <a href="https://openmaptiles.org/">OpenMapTiles</a> ' +
//       '© <a href="http://www.openstreetmap.org/copyright">' +
//       'OpenStreetMap contributors</a>',
//     format: new ol.format.MVT(),
//     tileGrid: tilegrid,
//     tilePixelRatio: 8,
//     url: 'https://tile.i-bitz.co.th/data/v3/{z}/{x}/{y}.pbf'
//   })
// });
//
// var view = new ol.View({
//   // center: ol.proj.fromLonLat([100.4833, 13.7500]),
//   center: [11278073.044876881, 1447961.1795186712],
//   zoom: 5.72
// })
//
// var map = new ol.Map({
//   target: 'map',
//   view: view
// });
//
// var outputTab = document.getElementById('pills-output-tab');
// if (outputTab) {
//     outputTab.onclick = function() {
//         setTimeout(function() {
//             map.updateSize();
//         }, 200);
//     };
// }
//
// map.getView().calculateExtent(map.getSize());
//
// fetch('data/VallarisMapStyleDay.json').then(function(response) {
//   response.json().then(function(glStyle) {
//     olms.applyStyle(layer, glStyle, 'openmaptiles').then(function() {
//       map.addLayer(layer);
//     });
//   });
// });
