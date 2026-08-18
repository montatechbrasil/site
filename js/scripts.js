// ============================================
// SCRIPTS PRINCIPAIS - MontaTech Brasil v3.0
// Contador + Galeria + Lightbox + Scroll Suave
// ============================================

(function() {
    'use strict';
    
    // Aguardar o DOM estar completamente pronto
    function init() {
        initContadorAvaliacoes();
        initGaleria();
        initScrollSuave();
    }
    
    // ============================================
    // CONTADOR DE AVALIAÇÕES
    // ============================================
    function initContadorAvaliacoes() {
        const ratingElement = document.getElementById('ratingCount');
        if (!ratingElement) {
            console.warn('Elemento #ratingCount não encontrado');
            return;
        }
        
        const target = 100;
        const duration = 2000;
        let animated = false;
        
        function animate(startTime) {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            ratingElement.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(() => animate(startTime));
            } else {
                ratingElement.textContent = target;
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    requestAnimationFrame(() => animate(performance.now()));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(ratingElement);
    }
    
    // ============================================
    // GALERIA - MOSTRA 3 + BOTÃO "VER MAIS" + LIGHTBOX
    // ============================================
    function initGaleria() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) {
            console.warn('Elemento #galleryGrid não encontrado');
            return;
        }
        
        // Lista de imagens
        const galleryImages = [
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594410/painel-tv-instalado_led_valparaiso-go_chdgu7.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594408/montagem-guarda-roupas-planejado_tgiaxw.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594407/montagem_guarda_roupas_valparaiso-ocidental_nvowi1.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594407/montagem-cozinha-aereos-valparaiso-go_qqmnq9.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594412/cozinha-planejada-montada-valparaiso_befqgr.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594413/desmontagem-mudanca-cidade-ocidental_afxyre.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594410/rack-montado-sala-estar-valparaiso_kr09xn.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594410/cadeiras-montagem-profissional_sqkk6e.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594411/comoda-montada-quarto-valparaiso_tgacyz.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594408/montagem-guarda-roupa-valparaiso-goias_xybseu.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594407/mesa-planejada-escritorio_k40rjt.jpg',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1785594407/montagem-guarda-roupas-novo-ocidental-valparaiso_k2kkrh.jpg'
        ];
        
        // Limpar galeria
        galleryGrid.innerHTML = '';
        
        // Determinar quantos itens carregar por vez
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const itemsPerLoad = isMobile ? 4 : 3;
        let visibleCount = 0;
        
        // Lightbox
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        // Criar todos os itens da galeria (inicialmente ocultos)
        const allItems = [];
        
        galleryImages.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Projeto MontaTech ${index + 1}`;
            img.loading = 'lazy';
            
            // Clique para abrir lightbox
            item.addEventListener('click', () => {
                if (lightbox && lightboxImg) {
                    lightbox.classList.add('active');
                    lightboxImg.src = src;
                    document.body.style.overflow = 'hidden';
                }
            });
            
            item.appendChild(img);
            galleryGrid.appendChild(item);
            allItems.push(item);
        });
        
        // Pegar o botão "Ver Mais"
        const verMaisBtn = document.getElementById('btnVerMais');
        
        // Mostrar itens
        function showItems(count) {
            const limit = Math.min(count, allItems.length);
            for (let i = visibleCount; i < limit; i++) {
                allItems[i].classList.add('visible');
            }
            visibleCount = limit;
            
            // Esconder botão se todas estiverem visíveis
            if (verMaisBtn && visibleCount >= allItems.length) {
                verMaisBtn.style.display = 'none';
            }
        }
        
        // Inicial: mostrar primeiro lote
        showItems(itemsPerLoad);
        
        // Botão Ver Mais
        if (verMaisBtn) {
            verMaisBtn.addEventListener('click', () => {
                showItems(visibleCount + itemsPerLoad);
            });
            
            // Se já mostrou tudo, esconder
            if (visibleCount >= allItems.length) {
                verMaisBtn.style.display = 'none';
            }
        }
        
        // Lightbox - fechar
        function closeLightbox() {
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
    
    // ============================================
    // SCROLL SUAVE PARA LINKS INTERNOS
    // ============================================
    function initScrollSuave() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ============================================
    // INICIALIZAR
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
