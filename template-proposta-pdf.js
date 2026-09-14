const getProposalTemplatePDF = (data) => {
    // Ferramentas em formato bloco simples (não sanfona)
    const toolsHtml = data.tools.map(tool => `
        <div class="card" style="margin-bottom: 12px; border-left: 4px solid #00A886; page-break-inside: avoid; padding: 15px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                ${tool.img ? `<img src="${tool.img}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px;">` : `<span style="color: #00A886; font-size: 20px;">✓</span>`}
                <span style="font-weight: 600; color: #252F35; font-size: 15px;">${tool.name}</span>
            </div>
            <div style="color: #475569; font-size: 14px; line-height: 1.6;">
                ${tool.desc}
            </div>
        </div>
    `).join('');

    // Segmentos em formato sequencial
    const featuresHtml = Array.isArray(data.segmentFeatures) ? data.segmentFeatures.map(f => `
        <div class="card" style="page-break-inside: avoid; margin-bottom: 20px;">
            <h4 style="color: #252F35; font-size: 18px; margin-top: 0; margin-bottom: 12px;">${f.title}</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: center;">
                <div style="flex: 1; min-width: 250px;">
                    <p style="color: #475569; font-size: 14px; line-height: 1.6;">${f.text}</p>
                </div>
                ${f.image ? `<div style="flex: 1; min-width: 250px;"><img src="${f.image}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);"></div>` : ''}
            </div>
        </div>
    `).join('') : '';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Proposta Comercial - PDF</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #334155; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #00A886 0%, #007860 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; text-shadow: 1px 1px 3px rgba(0,0,0,0.2); }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; margin-bottom: 30px; }
            .section-title { color: #252F35; font-size: 22px; font-weight: 700; margin-top: 40px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; page-break-after: avoid; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; page-break-inside: avoid; }
            .highlight-text { font-size: 16px; color: #475569; }
            .price-box { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 30px; page-break-inside: avoid; }
            .price-item { flex: 1; min-width: 250px; background: #252F35; color: white; padding: 25px; border-radius: 12px; text-align: center; page-break-inside: avoid; }
            .price-item.secondary { background: #00A886; color: white; }
            .price-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 10px; display: block; }
            .price-value { font-size: 32px; font-weight: 700; margin: 0; }
            .footer { background: #252F35; color: #9ba7ae; text-align: center; padding: 30px 20px; font-size: 14px; }
            .footer a { color: #00A886; text-decoration: none; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container" id="proposal-document">
            <div class="header">
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
                <div>
                    ${featuresHtml}
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

                <div style="margin-top: 30px; font-size: 13px; color: #64748b; background: #f1f5f9; padding: 15px; border-radius: 8px; page-break-inside: avoid;">
                    <strong>Considerações Finais:</strong> Após a conclusão da implantação, treinamentos adicionais podem ser contratados ao valor fixo de R$ 80,00 por hora. Qualquer ajuste ou alteração no escopo poderá resultar em modificações nos prazos e valores.
                </div>
            </div>

            <div class="footer">
                <p>Atual Soluções de Gestão LTDA</p>
                <p>Dúvidas? Entre em contato conosco através do nosso <a href="https://www.atualsistemas.com.br">Site Oficial</a>.</p>
                <p style="margin-top: 20px; font-size: 12px;">Esta proposta tem validade de 15 dias após a sua emissão.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
