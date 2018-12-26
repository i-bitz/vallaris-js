loadScript('js/ol.js', mapInit);
// loadScript('/js/mapbox-streets-v6-style.js', mapboxVectorTile);

window.vallaris = window.vallaris || {};
vallaris.maps = vallaris.maps || {};

window.app = {};
var app = window.app;

var map;
var view;

function loadScript(src, callback) {
    var s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
        if (!r && (!this.readyState || this.readyState == 'complete')) {
            r = true;
            callback();
        }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
}

function mapInit() {
    attributionControl();
    zoomControl();
    infoControl();
    drawingControl();

    view = new ol.View({
        center: ol.proj.fromLonLat([100.4833, 13.7500]),
        zoom: 6
    });

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: view,
        controls: ol.control.defaults({
            attribution: false,
            zoom: false,
            rotate: false
        }).extend([
            // new mousePosition(),
            new app.AttributionControl(),
            new app.ZoomControl(),
            new app.InfoControl()
        ])
    });

    window.onresize = function() {
        setTimeout(function() {
            map.updateSize();
        }, 200);
    }

    var outputTab = document.getElementById('pills-output-tab');
    if (outputTab) {
        outputTab.onclick = function() {
            setTimeout(function() {
                map.updateSize();
            }, 200);
        };
    }

    map.getView().calculateExtent(map.getSize());
}

function attributionControl() {
    app.AttributionControl = function(opt_options) {
        var options = opt_options || {};

        var element = document.createElement('div');
        element.className  = 'vallaris-attribution ol-unselectable vallaris-control';
        element.innerHTML  = '&copy; <a href="https://vallaris.space/terms" target="_blank">Vallaris</a> map ';
        element.innerHTML += '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.';

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };

    ol.inherits(app.AttributionControl, ol.control.Control);
}

function zoomControl() {
    app.ZoomControl = function(opt_options) {
        var options = opt_options || {};

        var element = document.createElement('div');
        element.className = 'vallaris-zoom vallris-btn-group ol-unselectable vallaris-control';

        var zoomInButton = document.createElement('button');
        zoomInButton.id = 'ZoomIn';
        zoomInButton.type = 'button';
        zoomInButton.className = 'vallaris-btn';
        zoomInButton.innerHTML = '<i class="fas fa-plus"></i>';

        var zoomOutButton = document.createElement('button');
        zoomOutButton.id = 'ZoomOut';
        zoomOutButton.type = 'button';
        zoomOutButton.className = 'vallaris-btn';
        zoomOutButton.innerHTML = '<i class="fas fa-minus"></i>';

        var vallarisZoomIn = function(e) {
            e.preventDefault();
            var definedZoom = Math.round(map.getView().getZoom()) + 1;

            if (definedZoom <= 20) {
                view.setZoom(definedZoom);
            }
        };

        var vallarisZoomOut = function(e) {
            e.preventDefault();
            var definedZoom = Math.round(map.getView().getZoom()) - 1;

            if (definedZoom >= 2) {
                view.setZoom(definedZoom);
            }
        };

        zoomInButton.addEventListener('click', vallarisZoomIn, false);
        zoomInButton.addEventListener('touchstart', vallarisZoomIn, false);
        zoomOutButton.addEventListener('click', vallarisZoomOut, false);
        zoomOutButton.addEventListener('touchstart', vallarisZoomOut, false);

        element.appendChild(zoomInButton);
        element.appendChild(zoomOutButton);

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };

    ol.inherits(app.ZoomControl, ol.control.Control);
}

function infoControl() {
    app.InfoControl = function(opt_options) {
        var options = opt_options || {};

        var element = document.createElement('div');
        element.id = 'info';
        element.className = 'vallris-feature-info';

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };

    ol.inherits(app.InfoControl, ol.control.Control);
}

function drawingControl() {
    app.DrawingControl = function(opt_options, setting) {
        var options = opt_options || {};

        var element = document.createElement('div');
        element.id = 'drawing';
        element.className = 'vallaris-drawing vallris-btn-group ol-unselectable vallaris-control';
        // element.innerHTML = '<div class="btn-group btn-group-toggle" data-toggle="buttons">\
        //   <label class="btn btn-secondary active">\
        //     <input type="radio" name="drawingOption" id="Point" autocomplete="off" checked> Active\
        //   </label>\
        //   <label class="btn btn-secondary">\
        //     <input type="radio" name="drawingOption" id="LineString" autocomplete="off"> Radio\
        //   </label>\
        //   <label class="btn btn-secondary">\
        //     <input type="radio" name="drawingOption" id="Polygon" autocomplete="off"> Radio\
        //   </label>\
        // </div>';

        var featurePointButton = document.createElement('button');
        featurePointButton.id = 'Point';
        featurePointButton.type = 'button';
        featurePointButton.className = 'vallaris-btn';
        featurePointButton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';

        var featureLineStringButton = document.createElement('button');
        featureLineStringButton.id = 'LineString';
        featureLineStringButton.type = 'button';
        featureLineStringButton.className = 'vallaris-btn';
        featureLineStringButton.innerHTML = '<i class="fas fa-route"></i>';

        var featurePolygonButton = document.createElement('button');
        featurePolygonButton.id = 'Polygon';
        featurePolygonButton.type = 'button';
        featurePolygonButton.className = 'vallaris-btn';
        featurePolygonButton.innerHTML = '<i class="fas fa-draw-polygon"></i>';

        var featureNoneButton = document.createElement('button');
        featureNoneButton.id = 'None';
        featureNoneButton.type = 'button';
        featureNoneButton.className = 'vallaris-btn';
        featureNoneButton.innerHTML = '<i class="fas fa-hand-paper"></i>';

        if (setting.drawing.type) {
            var drawingType = setting.drawing.type;

            switch (drawingType) {
                case 'features':
                    element.appendChild(featurePointButton);
                    element.appendChild(featureLineStringButton);
                    element.appendChild(featurePolygonButton);
                    element.appendChild(featureNoneButton);
                    break;
                case 'point':
                    element.appendChild(featurePointButton);
                    element.appendChild(featureNoneButton);
                    break;
                case 'line':
                    element.appendChild(featureLineStringButton);
                    element.appendChild(featureNoneButton);
                    break;
                case 'polygon':
                    element.appendChild(featurePolygonButton);
                    element.appendChild(featureNoneButton);
                    break;
                default:
                    return;
            }

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        }
    };

    ol.inherits(app.DrawingControl, ol.control.Control);
}

