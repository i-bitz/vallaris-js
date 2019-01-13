loadScript('js/ol.js', mapInit);

var olmsUrl = 'js/olms.js';
window.vallaris = window.vallaris || {};
vallaris.maps = vallaris.maps || {};

window.app = {};
var app = window.app;

var map;
var view;
var source;
var vector;
var drawingFeature = [];
var drawingOutput = {
    "type": "FeatureCollection",
    "features": []
};

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
            if (callback) {
                callback();
            }
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
    mapServiceControl();
    baseMapControl();

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
            new app.AttributionControl(),
            new app.ZoomControl()
        ])
    });

    source = new ol.source.Vector({
        wrapX: false
    });
    vector = new ol.layer.Vector({
        source: source
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
        element.className = 'vallaris-attribution ol-unselectable vallaris-control';
        element.innerHTML = '&copy; <a href="https://vallaris.space/terms" target="_blank">Vallaris</a> map ';
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
        element.className = 'vallaris-zoom vallaris-btn-group ol-unselectable vallaris-control';

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

function baseMapControl() {
    app.BaseMapControl = function(opt_options, setting) {
        var options = opt_options || {};
        var layersHTML = '<ul class="base-map">';

        if (setting.raster) {
            var base_layers = setting.raster;

            var Default = new ol.layer.Group({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ]
            });

            var layerList = {};

            for (var i in base_layers) {
                if (base_layers.hasOwnProperty(i)) {
                    layerList[base_layers[i].layer_name] = new ol.layer.Group({
                        layers: [
                            new ol.layer.Tile({
                                source: new ol.source.XYZ({
                                    url: base_layers[i].url
                                })
                            })
                        ]
                    });
                }
            }
        }

        if (setting.vector) {
            var base_layers = setting.vector;

            var tilegrid = ol.tilegrid.createXYZ({
                tileSize: 512,
                maxZoom: 12
            });

            var Default = new ol.layer.VectorTile({
                source: new ol.source.VectorTile({
                    format: new ol.format.MVT(),
                    tileGrid: tilegrid,
                    tilePixelRatio: 8,
                    url: setting.vector[0].url
                })
            });

            var DefaultStyle = setting.vector[0].style;

            var layerList = {};

            for (var i in base_layers) {
                if (base_layers.hasOwnProperty(i)) {
                    layerList[base_layers[i].layer_name] = new ol.layer.VectorTile({
                        source: new ol.source.VectorTile({
                            format: new ol.format.MVT(),
                            tileGrid: tilegrid,
                            tilePixelRatio: 8,
                            url: base_layers[i].url
                        })
                    });
                }
            }

            // document.getElementById('BaseMapReset').click();
            // console.log(document.getElementById('BaseMapReset'));
        }

        if (base_layers) {
            for (var i in base_layers) {
                if (base_layers.hasOwnProperty(i)) {
                    if (base_layers[i].style) {
                        layersHTML += '<li><a href="#" id="' + base_layers[i].layer_name + '" onclick="setBaseMap(this)" data-style="' + base_layers[i].style + '">' + base_layers[i].layer_label + '</a></li>';
                    } else {
                        layersHTML += '<li><a href="#" id="' + base_layers[i].layer_name + '" onclick="setBaseMap(this)">' + base_layers[i].layer_label + '</a></li>';
                    }

                }
            }

            layersHTML += '</ul>';
        }

        var element = document.createElement('div');
        element.className = 'vallaris-base-map';

        var buttonGroup = document.createElement('div');
        buttonGroup.className = 'vallaris-btn-group ol-unselectable vallaris-control';

        var baseMapButton = document.createElement('button');
        baseMapButton.id = 'BaseMap';
        baseMapButton.type = 'button';
        baseMapButton.className = 'vallaris-btn';
        baseMapButton.innerHTML = '<i class="fas fa-map"></i>';

        var baseMapReset = document.createElement('button');
        baseMapReset.id = 'BaseMapReset';
        baseMapReset.type = 'button';
        baseMapReset.className = 'vallaris-btn';
        baseMapReset.innerHTML = '<i class="fas fa-eye-slash"></i>';

        var baseMap = document.createElement('div');
        baseMap.id = 'BaseMap';
        baseMap.innerHTML = layersHTML;
        baseMap.className = 'vallaris-base-map-layers d-none';

        buttonGroup.appendChild(baseMapReset);
        buttonGroup.appendChild(baseMapButton);

        element.appendChild(buttonGroup);
        element.appendChild(baseMap);

        baseMapButton.onclick = function() {
            baseMap.className = 'vallaris-base-map-layers';
        }

        baseMapReset.onclick = function() {
            baseMap.className = 'vallaris-base-map-layers d-none';

            if (DefaultStyle) {
                fetch(DefaultStyle).then(function(response) {
                    response.json().then(function(glStyle) {
                        olms.applyStyle(Default, glStyle, 'openmaptiles').then(function() {
                            map.getLayers().removeAt(0);
                            map.getLayers().insertAt(0, Default);
                        });
                    });
                });
            } else {
                map.getLayers().removeAt(0);
                map.getLayers().insertAt(0, Default);
            }
        }

        setBaseMap = function(element) {
            baseMap.className = 'vallaris-base-map-layers d-none';

            if (layerList[element.id].type === 'VECTOR_TILE') {
                fetch(element.dataset.style).then(function(response) {
                    response.json().then(function(glStyle) {
                        olms.applyStyle(layerList[element.id], glStyle, 'openmaptiles').then(function() {
                            map.getLayers().removeAt(0);
                            map.getLayers().insertAt(0, layerList[element.id]);
                        });
                    });
                });
            } else {
                map.getLayers().removeAt(0);
                map.getLayers().insertAt(0, layerList[element.id]);
            }
        }

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };

    ol.inherits(app.BaseMapControl, ol.control.Control);
}

function infoControl() {
    app.InfoControl = function(opt_options) {
        var options = opt_options || {};

        var element = document.createElement('div');
        element.id = 'info';
        element.className = 'vallaris-feature-info';

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };

    ol.inherits(app.InfoControl, ol.control.Control);
}

function mapServiceControl() {
    app.MapServiceControl = function(opt_options, setting) {
        var options = opt_options || {};

        // var mapLayers = setting.map_service.layers.data;
        var layersHTML = 'Here is the list of layers';

        // for (var i in mapLayers) {
        //     if (mapLayers.hasOwnProperty(i)) {
        //         // layersHTML += mapLayers[i];
        //         // console.log(mapLayers[i]);
        //     }
        // }

        // console.log(setting.map_service.layers);

        var element = document.createElement('div');
        element.id = 'mapservice';

        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'vallaris-map-service vallaris-btn-group ol-unselectable vallaris-control';

        var layerContainer = document.createElement('div');
        layerContainer.id = 'layers';
        layerContainer.className = 'vallaris-map-layers d-none';
        layerContainer.innerHTML = layersHTML;

        var layersButton = document.createElement('button');
        layersButton.id = 'MapService';
        layersButton.type = 'button';
        layersButton.className = 'vallaris-btn';
        layersButton.innerHTML = '<i class="fas fa-layer-group"></i>';

        var resetButton = document.createElement('button');
        resetButton.id = 'ResetMapService';
        resetButton.type = 'button';
        resetButton.className = 'vallaris-btn';
        resetButton.innerHTML = '<i class="fas fa-eye-slash"></i>';

        buttonContainer.appendChild(layersButton);
        buttonContainer.appendChild(resetButton);

        element.appendChild(layerContainer);
        element.appendChild(buttonContainer);

        resetButton.onclick = function() {
            layerContainer.className = 'vallaris-map-layers d-none';
        }

        layersButton.onclick = function() {
            layerContainer.className = 'vallaris-map-layers';
        }

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };

    ol.inherits(app.MapServiceControl, ol.control.Control);
}

function drawingControl() {
    app.DrawingControl = function(opt_options, setting) {
        var options = opt_options || {};

        var element = document.createElement('div');
        element.id = 'drawing';
        element.className = 'vallaris-drawing vallaris-btn-group ol-unselectable vallaris-control';

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

        var featureSaveButton = document.createElement('button');
        featureSaveButton.id = 'Save';
        featureSaveButton.type = 'button';
        featureSaveButton.className = 'vallaris-btn';
        featureSaveButton.innerHTML = '<i class="fas fa-save"></i>';

        if (setting.drawing.type) {
            var drawingType = setting.drawing.type;

            switch (drawingType) {
                case 'features':
                    element.appendChild(featurePointButton);
                    element.appendChild(featureLineStringButton);
                    element.appendChild(featurePolygonButton);
                    break;
                case 'point':
                    element.appendChild(featurePointButton);
                    break;
                case 'line':
                    element.appendChild(featureLineStringButton);
                    break;
                case 'polygon':
                    element.appendChild(featurePolygonButton);
                    break;
                default:
                    return;
            }

            element.appendChild(featureSaveButton);
            element.appendChild(featureNoneButton);

            ol.control.Control.call(this, {
                element: element,
                target: options.target
            });
        }
    };

    ol.inherits(app.DrawingControl, ol.control.Control);
}

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

            if (setting.dataset_vector) {
                map.addControl(new app.InfoControl());
                vallaris.maps.DatasetVectorTile(setting);
            }

            if (setting.drawing) {
                vallaris.maps.Drawing(setting);
            }

            if (setting.map_service) {
                vallaris.maps.MapServices(setting);
            }

            if (setting.raster) {
                vallaris.maps.BaseMapRaster(setting);
            }

            if (setting.vector) {
                loadScript(olmsUrl);
                vallaris.maps.BaseMapVector(setting);
                // console.log(document.getElementById('BaseMapReset'));

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

vallaris.maps.GetFeatureInfo = function(event) {
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

vallaris.maps.DatasetVectorTile = function(setting) {
    var tileToDisplay = new ol.layer.VectorTile({
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            url: setting.dataset_vector.url,
            zIndex: (setting.dataset_vector.zIndex) ? setting.dataset_vector.zIndex : 500
        })
    });

    map.on('click', vallaris.maps.GetFeatureInfo.bind(this));
    map.addLayer(tileToDisplay);

    if (setting.dataset_vector.bbox) {
        var tileBbox = ol.proj.transformExtent(setting.dataset_vector.bbox, 'EPSG:4326', 'EPSG:3857');
        map.getView().fit(tileBbox, map.getSize());
    }
}

vallaris.maps.Drawing = function(setting) {
    if (setting.drawing.type) {
        map.addControl(new app.DrawingControl(null, setting));

        var drawingPoint = document.getElementById('Point');
        var drawingLineString = document.getElementById('LineString');
        var drawingPolygon = document.getElementById('Polygon');
        var resetNone = document.getElementById('None');

        map.addLayer(vector);

        var modify = new ol.interaction.Modify({
            source: source
        });
        map.addInteraction(modify);

        if (drawingPoint) {
            var pointTool = new ol.interaction.Draw({
                source: source,
                type: 'Point'
            });

            var pointSnap = new ol.interaction.Snap({
                source: source
            });

            drawingPoint.onclick = function() {
                resetNone.click();
                map.addInteraction(pointTool);
                map.addInteraction(pointSnap);
            }

            pointTool.on('drawend', (evt) => {
                drawingAction(evt.feature);
            }, this);
        }

        if (drawingLineString) {
            var lineTool = new ol.interaction.Draw({
                source: source,
                type: 'LineString'
            });

            var lineSnap = new ol.interaction.Snap({
                source: source
            });

            drawingLineString.onclick = function() {
                resetNone.click();
                map.addInteraction(lineTool);
                map.addInteraction(lineSnap);
            }

            lineTool.on('drawend', (evt) => {
                drawingAction(evt.feature);
            }, this);
        }

        if (drawingPolygon) {
            var polygonTool = new ol.interaction.Draw({
                source: source,
                type: 'Polygon'
            });

            var polygonSnap = new ol.interaction.Snap({
                source: source
            });

            drawingPolygon.onclick = function() {
                resetNone.click();
                map.addInteraction(polygonTool);
                map.addInteraction(polygonSnap);
            }

            polygonTool.on('drawend', (evt) => {
                drawingAction(evt.feature);
            }, this);
        }

        modify.on('modifyend', (evt) => {
            var featureArray = evt.features.getArray();
            var arrayGeom = featureArray.map(feature => {
                return new ol.format.GeoJSON().writeFeatureObject(feature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857',
                    decimals: 7
                });
            });

            drawingFeature = arrayGeom;
        }, this);

        resetNone.onclick = function() {
            map.removeInteraction(pointTool);
            map.removeInteraction(lineTool);
            map.removeInteraction(polygonTool);

            map.removeInteraction(pointSnap);
            map.removeInteraction(lineSnap);
            map.removeInteraction(polygonSnap);
        }

        drawingAction = function(feature) {
            var arrayGeom = new ol.format.GeoJSON().writeFeatureObject(feature, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
                decimals: 7
            });

            drawingFeature.push(arrayGeom);
            resetNone.onclick();
        }

        document.getElementById('Save').onclick = function() {
            drawingOutput.features = drawingFeature;
            vallaris.maps.Download('map.json', JSON.stringify(drawingOutput, null, 2));
        }
    }
}

