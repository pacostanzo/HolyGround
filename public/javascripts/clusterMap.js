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
});
