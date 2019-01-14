var wmsLayers = [
    {
        "layer_label": "Administrative Boundary",
        "layer_name": "Administrative",
        "layer_description": "Administrative Boundary of Thailand",
        "service": [
            {
                "service_name": "WMS",
                "service_version": "1.3.0",
                "request_type": "GET_MAP",
                "request_url": "https://water-s03.gistda.or.th/geoserver/SmallWaterArea/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:4326&WIDTH=256&HEIGHT=256&FORMAT=image/png&TILED=TRUE&STYLES&LAYERS=Administrative&BBOX=11.050048828125,98.9571533203125,19.491943359375,103.2132568359375"
            },
            {
                "service_name": "WMS",
                "service_version": "1.3.0",
                "request_type": "GET_INFORMATION",
                "request_url": "https://water-s03.gistda.or.th/geoserver/SmallWaterArea/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&CRS=EPSG:4326&FORMAT=image/png&TRANSPARENT=true&INFO_FORMAT=application/json&QUERY_LAYERS=Administrative&STYLES&LAYERS=Administrative&X=50&Y=50&WIDTH=101&HEIGHT=101&BBOX=11.050048828125,98.9571533203125,19.491943359375,103.2132568359375"
            }
        ]
    }
];

var setting = {
    center: [100.4833, 13.7500],
    zoom: 6,
    map_service: {
        types: 'WMS',
        layers: wmsLayers,
        info: true
    }
};

new vallaris.maps.Map(setting);
