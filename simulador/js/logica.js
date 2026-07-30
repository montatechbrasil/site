(function() {
    var dados = { movel: null, condicao: null, desmontagem: null, remontagem: null, fixacao: null, recortes: [], cidade: null };
    var etapaAtual = 1;
    var totalEtapas = 8;

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
        if (etapaAtual > 1) renderizarEtapa(etapaAtual - 1);
    };

    btnAvancar.onclick = function() {
        if (validarEtapa()) renderizarEtapa(etapaAtual + 1);
    };

    btnCalcular.onclick = function() {
        if (validarEtapa()) exibirResultado();
    };

    function renderizarEtapa(numero) {
        etapaAtual = numero;
        progressoFill.style.width = Math.round((numero / totalEtapas) * 100) + '%';
        progressoTexto.textContent = 'Etapa ' + numero + ' de ' + totalEtapas;
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
        var h = '<h2>Qual móvel deseja montar?</h2><div class="opcoes-grid">';
        for (var k in tabelaPrecos) {
            var sel = dados.movel === k ? ' selecionado' : '';
            h += '<div class="opcao-item' + sel + '" data-valor="' + k + '" tabindex="0">';
            h += '<span class="opcao-icone">' + tabelaPrecos[k].icone + '</span>';
            h += '<span class="opcao-nome">' + tabelaPrecos[k].nome + '</span></div>';
        }
        return h + '</div>';
    }

    function etapa2() {
        return '<h2>O móvel é:</h2><div class="opcoes-simples">' +
            '<div class="opcao-simples' + (dados.condicao === 'novo' ? ' selecionado' : '') + '" data-valor="novo" tabindex="0">Novo</div>' +
            '<div class="opcao-simples' + (dados.condicao === 'usado' ? ' selecionado' : '') + '" data-valor="usado" tabindex="0">Usado</div></div>';
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
        return '<h2>Existe necessidade de fixação na parede?</h2><div class="opcoes-simples">' +
            '<div class="opcao-simples' + (dados.fixacao === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>' +
            '<div class="opcao-simples' + (dados.fixacao === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div>' +
            '<div class="opcao-simples' + (dados.fixacao === 'naosei' ? ' selecionado' : '') + '" data-valor="naosei" tabindex="0">Não sei</div></div>';
    }

    function etapa6() {
        var recs = ['Pia/Cuba', 'Sifão', 'Tomada', 'Rodapé', 'Tubulação', 'Nenhum'];
        var h = '<h2>Será necessário algum recorte?</h2><p style="text-align:center;color:#888;margin-bottom:15px;">Exemplo: pia, sifão, tomada, rodapé</p><div class="opcoes-checkbox">';
        recs.forEach(function(r) {
            var sel = dados.recortes.indexOf(r) !== -1 ? ' selecionado' : '';
            h += '<div class="opcao-checkbox' + sel + '" data-valor="' + r + '" tabindex="0">' + r + '</div>';
        });
        return h + '</div>';
    }

    function etapa7() {
        var cidades = [
            { v: 'valparaiso', n: 'Valparaíso de Goiás' },
            { v: 'novo-gama', n: 'Novo Gama' },
            { v: 'cidade-ocidental', n: 'Cidade Ocidental' },
            { v: 'luziania', n: 'Luziânia' },
            { v: 'jardim-inga', n: 'Jardim Ingá' },
            { v: 'gama', n: 'Gama' },
            { v: 'outro', n: 'Outro' }
        ];
        var h = '<h2>Qual a sua cidade?</h2><div class="opcoes-grid">';
        cidades.forEach(function(c) {
            var sel = dados.cidade === c.v ? ' selecionado' : '';
            h += '<div class="opcao-item' + sel + '" data-valor="' + c.v + '" tabindex="0"><span class="opcao-nome">' + c.n + '</span></div>';
        });
        return h + '</div>';
    }

    function etapa8() {
        var m = tabelaPrecos[dados.movel];
        var h = '<h2>Confira as informações</h2><ul style="list-style:none;padding:0;">';
        h += '<li style="padding:8px 0;"><strong>Móvel:</strong> ' + m.nome + '</li>';
        h += '<li style="padding:8px 0;"><strong>Condição:</strong> ' + (dados.condicao === 'novo' ? 'Novo' : 'Usado') + '</li>';
        h += '<li style="padding:8px 0;"><strong>Desmontagem:</strong> ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
        h += '<li style="padding:8px 0;"><strong>Remontagem:</strong> ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
        h += '<li style="padding:8px 0;"><strong>Fixação:</strong> ' + (dados.fixacao === 'sim' ? 'Sim' : dados.fixacao === 'nao' ? 'Não' : 'Não sei') + '</li>';
        h += '<li style="padding:8px 0;"><strong>Recortes:</strong> ' + (dados.recortes.length > 0 ? dados.recortes.join(', ') : 'Nenhum') + '</li>';
        h += '<li style="padding:8px 0;"><strong>Cidade:</strong> ' + (fatorLocalizacao[dados.cidade] ? fatorLocalizacao[dados.cidade].descricao : dados.cidade) + '</li></ul>';
        h += '<p style="text-align:center;color:#888;margin-top:15px;">Clique em <strong>Calcular Estimativa</strong> para ver o resultado.</p>';
        return h;
    }

    function addEventos(numero) {
        if (numero === 1) {
            document.querySelectorAll('.opcao-item').forEach(function(item) {
                item.onclick = function() {
                    document.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    dados.movel = this.getAttribute('data-valor');
                };
            });
        }
        if (numero >= 2 && numero <= 5) {
            document.querySelectorAll('.opcao-simples').forEach(function(item) {
                item.onclick = function() {
                    var parent = this.parentElement;
                    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    var v = this.getAttribute('data-valor');
                    if (numero === 2) dados.condicao = v;
                    if (numero === 3) dados.desmontagem = v;
                    if (numero === 4) dados.remontagem = v;
                    if (numero === 5) dados.fixacao = v;
                };
            });
        }
        if (numero === 6) {
            document.querySelectorAll('.opcao-checkbox').forEach(function(item) {
                item.onclick = function() {
                    var v = this.getAttribute('data-valor');
                    if (v === 'Nenhum') {
                        dados.recortes = ['Nenhum'];
                        document.querySelectorAll('.opcao-checkbox').forEach(function(i) { i.classList.remove('selecionado'); });
                        this.classList.add('selecionado');
                    } else {
                        var idx = dados.recortes.indexOf('Nenhum');
                        if (idx !== -1) dados.recortes.splice(idx, 1);
                        var el = document.querySelector('.opcao-checkbox[data-valor="Nenhum"]');
                        if (el) el.classList.remove('selecionado');
                        var ri = dados.recortes.indexOf(v);
                        if (ri === -1) { dados.recortes.push(v); this.classList.add('selecionado'); }
                        else { dados.recortes.splice(ri, 1); this.classList.remove('selecionado'); }
                    }
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
        if (etapaAtual === 1 && !dados.movel) { alert('Selecione um tipo de móvel.'); return false; }
        if (etapaAtual === 2 && !dados.condicao) { alert('Informe se o móvel é novo ou usado.'); return false; }
        if (etapaAtual === 3 && !dados.desmontagem) { alert('Informe se será necessário desmontar.'); return false; }
        if (etapaAtual === 4 && !dados.remontagem) { alert('Informe se será necessário remontar.'); return false; }
        if (etapaAtual === 5 && !dados.fixacao) { alert('Informe sobre a fixação na parede.'); return false; }
        if (etapaAtual === 7 && !dados.cidade) { alert('Selecione sua cidade.'); return false; }
        return true;
    }

    function atualizarBotoes() {
        btnVoltar.style.display = etapaAtual > 1 ? 'inline-block' : 'none';
        if (etapaAtual === totalEtapas) {
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
        var m = tabelaPrecos[dados.movel];
        var loc = fatorLocalizacao[dados.cidade] || fatorLocalizacao['outro'];
        var pMin = m.precoMin, pMax = m.precoMax, tMin = m.tempoMin, tMax = m.tempoMax;
        var obs = [m.observacao];

        if (dados.condicao === 'usado') {
            pMin = Math.round(pMin * fatoresAjuste.usado.multiplicador);
            pMax = Math.round(pMax * fatoresAjuste.usado.multiplicador);
            obs.push(fatoresAjuste.usado.descricao);
        }
        if (dados.desmontagem === 'sim') {
            pMin += fatoresAjuste.desmontagem.adicionalPreco; pMax += fatoresAjuste.desmontagem.adicionalPreco;
            tMin += fatoresAjuste.desmontagem.adicionalTempo; tMax += fatoresAjuste.desmontagem.adicionalTempo;
            obs.push(fatoresAjuste.desmontagem.descricao);
        }
        if (dados.remontagem === 'sim') {
            pMin += fatoresAjuste.remontagem.adicionalPreco; pMax += fatoresAjuste.remontagem.adicionalPreco;
            obs.push(fatoresAjuste.remontagem.descricao);
        }
        if (dados.fixacao === 'sim') {
            pMin += fatoresAjuste.fixacaoParede.adicionalPreco; pMax += fatoresAjuste.fixacaoParede.adicionalPreco;
            tMin += fatoresAjuste.fixacaoParede.adicionalTempo; tMax += fatoresAjuste.fixacaoParede.adicionalTempo;
            obs.push(fatoresAjuste.fixacaoParede.descricao);
        }
        if (dados.recortes.length > 0 && dados.recortes.indexOf('Nenhum') === -1) {
            pMin += fatoresAjuste.recorte.adicionalPreco; pMax += fatoresAjuste.recorte.adicionalPreco;
            tMin += fatoresAjuste.recorte.adicionalTempo; tMax += fatoresAjuste.recorte.adicionalTempo;
            obs.push(fatoresAjuste.recorte.descricao);
        }
        pMin = Math.round(pMin * loc.multiplicador);
        pMax = Math.round(pMax * loc.multiplicador);

        var comp = m.complexidade === 'baixa' ? '🟢 Baixa' : m.complexidade === 'media' ? '🟡 Média' : '🔴 Alta';

        var msg = 'Olá!%0A%0AUtilizei o Simulador de Preço da MontaTech.%0A%0A' +
            'Móvel: ' + m.nome + '%0A' +
            'Condição: ' + (dados.condicao === 'novo' ? 'Novo' : 'Usado') + '%0A' +
            'Desmontagem: ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '%0A' +
            'Remontagem: ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '%0A' +
            'Fixação: ' + (dados.fixacao === 'sim' ? 'Sim' : dados.fixacao === 'nao' ? 'Não' : 'Não sei') + '%0A' +
            'Cidade: ' + loc.descricao + '%0A' +
            'Estimativa: R$ ' + pMin + ' a R$ ' + pMax + '%0A%0A' +
            'Gostaria de solicitar um orçamento.';

        var h = '';
        h += '<div class="resultado-header"><h2>Estimativa de Montagem</h2><p class="resultado-movel">' + m.nome + '</p></div>';
        h += '<div class="resultado-body">';
        h += '<div class="resultado-item"><span class="resultado-label">Complexidade</span><span class="resultado-valor">' + comp + '</span></div>';
        h += '<div class="resultado-item"><span class="resultado-label">Tempo estimado</span><span class="resultado-valor">Entre ' + formatarTempo(tMin) + ' e ' + formatarTempo(tMax) + '</span></div>';
        h += '<div class="resultado-item"><span class="resultado-label">Faixa média de investimento</span><span class="resultado-valor" style="font-size:1.3em;color:var(--verde);">R$ ' + pMin + ' a R$ ' + pMax + '</span></div>';
        h += '<div class="resultado-aviso">⚠️ <strong>Importante:</strong> Estimativa baseada nas informações fornecidas. O orçamento definitivo depende da análise do móvel e das condições do ambiente.</div>';
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
