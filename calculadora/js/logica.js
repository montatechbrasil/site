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
var etapasAtivas = [1, 2, 3, 4, 5, 6, 7];

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

function definirEtapas() {
    if (dados.condicao === 'novo') {
        etapasAtivas = [1, 2, 4, 5, 6, 7];
    } else {
        etapasAtivas = [1, 2, 3, 4, 5, 6, 7];
    }
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
    if (etapaAtual === 2 && dados.condicao) definirEtapas();
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
    if (numero === 7) html = etapaResumoHTML();
    document.getElementById('etapaContainer').innerHTML = html;
    atualizarBotoes();
    var wizardTop = document.getElementById('simuladorWizard').getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: wizardTop, behavior: 'smooth' });
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
    if (dados.condicao === 'novo') {
        dados.tipoServico = 'montagem';
        dados.embalagem = 'nao';
        dados.cidadeDiferente = false;
        dados.cidadeOrigem = null;
        dados.cidadeDestino = null;
    } else {
        dados.tipoServico = null;
        dados.embalagem = null;
    }
    definirEtapas();
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
    h += '<div class="opcao-simples' + (dados.embalagem === 'embalar_desembalar' ? ' selecionado' : '') + '" data-valor="embalar_desembalar" tabindex="0" onclick="selecionarEmbalagem(this)">📦📤 Embalar + Desembalar</div>';
    h += '<div class="opcao-simples' + (dados.embalagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0" onclick="selecionarEmbalagem(this)">❌ Não preciso</div>';
    h += '</div>';
    return h;
}

function selecionarTipoServico(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.tipoServico = el.getAttribute('data-valor');
}

function selecionarEmbalagem(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.embalagem = el.getAttribute('data-valor');
}

function etapa4HTML() {
    var cidades = [
        { v: 'valparaiso', n: 'Valparaíso de Goiás' },
        { v: 'jardim-inga', n: 'Jardim Ingá' },
        { v: 'ocidental', n: 'Cidade Ocidental' },
        { v: 'novo-gama', n: 'Novo Gama' },
        { v: 'pedregal', n: 'Pedregal' },
        { v: 'ceu-azul', n: 'Céu Azul' },
        { v: 'luziania', n: 'Luziânia' },
        { v: 'santa-maria', n: 'Santa Maria' },
        { v: 'gama', n: 'Gama DF' },
        { v: 'outro', n: 'Outra localidade' }
    ];
    
    if (dados.condicao === 'usado' && dados.tipoServico && dados.tipoServico.indexOf('desmontagem') !== -1) {
        var h = '<h2>Localização do serviço</h2>';
        h += '<p style="text-align:center;color:#888;margin-bottom:20px;">A desmontagem e remontagem serão na mesma cidade?</p>';
        h += '<div class="opcoes-simples" style="margin-bottom:25px;">';
        h += '<div class="opcao-simples' + (dados.cidadeDiferente === false ? ' selecionado' : '') + '" data-valor="nao" tabindex="0" onclick="selecionarMesmaCidade(this)">Sim, mesma cidade</div>';
        h += '<div class="opcao-simples' + (dados.cidadeDiferente === true ? ' selecionado' : '') + '" data-valor="sim" tabindex="0" onclick="selecionarMesmaCidade(this)">Não, cidades diferentes</div>';
        h += '</div>';
        
        if (dados.cidadeDiferente) {
            h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:25px;">';
            h += '<div><h3 style="text-align:center;color:var(--azul-escuro);margin-bottom:12px;">🏠 Cidade de Origem</h3><div class="opcoes-grid" style="grid-template-columns:1fr;">';
            cidades.forEach(function(c) {
                var sel = dados.cidadeOrigem === c.v ? ' selecionado' : '';
                h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" data-tipo="origem" tabindex="0" onclick="selecionarCidadeEspecifica(this)"><span class="opcao-nome">' + c.n + '</span></div>';
            });
            h += '</div></div>';
            h += '<div><h3 style="text-align:center;color:var(--azul-escuro);margin-bottom:12px;">🏡 Cidade de Destino</h3><div class="opcoes-grid" style="grid-template-columns:1fr;">';
            cidades.forEach(function(c) {
                var sel = dados.cidadeDestino === c.v ? ' selecionado' : '';
                h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" data-tipo="destino" tabindex="0" onclick="selecionarCidadeEspecifica(this)"><span class="opcao-nome">' + c.n + '</span></div>';
            });
            h += '</div></div></div>';
        } else {
            h += '<h3 style="text-align:center;color:var(--azul-escuro);margin-bottom:12px;">Selecione sua cidade:</h3><div class="opcoes-grid">';
            cidades.forEach(function(c) {
                var sel = dados.cidade === c.v ? ' selecionado' : '';
                h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" tabindex="0" onclick="selecionarCidadeUnica(this)"><span class="opcao-nome">' + c.n + '</span></div>';
            });
            h += '</div>';
        }
        return h;
    }
    
    var h = '<h2>Qual a sua cidade?</h2><div class="opcoes-grid">';
    cidades.forEach(function(c) {
        var sel = dados.cidade === c.v ? ' selecionado' : '';
        h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" tabindex="0" onclick="selecionarCidadeUnica(this)"><span class="opcao-nome">' + c.n + '</span></div>';
    });
    h += '</div>';
    return h;
}

