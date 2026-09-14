// db-local.js
// Simula a lógica de um Backend (Firebase) usando LocalStorage

const DB_KEY = 'atual_sistemas_db';
const SESSION_KEY = 'atual_sistemas_session';

// Inicializa o banco de dados caso não exista
const initDB = () => {
    let db = JSON.parse(localStorage.getItem(DB_KEY));
    
    // Se não existir o banco ou se não tivermos equipes de teste ainda, vamos injetar a estrutura base
    if (!db || !db.teams || db.teams.length === 0) {
        db = {
            users: [
                {
                    id: 'admin_01',
                    name: 'Administrador (Atual)',
                    email: 'admin@atualsistemas.com.br',
                    password: '123',
                    role: 'admin',
                    teamIds: [],
                    status: 'aprovado'
                },
                {
                    id: 'user_bsf_owner',
                    name: 'João BSF (Dono de Equipe)',
                    email: 'joao.bsf@atualsistemas.com.br',
                    password: '123',
                    role: 'dono_equipe',
                    teamIds: ['team_bsf'],
                    status: 'aprovado'
                },
                {
                    id: 'user_bsf_seller',
                    name: 'Maria BSF (Vendedora)',
                    email: 'maria.bsf@atualsistemas.com.br',
                    password: '123',
                    role: 'vendedor',
                    teamIds: ['team_bsf'],
                    status: 'aprovado'
                },
                {
                    id: 'user_gv_owner',
                    name: 'Pedro GV (Dono de Equipe)',
                    email: 'pedro.gv@atualsistemas.com.br',
                    password: '123',
                    role: 'dono_equipe',
                    teamIds: ['team_gv'],
                    status: 'aprovado'
                },
                {
                    id: 'user_gv_seller',
                    name: 'Ana GV (Vendedora)',
                    email: 'ana.gv@atualsistemas.com.br',
                    password: '123',
                    role: 'vendedor',
                    teamIds: ['team_gv'],
                    status: 'aprovado'
                }
            ],
            teams: [
                {
                    id: 'team_bsf',
                    name: 'Barra de São Francisco',
                    ownerId: 'user_bsf_owner'
                },
                {
                    id: 'team_gv',
                    name: 'Governador Valadares',
                    ownerId: 'user_gv_owner'
                }
            ],
            proposals: db ? db.proposals : [], // preserva propostas se já existiam
            settings: {
                minimumWage: 1621.00
            }
        };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
    
    // Migração de banco de dados para incluir ferramentas e segmentos dinâmicos se não existirem
    let needsSave = false;
    if (!db.settings) { db.settings = { minimumWage: 1621.00 }; needsSave = true; }
    
    if (!db.settings.tools || db.settings.tools.length === 0) {
        db.settings.tools = [
            { id: "Atual B.i", name: "Atual B.i", desc: "Plataforma de inteligência de negócios (Business Intelligence) com painéis e gráficos avançados em tempo real para análise de faturamento, lucratividade e performance da equipe.", img: "" },
            { id: "Atual Gestão", name: "Atual Gestão", desc: "Sistema ERP completo de retaguarda, responsável pelo controle de estoque, financeiro, emissão de notas fiscais, compras, relatórios gerenciais e cadastros gerais da sua empresa.", img: "" },
            { id: "Atual Checkout", name: "Atual Checkout", desc: "Frente de caixa (PDV) de altíssimo desempenho, projetado para suportar alto volume de vendas sem filas, com integração TEF, balanças e PIX nativo.", img: "" },
            { id: "Atual Mais", name: "Atual Mais", desc: "Módulo especializado para o varejo, permitindo gestão precisa de grade (cor e tamanho), emissão de pré-vendas, consignações e orçamentos detalhados.", img: "" },
            { id: "Atual Vendas Mobile", name: "Atual Vendas Mobile", desc: "Aplicativo de força de vendas e operação de salão para smartphones e tablets. Permite lançar pedidos, realizar inventários, conferir estoques e corrigir etiquetas de preços diretamente das gôndolas.", img: "" },
            { id: "Atual Messenger", name: "Atual Messenger", desc: "Ferramenta de automação e relacionamento via WhatsApp. Envie promoções, cobranças automáticas, campanhas de aniversário e status de serviços.", img: "" },
            { id: "Atual Controle Mobile", name: "Atual Controle Mobile", desc: "Aplicativo exclusivo para o empresário, trazendo dados estratégicos na palma da mão: vendas diárias e mensais, horários de pico, visão geral dos caixas, contas a pagar/receber e consulta de estoque.", img: "" },
            { id: "Atual Conciliador", name: "Atual Conciliador", desc: "Solução que audita e concilia automaticamente todas as suas vendas em cartão, garantindo que as taxas cobradas pelas adquirentes estão corretas e o dinheiro entrou na conta.", img: "" },
            { id: "Atual Integrador", name: "Atual Integrador", desc: "Sistema inteligente responsável pela integração técnica e troca de dados segura entre os módulos locais e em nuvem.", img: "" },
            { id: "Atual Food", name: "Atual Food", desc: "Módulo dedicado para bares, restaurantes e lanchonetes. Controle de mesas, comandas eletrônicas e gestão de produção (KDS/Impressoras de cozinha).", img: "" },
            { id: "Atual Balança", name: "Atual Balança", desc: "Integração nativa com balanças de pesagem, agilizando a venda de produtos a granel e self-service direto no frente de caixa.", img: "" },
            { id: "Atual Delivery", name: "Atual Delivery", desc: "Plataforma própria de pedidos online (Cardápio Digital) para o seu restaurante, 100% livre de comissões de aplicativos terceiros.", img: "" },
            { id: "Atual CTe / MDFe", name: "Atual CTe / MDFe", desc: "Módulo adicional para potencializar sua gestão.", img: "" }
        ];
        needsSave = true;
    }
    
    if (!db.settings.segments || db.settings.segments.length === 0) {
        db.settings.segments = [
            { id: "food", name: "Food Service (Bares, Restaurantes, etc)", defaultTools: ["Atual Gestão", "Atual Food", "Atual Balança", "Atual Delivery", "Atual Controle Mobile", "Atual B.i"], features: { estoque: "Controle preciso de insumos, ficha técnica dos pratos para baixa automática de ingredientes e inventário fácil para evitar desperdícios na cozinha.", caixa: "PDV ultra-rápido com comandas eletrônicas, integração com balança no caixa, divisão de contas, autoatendimento e controle de mesas em tempo real.", fiscal: "Emissão de NFC-e transparente, gestão de gorjetas, controle rigoroso de contas a pagar/receber e Dashboards do Atual B.i para análise de lucratividade.", servicos: "Integração total com aplicativo para garçons, gestão de reservas de mesas e módulo de Delivery próprio sem cobrança de taxas de terceiros." } },
            { id: "roupas", name: "Lojas de Roupas", defaultTools: ["Atual Gestão", "Atual Mais", "Atual Messenger", "Atual B.i"], features: { estoque: "Gestão inteligente de grade (tamanhos e cores), controle de coleções, inventário simplificado e alertas automáticos de estoque mínimo.", caixa: "Frente de caixa ágil, com troca fácil de mercadorias, descontos programados por tipo de cliente e venda rápida através do código de barras.", fiscal: "Emissão rápida de NFC-e/NF-e, controle financeiro consolidado, fluxo de caixa e relatórios visuais de vendas por vendedor com Atual B.i.", servicos: "Use o Atual Messenger para revolucionar seu marketing: envie catálogos, parabenize aniversariantes e crie campanhas personalizadas no WhatsApp." } },
            { id: "auto_pecas", name: "Auto Peças e Oficinas", defaultTools: ["Atual Gestão", "Atual Messenger", "Atual B.i"], features: { estoque: "Cadastro robusto de produtos por códigos originais e similares (referências cruzadas), controle de lotes, marcas e endereçamento no galpão.", caixa: "Venda rápida de balcão, integração com orçamentos e pré-vendas, recebimento via PIX e TEF integrado sem filas.", fiscal: "Gestão completa de ST (Substituição Tributária), emissão segura de Notas Fiscais, fluxo de caixa detalhado e DRE automatizada pelo B.i.", servicos: "Módulo completo de Ordens de Serviço (OS): vincule produtos e horas de mecânicos, gerencie comissões, status dos veículos e envie alertas via WhatsApp." } },
            { id: "construcao", name: "Materiais de Construção", defaultTools: ["Atual Gestão", "Atual Messenger", "Atual B.i"], features: { estoque: "Venda fracionada e conversão de unidades (metro quadrado, metro linear, caixas). Controle de estoque multi-loja e gestão de entregas futuras.", caixa: "Agilidade no atendimento de balcão: transforme pré-vendas e orçamentos em vendas no PDV em 1 clique, com múltiplas formas de pagamento.", fiscal: "Controle tributário preciso para o varejo, conciliação bancária, fluxo de caixa e gestão de contas a receber com emissão de boletos.", servicos: "Controle eficiente de Romaneios de Entrega (logística) e campanhas de recuperação de clientes inativos através do Atual Messenger." } },
            { id: "moveis", name: "Loja de Móveis", defaultTools: ["Atual Gestão", "Atual Messenger", "Atual B.i"], features: { estoque: "Visão consolidada do estoque na loja e nos depósitos. Controle de mostruário, encomendas junto aos fornecedores e reserva de produtos.", caixa: "Recebimento flexível com crediário próprio, carnês, divisão de pagamentos em vários cartões e PIX, além de gestão de pré-vendas consultivas.", fiscal: "Análise profunda de margem de lucro por item com o Atual B.i., apuração de impostos e emissão rápida e segura de NF-e e boletos.", servicos: "Módulo especial para agendamento e controle de montadores, prazos de entrega e disparo de status dos pedidos via WhatsApp." } },
            { id: "ar_condicionado", name: "Serviços de Ar Condicionado", defaultTools: ["Atual Gestão", "Atual Messenger"], features: { estoque: "Controle de peças de reposição, ferramentas alocadas com técnicos, consumo de materiais (gás, tubulações) e histórico de compras.", caixa: "Faturamento facilitado de serviços e peças, recebimento em campo (via integração PIX) ou geração de boletos recorrentes para contratos.", fiscal: "Emissão conjugada de Nota Fiscal de Produto e Serviço. Controle unificado do financeiro, contas a receber e retenção de impostos.", servicos: "Controle ponta-a-ponta de Ordens de Serviço, agendamento de técnicos, PMOC e avisos automáticos de manutenção preventiva no WhatsApp do cliente." } },
            { id: "celulares", name: "Lojas de Celulares", defaultTools: ["Atual Gestão", "Atual Messenger"], features: { estoque: "Controle rigoroso de aparelhos através de Número de Série (IMEI). Rastreabilidade de histórico de vendas e compras por aparelho e gestão de acessórios.", caixa: "PDV veloz com leitura de código de barras para capas e películas, descontos parametrizados e recebimento integrado TEF.", fiscal: "Gerenciamento completo das finanças da loja, emissão automática de NFC-e, fluxo de caixa diário e gestão de margens de lucro.", servicos: "Módulo de Assistência Técnica: crie Ordens de Serviço detalhadas, controle laudos técnicos, tempo de reparo e termos de garantia impressos." } },
            { id: "supermercado", name: "Supermercados e Mercearias", defaultTools: ["Atual Gestão", "Atual Checkout", "Atual Conciliador", "Atual Controle Mobile", "Atual B.i"], features: { estoque: "Inventário inteligente via app, controle de validades, reposição automática baseada em curva ABC e gestão avançada de compras de perecíveis.", caixa: "Frente de caixa projetada para alto fluxo. Atual Checkout integra perfeitamente a balança e TEF/PIX garantindo velocidade máxima para acabar com as filas.", fiscal: "Tranquilidade tributária e financeira: Atual Conciliador confere todas as vendas de cartões, enquanto o B.i. entrega dashboards de vendas ao vivo.", servicos: "Aplicativos móveis de contagem (Atual Controle Mobile) para a equipe de salão conferir e corrigir etiquetas direto das gôndolas." } },
            { id: "naturais", name: "Lojas de Produtos Naturais", defaultTools: ["Atual Gestão", "Atual Checkout", "Atual B.i"], features: { estoque: "Precisão na gestão a granel. Transforme sacas de produtos em fracionados (gramas e quilos) sem perder a rastreabilidade do custo da mercadoria.", caixa: "Atendimento veloz com integração direta de balanças de balcão ou de caixa. O Atual Checkout captura o peso e converte para valor instantaneamente.", fiscal: "Relatórios analíticos do Atual B.i. para descobrir quais produtos a granel dão mais lucro, com emissão descomplicada de NFC-e.", servicos: "Geração de etiquetas nutricionais com tabela e códigos de barra gerados automaticamente pelo sistema para padronizar os itens ensacados." } }
        ];
        needsSave = true;
    }

    if (!db.settings.lostReasons || db.settings.lostReasons.length === 0) {
        db.settings.lostReasons = [
            "Concorrente fez mais barato",
            "Concorrente agregou mais valor a ferramenta",
            "Cliente optou por não colocar sistema agora",
            "Cliente optou por continuar no sistema atual",
            "Outros"
        ];
        needsSave = true;
    }

    // MIGRATION: Convert features object to dynamic array
    if (db.settings && db.settings.segments) {
        let migratedAny = false;
        db.settings.segments.forEach(seg => {
            if (seg.features && !Array.isArray(seg.features)) {
                const newFeatures = [];
                if (seg.features.estoque) newFeatures.push({ title: 'Controle de Estoque Inteligente', text: seg.features.estoque });
                if (seg.features.caixa) newFeatures.push({ title: 'Frente de Caixa (PDV)', text: seg.features.caixa });
                if (seg.features.fiscal) newFeatures.push({ title: 'Fiscal & Financeiro', text: seg.features.fiscal });
                if (seg.features.servicos) newFeatures.push({ title: 'Serviços Especiais', text: seg.features.servicos });
                seg.features = newFeatures;
                migratedAny = true;
            }
        });
        if (migratedAny) needsSave = true;
    }
    
    if (needsSave) {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
    return db;
};

const saveDB = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// ==========================================
// AUTENTICAÇÃO
// ==========================================

const login = (email, password) => {
    const db = initDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (!user) throw new Error("E-mail ou senha incorretos.");
    if (user.status !== 'aprovado') throw new Error("Seu cadastro ainda não foi aprovado pelo administrador.");
    
    // Salva a sessão
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamIds: user.teamIds || []
    }));
    
    return user;
};

