const getText = () => reearth.widget.property && reearth.widget.property.default ? reearth.widget.property.default.text || "" : "";
const html = `
<style>
  body {
    margin: 0;
  }
  body.extendedh {
    width: 100%;
  }
  body.extendedv {
    height: 100%;
  }
  #wrapper {
    border: 2px solid blue;
    border-radius: 5px;
    background-color: rgba(111, 111, 111, 0.5);
    box-sizing: border-box;
    width: 300px;
  }
  .extendedh #wrapper {
    width: 100%;
  }
  .extendedv #wrapper {
    height: 100%;
  }
</style>
<div id="wrapper">
  <h1>Current ISS location</h1>
  <p>Latitude: <span id="lat">-</span></p>
  <p>Longitude: <span id="lon">-</span></p>
  <p>Altitude: <span id="alt">-</span>km</p>
  <p><button id="update">Update</button> <button id="jump">Jump</button> <button id="follow">Follow</button></p>
</div>
<script>
  let lat, lng, alt, timer;
  const update = () => {
    return fetch("https://api.wheretheiss.at/v1/satellites/25544").then(r => r.json()).then(data => {
      lat = data.latitude;
      lng = data.longitude;
      alt = data.altitude * 1000; // km -> m
      document.getElementById("lat").textContent = data.latitude;
      document.getElementById("lon").textContent = data.longitude;
      document.getElementById("alt").textContent = data.altitude;
    });
  };
  const send = () => {
    parent.postMessage({ lat, lng, alt }, "*");
  };

  document.getElementById("update").addEventListener("click", update);
  document.getElementById("jump").addEventListener("click", () => {
    if (lat === undefined) return;
    send();
  });
  document.getElementById("follow").addEventListener("click", (e) => {
    if (timer) {
      clearTimeout(timer);
      e.currentTarget.textContent = "Follow";
      return;
    }
    const cb = () => update().then(() => {
      send();
      timer = setTimeout(cb, 2000);
    });
    timer = setTimeout(cb, 2000);
    e.currentTarget.textContent = "Unfollow";
  });

  const extended = ${JSON.stringify(reearth.widget.extended)};
  if (extended) {
    document.body.classList.add("extended");
  }
  addEventListener("message", e => {
    if (e.source !== parent || !e.extended) return;
    if (e.extended.horizontally) {
      document.body.classList.add("extendedh");
    } else {
      document.body.classList.remove("extendedh");
    }
    if (e.extended.vertically) {
      document.body.classList.add("extendedv");
    } else {
      document.body.classList.remove("extendedv");
    }
  });

  update();
</script>
`;

reearth.ui.show(html);
reearth.on("update", () => {
  reearth.ui.postMessage({
    extended: reearth.widget.extended
  });
});
reearth.on("message", msg => {
  reearth.visualizer.camera.flyTo({
    lat: msg.lat,
    lng: msg.lng,
    alt: msg.alt,
    heading: 0,
    pitch: -Math.PI/2,
    roll: 0,
  }, {
    duration: 2
  });
});
