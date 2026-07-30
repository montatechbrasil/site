(function() {
    var dados = { moveis: [], condicao: null, desmontagem: null, remontagem: null, fixacao: null, recortes: [], cidade: null };
    var etapaAtual = 1;
    var totalEtapas = 8;
    var etapasAtivas = [1,2,5,7,8]; // Padrão: móvel novo

    var btnIniciar = document.getElementById('btnIniciar');
    var simuladorHero = document.getElementById('simuladorHero');
    var simuladorWizard = document.getElementById('simuladorWizard');
    var simuladorResultado = document.getElementById('simuladorResultado');
    var simuladorSeo = document.getElementById('simuladorSeo');
    var etapaContainer = document.getElementById('etapaContainer');
    var progressoFill = document.getElementById('progressoFill');
    var progressoTexto = document.getElementById('progressoTexto');
    var btnVoltar = document.getElementById('btnVoltar');
    var btnAvancar = document.getElementById('btnAvancar');
    var btnCalcular = document.getElementById('btnCalcular');
    var resultadoCard = document.getElementById('resultadoCard');

    if (!btnIniciar) return;

    btnIniciar.onclick = function() {
        simuladorHero.style.display = 'none';
        simuladorWizard.style.display = 'block';
        if (simuladorSeo) simuladorSeo.style.display = 'none';
        renderizarEtapa(1);
    };

    btnVoltar.onclick = function() {
        var idx = etapasAtivas.indexOf(etapaAtual);
        if (idx > 0) renderizarEtapa(etapasAtivas[idx - 1]);
    };

    btnAvancar.onclick = function() {
        if (validarEtapa()) {
            var idx = etapasAtivas.indexOf(etapaAtual);
            if (idx < etapasAtivas.length - 1) renderizarEtapa(etapasAtivas[idx + 1]);
        }
    };

    btnCalcular.onclick = function() {
        if (validarEtapa()) exibirResultado();
    };

    function atualizarEtapas() {
        etapasAtivas = [1, 2]; // Sempre: móveis + condição
        if (dados.condicao === 'usado') {
            etapasAtivas.push(3, 4); // Desmontagem + Remontagem
        }
        // Verificar se algum móvel selecionado permite fixação
        var temFixacao = false;
        var temRecorte = false;
        dados.moveis.forEach(function(key) {
            if (tabelaPrecos[key] && tabelaPrecos[key].permiteFixacao) temFixacao = true;
            if (tabelaPrecos[key] && tabelaPrecos[key].permiteRecortes) temRecorte = true;
        });
        if (temFixacao) etapasAtivas.push(5);
        if (temRecorte) etapasAtivas.push(6);
        etapasAtivas.push(7, 8); // Cidade + Calcular
        totalEtapas = etapasAtivas.length;
    }

    function renderizarEtapa(numero) {
        etapaAtual = numero;
        var idx = etapasAtivas.indexOf(numero) + 1;
        progressoFill.style.width = Math.round((idx / totalEtapas) * 100) + '%';
        progressoTexto.textContent = 'Etapa ' + idx + ' de ' + totalEtapas;
        var html = '';
        switch(numero) {
            case 1: html = etapa1(); break;
            case 2: html = etapa2(); break;
            case 3: html = etapa3(); break;
            case 4: html = etapa4(); break;
            case 5: html = etapa5(); break;
            case 6: html = etapa6(); break;
            case 7: html = etapa7(); break;
            case 8: html = etapa8(); break;
        }
        etapaContainer.innerHTML = html;
        addEventos(numero);
        atualizarBotoes();
        etapaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function etapa1() {
        var h = '<h2>Quais móveis deseja montar?</h2>';
        h += '<p style="text-align:center;color:#888;margin-bottom:20px;">Selecione todos os móveis do seu projeto. Múltiplos móveis no mesmo ambiente têm desconto!</p>';
        h += '<div class="opcoes-grid">';
        for (var k in tabelaPrecos) {
            var sel = dados.moveis.indexOf(k) !== -1 ? ' selecionado' : '';
            h += '<div class="opcao-item' + sel + '" data-valor="' + k + '" tabindex="0">';
            h += '<span class="opcao-icone">' + tabelaPrecos[k].icone + '</span>';
            h += '<span class="opcao-nome">' + tabelaPrecos[k].nome + '</span></div>';
        }
        h += '</div>';
        h += '<p style="text-align:center;margin-top:15px;font-weight:600;color:var(--azul-escuro);">';
        h += '<span id="contadorMoveis">0</span> móvel(is) selecionado(s)</p>';
        return h;
    }

    function etapa2() {
        return '<h2>O(s) móvel(is) é(são):</h2><div class="opcoes-simples">' +
            '<div class="opcao-simples' + (dados.condicao === 'novo' ? ' selecionado' : '') + '" data-valor="novo" tabindex="0">🆕 Novo(s)</div>' +
            '<div class="opcao-simples' + (dados.condicao === 'usado' ? ' selecionado' : '') + '" data-valor="usado" tabindex="0">🔄 Usado(s)</div></div>';
    }

    function etapa3() {
        return '<h2>Será necessário desmontar?</h2><div class="opcoes-simples">' +
            '<div class="opcao-simples' + (dados.desmontagem === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>' +
            '<div class="opcao-simples' + (dados.desmontagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div></div>';
    }

    function etapa4() {
        return '<h2>Será necessária remontagem?</h2><div class="opcoes-simples">' +
            '<div class="opcao-simples' + (dados.remontagem === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>' +
            '<div class="opcao-simples' + (dados.remontagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div></div>';
    }

    function etapa5() {
        return '<h2>Será necessário fixar na parede?</h2><p style="text-align:center;color:#888;margin-bottom:15px;">Essencial para armários altos, painéis e guarda-roupas</p><div class="opcoes-simples">' +
            '<div class="opcao-simples' + (dados.fixacao === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>' +
            '<div class="opcao-simples' + (dados.fixacao === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div>' +
            '<div class="opcao-simples' + (dados.fixacao === 'naosei' ? ' selecionado' : '') + '" data-valor="naosei" tabindex="0">Não sei</div></div>';
    }

    function etapa6() {
        var recs = ['Pia/Cuba', 'Cooktop', 'Sifão', 'Tomada', 'Rodapé', 'Tubulação'];
        var h = '<h2>Será necessário algum recorte?</h2><p style="text-align:center;color:#888;margin-bottom:15px;">Comum em cozinhas e balcões — selecione os itens que precisam de adaptação</p><div class="opcoes-checkbox">';
        recs.forEach(function(r) {
            var sel = dados.recortes.indexOf(r) !== -1 ? ' selecionado' : '';
            h += '<div class="opcao-checkbox' + sel + '" data-valor="' + r + '" tabindex="0">' + r + '</div>';
        });
        return h + '</div>';
    }

    function etapa7() {
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
            h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" tabindex="0"><span class="opcao-nome">' + c.n + '</span></div>';
        });
        return h + '</div>';
    }

    function etapa8() {
        var h = '<h2>Confira as informações</h2><ul style="list-style:none;padding:0;">';
        h += '<li style="padding:8px 0;"><strong>Móveis selecionados:</strong><br>';
        dados.moveis.forEach(function(key) {
            h += '• ' + tabelaPrecos[key].nome + '<br>';
        });
        h += '</li>';
        h += '<li style="padding:8px 0;"><strong>Condição:</strong> ' + (dados.condicao === 'novo' ? 'Novo(s)' : 'Usado(s)') + '</li>';
        if (dados.condicao === 'usado') {
            h += '<li style="padding:8px 0;"><strong>Desmontagem:</strong> ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
            h += '<li style="padding:8px 0;"><strong>Remontagem:</strong> ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
        }
        if (dados.fixacao) {
            h += '<li style="padding:8px 0;"><strong>Fixação na parede:</strong> ' + (dados.fixacao === 'sim' ? 'Sim' : dados.fixacao === 'nao' ? 'Não' : 'Não sei') + '</li>';
        }
        if (dados.recortes.length > 0) {
            h += '<li style="padding:8px 0;"><strong>Recortes:</strong> ' + dados.recortes.join(', ') + '</li>';
        }
        h += '<li style="padding:8px 0;"><strong>Cidade:</strong> ' + (fatorLocalizacao[dados.cidade] ? fatorLocalizacao[dados.cidade].descricao : dados.cidade) + '</li></ul>';
        h += '<p style="text-align:center;color:#888;margin-top:15px;">Clique em <strong>Calcular Estimativa</strong> para ver o resultado.</p>';
        return h;
    }

    function addEventos(numero) {
        if (numero === 1) {
            document.querySelectorAll('.opcao-item').forEach(function(item) {
                item.onclick = function() {
                    var v = this.getAttribute('data-valor');
                    var idx = dados.moveis.indexOf(v);
                    if (idx === -1) {
                        dados.moveis.push(v);
                        this.classList.add('selecionado');
                    } else {
                        dados.moveis.splice(idx, 1);
                        this.classList.remove('selecionado');
                    }
                    var contador = document.getElementById('contadorMoveis');
                    if (contador) contador.textContent = dados.moveis.length;
                };
            });
        }
        if (numero === 2) {
            document.querySelectorAll('.opcao-simples').forEach(function(item) {
                item.onclick = function() {
                    document.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    dados.condicao = this.getAttribute('data-valor');
                    if (dados.condicao === 'novo') {
                        dados.desmontagem = null;
                        dados.remontagem = null;
                    }
                    atualizarEtapas();
                };
            });
        }
        if (numero === 3 || numero === 4) {
            document.querySelectorAll('.opcao-simples').forEach(function(item) {
                item.onclick = function() {
                    var parent = this.parentElement;
                    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    var v = this.getAttribute('data-valor');
                    if (numero === 3) dados.desmontagem = v;
                    if (numero === 4) dados.remontagem = v;
                };
            });
        }
        if (numero === 5) {
            document.querySelectorAll('.opcao-simples').forEach(function(item) {
                item.onclick = function() {
                    var parent = this.parentElement;
                    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    dados.fixacao = this.getAttribute('data-valor');
                };
            });
        }
        if (numero === 6) {
            document.querySelectorAll('.opcao-checkbox').forEach(function(item) {
                item.onclick = function() {
                    var v = this.getAttribute('data-valor');
                    var ri = dados.recortes.indexOf(v);
                    if (ri === -1) { dados.recortes.push(v); this.classList.add('selecionado'); }
                    else { dados.recortes.splice(ri, 1); this.classList.remove('selecionado'); }
                };
            });
        }
        if (numero === 7) {
            document.querySelectorAll('.opcao-item').forEach(function(item) {
                item.onclick = function() {
                    document.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    dados.cidade = this.getAttribute('data-valor');
                };
            });
        }
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
        btnVoltar.style.display = idx > 0 ? 'inline-block' : 'none';
        if (idx === etapasAtivas.length - 1) {
            btnAvancar.style.display = 'none';
            btnCalcular.style.display = 'inline-block';
        } else {
            btnAvancar.style.display = 'inline-block';
            btnCalcular.style.display = 'none';
        }
    }

    function formatarTempo(min) {
        if (min < 60) return min + ' min';
        var h = Math.floor(min / 60);
        var m = min % 60;
        if (m === 0) return h + 'h';
        return h + 'h' + m + 'min';
    }

    function exibirResultado() {
        var loc = fatorLocalizacao[dados.cidade] || fatorLocalizacao['outro'];
        var pMinTotal = 0, pMaxTotal = 0, tMinTotal = 0, tMaxTotal = 0;
        var obs = [];
        var complexidadeMax = 'baixa';
        var nomesMoveis = [];

        dados.moveis.forEach(function(key) {
            var m = tabelaPrecos[key];
            nomesMoveis.push(m.nome);
            pMinTotal += m.precoMin;
            pMaxTotal += m.precoMax;
            tMinTotal += m.tempoMin;
            tMaxTotal += m.tempoMax;
            if (m.complexidade === 'alta') complexidadeMax = 'alta';
            else if (m.complexidade === 'media' && complexidadeMax !== 'alta') complexidadeMax = 'media';
        });

        // Desconto por múltiplos móveis
        if (dados.moveis.length > 1) {
            var desconto = fatoresAjuste.multiplosMoveis.desconto;
            pMinTotal = Math.round(pMinTotal * (1 - desconto));
            pMaxTotal = Math.round(pMaxTotal * (1 - desconto));
            obs.push(fatoresAjuste.multiplosMoveis.descricao + ' (' + (desconto * 100) + '% de desconto)');
        }

        if (dados.condicao === 'usado') {
            pMinTotal = Math.round(pMinTotal * fatoresAjuste.usado.multiplicador);
            pMaxTotal = Math.round(pMaxTotal * fatoresAjuste.usado.multiplicador);
            obs.push(fatoresAjuste.usado.descricao);
        }
        if (dados.desmontagem === 'sim') {
            pMinTotal += fatoresAjuste.desmontagem.adicionalPreco;
            pMaxTotal += fatoresAjuste.desmontagem.adicionalPreco;
            tMinTotal += fatoresAjuste.desmontagem.adicionalTempo;
            tMaxTotal += fatoresAjuste.desmontagem.adicionalTempo;
            obs.push(fatoresAjuste.desmontagem.descricao);
        }
        if (dados.remontagem === 'sim') {
            pMinTotal += fatoresAjuste.remontagem.adicionalPreco;
            pMaxTotal += fatoresAjuste.remontagem.adicionalPreco;
            obs.push(fatoresAjuste.remontagem.descricao);
        }
        if (dados.fixacao === 'sim') {
            pMinTotal += fatoresAjuste.fixacaoParede.adicionalPreco;
            pMaxTotal += fatoresAjuste.fixacaoParede.adicionalPreco;
            tMinTotal += fatoresAjuste.fixacaoParede.adicionalTempo;
            tMaxTotal += fatoresAjuste.fixacaoParede.adicionalTempo;
            obs.push(fatoresAjuste.fixacaoParede.descricao);
        }
        if (dados.recortes.length > 0) {
            pMinTotal += fatoresAjuste.recorte.adicionalPreco;
            pMaxTotal += fatoresAjuste.recorte.adicionalPreco;
            tMinTotal += fatoresAjuste.recorte.adicionalTempo;
            tMaxTotal += fatoresAjuste.recorte.adicionalTempo;
            obs.push(fatoresAjuste.recorte.descricao);
        }

        pMinTotal = Math.round(pMinTotal * loc.multiplicador);
        pMaxTotal = Math.round(pMaxTotal * loc.multiplicador);

        var comp = complexidadeMax === 'baixa' ? '🟢 Baixa' : complexidadeMax === 'media' ? '🟡 Média' : '🔴 Alta';

        var msg = 'Olá!%0A%0AUtilizei o Simulador de Preço da MontaTech.%0A%0A' +
            'Móveis: ' + nomesMoveis.join(', ') + '%0A' +
            'Condição: ' + (dados.condicao === 'novo' ? 'Novo(s)' : 'Usado(s)') + '%0A';
        if (dados.condicao === 'usado') {
            msg += 'Desmontagem: ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '%0A';
            msg += 'Remontagem: ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '%0A';
        }
        msg += 'Cidade: ' + loc.descricao + '%0A' +
            'Estimativa: R$ ' + pMinTotal + ' a R$ ' + pMaxTotal + '%0A%0A' +
            'Gostaria de solicitar um orçamento.';

        var h = '';
        h += '<div class="resultado-header"><h2>Estimativa de Montagem</h2><p class="resultado-movel">' + nomesMoveis.join(' + ') + '</p></div>';
        h += '<div class="resultado-body">';
        h += '<div class="resultado-item"><span class="resultado-label">Complexidade</span><span class="resultado-valor">' + comp + '</span></div>';
        h += '<div class="resultado-item"><span class="resultado-label">Tempo estimado</span><span class="resultado-valor">Entre ' + formatarTempo(tMinTotal) + ' e ' + formatarTempo(tMaxTotal) + '</span></div>';
        h += '<div class="resultado-item"><span class="resultado-label">Faixa de investimento</span><span class="resultado-valor" style="font-size:1.3em;color:var(--verde);">R$ ' + pMinTotal + ' a R$ ' + pMaxTotal + '</span></div>';
        if (dados.moveis.length > 1) {
            h += '<div class="resultado-item"><span class="resultado-label">💰 Desconto múltiplos móveis</span><span class="resultado-valor" style="color:var(--verde);">-10% aplicado</span></div>';
        }
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

        resultadoCard.innerHTML = h;
        simuladorWizard.style.display = 'none';
        simuladorResultado.style.display = 'block';
        simuladorResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
})();
