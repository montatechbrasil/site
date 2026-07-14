// ============================================
// MONTATECH BRASIL - SISTEMA DE BLOG
// Paginação automática - Não editar
// ============================================

(function() {
    'use strict';
    
    const postsPorPagina = 6;
    const blogGrid = document.getElementById('blogGrid');
    const paginationContainer = document.getElementById('pagination');
    
    if (!blogGrid || !paginationContainer) return;
    
    // Descobrir página atual pela URL
    function getPaginaAtual() {
        const urlParams = new URLSearchParams(window.location.search);
        const pagina = parseInt(urlParams.get('pagina')) || 1;
        return pagina;
    }
    
    // Gerar HTML de um card
    function criarCard(post) {
        return `
            <article class="blog-card">
                <div class="blog-card-image">
                    <img src="${post.imagem}" 
                         alt="${post.titulo}" 
                         loading="lazy" 
                         width="400" 
                         height="250">
                </div>
                <div class="blog-card-content">
                    <span class="blog-category">${post.categoria}</span>
                    <h2><a href="${post.link}">${post.titulo}</a></h2>
                    <p>${post.resumo}</p>
                    <div class="blog-meta">
                        <span>📅 ${post.data}</span>
                        <span>⏱️ ${post.tempoLeitura}</span>
                    </div>
                </div>
            </article>
        `;
    }
    
    // Gerar paginação
    function criarPaginacao(paginaAtual, totalPaginas) {
        if (totalPaginas <= 1) return '';
        
        let html = '';
        
        // Informação
        html += `<span class="pagination-info">Página ${paginaAtual} de ${totalPaginas}</span>`;
        html += '<div class="pagination-buttons">';
        
        // Botão Anterior
        if (paginaAtual > 1) {
            html += `<a href="?pagina=${paginaAtual - 1}" class="page-btn">← Anterior</a>`;
        } else {
            html += '<span class="page-btn disabled">← Anterior</span>';
        }
        
        // Números das páginas
        for (let i = 1; i <= totalPaginas; i++) {
            if (i === paginaAtual) {
                html += `<span class="page-btn active">${i}</span>`;
            } else {
                html += `<a href="?pagina=${i}" class="page-btn">${i}</a>`;
            }
        }
        
        // Botão Próxima
        if (paginaAtual < totalPaginas) {
            html += `<a href="?pagina=${paginaAtual + 1}" class="page-btn">Próxima →</a>`;
        } else {
            html += '<span class="page-btn disabled">Próxima →</span>';
        }
        
        html += '</div>';
        return html;
    }
    
    // Inicializar
    function init() {
        if (typeof todosPosts === 'undefined') {
            blogGrid.innerHTML = '<p style="text-align:center;padding:40px;">Nenhum post encontrado.</p>';
            return;
        }
        
        const totalPosts = todosPosts.length;
        const totalPaginas = Math.ceil(totalPosts / postsPorPagina);
        const paginaAtual = getPaginaAtual();
        
        // Validar página
        if (paginaAtual < 1 || paginaAtual > totalPaginas) {
            window.location.href = '?pagina=1';
            return;
        }
        
        // Calcular posts da página atual
        const inicio = (paginaAtual - 1) * postsPorPagina;
        const fim = inicio + postsPorPagina;
        const postsDaPagina = todosPosts.slice(inicio, fim);
        
        // Renderizar cards
        blogGrid.innerHTML = postsDaPagina.map(post => criarCard(post)).join('');
        
        // Renderizar paginação
        paginationContainer.innerHTML = criarPaginacao(paginaAtual, totalPaginas);
        paginationContainer.className = 'pagination pagination-bottom';
    }
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
