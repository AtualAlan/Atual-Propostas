// Autenticação obrigatória para acessar o gerador
requireAuth();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('proposal-form');
    const segmentSelect = document.getElementById('segment');
    const toolsGrid = document.getElementById('toolsGrid');
    
    // Inicia os dados do DB
    const dbTools = getTools();
    const dbSegments = getSegments();
    
    // Renderiza os Segmentos
    segmentSelect.innerHTML = `<option value="" disabled selected>Selecione um segmento...</option>` + 
        dbSegments.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        
    // Renderiza as Ferramentas
    toolsGrid.innerHTML = dbTools.map(t => `
        <div class="form-group" style="margin-top: 10px;">
            <label class="checkbox-label" style="width: fit-content; background: transparent; padding: 0;">
                <input type="checkbox" value="${t.id}"> ${t.name}
            </label>
        </div>
    `).join('');
    
    const checkboxes = toolsGrid.querySelectorAll('input[type="checkbox"]');
    
    const outputContainer = document.getElementById('proposalOutput');
    const emptyState = document.querySelector('.empty-state');
    
    const btnExportHtml = document.getElementById('btnExportHtml');
    const btnExportPdf = document.getElementById('btnExportPdf');
    
    const toggleMobileView = document.getElementById('toggleMobileView');
    const toggleDesktopView = document.getElementById('toggleDesktopView');
    const previewContainer = document.getElementById('previewContainer');

    let currentProposalHtml = '';
    let loadedProposalId = null;
    let loadedProposalStatus = null;

    // Carregar dados salvos localmente
    const loadSavedData = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const loadPropId = urlParams.get('load');
        
        if (loadPropId) {
            const props = getProposals();
            const prop = props.find(p => p.id === loadPropId);
            if (prop && prop.data) {
                loadedProposalId = prop.id;
                loadedProposalStatus = prop.status;
                const data = prop.data;
                document.getElementById('clientName').value = data.clientName || '';
                document.getElementById('clientCNPJ').value = data.clientCNPJ || '';
                document.getElementById('contactName').value = data.contactName || '';
                document.getElementById('implCost').value = data.implCost || '';
                document.getElementById('monthlyFee').value = data.monthlyFee || '';
                document.getElementById('implTime').value = data.implTime || '';
                document.getElementById('migratedSystem').value = data.migratedSystem || '';
                if (data.hasMigration !== undefined) document.getElementById('hasMigration').checked = data.hasMigration;
                
                if (data.segmentLabel) {
                    const matchedSeg = dbSegments.find(s => s.name === data.segmentLabel);
                    if(matchedSeg) segmentSelect.value = matchedSeg.id;
                }
                
                if (data.tools && Array.isArray(data.tools)) {
                    const toolIds = data.tools.map(t => t.id);
                    checkboxes.forEach(cb => {
                        cb.checked = toolIds.includes(cb.value);
                    });
                }
                
                // Auto preview after a small delay to ensure DOM is ready
                setTimeout(() => document.getElementById('btnPreview').click(), 100);
            }
        }
    };
    loadSavedData();

    // Quando mudar o segmento, auto-seleciona as ferramentas recomendadas
    segmentSelect.addEventListener('change', (e) => {
        const segKey = e.target.value;
        if (!segKey) return;
        
        const segment = dbSegments.find(s => s.id === segKey);
        if(!segment) return;
        
        checkboxes.forEach(cb => {
            cb.checked = segment.defaultTools.includes(cb.value);
        });
    });

    // Calculadora Mágica Bidirecional (Salário Mínimo)
    const percInput = document.getElementById('calcPerc');
    const feeInput = document.getElementById('monthlyFee');

    if (percInput && feeInput) {
        const baseSM = getSettings().minimumWage;

        const updateFeeFromPerc = () => {
            const percVal = parseFloat(percInput.value.replace(',', '.'));
            if (!isNaN(percVal) && percVal > 0) {
                const calcResult = (baseSM * (percVal / 100)).toFixed(2);
                feeInput.value = calcResult.replace('.', ',');
            } else if (percInput.value === '') {
                feeInput.value = '';
            }
        };

        const updatePercFromFee = () => {
            // Remove tudo que não for dígito, vírgula ou ponto, para evitar erros de digitação (ex: R$)
            let rawVal = feeInput.value.replace(/[^\d,.-]/g, '');
            const feeVal = parseFloat(rawVal.replace(/\./g, '').replace(',', '.'));
            if (!isNaN(feeVal) && feeVal > 0) {
                const calcPercResult = ((feeVal / baseSM) * 100).toFixed(2);
                percInput.value = calcPercResult.replace('.', ',');
            } else if (feeInput.value === '') {
                percInput.value = '';
            }
        };

        // Eventos de digitação
        percInput.addEventListener('input', updateFeeFromPerc);
        feeInput.addEventListener('input', updatePercFromFee);
        
        // Dispara o cálculo inicial caso o valor da mensalidade (teste) já esteja preenchido no HTML
        if (feeInput.value) {
            updatePercFromFee();
        }
    }

    // Formatar valores financeiros (simples)
    const formatCurrencyInput = (el) => {
        el.addEventListener('blur', (e) => {
            let val = e.target.value;
            if(val && !val.includes(',')) {
                e.target.value = val + ',00';
            }
        });
    };
    formatCurrencyInput(document.getElementById('implCost'));
    formatCurrencyInput(document.getElementById('monthlyFee'));

    // Geração do Preview
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const segKey = segmentSelect.value;
        const segmentInfo = dbSegments.find(s => s.id === segKey);
        
        const selectedToolsData = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => {
                const dbTool = dbTools.find(t => t.id === cb.value);
                return {
                    name: cb.value,
                    desc: dbTool ? dbTool.desc : "Módulo adicional para potencializar sua gestão.",
                    img: dbTool ? dbTool.img : ""
                };
            });

        const data = {
            clientName: document.getElementById('clientName').value,
            clientCNPJ: document.getElementById('clientCNPJ').value,
            contactName: document.getElementById('contactName').value,
            implCost: document.getElementById('implCost').value,
            monthlyFee: document.getElementById('monthlyFee').value,
            implTime: document.getElementById('implTime').value,
            migratedSystem: document.getElementById('migratedSystem').value,
            hasMigration: document.getElementById('hasMigration').checked,
            segmentLabel: segmentInfo ? segmentInfo.name : '',
            segmentFeatures: segmentInfo ? segmentInfo.features : {},
            tools: selectedToolsData
        };

        // Salvar localmente no LocalStorage form cache
        const saveObj = { ...data, segment: segKey };
        localStorage.setItem('proposalData', JSON.stringify(saveObj));


        // Chama a função definida em template-proposta.js
        currentProposalHtml = getProposalTemplate(data);
        
        // Exibe no container
        emptyState.style.display = 'none';
        outputContainer.style.display = 'block';
        
        // Usa iframe para renderizar isoladamente o HTML e garantir estilos exatos
        outputContainer.innerHTML = `<iframe id="previewIframe" srcdoc="${currentProposalHtml.replace(/"/g, '&quot;')}"></iframe>`;

        // Habilita botões
        btnExportHtml.disabled = false;
        btnExportPdf.disabled = false;
    });

    document.getElementById('btnSave').addEventListener('click', () => {
        const segKey = segmentSelect.value;
        const segmentInfo = dbSegments.find(s => s.id === segKey);
        
        const selectedToolsData = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => {
                const dbTool = dbTools.find(t => t.id === cb.value);
                return {
                    name: cb.value,
                    desc: dbTool ? dbTool.desc : "Módulo adicional para potencializar sua gestão.",
                    img: dbTool ? dbTool.img : "",
                    link: dbTool ? dbTool.link : ""
                };
            });

        const data = {
            clientName: document.getElementById('clientName').value,
            clientCNPJ: document.getElementById('clientCNPJ').value,
            contactName: document.getElementById('contactName').value,
            implCost: document.getElementById('implCost').value,
            monthlyFee: document.getElementById('monthlyFee').value,
            implTime: document.getElementById('implTime').value,
            migratedSystem: document.getElementById('migratedSystem').value,
            hasMigration: document.getElementById('hasMigration').checked,
            segmentLabel: segmentInfo ? segmentInfo.name : '',
            segmentFeatures: segmentInfo ? segmentInfo.features : {},
            tools: selectedToolsData
        };

        try {
            const savedProp = saveProposal(data, loadedProposalId, loadedProposalStatus);
            loadedProposalId = savedProp.id;
            alert("Proposta salva no Kanban com sucesso!");
            window.location.href = 'dashboard.html';
        } catch(e) {
            alert("Erro ao salvar proposta: " + e.message);
        }
    });

    // Download HTML
    btnExportHtml.addEventListener('click', () => {
        const clientName = document.getElementById('clientName').value || 'Cliente';
        const blob = new Blob([currentProposalHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Proposta_${clientName.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Download PDF (usando html2pdf.js)
    btnExportPdf.addEventListener('click', () => {
        const clientName = document.getElementById('clientName').value || 'Cliente';
        
        // Cria um elemento temporário para o PDF (pois o iframe não é bem capturado)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentProposalHtml;
        
        const opt = {
            margin:       0,
            filename:     `Proposta_${clientName.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(tempDiv).save();
    });

    // Toggles de visualização (Mobile/Desktop)
    toggleMobileView.addEventListener('click', (e) => {
        e.preventDefault();
        previewContainer.classList.remove('desktop-view');
        previewContainer.classList.add('mobile-view');
        toggleMobileView.classList.add('active');
        toggleDesktopView.classList.remove('active');
    });

    toggleDesktopView.addEventListener('click', (e) => {
        e.preventDefault();
        previewContainer.classList.remove('mobile-view');
        previewContainer.classList.add('desktop-view');
        toggleDesktopView.classList.add('active');
        toggleMobileView.classList.remove('active');
    });
});
