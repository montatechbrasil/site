// ============================================
// MONTATECH BRASIL - LÓGICA DO SIMULADOR
// Wizard de 8 etapas + resultado
// ============================================

(function() {
    'use strict';
    
    // Estado da simulação
    var dados = {
        movel: null,
        condicao: null,
        desmontagem: null,
        remontagem: null,
        fixacao: null,
        recortes: [],
        cidade: null
    };
    
    var etapaAtual = 1;
    var totalEtapas = 8;
    
    // Elementos do DOM
    var btnIniciar = document.getElementById('btnIniciar');
    var simuladorWizard = document.getElementById('simuladorWizard');
    var simuladorResultado = document.getElementById('simuladorResultado');
    var etapaContainer = document.getElementById('etapaContainer');
    var progressoFill = document.getElementById('progressoFill');
    var progressoTexto = document.getElementById('progressoTexto');
    var btnVoltar = document.getElementById('btnVoltar');
    var btnAvancar = document.getElementById('btnAvancar');
    var btnCalcular = document.getElementById('btnCalcular');
    var resultadoCard = document.getElementById('resultadoCard');
    var simuladorSeo = document.getElementById('simuladorSeo');
    
    // Iniciar
    btnIniciar.addEventListener('click', function() {
        btnIniciar.parentElement.parentElement.style.display = 'none';
        simuladorWizard.style.display = 'block';
        if (simuladorSeo) simuladorSeo.style.display = 'none';
        renderizarEtapa(1);
    });
    
    // Voltar
    btnVoltar.addEventListener('click', function() {
        if (etapaAtual > 1) {
            renderizarEtapa(etapaAtual - 1);
        }
    });
    
    // Avançar
    btnAvancar.addEventListener('click', function() {
        if (validarEtapa()) {
            renderizarEtapa(etapaAtual + 1);
        }
    });
    
    // Calcular
    btnCalcular.addEventListener('click', function() {
        if (validarEtapa()) {
            exibirResultado();
        }
    });
    
    // Renderizar etapa
    function renderizarEtapa(numero) {
        etapaAtual = numero;
        var progresso = Math.round((numero / totalEtapas) * 100);
        progressoFill.style.width = progresso + '%';
        progressoTexto.textContent = 'Etapa ' + numero + ' de ' + totalEtapas;
        
        var html = '';
        
        switch(numero) {
            case 1: html = renderizarEtapa1(); break;
            case 2: html = renderizarEtapa2(); break;
            case 3: html = renderizarEtapa3(); break;
            case 4: html = renderizarEtapa4(); break;
            case 5: html = renderizarEtapa5(); break;
            case 6: html = renderizarEtapa6(); break;
            case 7: html = renderizarEtapa7(); break;
            case 8: html = renderizarEtapa8(); break;
        }
        
        etapaContainer.innerHTML = html;
        adicionarEventosEtapa(numero);
        atualizarBotoes();
        etapaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Etapa 1: Tipo de móvel
    function renderizarEtapa1() {
        var html = '<h2>Qual móvel deseja montar?</h2><div class="opcoes-grid">';
        for (var key in tabelaPrecos) {
            var selecionado = (dados.movel === key) ? ' selecionado' : '';
            html += '<div class="opcao-item' + selecionado + '" data-valor="' + key + '" tabindex="0" role="button" aria-pressed="' + (dados.movel === key) + '">';
            html += '<span class="opcao-icone">' + tabelaPrecos[key].icone + '</span>';
            html += '<span class="opcao-nome">' + tabelaPrecos[key].nome + '</span>';
            html += '</div>';
        }
        html += '</div>';
        return html;
    }
    
    // Etapa 2: Condição
    function renderizarEtapa2() {
        var html = '<h2>O móvel é:</h2><div class="opcoes-simples">';
        html += '<div class="opcao-simples' + (dados.condicao === 'novo' ? ' selecionado' : '') + '" data-valor="novo" tabindex="0">Novo</div>';
        html += '<div class="opcao-simples' + (dados.condicao === 'usado' ? ' selecionado' : '') + '" data-valor="usado" tabindex="0">Usado</div>';
        html += '</div>';
        return html;
    }
    
    // Etapa 3: Desmontagem
    function renderizarEtapa3() {
        var html = '<h2>Será necessário desmontar?</h2><div class="opcoes-simples">';
        html += '<div class="opcao-simples' + (dados.desmontagem === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>';
        html += '<div class="opcao-simples' + (dados.desmontagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div>';
        html += '</div>';
        return html;
    }
    
    // Etapa 4: Remontagem
    function renderizarEtapa4() {
        var html = '<h2>Será necessária remontagem?</h2><div class="opcoes-simples">';
        html += '<div class="opcao-simples' + (dados.remontagem === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>';
        html += '<div class="opcao-simples' + (dados.remontagem === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div>';
        html += '</div>';
        return html;
    }
    
    // Etapa 5: Fixação na parede
    function renderizarEtapa5() {
        var html = '<h2>Existe necessidade de fixação na parede?</h2><div class="opcoes-simples">';
        html += '<div class="opcao-simples' + (dados.fixacao === 'sim' ? ' selecionado' : '') + '" data-valor="sim" tabindex="0">Sim</div>';
        html += '<div class="opcao-simples' + (dados.fixacao === 'nao' ? ' selecionado' : '') + '" data-valor="nao" tabindex="0">Não</div>';
        html += '<div class="opcao-simples' + (dados.fixacao === 'naosei' ? ' selecionado' : '') + '" data-valor="naosei" tabindex="0">Não sei</div>';
        html += '</div>';
        return html;
    }
    
    // Etapa 6: Recortes
    function renderizarEtapa6() {
        var html = '<h2>Será necessário algum recorte?</h2><p style="text-align:center;color:#888;margin-bottom:15px;">Exemplo: pia, sifão, tomada, rodapé</p><div class="opcoes-checkbox">';
        var recortes = ['Pia/Cuba', 'Sifão', 'Tomada', 'Rodapé', 'Tubulação', 'Nenhum'];
        recortes.forEach(function(r) {
            var selecionado = dados.recortes.indexOf(r) !== -1 ? ' selecionado' : '';
            html += '<div class="opcao-checkbox' + selecionado + '" data-valor="' + r + '" tabindex="0">' + r + '</div>';
        });
        html += '</div>';
        return html;
    }
    
    // Etapa 7: Cidade
    function renderizarEtapa7() {
        var cidades = [
            { valor: 'valparaiso', nome: 'Valparaíso de Goiás' },
            { valor: 'novo-gama', nome: 'Novo Gama' },
            { valor: 'cidade-ocidental', nome: 'Cidade Ocidental' },
            { valor: 'luziania', nome: 'Luziânia' },
            { valor: 'jardim-inga', nome: 'Jardim Ingá' },
            { valor: 'gama', nome: 'Gama' },
            { valor: 'outro', nome: 'Outro' }
        ];
        var html = '<h2>Qual a sua cidade?</h2><div class="opcoes-grid">';
        cidades.forEach(function(c) {
            var selecionado = (dados.cidade === c.valor) ? ' selecionado' : '';
            html += '<div class="opcao-item' + selecionado + '" data-valor="' + c.valor + '" tabindex="0">';
            html += '<span class="opcao-nome">' + c.nome + '</span>';
            html += '</div>';
        });
        html += '</div>';
        return html;
    }
    
    // Etapa 8: Resumo + Calcular
    function renderizarEtapa8() {
        var movel = tabelaPrecos[dados.movel];
        var html = '<h2>Confira as informações</h2>';
        html += '<ul style="list-style:none;padding:0;">';
        html += '<li style="padding:8px 0;"><strong>Móvel:</strong> ' + movel.nome + '</li>';
        html += '<li style="padding:8px 0;"><strong>Condição:</strong> ' + (dados.condicao === 'novo' ? 'Novo' : 'Usado') + '</li>';
        html += '<li style="padding:8px 0;"><strong>Desmontagem:</strong> ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
        html += '<li style="padding:8px 0;"><strong>Remontagem:</strong> ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '</li>';
        html += '<li style="padding:8px 0;"><strong>Fixação na parede:</strong> ' + (dados.fixacao === 'sim' ? 'Sim' : dados.fixacao === 'nao' ? 'Não' : 'Não sei') + '</li>';
        html += '<li style="padding:8px 0;"><strong>Recortes:</strong> ' + (dados.recortes.length > 0 ? dados.recortes.join(', ') : 'Nenhum') + '</li>';
        html += '<li style="padding:8px 0;"><strong>Cidade:</strong> ' + (fatorLocalizacao[dados.cidade] ? fatorLocalizacao[dados.cidade].descricao : dados.cidade) + '</li>';
        html += '</ul>';
        html += '<p style="text-align:center;color:#888;margin-top:15px;">Clique em <strong>Calcular Estimativa</strong> para ver o resultado.</p>';
        return html;
    }
    
    // Adicionar eventos da etapa
    function adicionarEventosEtapa(numero) {
        if (numero === 1) {
            document.querySelectorAll('.opcao-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    dados.movel = this.getAttribute('data-valor');
                });
                item.addEventListener('keydown', function(e) { if (e.key === 'Enter') this.click(); });
            });
        }
        if (numero >= 2 && numero <= 5) {
            document.querySelectorAll('.opcao-simples').forEach(function(item) {
                item.addEventListener('click', function() {
                    var parent = this.parentElement;
                    parent.querySelectorAll('.opcao-simples').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    var valor = this.getAttribute('data-valor');
                    if (numero === 2) dados.condicao = valor;
                    if (numero === 3) dados.desmontagem = valor;
                    if (numero === 4) dados.remontagem = valor;
                    if (numero === 5) dados.fixacao = valor;
                });
                item.addEventListener('keydown', function(e) { if (e.key === 'Enter') this.click(); });
            });
        }
        if (numero === 6) {
            document.querySelectorAll('.opcao-checkbox').forEach(function(item) {
                item.addEventListener('click', function() {
                    var valor = this.getAttribute('data-valor');
                    if (valor === 'Nenhum') {
                        dados.recortes = ['Nenhum'];
                        document.querySelectorAll('.opcao-checkbox').forEach(function(i) { i.classList.remove('selecionado'); });
                        this.classList.add('selecionado');
                    } else {
                        var idx = dados.recortes.indexOf('Nenhum');
                        if (idx !== -1) dados.recortes.splice(idx, 1);
                        document.querySelector('.opcao-checkbox[data-valor="Nenhum"]').classList.remove('selecionado');
                        
                        var recIdx = dados.recortes.indexOf(valor);
                        if (recIdx === -1) {
                            dados.recortes.push(valor);
                            this.classList.add('selecionado');
                        } else {
                            dados.recortes.splice(recIdx, 1);
                            this.classList.remove('selecionado');
                        }
                    }
                });
                item.addEventListener('keydown', function(e) { if (e.key === 'Enter') this.click(); });
            });
        }
        if (numero === 7) {
            document.querySelectorAll('.opcao-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.opcao-item').forEach(function(i) { i.classList.remove('selecionado'); });
                    this.classList.add('selecionado');
                    dados.cidade = this.getAttribute('data-valor');
                });
                item.addEventListener('keydown', function(e) { if (e.key === 'Enter') this.click(); });
            });
        }
    }
    
    // Validar etapa
    function validarEtapa() {
        if (etapaAtual === 1 && !dados.movel) { alert('Selecione um tipo de móvel.'); return false; }
        if (etapaAtual === 2 && !dados.condicao) { alert('Informe se o móvel é novo ou usado.'); return false; }
        if (etapaAtual === 3 && !dados.desmontagem) { alert('Informe se será necessário desmontar.'); return false; }
        if (etapaAtual === 4 && !dados.remontagem) { alert('Informe se será necessário remontar.'); return false; }
        if (etapaAtual === 5 && !dados.fixacao) { alert('Informe sobre a fixação na parede.'); return false; }
        if (etapaAtual === 7 && !dados.cidade) { alert('Selecione sua cidade.'); return false; }
        return true;
    }
    
    // Atualizar botões
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
    
    // Calcular e exibir resultado
    function exibirResultado() {
        var movel = tabelaPrecos[dados.movel];
        var local = fatorLocalizacao[dados.cidade] || fatorLocalizacao['outro'];
        
        var precoMin = movel.precoMin;
        var precoMax = movel.precoMax;
        var tempoMin = movel.tempoMin;
        var tempoMax = movel.tempoMax;
        var complexidade = movel.complexidade;
        var observacoes = [movel.observacao];
        
        // Ajustes por condição
        if (dados.condicao === 'usado') {
            precoMin = Math.round(precoMin * fatoresAjuste.usado.multiplicador);
            precoMax = Math.round(precoMax * fatoresAjuste.usado.multiplicador);
            observacoes.push(fatoresAjuste.usado.descricao);
        }
        
        // Desmontagem
        if (dados.desmontagem === 'sim') {
            precoMin += fatoresAjuste.desmontagem.adicionalPreco;
            precoMax += fatoresAjuste.desmontagem.adicionalPreco;
            tempoMin += fatoresAjuste.desmontagem.adicionalTempo;
            tempoMax += fatoresAjuste.desmontagem.adicionalTempo;
            observacoes.push(fatoresAjuste.desmontagem.descricao);
        }
        
        // Remontagem
        if (dados.remontagem === 'sim') {
            precoMin += fatoresAjuste.remontagem.adicionalPreco;
            precoMax += fatoresAjuste.remontagem.adicionalPreco;
            observacoes.push(fatoresAjuste.remontagem.descricao);
        }
        
        // Fixação
        if (dados.fixacao === 'sim') {
            precoMin += fatoresAjuste.fixacaoParede.adicionalPreco;
            precoMax += fatoresAjuste.fixacaoParede.adicionalPreco;
            tempoMin += fatoresAjuste.fixacaoParede.adicionalTempo;
            tempoMax += fatoresAjuste.fixacaoParede.adicionalTempo;
            observacoes.push(fatoresAjuste.fixacaoParede.descricao);
        }
        
        // Recortes
        if (dados.recortes.length > 0 && dados.recortes.indexOf('Nenhum') === -1) {
            precoMin += fatoresAjuste.recorte.adicionalPreco;
            precoMax += fatoresAjuste.recorte.adicionalPreco;
            tempoMin += fatoresAjuste.recorte.adicionalTempo;
            tempoMax += fatoresAjuste.recorte.adicionalTempo;
            observacoes.push(fatoresAjuste.recorte.descricao);
        }
        
        // Localização
        precoMin = Math.round(precoMin * local.multiplicador);
        precoMax = Math.round(precoMax * local.multiplicador);
        
        // Complexidade visual
        var compVisual = '';
        if (complexidade === 'baixa') compVisual = '🟢 Baixa';
        if (complexidade === 'media') compVisual = '🟡 Média';
        if (complexidade === 'alta') compVisual = '🔴 Alta';
        
        // Formatar tempo
        function formatarTempo(min) {
            if (min < 60) return min + ' min';
            var h = Math.floor(min / 60);
            var m = min % 60;
            if (m === 0) return h + 'h';
            return h + 'h' + m + 'min';
        }
        
        // Construir resultado
        var html = '';
        html += '<div class="resultado-header">';
        html += '<h2>Estimativa de Montagem</h2>';
        html += '<p class="resultado-movel">' + movel.nome + '</p>';
        html += '</div>';
        html += '<div class="resultado-body">';
        
        html += '<div class="resultado-item">';
        html += '<span class="resultado-label">Complexidade</span>';
        html += '<span class="resultado-valor">' + compVisual + '</span>';
        html += '</div>';
        
        html += '<div class="resultado-item">';
        html += '<span class="resultado-label">Tempo estimado</span>';
        html += '<span class="resultado-valor">Entre ' + formatarTempo(tempoMin) + ' e ' + formatarTempo(tempoMax) + '</span>';
        html += '</div>';
        
        html += '<div class="resultado-item">';
        html += '<span class="resultado-label">Faixa média de investimento</span>';
        html += '<span class="resultado-valor" style="font-size:1.3em;color:var(--verde);">R$ ' + precoMin + ' a R$ ' + precoMax + '</span>';
        html += '</div>';
        
        html += '<div class="resultado-aviso">';
        html += '⚠️ <strong>Importante:</strong> Estimativa baseada nas informações fornecidas. O orçamento definitivo depende da análise do móvel e das condições do ambiente.';
        html += '</div>';
        
        if (observacoes.length > 0) {
            html += '<div class="resultado-observacoes">';
            html += '<h4>📝 Observações:</h4>';
            html += '<ul style="padding-left:18px;">';
            observacoes.forEach(function(obs) {
                html += '<li style="margin-bottom:5px;">' + obs + '</li>';
            });
            html += '</ul></div>';
        }
        
        // Mensagem WhatsApp
        var msg = 'Olá!%0A%0AUtilizei o Simulador de Preço da MontaTech.%0A%0A';
        msg += 'Móvel: ' + movel.nome + '%0A';
        msg += 'Condição: ' + (dados.condicao === 'novo' ? 'Novo' : 'Usado') + '%0A';
        msg += 'Desmontagem: ' + (dados.desmontagem === 'sim' ? 'Sim' : 'Não') + '%0A';
        msg += 'Remontagem: ' + (dados.remontagem === 'sim' ? 'Sim' : 'Não') + '%0A';
        msg += 'Fixação: ' + (dados.fixacao === 'sim' ? 'Sim' : dados.fixacao === 'nao' ? 'Não' : 'Não sei') + '%0A';
        msg += 'Cidade: ' + local.descricao + '%0A';
        msg += 'Estimativa: R$ ' + precoMin + ' a R$ ' + precoMax + '%0A%0A';
        msg += 'Gostaria de solicitar um orçamento.';
        
        html += '<div class="resultado-cta">';
        html += '<a href="https://api.whatsapp.com/send/?phone=5561998865417&text=' + msg + '&type=phone_number&app_absent=0" class="btn-whatsapp" target="_blank" rel="noopener">📱 Solicitar Orçamento pelo WhatsApp</a>';
        html += '<br>';
        html += '<button class="btn-reiniciar" onclick="location.reload();">🔄 Fazer Nova Simulação</button>';
        html += '</div>';
        
        html += '</div>';
        
        resultadoCard.innerHTML = html;
        simuladorWizard.style.display = 'none';
        simuladorResultado.style.display = 'block';
        simuladorResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
})();