const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
};

const getSession = () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

const requireAuth = () => {
    const session = getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    return session;
};

const requireAdmin = () => {
    const session = requireAuth();
    if (session.role !== 'admin') {
        window.location.href = 'dashboard.html';
    }
    return session;
};

const register = (name, email, password, requestedTeam, requestedRole) => {
    const db = initDB();
    if (db.users.find(u => u.email === email)) {
        throw new Error("Este e-mail já está em uso.");
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        password,
        role: 'vendedor',
        teamIds: [],
        status: 'pendente', // Exige aprovação
        requestedTeam: requestedTeam || '',
        requestedRole: requestedRole || ''
    };
    
    db.users.push(newUser);
    saveDB(db);
    return newUser;
};

// ==========================================
// USUÁRIOS & EQUIPES (ADMIN)
// ==========================================

const getUsers = () => initDB().users;
const getTeams = () => initDB().teams;

const approveUser = (id, role, teamIds) => {
    const db = initDB();
    const user = db.users.find(u => u.id === id);
    if (user) {
        user.status = 'aprovado';
        user.role = role;
        user.teamIds = teamIds; // Array de IDs de equipes
        saveDB(db);
    }
};

const updateUserByAdmin = (id, newName, newEmail) => {
    const db = initDB();
    const user = db.users.find(u => u.id === id);
    if (user) {
        // Verifica se o email já existe em outro usuário
        if (db.users.some(u => u.email === newEmail && u.id !== id)) {
            throw new Error("Este e-mail já está em uso por outro usuário.");
        }
        user.name = newName;
        user.email = newEmail;
        saveDB(db);
        
        // Atualiza a sessão caso o admin esteja editando a si mesmo
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (session && session.id === id) {
            session.name = newName;
            session.email = newEmail;
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
    }
};

const updateProfile = (id, newName, newEmail, oldPassword, newPassword) => {
    const db = initDB();
    const user = db.users.find(u => u.id === id);
    if (user) {
        if (db.users.some(u => u.email === newEmail && u.id !== id)) {
            throw new Error("Este e-mail já está em uso.");
        }
        
        if (newPassword && newPassword.trim() !== '') {
            if (user.password !== oldPassword) {
                throw new Error("A senha atual informada está incorreta.");
            }
            user.password = newPassword;
        }
        
        user.name = newName;
        user.email = newEmail;
        saveDB(db);
        
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (session && session.id === id) {
            session.name = newName;
            session.email = newEmail;
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
    }
};

const rejectUser = (userId) => {
    const db = initDB();
    db.users = db.users.filter(u => u.id !== userId);
    saveDB(db);
};

const createTeam = (name) => {
    const db = initDB();
    const newTeam = {
        id: 'team_' + Date.now(),
        name
    };
    db.teams.push(newTeam);
    saveDB(db);
    return newTeam;
};

const updateTeam = (teamId, newName) => {
    const db = initDB();
    const team = db.teams.find(t => t.id === teamId);
    if (team) {
        team.name = newName;
        saveDB(db);
    }
};

const deleteTeam = (teamId) => {
    const db = initDB();
    const hasUsers = db.users.some(u => u.teamIds && u.teamIds.includes(teamId));
    const hasProposals = db.proposals.some(p => p.teamIds && p.teamIds.includes(teamId));
    
    if (hasUsers || hasProposals) {
        throw new Error("Segurança: Não é possível excluir esta equipe pois há usuários ou propostas vinculadas a ela.");
    }
    
    db.teams = db.teams.filter(t => t.id !== teamId);
    saveDB(db);
};

// ==========================================
// CONFIGURAÇÕES GLOBAIS
// ==========================================

const getSettings = () => initDB().settings;

const updateMinimumWage = (value) => {
    const db = initDB();
    db.settings.minimumWage = parseFloat(value);
    saveDB(db);
};

const getLostReasons = () => {
    return initDB().settings.lostReasons || [];
};

const addLostReason = (reason) => {
    const db = initDB();
    if (!db.settings.lostReasons) db.settings.lostReasons = [];
    if (!db.settings.lostReasons.includes(reason)) {
        db.settings.lostReasons.push(reason);
        saveDB(db);
    }
};

const deleteLostReason = (reason) => {
    const db = initDB();
    if (db.settings.lostReasons) {
        db.settings.lostReasons = db.settings.lostReasons.filter(r => r !== reason);
        saveDB(db);
    }
};

// ==========================================
// CRUD FERRAMENTAS & SEGMENTOS (ADMIN)
// ==========================================

const getTools = () => initDB().settings.tools;
const getSegments = () => initDB().settings.segments;

const createTool = (id, name, desc, img, link) => {
    const db = initDB();
    if(db.settings.tools.find(t => t.id === id)) throw new Error('Ferramenta já existe');
    const newTool = { id, name, desc, img, link };
    db.settings.tools.push(newTool);
    saveDB(db);
    return newTool;
};

const updateTool = (id, name, desc, img, link) => {
    const db = initDB();
    const idx = db.settings.tools.findIndex(t => t.id === id);
    if (idx > -1) {
        db.settings.tools[idx] = { id, name, desc, img, link };
        saveDB(db);
    }
};

const deleteTool = (id) => {
    const db = initDB();
    db.settings.tools = db.settings.tools.filter(t => t.id !== id);
    db.settings.segments.forEach(seg => {
        seg.defaultTools = seg.defaultTools.filter(t => t !== id);
    });
    saveDB(db);
};

const createSegment = (id, name, features, defaultTools) => {
    const db = initDB();
    if(db.settings.segments.find(s => s.id === id)) throw new Error('Segmento já existe');
    const newSeg = { id, name, features, defaultTools };
    db.settings.segments.push(newSeg);
    saveDB(db);
    return newSeg;
};

const updateSegment = (id, name, features, defaultTools) => {
    const db = initDB();
    const idx = db.settings.segments.findIndex(s => s.id === id);
    if (idx > -1) {
        db.settings.segments[idx] = { id, name, features, defaultTools };
        saveDB(db);
    }
};

const deleteSegment = (id) => {
    const db = initDB();
    db.settings.segments = db.settings.segments.filter(s => s.id !== id);
    saveDB(db);
};

// ==========================================
// PROPOSTAS
// ==========================================

const saveProposal = (proposalData, existingId = null, existingStatus = null) => {
    const session = getSession();
    if (!session) throw new Error("Não autenticado");

    const db = initDB();
    
    if (existingId) {
        const idx = db.proposals.findIndex(p => p.id === existingId);
        if (idx > -1) {
            db.proposals[idx].data = proposalData;
            db.proposals[idx].date = new Date().toISOString(); // Update date on modify
            saveDB(db);
            return db.proposals[idx];
        }
    }
    
    const newProposal = {
        id: 'prop_' + Date.now(),
        sellerId: session.id,
        sellerName: session.name,
        teamIds: session.teamIds || [],
        date: new Date().toISOString(),
        status: existingStatus || 'rascunho',
        data: proposalData
    };
    
    db.proposals.push(newProposal);
    saveDB(db);
    return newProposal;
};

const getProposals = () => {
    const session = getSession();
    if (!session) return [];
    
    const db = initDB();
    
    // RBAC: Role Based Access Control
    if (session.role === 'admin') {
        return db.proposals; // Vê todas
    } 
    else if (session.role === 'dono_equipe') {
        // Vê as propostas cuja equipe cruze com as equipes do dono
        return db.proposals.filter(p => p.teamIds && p.teamIds.some(id => session.teamIds.includes(id)));
    } 
    else {
        // Vendedor comum: vê apenas as suas
        return db.proposals.filter(p => p.sellerId === session.id);
    }
};

const deleteProposal = (id) => {
    const session = getSession();
    if (!session) throw new Error("Não autenticado");
    
    const db = initDB();
    const idx = db.proposals.findIndex(p => p.id === id);
    if (idx === -1) return;
    
    const p = db.proposals[idx];
    
    let canDelete = false;
    if (session.role === 'admin') canDelete = true;
    else if (session.role === 'dono_equipe' && p.teamIds && p.teamIds.some(tid => session.teamIds.includes(tid))) canDelete = true;
    else if (p.sellerId === session.id) canDelete = true;
    
    if (canDelete) {
        db.proposals.splice(idx, 1);
        saveDB(db);
    } else {
        throw new Error("Sem permissão para excluir esta proposta");
    }
};

const updateProposalStatus = (id, newStatus, lostReason = null) => {
    const session = getSession();
    if (!session) throw new Error("Não autenticado");
    
    const db = initDB();
    const idx = db.proposals.findIndex(p => p.id === id);
    if (idx === -1) return;
    
    const p = db.proposals[idx];
    
    let canEdit = false;
    if (session.role === 'admin') canEdit = true;
    else if (session.role === 'dono_equipe' && p.teamIds && p.teamIds.some(tid => session.teamIds.includes(tid))) canEdit = true;
    else if (p.sellerId === session.id) canEdit = true;
    
    if (canEdit) {
        p.status = newStatus;
        if (newStatus === 'perdida' && lostReason) {
            if (!p.data) p.data = {};
            p.data.lostReason = lostReason;
        }
        saveDB(db);
    } else {
        throw new Error("Sem permissão para alterar esta proposta");
    }
};


// ==========================================
// TEMA CLARO / ESCURO (GLOBAL INJECTOR)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggleBtn';
    themeBtn.title = 'Alternar Tema';
    themeBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; border-radius: 50%; width: 36px; height: 36px; z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,0.3); background: var(--panel-bg); border: 1px solid var(--border-color); color: var(--text-main); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; opacity: 0.7;';
    
    themeBtn.addEventListener('mouseenter', () => { themeBtn.style.opacity = '1'; themeBtn.style.backgroundColor = 'var(--input-bg)'; });
    themeBtn.addEventListener('mouseleave', () => { themeBtn.style.opacity = '0.7'; themeBtn.style.backgroundColor = 'var(--panel-bg)'; });
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    themeBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
    
    themeBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });
    
    document.body.appendChild(themeBtn);
});

