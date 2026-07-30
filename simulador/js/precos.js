// ============================================
// MONTATECH BRASIL - TABELA DE PREÇOS
// Edite aqui para ajustar valores, tempos e observações
// ============================================

var tabelaPrecos = {
    "guarda-roupa-solteiro": {
        nome: "Guarda-roupa Solteiro",
        icone: "🚪",
        categoria: "Quarto",
        complexidade: "media",
        tempoMin: 180,
        tempoMax: 300,
        precoMin: 250,
        precoMax: 500,
        observacao: "Guarda-roupas solteiros costumam ter montagem mais rápida, mas exigem cuidado com nivelamento e portas."
    },
    "guarda-roupa-casal": {
        nome: "Guarda-roupa Casal",
        icone: "🚪",
        categoria: "Quarto",
        complexidade: "alta",
        tempoMin: 240,
        tempoMax: 480,
        precoMin: 350,
        precoMax: 700,
        observacao: "Móveis grandes podem exigir mais de um profissional. Verifique o espaço disponível no ambiente."
    },
    "guarda-roupa-correr": {
        nome: "Guarda-roupa Portas de Correr",
        icone: "🚪",
        categoria: "Quarto",
        complexidade: "alta",
        tempoMin: 300,
        tempoMax: 480,
        precoMin: 450,
        precoMax: 850,
        observacao: "Guarda-roupas com portas de correr exigem maior tempo de regulagem e ajuste dos trilhos."
    },
    "cozinha-modulada": {
        nome: "Cozinha Modulada",
        icone: "🍳",
        categoria: "Cozinha",
        complexidade: "alta",
        tempoMin: 300,
        tempoMax: 900,
        precoMin: 500,
        precoMax: 900,
        observacao: "Recortes para pia e ajustes hidráulicos podem alterar o tempo de execução."
    },
    "rack": {
        nome: "Rack para TV",
        icone: "📺",
        categoria: "Sala",
        complexidade: "media",
        tempoMin: 60,
        tempoMax: 180,
        precoMin: 180,
        precoMax: 380,
        observacao: "Racks com portas de vidro ou iluminação embutida exigem cuidado redobrado."
    },
    "painel-tv": {
        nome: "Painel para TV",
        icone: "🖥️",
        categoria: "Sala",
        complexidade: "media",
        tempoMin: 120,
        tempoMax: 240,
        precoMin: 180,
        precoMax: 450,
        observacao: "A fixação na parede é essencial para segurança. Verifique o tipo de parede antes da instalação."
    },
    "comoda": {
        nome: "Cômoda",
        icone: "🗄️",
        categoria: "Quarto",
        complexidade: "media",
        tempoMin: 60,
        tempoMax: 120,
        precoMin: 180,
        precoMax: 350,
        observacao: "O número de gavetas influencia diretamente no tempo de montagem."
    },
    "escrivaninha": {
        nome: "Escrivaninha",
        icone: "✏️",
        categoria: "Escritório",
        complexidade: "baixa",
        tempoMin: 60,
        tempoMax: 120,
        precoMin: 150,
        precoMax: 280,
        observacao: "Escrivaninhas com gavetas ou nichos embutidos exigem mais atenção na montagem."
    },
    "mesa": {
        nome: "Mesa",
        icone: "🍽️",
        categoria: "Sala",
        complexidade: "baixa",
        tempoMin: 30,
        tempoMax: 90,
        precoMin: 100,
        precoMax: 250,
        observacao: "Mesas com tampo de vidro exigem cuidado especial no manuseio."
    },
    "mesa-jantar": {
        nome: "Mesa de Jantar",
        icone: "🍽️",
        categoria: "Sala",
        complexidade: "media",
        tempoMin: 60,
        tempoMax: 180,
        precoMin: 150,
        precoMax: 350,
        observacao: "Mesas extensíveis possuem mecanismos que exigem atenção na montagem."
    },
    "sapateira": {
        nome: "Sapateira",
        icone: "👞",
        categoria: "Quarto",
        complexidade: "baixa",
        tempoMin: 30,
        tempoMax: 60,
        precoMin: 90,
        precoMax: 180,
        observacao: "Sapateiras com portas de correr precisam de ajuste fino nos trilhos."
    },
    "estante": {
        nome: "Estante",
        icone: "📚",
        categoria: "Sala",
        complexidade: "baixa",
        tempoMin: 40,
        tempoMax: 120,
        precoMin: 120,
        precoMax: 200,
        observacao: "Estantes altas devem ser fixadas na parede para segurança."
    },
    "armario-aereo": {
        nome: "Armário Aéreo",
        icone: "🗄️",
        categoria: "Cozinha",
        complexidade: "media",
        tempoMin: 60,
        tempoMax: 150,
        precoMin: 120,
        precoMax: 250,
        observacao: "A fixação na parede é obrigatória. Verifique se há tubulações antes de furar."
    },
    "balcao": {
        nome: "Balcão de Cozinha",
        icone: "🍳",
        categoria: "Cozinha",
        complexidade: "media",
        tempoMin: 90,
        tempoMax: 180,
        precoMin: 150,
        precoMax: 300,
        observacao: "Recortes para cuba e torneira podem aumentar o tempo de instalação."
    },
    "nicho": {
        nome: "Nicho",
        icone: "📦",
        categoria: "Geral",
        complexidade: "baixa",
        tempoMin: 20,
        tempoMax: 40,
        precoMin: 60,
        precoMax: 120,
        observacao: "Nichos com iluminação embutida exigem cuidado com a instalação elétrica."
    },
    "home-office": {
        nome: "Home Office Completo",
        icone: "💻",
        categoria: "Escritório",
        complexidade: "alta",
        tempoMin: 240,
        tempoMax: 480,
        precoMin: 400,
        precoMax: 800,
        observacao: "Conjuntos de home office incluem mesa, gaveteiro e prateleiras. O tempo varia conforme a quantidade de peças."
    }
};

// Fatores de ajuste
var fatoresAjuste = {
    usado: { multiplicador: 1.2, descricao: "Móveis usados podem exigir ajustes extras ou substituição de ferragens." },
    desmontagem: { adicionalTempo: 60, adicionalPreco: 80, descricao: "A desmontagem prévia adiciona tempo e cuidado ao serviço." },
    remontagem: { adicionalTempo: 30, adicionalPreco: 50, descricao: "A remontagem exige organização adicional das peças." },
    fixacaoParede: { adicionalTempo: 20, adicionalPreco: 30, descricao: "Fixação na parede é essencial para segurança em móveis altos." },
    recorte: { adicionalTempo: 40, adicionalPreco: 60, descricao: "Recortes para pia, tomadas ou rodapés exigem ferramentas específicas." }
};

// Fator de localização
var fatorLocalizacao = {
    "valparaiso": { multiplicador: 1.0, descricao: "Valparaíso de Goiás" },
    "novo-gama": { multiplicador: 1.05, descricao: "Novo Gama" },
    "cidade-ocidental": { multiplicador: 1.05, descricao: "Cidade Ocidental" },
    "luziania": { multiplicador: 1.08, descricao: "Luziânia" },
    "jardim-inga": { multiplicador: 1.0, descricao: "Jardim Ingá" },
    "gama": { multiplicador: 1.08, descricao: "Gama DF" },
    "outro": { multiplicador: 1.1, descricao: "Outra localidade" }
};
