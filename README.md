# Vallaris Map JavaScript API

Vallaris Map Javascript API is the great set of APIs for building map application, rich data oriented application and Geographical based informative application.

This JavaScript API lets you customize maps with your own dataset and imagery for display on website and mobile application. The Maps JavaScript API features the following things:

- Vector Tile Map
- Raster Tile Map
- Map Services
- Geo Tools

The above mention features which you can modify using layers and styles, controls and events, and various services and libraries.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Simple base map</title>
        <link rel="stylesheet" href="https://cdn.vallaris.space/css/vallaris.css">
        <style>
            .map, body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <div id="map" class="map"></div>
        <script type="text/javascript" src="https://cdn.vallaris.space/js/vallaris.js"></script>
        <script type="text/javascript">
            var setting = {
                center: [100.4833, 13.7500],
                zoom: 6
            };

            new vallaris.maps.Map(setting);
        </script>
    </body>
</html>
```

Developer can download repository and start implementing the project from `/dist` folder.

Someone who want to collaborate they can folk and contribute `vallaris.js` file. 

Repo URL:
- Hosted in GitHub https://github.com/i-bitz/vallaris-js
- Hosted in GitLab https://vallaris.gitlab.io/javascript/
