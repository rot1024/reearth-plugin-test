const getText = () => reearth.widget.property && reearth.widget.property.default ? reearth.widget.property.default.text || "" : "";
const html = `
<div id="wrapper">
<h1>Current ISS location</h1>
<p>Latitude: <span id="lat">-</span></p>
<p>Longitude: <span id="lon">-</span></p>
<p>Altitude: <span id="alt">-</span>km</p>
<p><button id="update">Update</button> <button id="jump">Jump!</button></p>
</div>
<style>
  html, body {
    margin: 0;
    background: transparent;
  }
  #wrapper {
    border: 2px solid blue;
    border-radius: 5px;
    background-color: rgba(111, 111, 111, 0.5);
  }
</style>
<script>
  let lat, lng, alt;
  const update = () => {
    fetch("https://api.wheretheiss.at/v1/satellites/25544").then(r => r.json()).then(data => {
      lat = data.latitude;
      lon = data.longitude;
      alt = data.altitude;
      document.getElementById("lat").textContent = data.latitude;
      document.getElementById("lon").textContent = data.longitude;
      document.getElementById("alt").textContent = data.altitude;
    });
  };
  document.getElementById("update").addEventListener("click", update);
  document.getElementById("update").addEventListener("click", () => {
    if (lat === undefined) return;
    parent.postMessage({ lat, lng, alt }, "*");
  });
  update();
</script>
`;

reearth.ui.show(html);
reearth.on("message", msg => {
  reearth.visualizer.camera.flyTo({
    lat: msg.lat,
    lng: msg.lng,
    alt: msg.alt,
    heading: 0,
    pitch: 90,
    roll: 0,
  }, {
    duration: 2000
  });
});