function selecionarMesmaCidade(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.cidadeDiferente = el.getAttribute('data-valor') === 'sim';
    dados.cidade = null;
    dados.cidadeOrigem = null;
    dados.cidadeDestino = null;
    renderizarEtapa(4);
}

function selecionarCidadeUnica(el) {
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    dados.cidade = el.getAttribute('data-valor');
}

function selecionarCidadeEspecifica(el) {
    var tipo = el.getAttribute('data-tipo');
    var parent = el.parentElement;
    parent.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
    el.classList.add('selecionado');
    if (tipo === 'origem') {
        dados.cidadeOrigem = el.getAttribute('data-valor');
    } else {
        dados.cidadeDestino = el.getAttribute('data-valor');
    }
}

function etapa5HTML() {
    var h = '<h2>Adicionais do móvel</h2>';
    h += '<p style="text-align:center;color:#888;margin-bottom:20px;">Selecione as características especiais:</p>';
    h += '<div class="opcoes-checkbox" style="flex-direction:column;align-items:center;">';
    h += '<div class="opcao-checkbox' + (dados.adicionais.indexOf('portasCorrer') !== -1 ? ' selecionado' : '') + '" data-valor="portasCorrer" tabindex="0" onclick="toggleAdicional(this)">🚪 Portas de Correr</div>';
    h += '<div class="opcao-checkbox' + (dados.adicionais.indexOf('espelhosGrandes') !== -1 ? ' selecionado' : '') + '" data-valor="espelhosGrandes" tabindex="0" onclick="toggleAdicional(this)">🪞 Espelhos Grandes</div>';
    h += '<div class="opcao-checkbox' + (dados.iluminacaoLED ? ' selecionado' : '') + '" data-valor="iluminacaoLED" tabindex="0" onclick="toggleLED(this)">💡 Iluminação LED</div>';
    h += '<div class="opcao-checkbox' + (dados.balcaoSuspenso ? ' selecionado' : '') + '" data-valor="balcaoSuspenso" tabindex="0" onclick="toggleBalcaoSuspenso(this)">📌 Balcão Suspenso</div>';
    h += '</div>';
    return h;
}

function toggleAdicional(el) {
    var v = el.getAttribute('data-valor');
    var idx = dados.adicionais.indexOf(v);
    if (idx === -1) { dados.adicionais.push(v); el.classList.add('selecionado'); }
    else { dados.adicionais.splice(idx, 1); el.classList.remove('selecionado'); }
}

function toggleLED(el) {
    dados.iluminacaoLED = !dados.iluminacaoLED;
    if (dados.iluminacaoLED) el.classList.add('selecionado'); else el.classList.remove('selecionado');
}

function toggleBalcaoSuspenso(el) {
    dados.balcaoSuspenso = !dados.balcaoSuspenso;
    if (dados.balcaoSuspenso) el.classList.add('selecionado'); else el.classList.remove('selecionado');
}