// ==========================================
// MIGRAÇÃO DE DADOS (CORREÇÃO DE EQUIPES)
// ==========================================
(() => {
    try {
        const db = JSON.parse(localStorage.getItem('atual_sistemas_db'));
        if (db) {
            let updated = false;
            
            if (!db.teams || db.teams.length === 0) {
                db.teams = [{ id: 'team_default', name: 'Equipe Padrão' }];
                updated = true;
            }
            
            const defaultTeamId = db.teams[0].id;
            const validTeamIds = db.teams.map(t => t.id);

            db.users.forEach(u => {
                // Limpa times inválidos
                if (u.teamIds && u.teamIds.length > 0) {
                    const originalLen = u.teamIds.length;
                    u.teamIds = u.teamIds.filter(tid => validTeamIds.includes(tid));
                    if(u.teamIds.length !== originalLen) updated = true;
                }
                
                // Atribui time padrão
                if (!u.teamIds || u.teamIds.length === 0) {
                    u.teamIds = [defaultTeamId];
                    updated = true;
                }
            });

            if (updated) {
                localStorage.setItem('atual_sistemas_db', JSON.stringify(db));
                console.log('Migração: Usuários sem equipe foram alocados automaticamente.');
                
                // Se estivermos editando a nós mesmos, precisamos arrumar a sessão também
                const sessionStr = localStorage.getItem('atual_sistemas_session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    if (!session.teamIds || session.teamIds.length === 0) {
                        session.teamIds = [defaultTeamId];
                        localStorage.setItem('atual_sistemas_session', JSON.stringify(session));
                    }
                }
            }
        }
    } catch(e) {
        console.error('Erro na migração de equipes:', e);
    }
})();

