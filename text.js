const initialtext = reearth.block.property && reearth.block.property.default ? reearth.block.property.default.text || "" : "";
const html = `
<h1 id="text"></h1>
<style>
  html, body {
    margin: 0;
    background: transparent;
  }
</style>
<script>
  const cb = text => {
    document.getElementById("text").textContent = text;
  };
  addEventListener("message", e => {
    if (e.source !== parent) return;
    cb(e.data);
  });
  cb(${JSON.stringify(initialtext)});
</script>
`;

reearth.ui.show(html);
reearth.on("update", () => {
  const text = reearth.block.property && reearth.block.property.default ? reearth.block.property.default.text || "" : "";
  reearth.ui.postMessage(text);
});