function etapa6HTML() {
    var h = '<h2>Recortes e adaptações</h2>';
    h += '<p style="text-align:center;color:#888;margin-bottom:20px;">Comum em cozinhas, balcões e painéis</p>';
    var recs = ['Pia/Cuba', 'Cooktop', 'Forno', 'Sifão', 'Tomada', 'Rodapé'];
    h += '<div class="opcoes-checkbox">';
    recs.forEach(function(r) {
        var sel = dados.recortes.indexOf(r) !== -1 ? ' selecionado' : '';
        h += '<div class="opcao-checkbox' + sel + '" data-valor="' + r + '" tabindex="0" onclick="toggleRecorte(this)">' + r + '</div>';
    });
    h += '</div>';
    h += '<div style="margin-top:15px;text-align:center;">';
    h += '<div class="opcao-checkbox' + (dados.recortesChapa ? ' selecionado' : '') + '" data-valor="chapa" tabindex="0" onclick="toggleRecorteChapa(this)" style="display:inline-block;">🪚 Recortes em chapas de madeira</div>';
    h += '</div>';
    return h;
}

function toggleRecorte(el) {
    var v = el.getAttribute('data-valor');
    var idx = dados.recortes.indexOf(v);
    if (idx === -1) { dados.recortes.push(v); el.classList.add('selecionado'); }
    else { dados.recortes.splice(idx, 1); el.classList.remove('selecionado'); }
}

function toggleRecorteChapa(el) {
    dados.recortesChapa = !dados.recortesChapa;
    if (dados.recortesChapa) el.classList.add('selecionado'); else el.classList.remove('selecionado');
}

function etapaResumoHTML() {
    var loc = dadosSimulador.localizacao;
    var h = '<h2>Confira as informações</h2><ul style="list-style:none;padding:0;">';
    h += '<li style="padding:8px 0;"><strong>Móveis:</strong><br>';
    for (var k in dados.moveis) {
        h += '• ' + dados.moveis[k] + 'x ' + dadosSimulador.moveis[k].nome + '<br>';
    }
    h += '</li>';
    h += '<li style="padding:8px 0;"><strong>Condição:</strong> ' + (dados.condicao === 'novo' ? 'Novo(s)' : 'Usado(s)') + '</li>';
    if (dados.condicao === 'usado') {
        h += '<li style="padding:8px 0;"><strong>Serviço:</strong> ' + dados.tipoServico + '</li>';
        if (dados.embalagem && dados.embalagem !== 'nao') h += '<li style="padding:8px 0;"><strong>Embalagem:</strong> ' + dados.embalagem + '</li>';
    }
    if (dados.cidadeDiferente) {
        h += '<li style="padding:8px 0;"><strong>🏠 Origem:</strong> ' + (loc[dados.cidadeOrigem] ? loc[dados.cidadeOrigem].descricao : '—') + '</li>';
        h += '<li style="padding:8px 0;"><strong>🏡 Destino:</strong> ' + (loc[dados.cidadeDestino] ? loc[dados.cidadeDestino].descricao : '—') + '</li>';
    } else {
        h += '<li style="padding:8px 0;"><strong>Cidade:</strong> ' + (loc[dados.cidade] ? loc[dados.cidade].descricao : '—') + '</li>';
    }
    h += '</ul>';
    h += '<p style="text-align:center;color:#888;margin-top:15px;">Clique em <strong>Calcular Estimativa</strong>.</p>';
    return h;
}

function validarEtapa() {
    if (etapaAtual === 1 && totalMoveis() === 0) { alert('Selecione pelo menos um móvel.'); return false; }
    if (etapaAtual === 2 && !dados.condicao) { alert('Informe se o móvel é novo ou usado.'); return false; }
    if (etapaAtual === 3 && !dados.tipoServico) { alert('Selecione o tipo de serviço.'); return false; }
    if (etapaAtual === 4) {
        if (dados.cidadeDiferente) {
            if (!dados.cidadeOrigem || !dados.cidadeDestino) { alert('Selecione as duas cidades (origem e destino).'); return false; }
        } else {
            if (!dados.cidade) { alert('Selecione sua cidade.'); return false; }
        }
    }
    return true;
}

