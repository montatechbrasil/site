(function() {
    var postsPorPagina = 6;
    var blogGrid = document.getElementById('blogGrid');
    var paginationContainer = document.getElementById('pagination');
    
    if (!blogGrid || !paginationContainer) return;
    
    function getPaginaAtual() {
        var urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('pagina')) || 1;
    }
    
    function criarCard(post) {
        return '<article class="blog-card">' +
            '<div class="blog-card-image">' +
            '<img src="' + post.imagem + '" alt="' + post.titulo + '" loading="lazy" width="400" height="250">' +
            '</div>' +
            '<div class="blog-card-content">' +
            '<span class="blog-category">' + post.categoria + '</span>' +
            '<h2><a href="' + post.link + '">' + post.titulo + '</a></h2>' +
            '<p>' + post.resumo + '</p>' +
            '<div class="blog-meta">' +
            '<span>&#128197; ' + post.data + '</span>' +
            '<span>&#9201; ' + post.tempoLeitura + '</span>' +
            '</div>' +
            '</div>' +
            '</article>';
    }
    
    function init() {
        if (typeof todosPosts === 'undefined') {
            blogGrid.innerHTML = '<p style="text-align:center;padding:40px;">Nenhum post encontrado.</p>';
            return;
        }
        
        var totalPosts = todosPosts.length;
        var totalPaginas = Math.ceil(totalPosts / postsPorPagina);
        var paginaAtual = getPaginaAtual();
        
        var inicio = (paginaAtual - 1) * postsPorPagina;
        var fim = inicio + postsPorPagina;
        var postsDaPagina = todosPosts.slice(inicio, fim);
        
        blogGrid.innerHTML = postsDaPagina.map(function(post) {
            return criarCard(post);
        }).join('');
        
        if (totalPaginas > 1) {
            var html = '<span class="pagination-info">Pagina ' + paginaAtual + ' de ' + totalPaginas + '</span>';
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
            paginationContainer.innerHTML = html;
            paginationContainer.className = 'pagination pagination-bottom';
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
