const fs = require('fs');

try {
    const html1 = fs.readFileSync('c:/Users/TiuDasTreta/Desktop/Gerador de Propostas/template-proposta.js', 'utf8');
    const match = html1.match(/(<img src="data:image\/png;base64,[^>]+>)/);
    
    if (match) {
        let logo = match[1];
        if (!logo.includes('class="logo"')) {
           logo = logo.replace('<img', '<img class="logo"');
        }
        logo = `<div style="margin-bottom: 20px;">\n                ${logo}\n            </div>`;
        let html2 = fs.readFileSync('c:/Users/TiuDasTreta/Desktop/Gerador de Propostas/template-proposta-pdf.js', 'utf8');
        
        html2 = html2.replace('<h1>Proposta Comercial</h1>', `${logo}\n                <h1>Proposta Comercial</h1>`);
        
        fs.writeFileSync('c:/Users/TiuDasTreta/Desktop/Gerador de Propostas/template-proposta-pdf.js', html2);
        console.log('Logo injetada com sucesso!');
    } else {
        console.log('Logo não encontrada em template-proposta.js');
    }
} catch(err) {
    console.error('Erro:', err);
}
