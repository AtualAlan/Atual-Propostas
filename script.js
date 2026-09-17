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
        
    // Renderiza as Ferramentas Ocultas na Grid
    const renderToolsGrid = () => {
        toolsGrid.innerHTML = dbTools.map(t => `
            <div class="tool-config-card" id="card-tool-${t.id}" style="display: none; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 10px; overflow: hidden; background: var(--panel-bg);">
                <div style="display: flex; align-items: center; padding: 12px; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                        <input type="checkbox" name="tools" value="${t.id}" id="chk-tool-${t.id}" style="display: none;">
                        <span style="font-weight: 600; font-size: 14px; color: var(--text-main);">${t.name}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" title="Configurar Preço" onclick="const e = document.getElementById('opts-${t.id}'); e.style.display = e.style.display === 'none' ? 'block' : 'none'; this.style.opacity = e.style.display === 'none' ? '0.5' : '1';" style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 16px; opacity: 0.5; transition: opacity 0.2s;">⚙️</button>
                        <button type="button" title="Remover da Proposta" onclick="window.removeTool('${t.id}')" style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 16px; transition: 0.2s; color: #ef4444;">🗑️</button>
                    </div>
                </div>
                <div id="opts-${t.id}" style="display: none; padding: 12px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.02);">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Implantação (R$)</label>
                            <input type="text" id="price-impl-${t.id}" class="form-control" placeholder="Ex: 100,00" style="padding: 6px; font-size: 13px; height: auto;">
                        </div>
                        <div style="flex: 1; min-width: 120px;">
                            <label style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Mensalidade (R$)</label>
                            <input type="text" id="price-mensal-${t.id}" class="form-control" placeholder="Ex: 50,00" style="padding: 6px; font-size: 13px; height: auto;">
                        </div>
                    </div>
                    <div style="margin-top: 8px;">
                        <label style="font-size: 12px; color: #475569; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="checkbox" id="sum-impl-${t.id}" checked>
                            Somar implantação ao total da proposta
                        </label>
                    </div>
                </div>
            </div>
        `).join('');
    };
    renderToolsGrid();
    
    // Atualiza as opções do Dropdown (Menu Oculto)
    const updateToolSelector = () => {
        const toolSelector = document.getElementById('toolSelector');
        toolSelector.innerHTML = '<option value="" disabled selected>Escolha um módulo para adicionar...</option>';
        
        dbTools.forEach(t => {
            const chk = document.getElementById(`chk-tool-${t.id}`);
            if (chk && !chk.checked) {
                toolSelector.innerHTML += `<option value="${t.id}">${t.name}</option>`;
            }
        });
    };
    
    // Remove ferramenta e devolve pro dropdown
    window.removeTool = (id) => {
        const chk = document.getElementById(`chk-tool-${id}`);
        const card = document.getElementById(`card-tool-${id}`);
        if (chk && card) {
            chk.checked = false;
            card.style.display = 'none';
            // Limpa os valores ao remover
            document.getElementById(`price-impl-${id}`).value = '';
            document.getElementById(`price-mensal-${id}`).value = '';
            document.getElementById(`sum-impl-${id}`).checked = true;
            document.getElementById(`opts-${id}`).style.display = 'none';
        }
        updateToolSelector();
    };
    
    // Adiciona ferramenta pelo dropdown
    document.getElementById('btnAddTool').addEventListener('click', () => {
        const toolSelector = document.getElementById('toolSelector');
        const selectedId = toolSelector.value;
        
        if (selectedId) {
            const chk = document.getElementById(`chk-tool-${selectedId}`);
            const card = document.getElementById(`card-tool-${selectedId}`);
            if (chk && card) {
                chk.checked = true;
                card.style.display = 'block';
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
                        
                        const card = document.getElementById(`card-tool-${cb.value}`);
                        if (card) {
                            card.style.display = isSelected ? 'block' : 'none';
                        }
                    });
                    
                    updateToolSelector();
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
            const isRecommended = segment.defaultTools.includes(cb.value);
            cb.checked = isRecommended;
            
            const card = document.getElementById(`card-tool-${cb.value}`);
            if (card) {
                card.style.display = isRecommended ? 'block' : 'none';
                
                // Se foi ocultado, limpa os valores
                if (!isRecommended) {
                    document.getElementById(`price-impl-${cb.value}`).value = '';
                    document.getElementById(`price-mensal-${cb.value}`).value = '';
                    document.getElementById(`opts-${cb.value}`).style.display = 'none';
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
        tempDiv.innerHTML = currentProposalPdfHtml;
        
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

    // -- INÍCIO: PREENCHIMENTO AUTOMÁTICO PARA TESTES --
    // TODO: O usuário pedirá para remover isso depois
    setTimeout(() => {
        // Preencher dados básicos
        if (document.getElementById('clientName')) document.getElementById('clientName').value = "Empresa de Teste Ltda";
        if (document.getElementById('contactName')) document.getElementById('contactName').value = "Alan";
        if (document.getElementById('implTime')) document.getElementById('implTime').value = "15 a 20 dias úteis";
        if (document.getElementById('migratedSystem')) document.getElementById('migratedSystem').value = "Sistema Concorrente";
        if (document.getElementById('implCost')) document.getElementById('implCost').value = "2.500,00";
        if (document.getElementById('monthlyFee')) document.getElementById('monthlyFee').value = "350,00";
        if (document.getElementById('hasMigration')) document.getElementById('hasMigration').checked = true;

        // Selecionar o primeiro segmento
        if (segmentSelect && dbSegments.length > 0) {
            segmentSelect.value = dbSegments[0].id;
            segmentSelect.dispatchEvent(new Event('change'));
        }

        // Marcar todas as ferramentas
        document.querySelectorAll('.tool-checkbox').forEach(cb => {
            if (!cb.checked) {
                cb.checked = true;
                cb.dispatchEvent(new Event('change'));
            }
        });

        // Adicionar valores extras na primeira ferramenta para ela ir para "Módulos Adicionais"
        if (dbTools.length > 0) {
            const firstToolId = dbTools[0].id;
            const implInput = document.getElementById(`price-impl-${firstToolId}`);
            const mensalInput = document.getElementById(`price-mensal-${firstToolId}`);
            const sumImplCheck = document.getElementById(`sum-impl-${firstToolId}`);
            
            if (implInput) implInput.value = "1.000,00";
            if (mensalInput) mensalInput.value = "200,00";
            if (sumImplCheck) sumImplCheck.checked = false; // Isso garante que a implantação extra não some ao total base, forçando-a ser Adicional
        }

        // Simular o clique de gerar a proposta automaticamente
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }, 500);
    // -- FIM: PREENCHIMENTO AUTOMÁTICO PARA TESTES --

});
