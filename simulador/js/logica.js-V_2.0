var dados = { moveis: [], condicao: null, desmontagem: null, remontagem: null, fixacao: null, recortes: [], cidade: null };
var etapaAtual = 1;
var totalEtapas = 8;
var etapasAtivas = [1, 2, 5, 7, 8];

function iniciarSimulador() {
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
    if (etapaAtual === 2 && dados.condicao) atualizarEtapas();
    var idx = etapasAtivas.indexOf(etapaAtual);
    if (idx < etapasAtivas.length - 1) renderizarEtapa(etapasAtivas[idx + 1]);
}

function calcularEstimativa() {
    if (!validarEtapa()) return;
    exibirResultado();
}

function atualizarEtapas() {
    etapasAtivas = [1, 2];
    if (dados.condicao === 'usado') etapasAtivas.push(3, 4);
    var temFixacao = false, temRecorte = false;
    dados.moveis.forEach(function(k) {
        if (tabelaPrecos[k] && tabelaPrecos[k].permiteFixacao) temFixacao = true;
        if (tabelaPrecos[k] && tabelaPrecos[k].permiteRecortes) temRecorte = true;
    });
    if (temFixacao) etapasAtivas.push(5);
    if (temRecorte) etapasAtivas.push(6);
    etapasAtivas.push(7, 8);
    totalEtapas = etapasAtivas.length;
}