function atualizarBotoes() {
    var idx = etapasAtivas.indexOf(etapaAtual);
    var total = etapasAtivas.length;
    document.getElementById('btnVoltar').style.display = idx > 0 ? 'inline-block' : 'none';
    
    if (idx === total - 1) {
        document.getElementById('btnAvancar').style.display = 'none';
        document.getElementById('btnCalcular').style.display = 'inline-block';
    } else {
        document.getElementById('btnAvancar').style.display = 'inline-block';
        document.getElementById('btnCalcular').style.display = 'none';
    }
}

function exibirResultado() {
    var mData = dadosSimulador.moveis, add = dadosSimulador.adicionais, loc = dadosSimulador.localizacao;
    var precoMaoObra = 0, precoMateriaisMin = 0, precoMateriaisMax = 0, nomes = [];
    
    for (var k in dados.moveis) {
        var m = mData[k], qtd = dados.moveis[k];
        nomes.push(qtd + 'x ' + m.nome);
        for (var i = 0; i < qtd; i++) {
            if (dados.condicao === 'novo') precoMaoObra += m.precos.novo;
            if (dados.condicao === 'usado') {
                if (dados.tipoServico === 'montagem') precoMaoObra += m.precos.usado;
                if (dados.tipoServico === 'desmontagem') precoMaoObra += m.precos.desmontagem;
                if (dados.tipoServico === 'remontagem') precoMaoObra += m.precos.remontagem;
                if (dados.tipoServico === 'desmontagem_montagem') precoMaoObra += m.precos.desmontagem + m.precos.usado;
            }
            if (dados.adicionais.indexOf('portasCorrer') !== -1 && m.adicionais.portasCorrer) precoMaoObra += Math.round(m.precos.novo * m.adicionais.portasCorrer / 100);
            if (dados.adicionais.indexOf('espelhosGrandes') !== -1 && m.adicionais.espelhosGrandes) precoMaoObra += Math.round(m.precos.novo * m.adicionais.espelhosGrandes / 100);
            
            if (dados.condicao === 'usado' && dados.embalagem && dados.embalagem !== 'nao') {
                var nivel = m.nivelEmbalagem || 'medio';
                var mat = dadosMateriais[nivel];
                var valorEmbalagem = m.precos.desmontagem;
                var valorDesembalagem = Math.round(valorEmbalagem * 0.5);
                
                if (dados.embalagem === 'embalar') {
                    precoMaoObra += valorEmbalagem;
                    precoMateriaisMin += mat.faixaMin;
                    precoMateriaisMax += mat.faixaMax;
                }
                if (dados.embalagem === 'desembalar') {
                    precoMaoObra += valorDesembalagem;
                    precoMateriaisMin += mat.faixaMin;
                    precoMateriaisMax += mat.faixaMax;
                }
                if (dados.embalagem === 'embalar_desembalar') {
                    precoMaoObra += valorEmbalagem + valorDesembalagem;
                    precoMateriaisMin += mat.faixaMin * 2;
                    precoMateriaisMax += mat.faixaMax * 2;
                }
            }
        }
    }
    
    if (dados.iluminacaoLED) precoMaoObra += add.iluminacaoLED.preco;
    if (dados.balcaoSuspenso) precoMaoObra += add.balcaoSuspenso.preco;
    if (dados.recortes.length > 0) precoMaoObra += dados.recortes.length * add.recortePorModulo.preco;
    if (dados.recortesChapa) precoMaoObra += add.recorteChapa.preco;
    
    if (dados.cidadeDiferente) {
        var taxaOrigem = loc[dados.cidadeOrigem] ? loc[dados.cidadeOrigem].fator : 60;
        var taxaDestino = loc[dados.cidadeDestino] ? loc[dados.cidadeDestino].fator : 60;
        precoMaoObra += taxaOrigem + taxaDestino;
    } else {
        var taxa = loc[dados.cidade] ? loc[dados.cidade].fator : 60;
        precoMaoObra += taxa;
    }
    
    if (totalMoveis() >= add.descontoMultiplos.minimo) {
        var desc = Math.round(precoMaoObra * add.descontoMultiplos.percentual / 100);
        precoMaoObra -= desc;
    }
    
    var totalMin = precoMaoObra + precoMateriaisMin;
    var totalMax = precoMaoObra + precoMateriaisMax;
    
    var cidadeMsg = '';
    if (dados.cidadeDiferente) {
        cidadeMsg = 'Origem: ' + loc[dados.cidadeOrigem].descricao + ' → Destino: ' + loc[dados.cidadeDestino].descricao;
    } else {
        cidadeMsg = loc[dados.cidade].descricao;
    }
    
    var msg = 'Olá!%0A%0AUtilizei a Calculadora da MontaTech.%0A%0A' +
        'Móveis: ' + nomes.join(', ') + '%0A' +
        'Condição: ' + (dados.condicao === 'novo' ? 'Novo' : 'Usado') + '%0A' +
        'Cidade: ' + cidadeMsg + '%0A' +
        'Estimativa: R$ ' + precoMaoObra + '%0A%0AGostaria de solicitar um orçamento real.';
    
    var h = '<div class="resultado-header"><h2>Estimativa de Montagem</h2><p class="resultado-movel">' + nomes.join(' + ') + '</p></div>';
    h += '<div class="resultado-body">';
    
    // Resumo das escolhas
    h += '<div style="background:#f0f7ff;border-radius:8px;padding:15px;margin-bottom:20px;font-size:0.9em;">';
    h += '<strong>📋 Resumo:</strong><br>';
    h += '• Condição: ' + (dados.condicao === 'novo' ? 'Novo(s)' : 'Usado(s)') + '<br>';
    if (dados.condicao === 'usado') {
        h += '• Serviço: ' + dados.tipoServico + '<br>';
        if (dados.embalagem && dados.embalagem !== 'nao') h += '• Embalagem: ' + dados.embalagem + '<br>';
    }
    h += '• Cidade: ' + cidadeMsg + '<br>';
    h += '</div>';
    
    h += '<div class="resultado-item"><span class="resultado-label">🔧 Mão de obra MontaTech</span><span class="resultado-valor" style="font-size:1.2em;color:var(--verde);">R$ ' + precoMaoObra + '</span></div>';
    if (precoMateriaisMin > 0) {
        h += '<div class="resultado-item"><span class="resultado-label">📦 Materiais (estimativa por fora)</span><span class="resultado-valor">R$ ' + precoMateriaisMin + ' – R$ ' + precoMateriaisMax + '</span></div>';
        h += '<div class="resultado-item"><span class="resultado-label">💰 Total estimado</span><span class="resultado-valor" style="font-size:1.3em;color:var(--verde);">R$ ' + totalMin + ' – R$ ' + totalMax + '</span></div>';
    }
    h += '<div class="resultado-aviso">⚠️ <strong>Importante:</strong> ';
    if (precoMateriaisMin > 0) {
        h += 'Materiais de embalagem são estimados e podem ser adquiridos pelo cliente ou fornecidos mediante validação no WhatsApp. ';
    }
    h += 'O orçamento final depende da análise dos móveis.</div>';
    h += '<div class="resultado-cta"><a href="https://api.whatsapp.com/send/?phone=5561998865417&text=' + msg + '&type=phone_number&app_absent=0" class="btn-whatsapp" target="_blank" rel="noopener">📱 Solicitar Orçamento Real pelo WhatsApp</a><br>';
    h += '<button class="btn-reiniciar" onclick="location.reload();">🔄 Fazer Novo Cálculo</button></div></div>';
    
    document.getElementById('resultadoCard').innerHTML = h;
    document.getElementById('simuladorWizard').style.display = 'none';
    document.getElementById('simuladorResultado').style.display = 'block';
    document.getElementById('simuladorResultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function configurarBotoes() {
    document.getElementById('btnIniciar').onclick = iniciarCalculadora;
    document.getElementById('btnVoltar').onclick = voltarEtapa;
    document.getElementById('btnAvancar').onclick = avancarEtapa;
    document.getElementById('btnCalcular').onclick = calcularEstimativa;
}

carregarDados();
