
let data = [];

fetch('data/calibres.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        document.getElementById('calibreSearch').addEventListener('input', searchByCalibre);
        document.getElementById('partSearch').addEventListener('input', searchByPart);
    });

function searchByCalibre() {
    const calibreInput = document.getElementById('calibreSearch').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (calibreInput === '') return;

    const match = data.find(entry => entry.name.toLowerCase() === calibreInput);
    if (match) {
        const html = `
            <div class="card">
                <h3>Calibre: ${match.name}</h3>
                <h4>Parts:</h4>
                ${match.parts.map(part => {
                    return \`<div><strong>\${part}</strong>\${match.images && match.images[part] ? '<br><img src="' + match.images[part] + '">' : ''}</div>\`;
                }).join('')}
            </div>`;
        resultsDiv.innerHTML = html;
    }
}

function searchByPart() {
    const partInput = document.getElementById('partSearch').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (partInput === '') return;

    const matchingCalibres = data.filter(entry => entry.parts.some(p => p.toLowerCase() === partInput));

    if (matchingCalibres.length > 0) {
        resultsDiv.innerHTML = matchingCalibres.map(calibre => {
            return \`
                <div class="card">
                    <h3>Part: ${partInput}</h3>
                    <p>Found in Calibre: <strong>\${calibre.name}</strong></p>
                    \${calibre.images && calibre.images[partInput] ? '<img src="' + calibre.images[partInput] + '">' : ''}
                </div>\`;
        }).join('');
    }
}
