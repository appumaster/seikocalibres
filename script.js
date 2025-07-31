let calibreData = [];

function renderCalibres() {
  const container = document.getElementById('calibre-list');
  container.innerHTML = "";
  calibreData.forEach(calibre => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card calibre-card">
        <img src="images/${calibre.image}" class="card-img-top" alt="${calibre.name}">
        <div class="card-body">
          <h5 class="card-title">${calibre.name}</h5>
          <p class="card-text">${calibre.description}</p>
          <strong>Compatible with:</strong>
          <ul>${calibre.compatible.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

fetch('data/calibres.json')
  .then(response => response.json())
  .then(data => {
    calibreData = data;
    renderCalibres();
  });

document.getElementById('new-calibre-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('calibre-name').value.trim();
  const description = document.getElementById('calibre-desc').value.trim();
  const image = document.getElementById('calibre-image').value.trim();
  const compatible = document.getElementById('calibre-compat').value.trim().split(',').map(x => x.trim()).filter(x => x);

  const newCalibre = { name, description, image, compatible };
  calibreData.push(newCalibre);
  renderCalibres();
  this.reset();
});


document.body.insertAdjacentHTML('beforeend', `
  <div class="container mt-4">
    <button id="export-json" class="btn btn-success">Download Updated Database (JSON)</button>
  </div>
`);

document.getElementById('export-json').addEventListener('click', () => {
  const jsonString = JSON.stringify(calibreData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "updated_calibres.json";
  a.click();

  URL.revokeObjectURL(url);
});
