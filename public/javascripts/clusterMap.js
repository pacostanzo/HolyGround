mapboxgl.accessToken = mapToken;
const jsonHolygrounds = JSON.parse(holygrounds);
const map = new mapboxgl.Map({
  container: 'cluster-map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [0, 0],
  zoom: 1,
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
  map.addSource('holygrounds', {
    type: 'geojson',
    data: jsonHolygrounds,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'holygrounds',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#f1f075',
      'circle-radius': 40,
    },
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'holygrounds',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Arial Unicode MS Bold'],
      'text-size': 12,
      'text-allow-overlap': true,
    },
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'holygrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#51bbd6',
      'circle-radius': 8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  });

  // inspect a cluster on click
  map.on('click', 'clusters', function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource('holygrounds')
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on('click', 'unclustered-point', function (e) {
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
  });

  map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
  });
});
