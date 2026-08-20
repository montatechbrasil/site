var dadosSimulador = null;
var dadosMateriais = null;
var dados = {
    moveis: {},
    condicao: null,
    tipoServico: null,
    embalagem: null,
    cidade: null,
    cidadeDiferente: false,
    cidadeOrigem: null,
    cidadeDestino: null,
    adicionais: [],
    recortes: [],
    recortesChapa: false,
    iluminacaoLED: false,
    balcaoSuspenso: false
};
var etapaAtual = 1;
var totalEtapas = 8;
var etapasAtivas = [1, 2, 4, 5, 6, 7, 8];

function carregarDados() {
    var xhrDados = new XMLHttpRequest();
    xhrDados.open('GET', 'js/dados.json', true);
    xhrDados.onload = function() {
        if (xhrDados.status === 200) {
            dadosSimulador = JSON.parse(xhrDados.responseText);
            carregarMateriais();
        }
    };
    xhrDados.send();
}

function carregarMateriais() {
    var xhrMat = new XMLHttpRequest();
    xhrMat.open('GET', 'js/materiais.json', true);
    xhrMat.onload = function() {
        if (xhrMat.status === 200) {
            dadosMateriais = JSON.parse(xhrMat.responseText);
            configurarBotoes();
        }
    };
    xhrMat.send();
}

function iniciarCalculadora() {
    document.getElementById('simuladorHero').style.display = 'none';
    document.getElementById('simuladorWizard').style.display = 'block';
    var seo = document.getElementById('simuladorSeo');
    if (seo) seo.style.display = 'none';
    renderizarEtapa(1);
}

function voltarEtapa() {
    var idx = etapasAtivas.indexOf(etapaAtual);
    if (idx > 0) renderizarEtapa(etapasAtivas[idx - 1]);
}

function avancarEtapa() {
    if (!validarEtapa()) return;
    if (etapaAtual === 2 && dados.condicao === 'usado') {
        if (etapasAtivas.indexOf(3) === -1) { etapasAtivas.splice(2, 0, 3); totalEtapas = 8; }
    }
    if (etapaAtual === 2 && dados.condicao === 'novo') {
        var idx3 = etapasAtivas.indexOf(3);
        if (idx3 !== -1) { etapasAtivas.splice(idx3, 1); totalEtapas = 7; }
    }
    var idx = etapasAtivas.indexOf(etapaAtual);
    if (idx < etapasAtivas.length - 1) renderizarEtapa(etapasAtivas[idx + 1]);
}

function calcularEstimativa() {
    if (!validarEtapa()) return;
    exibirResultado();
}

function totalMoveis() {
    var t = 0;
    for (var k in dados.moveis) t += dados.moveis[k];
    return t;
}

