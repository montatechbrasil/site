// ============================================
// CARREGADOR DE COMPONENTES MODULARES
// MontaTech Brasil - Versão 3.0
// ============================================

(function() {
    'use strict';
    
    // Determinar caminho base
    const pathBase = window.location.pathname.includes('/blog/') ? '/' : '/';
    
    // Carregar Menu
    function carregarMenu() {
        const menuContainer = document.getElementById('menu-container');
        if (!menuContainer) return;
        
        fetch('/componentes/menu.html')
            .then(response => {
                if (!response.ok) throw new Error('Menu não encontrado');
                return response.text();
            })
            .then(html => {
                menuContainer.innerHTML = html;
                
                // Destacar link ativo
                destacarLinkAtivo();
                
                // Inicializar menu mobile
                inicializarMenuMobile();
            })
            .catch(error => {
                console.error('Erro ao carregar menu:', error);
                // Fallback: menu estático básico
                menuContainer.innerHTML = `
                    <header class="main-header">
                        <div class="container">
                            <a href="/index.html" class="logo-link">
                                <img src="/img/logo3.png" alt="MontaTech Brasil" width="220" height="50">
                            </a>
                            <nav class="main-nav">
                                <ul class="nav-list" style="display:flex;list-style:none;gap:10px;">
                                    <li><a href="/index.html">Home</a></li>
                                    <li><a href="/blog/">Blog</a></li>
                                    <li><a href="/index.html#contato">Contato</a></li>
                                </ul>
                            </nav>
                        </div>
                    </header>`;
            });
    }
    
    // Carregar Footer
    function carregarFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) return;
        
        fetch('/componentes/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Footer não encontrado');
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('Erro ao carregar footer:', error);
            });
    }
    
    // Destacar link ativo no menu
    function destacarLinkAtivo() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-list a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Página inicial
            if (currentPath === '/' && href === '/index.html') {
                link.classList.add('active');
            }
            // Blog
            else if (currentPath.includes('/blog/') && href === '/blog/') {
                link.classList.add('active');
            }
            // Outras páginas
            else if (href !== '/index.html' && href !== '/blog/' && currentPath.includes(href.replace('/',''))) {
                link.classList.add('active');
            }
        });
    }
    
    // Menu Mobile
    function inicializarMenuMobile() {
        setTimeout(() => {
            const menuToggle = document.getElementById('menuToggle');
            const navList = document.getElementById('navList');
            
            if (!menuToggle || !navList) return;
            
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navList.classList.toggle('active');
                
                const spans = this.querySelectorAll('span');
                if (navList.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
            
            // Fechar ao clicar em link
            navList.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                });
            });
            
            // Fechar ao clicar fora
            document.addEventListener('click', function(e) {
                if (!navList.contains(e.target) && !e.target.closest('#menuToggle')) {
                    navList.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        }, 100);
    }
    
    // Inicializar tudo quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            carregarMenu();
            carregarFooter();
        });
    } else {
        carregarMenu();
        carregarFooter();
    }
    
})();