// ==========================================
// POPULANDO DADOS FICTÍCIOS SOLICITADOS (EQUIPES, USUÁRIOS E PROPOSTAS)
// ==========================================
(() => {
    try {
        const dbStr = localStorage.getItem('atual_sistemas_db');
        if (dbStr) {
            const db = JSON.parse(dbStr);
            
            const novasEquipes = [
                "Baixo Guandu", "Linhares", "Nova Venécias", "São Gabriel da Palha", 
                "Colatina", "Teixeira de Freitas", "Aracruz", "Santa Maria de Jetibá", 
                "Vitória", "Alegre", "Pancas"
            ];
            
            let inseriuAlgo = false;
            
            novasEquipes.forEach(nomeEquipe => {
                const idEquipe = 'team_' + nomeEquipe.toLowerCase().replace(/\s/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                // Se a equipe já existir, pula
                if (db.teams.find(t => t.id === idEquipe)) return;
                
                // Cria Equipe
                db.teams.push({ id: idEquipe, name: nomeEquipe });
                
                const ownerId = 'owner_' + idEquipe;
                const sellerId = 'seller_' + idEquipe;
                
                // Cria Dono da Equipe
                db.users.push({
                    id: ownerId,
                    name: 'Gerente ' + nomeEquipe,
                    email: `gerente.${idEquipe}@atualsistemas.com.br`,
                    password: '123',
                    role: 'dono_equipe',
                    teamIds: [idEquipe],
                    status: 'aprovado'
                });
                
                // Cria Vendedor
                db.users.push({
                    id: sellerId,
                    name: 'Vendedor ' + nomeEquipe,
                    email: `vendedor.${idEquipe}@atualsistemas.com.br`,
                    password: '123',
                    role: 'vendedor',
                    teamIds: [idEquipe],
                    status: 'aprovado'
                });
                
                // Cria Proposta Fictícia para o Vendedor
                const statuses = ['rascunho', 'enviada', 'aprovada', 'perdida'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                const implValue = (Math.floor(Math.random() * 10) + 5) * 100; // 500 a 1400
                const mensValue = (Math.floor(Math.random() * 10) + 2) * 50;  // 100 a 550
                
                db.proposals.push({
                    id: 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                    sellerId: sellerId,
                    sellerName: 'Vendedor ' + nomeEquipe,
                    date: new Date(Date.now() - Math.floor(Math.random() * 15) * 86400000).toISOString(),
                    status: randomStatus,
                    data: {
                        clientName: 'Cliente ' + nomeEquipe + ' S/A',
                        contactName: 'Contato Fictício',
                        implCost: 'R$ ' + implValue + ',00',
                        monthlyFee: 'R$ ' + mensValue + ',00',
                        segmentLabel: 'Comércio'
                    }
                });
                
                inseriuAlgo = true;
            });
            
            if (inseriuAlgo) {
                localStorage.setItem('atual_sistemas_db', JSON.stringify(db));
                console.log('Equipes, usuários e propostas fictícias foram injetados com sucesso.');
            }
        }
    } catch(e) {
        console.error('Erro ao popular dados fictícios:', e);
    }
})();