function renderizarEtapa(numero) {
    etapaAtual = numero;
    var idx = etapasAtivas.indexOf(numero) + 1;
    var total = etapasAtivas.length;
    document.getElementById('progressoFill').style.width = Math.round((idx / total) * 100) + '%';
    document.getElementById('progressoTexto').textContent = 'Etapa ' + idx + ' de ' + total;
    var html = '';
    if (numero === 1) html = etapa1HTML();
    if (numero === 2) html = etapa2HTML();
    if (numero === 3) html = etapa3HTML();
    if (numero === 4) html = etapa4HTML();
    if (numero === 5) html = etapa5HTML();
    if (numero === 6) html = etapa6HTML();
    if (numero === 7) html = etapa7HTML();
    if (numero === 8) html = etapa8HTML();
    document.getElementById('etapaContainer').innerHTML = html;
    atualizarBotoes();
    if (numero !== 1) {
        document.getElementById('etapaContainer').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function atualizarEtapa1Suave() {
    var scrollY = window.scrollY;
    document.getElementById('etapaContainer').innerHTML = etapa1HTML();
    window.scrollTo(0, scrollY);
}

function etapa1HTML() {
    var moveis = dadosSimulador.moveis;
    var h = '<h2>Quais móveis deseja montar?</h2>';
    h += '<p style="text-align:center;color:#888;margin-bottom:20px;">Clique no móvel para adicionar. Use + e − para ajustar a quantidade.</p>';
    h += '<div class="opcoes-grid">';
    for (var k in moveis) {
        var qtd = dados.moveis[k] || 0;
        var sel = qtd > 0 ? ' selecionado' : '';
        h += '<div class="opcao-item' + sel + '" data-valor="' + k + '" tabindex="0" onclick="adicionarMovel(\'' + k + '\')">';
        h += '<span class="opcao-icone">' + moveis[k].icone + '</span>';
        h += '<span class="opcao-nome">' + moveis[k].nome + '</span>';
        if (qtd > 0) {
            h += '<div class="qtd-controle" style="display:flex;align-items:center;gap:8px;margin-top:8px;">';
            h += '<button class="qtd-btn" onclick="event.stopPropagation();alterarQtd(\'' + k + '\', -1)" style="width:28px;height:28px;border-radius:50%;border:2px solid var(--verde);background:white;color:var(--verde);font-weight:bold;cursor:pointer;font-size:16px;">−</button>';
            h += '<span class="qtd-num" style="font-weight:700;color:var(--azul-escuro);min-width:20px;text-align:center;">' + qtd + '</span>';
            h += '<button class="qtd-btn" onclick="event.stopPropagation();alterarQtd(\'' + k + '\', 1)" style="width:28px;height:28px;border-radius:50%;border:2px solid var(--verde);background:white;color:var(--verde);font-weight:bold;cursor:pointer;font-size:16px;">+</button>';
            h += '</div>';
        }
        h += '</div>';
    }
    h += '</div>';
    h += '<p style="text-align:center;margin-top:15px;font-weight:600;color:var(--azul-escuro);">';
    h += '<span id="contadorMoveis">' + totalMoveis() + '</span> móvel(is) selecionado(s)</p>';
    return h;
}

function adicionarMovel(key) {
    if (dadosSimulador.moveis[key] && dadosSimulador.moveis[key].linkWhatsApp) {
        window.open('https://api.whatsapp.com/send/?phone=5561998865417&text=Ol%C3%A1%2C+quero+um+or%C3%A7amento+para+cozinha+planejada', '_blank');
        return;
    }
    if (!dados.moveis[key]) { dados.moveis[key] = 1; } else { dados.moveis[key] += 1; }
    atualizarEtapa1Suave();
}

function alterarQtd(key, delta) {
    if (!dados.moveis[key]) dados.moveis[key] = 0;
    dados.moveis[key] += delta;
    if (dados.moveis[key] < 0) dados.moveis[key] = 0;
    if (dados.moveis[key] === 0) delete dados.moveis[key];
    atualizarEtapa1Suave();
}

function etapa2HTML() {
    var h = '<h2>O(s) móvel(is) é(são):</h2><div class="opcoes-simples">';
    h += '<div class="opcao-simples' + (dados.condicao === 'novo' ? ' selecionado' : '') + '" data-valor="novo" tabindex="0" onclick="selecionarCondicao(this)">🆕 Novo(s)</div>';
    h += '<div class="opcao-simples' + (dados.condicao === 'usado' ? ' selecionado' : '') + '" data-valor="usado" tabindex="0" onclick="selecionarCondicao(this)">🔄 Usado(s)</div>';
    return h + '</div>';
}

function selecionarCondicao(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.condicao = el.getAttribute('data-valor');
}

function etapa3HTML() {
    var h = '<h2>Qual serviço você precisa?</h2><div class="opcoes-simples" style="flex-direction:column;">';
    h += '<div class="opcao-simples' + (dados.tipoServico === 'montagem' ? ' selecionado' : '') + '" data-valor="montagem" tabindex="0" onclick="selecionarTipoServico(this)">🔧 Montagem</div>';
    h += '<div class="opcao-simples' + (dados.tipoServico === 'desmontagem' ? ' selecionado' : '') + '" data-valor="desmontagem" tabindex="0" onclick="selecionarTipoServico(this)">🔨 Desmontagem</div>';
    h += '<div class="opcao-simples' + (dados.tipoServico === 'remontagem' ? ' selecionado' : '') + '" data-valor="remontagem" tabindex="0" onclick="selecionarTipoServico(this)">🔄 Remontagem</div>';
    h += '<div class="opcao-simples' + (dados.tipoServico === 'desmontagem_montagem' ? ' selecionado' : '') + '" data-valor="desmontagem_montagem" tabindex="0" onclick="selecionarTipoServico(this)">🔨🔧 Desmontagem + Montagem</div>';
    h += '</div>';
    h += '<h3 style="margin-top:25px;">Precisa de embalagem?</h3>';
    h += '<div class="opcoes-simples" style="flex-direction:column;">';
    h += '<div class="opcao-simples' + (dados.embalagem === 'embalar' ? ' selecionado' : '') + '" data-valor="embalar" tabindex="0" onclick="selecionarEmbalagem(this)">📦 Embalar</div>';
    h += '<div class="opcao-simples' + (dados.embalagem === 'desembalar' ? ' selecionado' : '') + '" data-valor="desembalar" tabindex="0" onclick="selecionarEmbalagem(this)">📤 Desembalar</div>';
    h += '<
