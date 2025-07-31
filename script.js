let data = [];

fetch('data/calibres.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    document.getElementById('calibreSearch').addEventListener('input', handleCalibreInput);
    document.getElementById('partSearch').addEventListener('input', handlePartInput);
  });

function handleCalibreInput(e) {
  const value = e.target.value.toLowerCase();
  const suggestions = document.getElementById('calibreSuggestions');
  suggestions.innerHTML = '';
  if (!value) {
    suggestions.style.display = 'none';
    return;
  }

  const matches = data.filter(c => c.name.toLowerCase().includes(value));
  matches.forEach(match => {
    const div = document.createElement('div');
    div.textContent = match.name;
    div.onclick = () => {
      document.getElementById('calibreSearch').value = match.name;
      suggestions.style.display = 'none';
      searchByCalibre(match.name);
    };
    suggestions.appendChild(div);
  });

  suggestions.style.display = matches.length ? 'block' : 'none';
}

function handlePartInput(e) {
  const value = e.target.value.toLowerCase();
  const suggestions = document.getElementById('partSuggestions');
  suggestions.innerHTML = '';
  if (!value) {
    suggestions.style.display = 'none';
    return;
  }

  const uniqueParts = new Set();
  data.forEach(c => c.parts.forEach(p => uniqueParts.add(p)));

  const matches = Array.from(uniqueParts).filter(p => p.toLowerCase().includes(value));
  matches.forEach(match => {
    const div = document.createElement('div');
    div.textContent = match;
    div.onclick = () => {
      document.getElementById('partSearch').value = match;
      suggestions.style.display = 'none';
      searchByPart(match);
    };
    suggestions.appendChild(div);
  });

  suggestions.style.display = matches.length ? 'block' : 'none';
}

function searchByCalibre(calibre) {
  const resultDiv = document.getElementById('results');
  resultDiv.innerHTML = '';
  const entry = data.find(c => c.name === calibre);
  if (entry) {
    let html = '<h3>' + entry.name + '</h3><ul>';
    entry.parts.forEach(part => {
      html += '<li>' + part + (entry.images[part] ? ' <img src="' + entry.images[part] + '" width="50">' : '') + '</li>';
    });
    html += '</ul>';
    resultDiv.innerHTML = html;
  }
}

function searchByPart(part) {
  const resultDiv = document.getElementById('results');
  resultDiv.innerHTML = '';
  const calibres = data.filter(c => c.parts.includes(part));
  if (calibres.length) {
    let html = '<h3>Part: ' + part + '</h3><ul>';
    calibres.forEach(c => {
      html += '<li>' + c.name + (c.images[part] ? ' <img src="' + c.images[part] + '" width="50">' : '') + '</li>';
    });
    html += '</ul>';
    resultDiv.innerHTML = html;
  }
}
