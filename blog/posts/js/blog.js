(function() {
    'use strict';
    
    var postsPorPagina = 6;
    var blogGrid = document.getElementById('blogGrid');
    var paginationContainer = document.getElementById('pagination');
    
    if (!blogGrid || !paginationContainer) return;
    
    function getPaginaAtual() {
        var urlParams = new URLSearchParams(window.location.search);
        var pagina = parseInt(urlParams.get('pagina')) || 1;
        return pagina;
    }
    
    function criarCard(post) {
        var html = '';
        html += '<article class="blog-card">';
        html += '<div class="blog-card-image">';
        html += '<img src="' + post.imagem + '" alt="' + post.titulo + '" loading="lazy" width="400" height="250">';
        html += '</div>';
        html += '<div class="blog-card-content">';
        html += '<span class="blog-category">' + post.categoria + '</span>';
        html += '<h2><a href="' + post.link + '">' + post.titulo + '</a></h2>';
        html += '<p>' + post.resumo + '</p>';
        html += '<div class="blog-meta">';
        html += '<span>&#128197; ' + post.data + '</span>';
        html += '<span>&#9201; ' + post.tempoLeitura + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</article>';
        return html;
    }
    
    function criarPaginacao(paginaAtual, totalPaginas) {
        if (totalPaginas <= 1) return '';
        
        var html = '';
        html += '<span class="pagination-info">Pagina ' + paginaAtual + ' de ' + totalPaginas + '</span>';
        html += '<div class="pagination-buttons">';
        
        if (paginaAtual > 1) {
            html += '<a href="?pagina=' + (paginaAtual - 1) + '" class="page-btn">← Anterior</a>';
        } else {
            html += '<span class="page-btn disabled">← Anterior</span>';
        }
        
        for (var i = 1; i <= totalPaginas; i++) {
            if (i === paginaAtual) {
                html += '<span class="page-btn active">' + i + '</span>';
            } else {
                html += '<a href="?pagina=' + i + '" class="page-btn">' + i + '</a>';
            }
        }
        
        if (paginaAtual < totalPaginas) {
            html += '<a href="?pagina=' + (paginaAtual + 1) + '" class="page-btn">Proxima →</a>';
        } else {
            html += '<span class="page-btn disabled">Proxima →</span>';
        }
        
        html += '</div>';
        return html;
    }
    
    function init() {
        if (typeof todosPosts === 'undefined') {
            blogGrid.innerHTML = '<p style="text-align:center;padding:40px;">Nenhum post encontrado.</p>';
            return;
        }
        
        var totalPosts = todosPosts.length;
        var totalPaginas = Math.ceil(totalPosts / postsPorPagina);
        var paginaAtual = getPaginaAtual();
        
        if (paginaAtual < 1 || paginaAtual > totalPaginas) {
            window.location.href = '?pagina=1';
            return;
        }
        
        var inicio = (paginaAtual - 1) * postsPorPagina;
        var fim = inicio + postsPorPagina;
        var postsDaPagina = todosPosts.slice(inicio, fim);
        
        blogGrid.innerHTML = postsDaPagina.map(function(post) {
            return criarCard(post);
        }).join('');
        
        paginationContainer.innerHTML = criarPaginacao(paginaAtual, totalPaginas);
        paginationContainer.className = 'pagination pagination-bottom';
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
