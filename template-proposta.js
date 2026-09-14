const getProposalTemplate = (data) => {
    // Generate tools list
    const toolsHtml = data.tools.map(tool => `
        <details class="tool-accordion">
            <summary class="tool-summary">
                <div style="display: flex; align-items: center; gap: 12px;">
                    ${tool.img ? `<img src="${tool.img}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px;">` : `<span style="color: #00A886; font-size: 20px;">✓</span>`}
                    <span style="font-weight: 600; color: #252F35; font-size: 15px;">${tool.name}</span>
                </div>
                <span class="chevron">▼</span>
            </summary>
            <div class="tool-desc">
                ${tool.desc}
                ${tool.link ? `<div style="margin-top: 10px;"><a href="${tool.link}" target="_blank" style="display: inline-block; padding: 6px 12px; background: rgba(0,168,134,0.1); color: #00A886; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; transition: background 0.2s;">Saiba Mais →</a></div>` : ''}
            </div>
        </details>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proposta Comercial - Atual Sistemas</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f1f5f9;
                color: #334155;
                line-height: 1.6;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #00A886 0%, #007860 100%);
                padding: 40px 20px;
                text-align: center;
                color: #001A15; /* Dark green/black for contrast on the green background */
            }
            .logo {
                max-width: 250px;
                margin-bottom: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: 1px;
                color: #ffffff;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 30px;
            }
            .section-title {
                color: #252F35;
                font-size: 22px;
                font-weight: 700;
                margin-top: 40px;
                margin-bottom: 20px;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 10px;
            }
            .card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 20px;
            }
            .highlight-text {
                font-size: 16px;
                color: #475569;
            }
            
            /* Accordion Tools */
            .tool-accordion {
                margin-bottom: 12px;
                background: #f8fafc;
                border-radius: 8px;
                border-left: 4px solid #00A886;
                overflow: hidden;
                border-top: 1px solid #e2e8f0;
                border-right: 1px solid #e2e8f0;
                border-bottom: 1px solid #e2e8f0;
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            }
            .tool-summary {
                padding: 14px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                list-style: none;
                transition: background 0.2s;
            }
            .tool-summary::-webkit-details-marker {
                display: none;
            }
            .tool-summary:hover {
                background: #f1f5f9;
            }
            .tool-accordion[open] .chevron {
                transform: rotate(180deg);
            }
            .chevron {
                transition: transform 0.3s;
                color: #94a3b8;
                font-size: 12px;
            }
            .tool-desc {
                padding: 0 16px 16px 45px;
                color: #475569;
                font-size: 14px;
                line-height: 1.6;
                animation: fadeIn 0.3s ease;
            }
            
            /* Tabs System */
            .tabs-container {
                margin: 30px 0;
            }
            .tabs-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }
            .tab-btn {
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                padding: 12px 18px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                color: #475569;
                transition: all 0.2s;
                flex: 1;
                min-width: 140px;
                text-align: center;
            }
            .tab-btn:hover {
                background: #e2e8f0;
            }
            .tab-btn.active {
                background: #00A886;
                color: white;
                border-color: #00A886;
                box-shadow: 0 4px 6px -1px rgba(0, 168, 134, 0.3);
            }
            .tab-content {
                display: none;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 24px;
                animation: fadeIn 0.3s;
            }
            .tab-content.active {
                display: block;
            }
            .tab-layout {
                display: flex;
                gap: 20px;
                align-items: center;
            }
            .tab-text {
                flex: 1;
            }
            .tab-text h4 {
                color: #252F35;
                font-size: 18px;
                margin-top: 0;
                margin-bottom: 12px;
            }
            .tab-image {
                flex: 1;
                max-width: 300px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .price-box {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-top: 30px;
            }
            .price-item {
                flex: 1;
                min-width: 250px;
                background: #252F35;
                color: white;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 10px 15px -3px rgba(37, 47, 53, 0.3);
            }
            .price-item.secondary {
                background: #00A886;
                color: white;
                box-shadow: 0 10px 15px -3px rgba(0, 168, 134, 0.3);
            }
            .price-label {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.9;
                margin-bottom: 10px;
                display: block;
            }
            .price-value {
                font-size: 32px;
                font-weight: 700;
                margin: 0;
            }
            .footer {
                background: #252F35;
                color: #9ba7ae;
                text-align: center;
                padding: 30px 20px;
                font-size: 14px;
            }
            .footer a {
                color: #00A886;
                text-decoration: none;
                font-weight: 600;
            }
            
            @media (max-width: 700px) {
                .content {
                    padding: 20px 15px;
                }
                .price-box {
                    flex-direction: column;
                }
                .header h1 {
                    font-size: 24px;
                }
                .tab-layout {
                    flex-direction: column;
                }
                .tab-image {
                    max-width: 100%;
                }
            }

            /* Ao imprimir/gerar PDF, queremos mostrar todas as abas empilhadas para não esconder conteúdo */
            @media print {
                .tabs-buttons {
                    display: none;
                }
                .tab-content {
                    display: block !important;
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }
                /* Forçar expansão do acordeão no PDF */
                .tool-desc {
                    display: block !important;
                }
                .chevron {
                    display: none !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="container" id="proposal-document">
            <div class="header">
                <!-- Mantendo a logo branca mas sobre fundo verde -->
                <img src="https://www.atualsistemas.com.br/wp-content/uploads/2021/03/LOGO_BRANCA_HORIZONTAL_SITE.png" alt="Atual Sistemas" class="logo">
                <h1>Proposta Comercial</h1>
            </div>
            
            <div class="content">
                <div class="greeting">
                    <p>Olá, <strong>${data.contactName || 'Responsável'}</strong>.</p>
                    <p>É um prazer apresentar esta proposta desenvolvida especialmente para a <strong>${data.clientName}</strong>.</p>
                    ${data.clientCNPJ ? `<p style="font-size: 14px; color: #64748b; margin-top: -10px;">CNPJ: ${data.clientCNPJ}</p>` : ''}
                </div>

                <div class="card">
                    <h3 style="margin-top: 0; color: #252F35;">O Cenário Ideal para o seu Negócio</h3>
                    <p class="highlight-text">
                        Nós entendemos as necessidades do segmento de <strong>${data.segmentLabel}</strong>. 
                        ${data.migratedSystem ? `Para facilitar a sua transição do sistema <em>${data.migratedSystem}</em>, preparamos uma solução robusta e moderna.` : 'Preparamos uma solução robusta e moderna para impulsionar seus resultados.'}
                    </p>
                </div>

                <h2 class="section-title">Por que escolher a Atual Sistemas?</h2>
                
                <!-- Sistema de Abas Interativas -->
                <div class="tabs-container">
                    <div class="tabs-buttons">
                        ${Array.isArray(data.segmentFeatures) ? data.segmentFeatures.map((f, i) => `
                            <button class="tab-btn ${i === 0 ? 'active' : ''}" onclick="openTab('tab-feat-${i}', this)">${f.title}</button>
                        `).join('') : ''}
                        <button class="tab-btn ${(!data.segmentFeatures || data.segmentFeatures.length === 0) ? 'active' : ''}" onclick="openTab('tab-bi', this)">Atual B.i (Dashboards)</button>
                    </div>

                    ${Array.isArray(data.segmentFeatures) ? data.segmentFeatures.map((f, i) => `
                    <div id="tab-feat-${i}" class="tab-content ${i === 0 ? 'active' : ''}">
                        <div class="tab-layout">
                            <div class="tab-text" style="flex: 1;">
                                <h4>${f.title}</h4>
                                <p>${f.text}</p>
                                ${f.link ? `<a href="${f.link}" target="_blank" style="display: inline-block; margin-top: 15px; padding: 8px 16px; background: rgba(0,168,134,0.1); color: #00A886; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: background 0.2s;">Saiba Mais →</a>` : ''}
                            </div>
                            ${f.image ? `<img src="${f.image}" alt="${f.title}" class="tab-image">` : ''}
                        </div>
                    </div>
                    `).join('') : ''}

                    <div id="tab-bi" class="tab-content ${(!data.segmentFeatures || data.segmentFeatures.length === 0) ? 'active' : ''}">
                        <div class="tab-layout">
                            <div class="tab-text">
                                <h4>Decisões Baseadas em Dados</h4>
                                <p>Tenha o controle total da sua empresa na palma da mão. Com o <strong>Atual B.i.</strong>, você visualiza painéis dinâmicos de faturamento, lucratividade, curva ABC de produtos e performance da equipe em tempo real.</p>
                            </div>
                            <img src="bi.jpeg" alt="Atual B.i Dashboards" class="tab-image">
                        </div>
                    </div>
                </div>

                <h2 class="section-title">Soluções Inclusas</h2>
                <div style="margin-bottom: 30px;">
                    ${toolsHtml || '<p>Nenhuma ferramenta selecionada.</p>'}
                </div>

                <h2 class="section-title">Escopo do Projeto</h2>
                <div class="card">
                    <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.8;">
                        <li><strong>Implantação:</strong> Instalação e configuração do sistema de acordo com as necessidades do seu segmento.</li>
                        <li><strong>Integração:</strong> Configuração com ferramentas de gestão de estoque, vendas, controle financeiro, fiscal e gerencial.</li>
                        ${data.hasMigration ? `<li><strong>Migração de Dados:</strong> Contamos com um <b>setor próprio e especializado em migração</b> dentro da Atual Sistemas. Nossa equipe extrai todos os dados do seu sistema antigo (${data.migratedSystem || 'concorrente'}) para o nosso banco de dados, realizando todas as verificações laboratoriais rigorosas para garantir 100% de integridade, precisão e segurança das suas informações.</li>` : ''}
                        <li><strong>Treinamento:</strong> Treinamento completo da equipe de colaboradores para utilização fluida do novo sistema.</li>
                    </ul>
                </div>

                <h2 class="section-title">Investimento</h2>
                <div class="price-box">
                    <div class="price-item">
                        <span class="price-label">Taxa de Implantação e Migração</span>
                        <p class="price-value">R$ ${data.implCost}</p>
                        <p style="font-size: 13px; opacity: 0.8; margin-top: 10px;">Tempo estimado: ${data.implTime}</p>
                    </div>
                    <div class="price-item secondary">
                        <span class="price-label">Mensalidade (Licença e Suporte)</span>
                        <p class="price-value">R$ ${data.monthlyFee}</p>
                    </div>
                </div>

                <h2 class="section-title">Termos e Condições</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div class="card" style="margin-bottom: 0;">
                        <h4 style="margin-top: 0; color: #00A886;">💳 Forma de Pagamento</h4>
                        <p style="font-size: 14px; color: #475569;"><strong>Implantação:</strong> Pagamento via Pix ou Cartão de Crédito.<br><br><strong>Mensalidade:</strong> Pagamento recorrente a partir do mês seguinte à conclusão da implantação. <em>Reajuste anual baseado no percentual de variação do IGPM.</em></p>
                    </div>
                    <div class="card" style="margin-bottom: 0;">
                        <h4 style="margin-top: 0; color: #00A886;">🎧 Suporte Técnico</h4>
                        <p style="font-size: 14px; color: #475569;"><strong>Horário Comercial:</strong> Seg a Sex das 8h às 18h. Sábados das 8h às 11:45h.<br><br><strong>Plantões (Remoto):</strong> Seg a Sex das 18h às 22h. Sábados das 12h às 18h. Domingos das 8h às 12h.</p>
                    </div>
                </div>

                <div style="margin-top: 30px; font-size: 13px; color: #64748b; background: #f1f5f9; padding: 15px; border-radius: 8px;">
                    <strong>Considerações Finais:</strong> Após a conclusão da implantação, treinamentos adicionais podem ser contratados ao valor fixo de R$ 80,00 por hora. Qualquer ajuste ou alteração no escopo poderá resultar em modificações nos prazos e valores.
                </div>
            </div>

            <div class="footer">
                <p>Atual Soluções de Gestão LTDA</p>
                <p>Dúvidas? Entre em contato conosco através do nosso <a href="https://www.atualsistemas.com.br">Site Oficial</a>.</p>
                <p style="margin-top: 20px; font-size: 12px;">Esta proposta tem validade de 15 dias após a sua emissão.</p>
            </div>
        </div>

        <script>
            // Lógica para funcionamento das abas na proposta gerada
            function openTab(tabId, btnElement) {
                // Remove active de todas as abas e botões
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Ativa a aba e botão selecionado
                document.getElementById(tabId).classList.add('active');
                if (btnElement) {
                    btnElement.classList.add('active');
                }
            }
        </script>
    </body>
    </html>
    `;
};
