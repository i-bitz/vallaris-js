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
