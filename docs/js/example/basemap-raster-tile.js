var setting = {
    center: [100.4833, 13.7500],
    zoom: 6,
    raster: [
        {
            "layer_label": "Open street map",
            "layer_name": "OSM",
            "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        {
            "layer_label": "Black & white",
            "layer_name": "OSM_BW",
            "url": "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        },
        {
            "layer_label": "Vallaris Raster",
            "layer_name": "VallarisRaster",
            "url": "https://tile.i-bitz.co.th/styles/vallaris/{z}/{x}/{y}.png"
        }
    ]
};

new vallaris.maps.Map(setting);
