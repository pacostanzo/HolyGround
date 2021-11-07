mapboxgl.accessToken = mapToken;
currentGeometry = JSON.parse(geometry);
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: currentGeometry.coordinates,
  zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(currentGeometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${title}</h3><p>${currentLocation}</p>`
    )
  )
  .addTo(map);