function renderizarEtapa(numero) {
    etapaAtual = numero;
    var idx = etapasAtivas.indexOf(numero) + 1;
    document.getElementById('progressoFill').style.width = Math.round((idx / totalEtapas) * 100) + '%';
    document.getElementById('progressoTexto').textContent = 'Etapa ' + idx + ' de ' + totalEtapas;
    
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
    configurarCliques(numero);
    atualizarBotoes();
    document.getElementById('etapaContainer').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function etapa1HTML() {
    var h = '<h2>Quais móveis deseja montar?</h2>';
    h += '<p style="text-align:center;color:#888;margin-bottom:20px;">Selecione todos os móveis do seu projeto. Múltiplos móveis no mesmo ambiente têm desconto!</p>';
    h += '<div class="opcoes-grid">';
    for (var k in tabelaPrecos) {
        var sel = dados.moveis.indexOf(k) !== -1 ? ' selecionado' : '';
        h += '<div class="opcao-item' + sel + '" data-valor="' + k + '" tabindex="0" onclick="toggleMovel(this, \'' + k + '\')">';
        h += '<span class="opcao-icone">' + tabelaPrecos[k].icone + '</span>';
        h += '<span class="opcao-nome">' + tabelaPrecos[k].nome + '</span></div>';
    }
    h += '</div>';
    h += '<p style="text-align:center;margin-top:15px;font-weight:600;color:var(--azul-escuro);">';
    h += '<span id="contadorMoveis">' + dados.moveis.length + '</span> móvel(is) selecionado(s)</p>';
    return h;
}

function toggleMovel(el, key) {
    var idx = dados.moveis.indexOf(key);
    if (idx === -1) {
        dados.moveis.push(key);
        el.classList.add('selecionado');
    } else {
        dados.moveis.splice(idx, 1);
        el.classList.remove('selecionado');
    }
    var c = document.getElementById('contadorMoveis');
    if (c) c.textContent = dados.moveis.length;
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
    if (dados.condicao === 'novo') { dados.desmontagem = null; dados.remontagem = null; }
    atualizarEtapas();
}

function etapa3HTML() {
    var h = '<h2>Será necessário desmontar?</h2><div class="opcoes-simples">';
    h += '<div class="opcao-simples' + (dados.desmontagem === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0" onclick="selecionarSimNao(this, \'desmontagem\')">Sim</div>';
    h += '<div class="opcao-simples' + (dados.desmontagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0" onclick="selecionarSimNao(this, \'desmontagem\')">Não</div>';
    return h + '</div>';
}

function etapa4HTML() {
    var h = '<h2>Será necessária remontagem?</h2><div class="opcoes-simples">';
    h += '<div class="opcao-simples' + (dados.remontagem === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0" onclick="selecionarSimNao(this, \'remontagem\')">Sim</div>';
    h += '<div class="opcao-simples' + (dados.remontagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0" onclick="selecionarSimNao(this, \'remontagem\')">Não</div>';
    return h + '</div>';
}

function selecionarSimNao(el, campo) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados[campo] = el.getAttribute('data-valor');
}

function etapa5HTML() {
    var h = '<h2>Será necessário fixar na parede?</h2><p style="text-align:center;color:#888;margin-bottom:15px;">Essencial para armários altos, painéis e guarda-roupas</p><div class="opcoes-simples">';
    h += '<div class="opcao-simples' + (dados.fixacao === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0" onclick="selecionarFixacao(this)">Sim</div>';
    h += '<div class="opcao-simples' + (dados.fixacao === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0" onclick="selecionarFixacao(this)">Não</div>';
    h += '<div class="opcao-simples' + (dados.fixacao === 'naosei' ? ' selecionado' : '') + '" data-valor="naosei" tabindex="0" onclick="selecionarFixacao(this)">Não sei</div>';
    return h + '</div>';
}

function selecionarFixacao(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.fixacao = el.getAttribute('data-valor');
}

function etapa6HTML() {
    var recs = ['Pia/Cuba', 'Cooktop', 'Sifão', 'Tomada', 'Rodapé', 'Tubulação'];
    var h = '<h2>Será necessário algum recorte?</h2><p style="text-align:center;color:#888;margin-bottom:15px;">Comum em cozinhas e balcões</p><div class="opcoes-checkbox">';
    recs.forEach(function(r) {
        var sel = dados.recortes.indexOf(r) !== -1 ? ' selecionado' : '';
        h += '<div class="opcao-checkbox' + sel + '" data-valor="' + r + '" tabindex="0" onclick="toggleRecorte(this)">' + r + '</div>';
    });
    return h + '</div>';
}

function toggleRecorte(el) {
    var v = el.getAttribute('data-valor');
    var ri = dados.recortes.indexOf(v);
    if (ri === -1) { dados.recortes.push(v); el.classList.add('selecionado'); }
    else { dados.recortes.splice(ri, 1); el.classList.remove('selecionado'); }
}

function etapa7HTML() {
    var cidades = [
        { v: 'valparaiso', n: 'Valparaíso de Goiás' },
        { v: 'jardim-inga', n: 'Jardim Ingá' },
        { v: 'novo-gama', n: 'Novo Gama' },
        { v: 'cidade-ocidental', n: 'Cidade Ocidental' },
        { v: 'luziania', n: 'Luziânia' },
        { v: 'gama', n: 'Gama' },
        { v: 'outro', n: 'Outra localidade' }
    ];
    var h = '<h2>Qual a sua cidade?</h2><div class="opcoes-grid">';
    cidades.forEach(function(c) {
        var sel = dados.cidade === c.v ? ' selecionado' : '';
        h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" tabindex="0" onclick="selecionarCidade(this)"><span class="opcao-nome">' + c.n + '</span></div>';
    });
    return h + '</div>';
}

function selecionarCidade(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.cidade = el.getAttribute('data-valor');
}

function etapa8HTML() {
    var h = '<h2>Confira as informações</h2><ul style="list-style:none;padding:0;">';
    h += '<li style="padding:8px 0;"><strong>Móveis:</strong><br>';
    dados.moveis.forEach(function(key) { h += '• ' + tabelaPrecos[key].nome + '<br>'; });
    h += '</li>';
    h += '<li style="padding:8px 0;"><strong>Condição:</strong> ' + (dados.condicao === 'novo' ? 'Novo(s)' : 'Usado(s)') + '</li>';
    if (dados.condicao === 'usado') {
        h += '<li style="padding:8px 0;"><strong>Desmontagem:</strong> ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
        h += '<li style="padding:8px 0;"><strong>Remontagem:</strong> ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
    }
    if (dados.fixacao) h += '<li style="padding:8px 0;"><strong>Fixação:</strong> ' + (dados.fixacao === 'sim' ? 'Sim' : dados.fixacao === 'nao' ? 'Não' : 'Não sei') + '</li>';
    if (dados.recortes.length > 0) h += '<li style="padding:8px 0;"><strong>Recortes:</strong> ' + dados.recortes.join(', ') + '</li>';
    h += '<li style="padding:8px 0;"><strong>Cidade:</strong> ' + (fatorLocalizacao[dados.cidade] ? fatorLocalizacao[dados.cidade].descricao : dados.cidade) + '</li></ul>';
    h += '<p style="text-align:center;color:#888;margin-top:15px;">Clique em <strong>Calcular Estimativa</strong> para ver o resultado.</p>';
    return h;
}

function configurarCliques(numero) {
    // Os cliques já são configurados via onclick inline no HTML - não precisa de addEventListener
}

function validarEtapa() {
    if (etapaAtual === 1 && dados.moveis.length === 0) { alert('Selecione pelo menos um móvel.'); return false; }
    if (etapaAtual === 2 && !dados.condicao) { alert('Informe se o móvel é novo ou usado.'); return false; }
    if (etapaAtual === 3 && !dados.desmontagem) { alert('Informe sobre a desmontagem.'); return false; }
    if (etapaAtual === 4 && !dados.remontagem) { alert('Informe sobre a remontagem.'); return false; }
    if (etapaAtual === 5 && !dados.fixacao) { alert('Informe sobre a fixação na parede.'); return false; }
    if (etapaAtual === 7 && !dados.cidade) { alert('Selecione sua cidade.'); return false; }
    return true;
}

function atualizarBotoes() {
    var idx = etapasAtivas.indexOf(etapaAtual);
    document.getElementById('btnVoltar').style.display = idx > 0 ? 'inline-block' : 'none';
    if (idx === etapasAtivas.length - 1) {
        document.getElementById('btnAvancar').style.display = 'none';
        document.getElementById('btnCalcular').style.display = 'inline-block';
    } else {
        document.getElementById('btnAvancar').style.display = 'inline-block';
        document.getElementById('btnCalcular').style.display = 'none';
    }
}

function formatarTempo(min) {
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60), m = min % 60;
    if (m === 0) return h + 'h';
    return h + 'h' + m + 'min';
}

function exibirResultado() {
    var loc = fatorLocalizacao[dados.cidade] || fatorLocalizacao['outro'];
    var pMin = 0, pMax = 0, tMin = 0, tMax = 0, obs = [], compMax = 'baixa', nomes = [];
    
    dados.moveis.forEach(function(k) {
        var m = tabelaPrecos[k];
        nomes.push(m.nome);
        pMin += m.precoMin; pMax += m.precoMax;
        tMin += m.tempoMin; tMax += m.tempoMax;
        if (m.complexidade === 'alta') compMax = 'alta';
        else if (m.complexidade === 'media' && compMax !== 'alta') compMax = 'media';
    });
    
    if (dados.moveis.length > 1) {
        pMin = Math.round(pMin * 0.9); pMax = Math.round(pMax * 0.9);
        obs.push('Desconto de 10% para múltiplos móveis no mesmo ambiente.');
    }
    if (dados.condicao === 'usado') {
        pMin = Math.round(pMin * 1.2); pMax = Math.round(pMax * 1.2);
        obs.push(fatoresAjuste.usado.descricao);
    }
    if (dados.desmontagem === 'sim') {
        pMin += 80; pMax += 80; tMin += 60; tMax += 60;
        obs.push(fatoresAjuste.desmontagem.descricao);
    }
    if (dados.remontagem === 'sim') {
        pMin += 50; pMax += 50;
        obs.push(fatoresAjuste.remontagem.descricao);
    }
    if (dados.fixacao === 'sim') {
        pMin += 30; pMax += 30; tMin += 20; tMax += 20;
        obs.push(fatoresAjuste.fixacaoParede.descricao);
    }
    if (dados.recortes.length > 0) {
        pMin += 60; pMax += 60; tMin += 40; tMax += 40;
        obs.push(fatoresAjuste.recorte.descricao);
    }
    
    pMin = Math.round(pMin * loc.multiplicador);
    pMax = Math.round(pMax * loc.multiplicador);
    
    var comp = compMax === 'baixa' ? '🟢 Baixa' : compMax === 'media' ? '🟡 Média' : '🔴 Alta';
    
    var msg = 'Olá!%0A%0AUtilizei o Simulador de Preço da MontaTech.%0A%0A' +
        'Móveis: ' + nomes.join(', ') + '%0A' +
        'Condição: ' + (dados.condicao === 'novo' ? 'Novo' : 'Usado') + '%0A';
    if (dados.condicao === 'usado') {
        msg += 'Desmontagem: ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '%0A';
        msg += 'Remontagem: ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '%0A';
    }
    msg += 'Cidade: ' + loc.descricao + '%0AEstimativa: R$ ' + pMin + ' a R$ ' + pMax + '%0A%0AGostaria de solicitar um orçamento.';
    
    var h = '<div class="resultado-header"><h2>Estimativa de Montagem</h2><p class="resultado-movel">' + nomes.join(' + ') + '</p></div>';
    h += '<div class="resultado-body">';
    h += '<div class="resultado-item"><span class="resultado-label">Complexidade</span><span class="resultado-valor">' + comp + '</span></div>';
    h += '<div class="resultado-item"><span class="resultado-label">Tempo estimado</span><span class="resultado-valor">Entre ' + formatarTempo(tMin) + ' e ' + formatarTempo(tMax) + '</span></div>';
    h += '<div class="resultado-item"><span class="resultado-label">Faixa de investimento</span><span class="resultado-valor" style="font-size:1.3em;color:var(--verde);">R$ ' + pMin + ' a R$ ' + pMax + '</span></div>';
    if (dados.moveis.length > 1) h += '<div class="resultado-item"><span class="resultado-label">💰 Desconto</span><span class="resultado-valor" style="color:var(--verde);">-10% aplicado</span></div>';
    h += '<div class="resultado-aviso">⚠️ <strong>Importante:</strong> Estimativa baseada nas informações fornecidas. O orçamento definitivo depende da análise dos móveis e das condições do ambiente.</div>';
    if (obs.length > 0) {
        h += '<div class="resultado-observacoes"><h4>📝 Observações:</h4><ul style="padding-left:18px;">';
        obs.forEach(function(o) { h += '<li style="margin-bottom:5px;">' + o + '</li>'; });
        h += '</ul></div>';
    }
    h += '<div class="resultado-cta">';
    h += '<a href="https://api.whatsapp.com/send/?phone=5561998865417&text=' + msg + '&type=phone_number&app_absent=0" class="btn-whatsapp" target="_blank" rel="noopener">📱 Solicitar Orçamento pelo WhatsApp</a><br>';
    h += '<button class="btn-reiniciar" onclick="location.reload();">🔄 Fazer Nova Simulação</button>';
    h += '</div></div>';
    
    document.getElementById('resultadoCard').innerHTML = h;
    document.getElementById('simuladorWizard').style.display = 'none';
    document.getElementById('simuladorResultado').style.display = 'block';
    document.getElementById('simuladorResultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Vincular botões
document.addEventListener('DOMContentLoaded', function() {
    var btnIniciar = document.getElementById('btnIniciar');
    if (btnIniciar) btnIniciar.onclick = iniciarSimulador;
    var btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) btnVoltar.onclick = voltarEtapa;
    var btnAvancar = document.getElementById('btnAvancar');
    if (btnAvancar) btnAvancar.onclick = avancarEtapa;
    var btnCalcular = document.getElementById('btnCalcular');
    if (btnCalcular) btnCalcular.onclick = calcularEstimativa;
});
