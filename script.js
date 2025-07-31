
let data;

fetch('data/calibres.json')
  .then(response => response.json())
  .then(json => { data = json; });

function autocomplete(inputId, suggestionId, key) {
  const input = document.getElementById(inputId);
  const suggestionBox = document.getElementById(suggestionId);

  input.addEventListener("input", function () {
    const val = this.value.toLowerCase();
    suggestionBox.innerHTML = '';
    if (!val) return;

    const seen = new Set();
    for (const calibre in data) {
      if (key === 'calibre') {
        if (calibre.toLowerCase().includes(val) && !seen.has(calibre)) {
          const div = document.createElement("div");
          div.textContent = calibre;
          div.onclick = () => {
            input.value = calibre;
            suggestionBox.innerHTML = '';
            searchByCalibre();
          };
          suggestionBox.appendChild(div);
          seen.add(calibre);
        }
      } else if (key === 'part') {
        for (const part of data[calibre].parts) {
          if (part.part.toLowerCase().includes(val) && !seen.has(part.part)) {
            const div = document.createElement("div");
            div.textContent = part.part;
            div.onclick = () => {
              input.value = part.part;
              suggestionBox.innerHTML = '';
              searchByPart();
            };
            suggestionBox.appendChild(div);
            seen.add(part.part);
          }
        }
      }
    }
  });
}

function searchByCalibre() {
  const input = document.getElementById("calibreSearch").value.trim();
  const results = document.getElementById("results");
  results.innerHTML = '';

  if (data[input]) {
    const html = `<h3>Parts in Calibre: ${input}</h3>` +
      data[input].parts.map(part =>
        `<div><strong>${part.part}</strong> - ${part.name || ''} <br>` +
        (part.image ? `<img src="${part.image}" alt="${part.part}" style="max-width:100px">` : '') +
        `</div><hr>`
      ).join('');
    results.innerHTML = html;
  } else {
    results.innerHTML = '<p>No matching calibre found.</p>';
  }
}

function searchByPart() {
  const partInput = document.getElementById("partSearch").value.trim();
  const results = document.getElementById("results");
  results.innerHTML = '';

  const matchingCalibres = [];
  for (const calibre in data) {
    for (const part of data[calibre].parts) {
      if (part.part === partInput) {
        matchingCalibres.push({
          calibre,
          image: part.image || '',
          name: part.name || ''
        });
        break;
      }
    }
  }

  if (matchingCalibres.length) {
    const html = `<h3>Calibres using Part: ${partInput}</h3>` +
      matchingCalibres.map(c =>
        `<div><strong>${c.calibre}</strong> ${c.name}<br>` +
        (c.image ? `<img src="${c.image}" alt="${partInput}" style="max-width:100px">` : '') +
        `</div><hr>`
      ).join('');
    results.innerHTML = html;
  } else {
    results.innerHTML = '<p>No matching part found in database.</p>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  autocomplete("calibreSearch", "calibreSuggestions", "calibre");
  autocomplete("partSearch", "partSuggestions", "part");
});
