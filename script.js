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
        
    // Função auxiliar para criar IDs seguros para o HTML
    const getSafeId = (id) => id.replace(/[^a-zA-Z0-9]/g, '_');

    // Funções globais para controle dos cards
    window.updateToolVisuals = (safeId) => {
        const implInput = document.getElementById(`price-impl-${safeId}`);
        const mensalInput = document.getElementById(`price-mensal-${safeId}`);
        const gearBtn = document.getElementById(`gear-${safeId}`);
        const legendText = document.getElementById(`legend-${safeId}`);
        
        if (!implInput || !mensalInput || !gearBtn || !legendText) return;
        
        const hasImpl = implInput.value.trim() !== '';
        const hasMensal = mensalInput.value.trim() !== '';
        
        if (hasImpl || hasMensal) {
            gearBtn.style.color = 'var(--primary-green)';
            gearBtn.style.background = 'rgba(0, 168, 134, 0.1)';
            gearBtn.style.borderColor = 'rgba(0, 168, 134, 0.3)';
            
            let legend = [];
            if(hasImpl) legend.push(`Impl: R$ ${implInput.value}`);
            if(hasMensal) legend.push(`Men: R$ ${mensalInput.value}`);
            legendText.innerHTML = legend.join(' | ');
            legendText.style.display = 'block';
        } else {
            gearBtn.style.color = 'var(--text-muted)';
            gearBtn.style.background = 'rgba(255,255,255,0.05)';
            gearBtn.style.borderColor = 'transparent';
            legendText.style.display = 'none';
            legendText.innerHTML = '';
        }
    };

    window.toggleToolOpts = (safeId) => {
        const opts = document.getElementById(`opts-${safeId}`);
        
        // Auto-close: fecha outros abertos antes de abrir o atual
        document.querySelectorAll('.tool-opts-panel').forEach(p => {
            if (p.id !== `opts-${safeId}`) p.style.display = 'none';
        });

        opts.style.display = opts.style.display === 'none' ? 'block' : 'none';
    };

    // Auto-close ao clicar fora de qualquer card
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.tool-config-card')) {
            document.querySelectorAll('.tool-opts-panel').forEach(p => p.style.display = 'none');
        }
    });

    // Renderiza as Ferramentas Ocultas na Grid
    const renderToolsGrid = () => {
        toolsGrid.innerHTML = dbTools.map(t => {
            const safeId = getSafeId(t.id);
            return `
            <div id="wrapper-tool-${safeId}" style="display: none; margin-bottom: 12px;">
                <div class="tool-config-card" id="card-tool-${safeId}" style="border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; background: rgba(0,0,0,0.2); box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                    <div style="padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" name="tools" value="${t.id}" id="chk-tool-${safeId}" style="display: none;">
                                <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${t.name}</span>
                            </div>
                            <div style="display: flex; gap: 4px;">
                                <button type="button" id="gear-${safeId}" title="Configurar Preço" onclick="window.toggleToolOpts('${safeId}')" style="background: rgba(255,255,255,0.05); border: 1px solid transparent; border-radius: 6px; cursor: pointer; padding: 6px 10px; font-size: 16px; color: var(--text-muted); transition: all 0.2s;">⚙️</button>
                                <button type="button" title="Remover da Proposta" onclick="window.removeTool('${t.id}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid transparent; border-radius: 6px; cursor: pointer; padding: 6px 10px; font-size: 16px; transition: 0.2s; color: #ef4444;">🗑️</button>
                            </div>
                        </div>
                    </div>
                    <div id="opts-${safeId}" class="tool-opts-panel" style="display: none; padding: 16px; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.1);">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Implantação (R$)</label>
                            <input type="text" id="price-impl-${safeId}" class="form-control" placeholder="Ex: 100,00" oninput="window.updateToolVisuals('${safeId}')" style="padding: 6px; font-size: 13px; height: auto;">
                        </div>
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Mensalidade (R$)</label>
                            <input type="text" id="price-mensal-${safeId}" class="form-control" placeholder="Ex: 50,00" oninput="window.updateToolVisuals('${safeId}')" style="padding: 6px; font-size: 13px; height: auto;">
                        </div>
                    </div>
                    <div style="margin-top: 8px;">
                        <label style="font-size: 12px; color: #475569; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="checkbox" id="sum-impl-${safeId}" checked>
                            Somar implantação ao total da proposta
                        </label>
                    </div>
                </div>
            </div>
            <div id="legend-${safeId}" style="display: none; font-size: 11px; color: var(--primary-green); font-weight: 600; text-align: right; margin-top: 4px; padding-right: 8px; white-space: nowrap; letter-spacing: -0.2px;"></div>
        </div>
        `}).join('');
    };
    renderToolsGrid();
    segmentSelect.value = ""; // Garante que comece vazio ignorando cache do navegador
    
    // Atualiza as opções do Dropdown (Menu Oculto)
    const updateToolSelector = () => {
        const toolSelector = document.getElementById('toolSelector');
        toolSelector.innerHTML = '<option value="" disabled selected>+ Adicionar Módulo / Ferramenta...</option>';
        
        dbTools.forEach(t => {
            const safeId = getSafeId(t.id);
            const chk = document.getElementById(`chk-tool-${safeId}`);
            if (chk && !chk.checked) {
                toolSelector.innerHTML += `<option value="${t.id}">${t.name}</option>`;
            }
        });
    };
    
    // Remove ferramenta e devolve pro dropdown
    window.removeTool = (id) => {
        const safeId = getSafeId(id);
        const chk = document.getElementById(`chk-tool-${safeId}`);
        const wrapper = document.getElementById(`wrapper-tool-${safeId}`);
        if (chk && wrapper) {
            chk.checked = false;
            wrapper.style.display = 'none';
            // Limpa os valores ao remover
            document.getElementById(`price-impl-${safeId}`).value = '';
            document.getElementById(`price-mensal-${safeId}`).value = '';
            document.getElementById(`sum-impl-${safeId}`).checked = true;
            document.getElementById(`opts-${safeId}`).style.display = 'none';
            window.updateToolVisuals(safeId); // Reset legend and gear color
        }
        updateToolSelector();
    };
    
    // Adiciona ferramenta pelo dropdown
    document.getElementById('btnAddTool').addEventListener('click', () => {
        const toolSelector = document.getElementById('toolSelector');
        const selectedId = toolSelector.value;
        
        if (selectedId) {
            const safeId = getSafeId(selectedId);
            const chk = document.getElementById(`chk-tool-${safeId}`);
            const wrapper = document.getElementById(`wrapper-tool-${safeId}`);
            if (chk && wrapper) {
                chk.checked = true;
                wrapper.style.display = 'block';
            }
            updateToolSelector();
        }
    });

    const checkboxes = toolsGrid.querySelectorAll('input[type="checkbox"]');
    
    const outputContainer = document.getElementById('proposalOutput');
    const emptyState = document.querySelector('.empty-state');
    
    const btnExportHtml = document.getElementById('btnExportHtml');
    const btnExportPdf = document.getElementById('btnExportPdf');
    
    const toggleMobileView = document.getElementById('toggleMobileView');
    const toggleDesktopView = document.getElementById('toggleDesktopView');
    const previewContainer = document.getElementById('previewContainer');

    let currentProposalHtml = '';
    let currentProposalPdfHtml = '';
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
                        const isSelected = toolIds.includes(cb.value);
                        cb.checked = isSelected;
                        
                        const safeId = getSafeId(cb.value);
                        const wrapper = document.getElementById(`wrapper-tool-${safeId}`);
                        if (wrapper) {
                            wrapper.style.display = isSelected ? 'block' : 'none';
                        }
                        
                        // Load custom configs if any
                        if (data.toolConfigs) {
                            const tConfig = data.toolConfigs.find(tc => tc.id === cb.value);
                            if (tConfig) {
                                const elImpl = document.getElementById(`price-impl-${safeId}`);
                                const elMensal = document.getElementById(`price-mensal-${safeId}`);
                                const elSum = document.getElementById(`sum-impl-${safeId}`);
                                if (elImpl) elImpl.value = tConfig.impl || '';
                                if (elMensal) elMensal.value = tConfig.mensal || '';
                                if (elSum) elSum.checked = tConfig.sumImpl;
                            }
                        }
                        window.updateToolVisuals(safeId); // Refresh the UI immediately
                    });
                }
                
                // Auto preview after a small delay to ensure DOM is ready
                setTimeout(() => document.getElementById('btnPreviewWeb').click(), 100);
            }
        }
        
        // Sempre popula o dropdown, independente de ter carregado ou não
        updateToolSelector();
    };
    loadSavedData();

    // Quando mudar o segmento, auto-seleciona as ferramentas recomendadas
    segmentSelect.addEventListener('change', (e) => {
        const segKey = e.target.value;
        if (!segKey) return;
        
        const segment = dbSegments.find(s => s.id === segKey);
        if(!segment) return;
        
        checkboxes.forEach(cb => {
            const isRecommended = segment.defaultTools.includes(cb.value);
            cb.checked = isRecommended;
            
            const safeId = getSafeId(cb.value);
            const wrapper = document.getElementById(`wrapper-tool-${safeId}`);
            if (wrapper) {
                wrapper.style.display = isRecommended ? 'block' : 'none';
                
                // Se foi ocultado, limpa os valores
                if (!isRecommended) {
                    document.getElementById(`price-impl-${safeId}`).value = '';
                    document.getElementById(`price-mensal-${safeId}`).value = '';
                    document.getElementById(`opts-${safeId}`).style.display = 'none';
                    window.updateToolVisuals(safeId);
                }
            }
        });
        
        updateToolSelector();
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

    // Função auxiliar para coletar os dados do form
    const gatherFormData = () => {
        const segKey = segmentSelect.value;
        const segmentInfo = dbSegments.find(s => s.id === segKey);
        
        const selectedToolsData = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => {
                const dbTool = dbTools.find(t => t.id === cb.value);
                const mensalInput = document.getElementById(`price-mensal-${cb.value}`);
                const implInput = document.getElementById(`price-impl-${cb.value}`);
                const sumImplCheck = document.getElementById(`sum-impl-${cb.value}`);
                
                return {
                    name: cb.value,
                    desc: dbTool ? dbTool.desc : "Módulo adicional para potencializar sua gestão.",
                    img: dbTool ? dbTool.img : "",
                    priceMensal: mensalInput ? mensalInput.value : '',
                    priceImpl: implInput ? implInput.value : '',
                    sumImpl: sumImplCheck ? sumImplCheck.checked : true
                };
            });

        return {
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
            tools: selectedToolsData,
            segmentKey: segKey
        };
    };

    // Geração do Preview Web
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = gatherFormData();
        
        // Auto-Save: Garante que a proposta vá para o funil (como rascunho) mesmo se o vendedor esquecer de clicar em "Salvar"
        try {
            if (typeof saveProposal === 'function') {
                const savedProp = saveProposal(data, loadedProposalId, loadedProposalStatus);
                loadedProposalId = savedProp.id;
                loadedProposalStatus = savedProp.status;
                
                // Limpa a string da URL para não duplicar se recarregar
                const urlParams = new URLSearchParams(window.location.search);
                if (!urlParams.has('load')) {
                    window.history.replaceState({}, '', `index.html?load=${loadedProposalId}`);
                }
            }
        } catch(err) {
            console.warn("Falha no auto-save:", err);
        }

        // Salvar localmente no LocalStorage form cache
        const saveObj = { ...data, segment: data.segmentKey };
        localStorage.setItem('proposalData', JSON.stringify(saveObj));

        // Chama as funções de template
        currentProposalHtml = getProposalTemplate(data);
        currentProposalPdfHtml = getProposalTemplatePDF(data);
        
        // Exibe no container a versão WEB
        emptyState.style.display = 'none';
        outputContainer.style.display = 'block';
        outputContainer.innerHTML = `<iframe id="previewIframe" srcdoc="${currentProposalHtml.replace(/"/g, '&quot;')}"></iframe>`;

        // Habilita botões
        btnExportHtml.disabled = false;
        btnExportPdf.disabled = false;
        if(document.getElementById('btnCopyLink')) document.getElementById('btnCopyLink').style.display = 'block';
    });
    
    // Geração do Link Copiável
    const btnCopyLink = document.getElementById('btnCopyLink');
    if (btnCopyLink) {
        btnCopyLink.addEventListener('click', () => {
            if(!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const data = gatherFormData();
            const cleanCnpj = data.clientCNPJ ? data.clientCNPJ.replace(/\D/g, '') : '';
            const secretKey = cleanCnpj || 'public_atual'; // Se não tiver CNPJ, usa chave pública
            
            // Adiciona flag para o visualizador saber se pede senha
            data.requiresPassword = !!cleanCnpj;
            
            const jsonStr = JSON.stringify(data);
            const encrypted = CryptoJS.AES.encrypt(jsonStr, secretKey).toString();
            
            // Construir URL Base
            let baseUrl = window.location.href.split('?')[0].replace('index.html', '');
            if(!baseUrl.endsWith('/')) baseUrl += '/';
            const finalUrl = `${baseUrl}proposta.html?data=${encodeURIComponent(encrypted)}`;
            
            btnCopyLink.innerHTML = "⏳ Gerando Link Curto...";
            
            // Encurtar a URL usando spoo.me (Suporta URLs gigantes via POST)
            const shortenUrl = async (longUrl) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
                    
                    const response = await fetch('https://spoo.me/', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({ url: longUrl }),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        const responseData = await response.json();
                        return responseData.short_url || longUrl;
                    }
                    return longUrl;
                } catch (e) {
                    console.error("Erro ao encurtar:", e);
                    return longUrl; // Fallback para URL longa
                }
            };
            
            shortenUrl(finalUrl).then(shortUrl => {
                navigator.clipboard.writeText(shortUrl).then(() => {
                    btnCopyLink.innerHTML = "✅ Link Copiado!";
                    setTimeout(() => btnCopyLink.innerHTML = "🔗 Copiar Link Web", 2500);
                    markAsSent();
                }).catch(err => {
                    alert("Erro ao copiar. Tente copiar manualmente da barra.");
                    btnCopyLink.innerHTML = "🔗 Copiar Link Web";
                });
            });
        });
    }

    // Geração do Preview PDF
    const btnPreviewPdf = document.getElementById('btnPreviewPdf');
    if(btnPreviewPdf) {
        btnPreviewPdf.addEventListener('click', () => {
            if(!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const data = gatherFormData();
            
            // Salvar localmente no LocalStorage form cache
            const saveObj = { ...data, segment: data.segmentKey };
            localStorage.setItem('proposalData', JSON.stringify(saveObj));

            // Chama as funções de template
            currentProposalHtml = getProposalTemplate(data);
            currentProposalPdfHtml = getProposalTemplatePDF(data);
            
            // Exibe no container a versão PDF
            emptyState.style.display = 'none';
            outputContainer.style.display = 'block';
            outputContainer.innerHTML = `<iframe id="previewIframe" srcdoc="${currentProposalPdfHtml.replace(/"/g, '&quot;')}"></iframe>`;

            // Habilita botões
            btnExportHtml.disabled = false;
            btnExportPdf.disabled = false;
        });
    }
    document.getElementById('btnSave').addEventListener('click', () => {
        if(!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const data = gatherFormData();

        try {
            const savedProp = saveProposal(data, loadedProposalId, loadedProposalStatus);
            loadedProposalId = savedProp.id;
            alert("Proposta salva no Kanban com sucesso!");
            window.location.href = 'dashboard.html';
        } catch(e) {
            alert("Erro ao salvar proposta: " + e.message);
        }
    });

    // Função unificada para auto-salvar como enviada ao exportar/compartilhar
    const markAsSent = () => {
        try {
            if (typeof saveProposal === 'function' && loadedProposalId) {
                if (!loadedProposalStatus || loadedProposalStatus === 'rascunho') {
                    loadedProposalStatus = 'enviada';
                    saveProposal(gatherFormData(), loadedProposalId, loadedProposalStatus);
                }
            }
        } catch(e) {}
    };

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
        
        markAsSent();
    });

    // Download PDF (usando html2pdf.js)
    btnExportPdf.addEventListener('click', () => {
        const clientName = document.getElementById('clientName').value || 'Cliente';
        
        // Cria um elemento temporário para o PDF (pois o iframe não é bem capturado)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentProposalPdfHtml;
        
        const opt = {
            margin:       0,
            filename:     `Proposta_${clientName.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(tempDiv).save();
        
        markAsSent();
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

    // Máscara e Busca de CNPJ
    const inputCnpj = document.getElementById('clientCNPJ');
    const inputClientName = document.getElementById('clientName');

    if (inputCnpj) {
        inputCnpj.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            
            if (val.length <= 11) {
                // CPF
                if (val.length > 3) val = val.substring(0,3) + '.' + val.substring(3);
                if (val.length > 7) val = val.substring(0,7) + '.' + val.substring(7);
                if (val.length > 11) val = val.substring(0,11) + '-' + val.substring(11, 13);
            } else {
                // CNPJ
                if (val.length > 2) val = val.substring(0,2) + '.' + val.substring(2);
                if (val.length > 6) val = val.substring(0,6) + '.' + val.substring(6);
                if (val.length > 10) val = val.substring(0,10) + '/' + val.substring(10);
                if (val.length > 15) val = val.substring(0,15) + '-' + val.substring(15, 17);
            }
            
            e.target.value = val;

            if (val.length === 18) {
                const cleanCnpj = val.replace(/\D/g, '');
                const oldColor = inputCnpj.style.color;
                inputCnpj.style.color = 'var(--primary-green)'; // Feedback visual
                
                fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`)
                    .then(response => {
                        if (!response.ok) throw new Error("CNPJ não encontrado");
                        return response.json();
                    })
                    .then(data => {
                        inputClientName.value = data.nome_fantasia || data.razao_social || '';
                        // Se houver lógica futura de endereço, pode ser implementada aqui
                    })
                    .catch(err => {
                        console.warn("CNPJ não localizado na base pública:", err);
                    })
                    .finally(() => {
                        inputCnpj.style.color = oldColor;
                    });
            }
        });
    }

});