vallaris.maps.Download = function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

vallaris.maps.GeoTools = function(setting) {
    map.addControl(new mousePosition());
}

vallaris.maps.MapServices = function(setting) {
    if (setting.map_service.types) {
        map.addControl(new app.MapServiceControl(null, setting));
    }

    var stack = 1;

    switch (setting.map_service.types) {
        case 'WMS':
            var mapSource = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.TileWMS({
                    url: 'https://water-s03.gistda.or.th/geoserver/SmallWaterArea/wms',
                    params: {
                        'LAYERS': 'Administrative',
                        'TILED': true,
                        'FORMAT': 'image/png'
                    },
                    projection: 'EPSG:4326',
                    serverType: 'geoserver',
                    crossOrigin: 'anonymous'
                })
            });

            map.getLayers().insertAt(stack, mapSource);

            if (setting.map_service.info) {
                console.log('INFO');
            }
            break;
        case 'TMS':
            var mapSource = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.XYZ({
                    url: setting.map_service.layers[0].service[0].request_url
                })
            });

            map.getLayers().insertAt(stack, mapSource);
            break;
        default:
            return;
    }


    // map.addControl(new mousePosition());
}

vallaris.maps.BaseMapRaster = function(setting) {
    if (setting.raster) {
        map.addControl(new app.BaseMapControl(null, setting));
    }
}

vallaris.maps.BaseMapVector = function(setting) {
    if (setting.vector) {
        map.addControl(new app.BaseMapControl(null, setting));

        if (document.readyState === "complete") {
            setTimeout(function() {
                document.getElementById('BaseMapReset').click();
            }, 200);
        }
    }
}