// document.getElementById('Point').onclick = function() {alert('Hello')};

function mousePosition() {
    var mousePosition = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(2),
        projection: 'EPSG:4326',
        className: 'vallaris-mouse-position',
        undefinedHTML: '&nbsp;'
    });

    return mousePosition;
}

function mapboxVectorTile() {
    console.log('Tile should load');
}


vallaris.maps.Map = function(setting) {
    document.onreadystatechange = function() {
        if (document.readyState === "complete") {
            vallaris.maps.Positioning(setting);

            if (setting.vector) {
                vallaris.maps.DatasetVectorTile(setting);
            }

            if (setting.drawing) {
                vallaris.maps.Drawing(setting);
            }
        }
    }
}

vallaris.maps.Positioning = function(setting) {
    if (setting.center) {
        view.setCenter(ol.proj.fromLonLat(setting.center));
    }

    if (setting.zoom) {
        view.setZoom(setting.zoom);
    }
}

vallaris.maps.GetFeatureInfo = function (event) {
    var info = document.getElementById('info');
    var features = map.getFeaturesAtPixel(event.pixel);

    if (!features) {
        info.innerHTML = '';
        info.style.opacity = 0;
        return;
    }

    var properties = features[0].getProperties();
    var infoProperties = JSON.parse(JSON.stringify(properties, null, 2));

    var infoTable = '<table class="vallaris">';
    for (x in infoProperties) {
        infoTable += '<tr><td>' + x + '</td><td>' + infoProperties[x] + '</td></tr>';
    }
    infoTable += '</table>';

    info.innerHTML = infoTable;
    info.style.opacity = 1;
}

vallaris.maps.DatasetVectorTile = function (setting) {
    var tileToDisplay = new ol.layer.VectorTile({
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            url: setting.vector.url,
            zIndex: (setting.vector.zIndex) ? setting.vector.zIndex : 500
        })
    });

    map.on('click', vallaris.maps.GetFeatureInfo.bind(this));
    map.addLayer(tileToDisplay);

    if (setting.vector.bbox) {
        var tileBbox = ol.proj.transformExtent(setting.vector.bbox, 'EPSG:4326', 'EPSG:3857');
        map.getView().fit(tileBbox, map.getSize());
    }
}

vallaris.maps.Drawing = function (setting) {
    if (setting.drawing.type) {
        map.addControl(new app.DrawingControl(null, setting));

        var drawingPoint = document.getElementById('Point');
        var drawingLineString = document.getElementById('LineString');
        var drawingPolygon = document.getElementById('Polygon');
        var resetNone = document.getElementById('None');
        var source = new ol.source.Vector({wrapX: false});

        var vector = new ol.layer.Vector({
          source: source
        });

        map.addLayer(vector);

        if (drawingPoint) {
            var pointTool = new ol.interaction.Draw({
                source: source,
                type: 'Point'
            });

            drawingPoint.onclick = function () {
                resetNone.click();
                map.addInteraction(pointTool);
            }
        }

        if (drawingLineString) {
            var lineTool = new ol.interaction.Draw({
                source: source,
                type: 'LineString'
            });

            drawingLineString.onclick = function () {
                resetNone.click();
                map.addInteraction(lineTool);
            }
        }

        if (drawingPolygon) {
            var polygonTool = new ol.interaction.Draw({
                source: source,
                type: 'Polygon'
            });

            drawingPolygon.onclick = function () {
                resetNone.click();
                map.addInteraction(polygonTool);
            }
        }

        resetNone.onclick = function () {
            map.removeInteraction(pointTool);
            map.removeInteraction(lineTool);
            map.removeInteraction(polygonTool);
        }
    }
}

vallaris.maps.GeoTools = function (setting) {
    map.addControl(new mousePosition());
}

vallaris.maps.MapServices = function (setting) {
    map.addControl(new mousePosition());
}
