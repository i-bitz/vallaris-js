var tmsLayers = [
    {
        "layer_label": "Thaichote",
        "layer_name": "Thaichote",
        "layer_description": "Thaichote",
        "service": [
            {
                "service_name": "TMS",
                "service_version": "1.6.0",
                "request_type": "GET_MAPTILE",
                "request_url": "http://go-tiles1.gistda.or.th/mapproxy/wmts/thaichote/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png"
            }
        ]
    }
];

var setting = {
    center: [100.4833, 13.7500],
    zoom: 6,
    map_service: {
        types: 'TMS',
        layers: tmsLayers
    }
};

new vallaris.maps.Map(setting);
