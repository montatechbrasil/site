// ============================================
// MONTATECH BRASIL - SCRIPTS PRINCIPAIS
// Menu mobile + Contador + Galeria + Lightbox
// ============================================

(function() {
    'use strict';
    
    function init() {
        initContadorAvaliacoes();
        initGaleria();
        initScrollSuave();
    }
    
    // ============================================
    // CONTADOR DE AVALIAÇÕES
    // ============================================
    function initContadorAvaliacoes() {
        var ratingElement = document.getElementById('ratingCount');
        if (!ratingElement) return;
        
        var target = 100;
        var duration = 2000;
        var animated = false;
        
        function animate(startTime) {
            var elapsed = performance.now() - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easeOut = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(easeOut * target);
            
            ratingElement.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(function() { animate(startTime); });
            } else {
                ratingElement.textContent = target;
            }
        }
        
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    requestAnimationFrame(function() { animate(performance.now()); });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(ratingElement);
    }
    
    // ============================================
    // GALERIA COM LIGHTBOX MODERNIZADO
    // ============================================
    function initGaleria() {
        var galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        var galleryImages = [
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999809/montagem-moveis-valparaiso-goias-01_izqrzz.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-profissional-valparaiso-06_ztmhmi.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-moveis-cidades-entorno-02_vin2np.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999809/montagem-moveis-valparaiso-goias-01_izqrzz.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-profissional-valparaiso-06_ztmhmi.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-moveis-cidades-entorno-02_vin2np.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999809/montagem-moveis-valparaiso-goias-01_izqrzz.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-profissional-valparaiso-06_ztmhmi.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-moveis-cidades-entorno-02_vin2np.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999809/montagem-moveis-valparaiso-goias-01_izqrzz.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-profissional-valparaiso-06_ztmhmi.png',
            'https://res.cloudinary.com/dxqm3lwrk/image/upload/v1774999808/montagem-moveis-cidades-entorno-02_vin2np.png'
        ];
        
        var isMobile = window.matchMedia('(max-width: 768px)').matches;
        var itemsPerLoad = isMobile ? 4 : 3;
        var visibleCount = 0;
        var allItems = [];
        
        var lightbox = document.getElementById('lightbox');
        var lightboxImg = document.getElementById('lightboxImg');
        var lightboxClose = document.getElementById('lightboxClose');
        var lightboxPrev = document.getElementById('lightboxPrev');
        var lightboxNext = document.getElementById('lightboxNext');
        var lightboxCounter = document.getElementById('lightboxCounter');
        var lightboxDots = document.getElementById('lightboxDots');
        var currentIndex = 0;
        var touchStartX = 0;
        var touchEndX = 0;
        
        galleryGrid.innerHTML = '';
        
        galleryImages.forEach(function(src, index) {
            var item = document.createElement('div');
            item.className = 'gallery-item';
            
            var img = document.createElement('img');
            img.src = src;
            img.alt = 'Trabalho MontaTech Brasil ' + (index + 1);
            img.loading = 'lazy';
            
            item.addEventListener('click', function() {
                abrirLightbox(index);
            });
            
            item.appendChild(img);
            galleryGrid.appendChild(item);
            allItems.push(item);
        });
        
        var verMaisBtn = document.getElementById('btnVerMais');
        
        function showItems(count) {
            var limit = Math.min(count, allItems.length);
            for (var i = visibleCount; i < limit; i++) {
                allItems[i].classList.add('visible');
            }
            visibleCount = limit;
            if (verMaisBtn && visibleCount >= allItems.length) {
                verMaisBtn.style.display = 'none';
            }
        }
        
        showItems(itemsPerLoad);
        
        if (verMaisBtn) {
            verMaisBtn.addEventListener('click', function() {
                showItems(visibleCount + itemsPerLoad);
            });
            if (visibleCount >= allItems.length) {
                verMaisBtn.style.display = 'none';
            }
        }
        
        // ============================================
        // LIGHTBOX MODERNIZADO
        // ============================================
        function criarDots() {
            if (!lightboxDots) return;
            lightboxDots.innerHTML = '';
            galleryImages.forEach(function(_, i) {
                var dot = document.createElement('button');
                dot.className = 'lightbox-dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('aria-label', 'Ir para imagem ' + (i + 1));
                dot.addEventListener('click', function() {
                    abrirLightbox(i);
                });
                lightboxDots.appendChild(dot);
            });
        }
        
        function atualizarLightbox() {
            if (lightboxImg) {
                lightboxImg.src = galleryImages[currentIndex];
                lightboxImg.alt = 'Trabalho MontaTech Brasil ' + (currentIndex + 1);
            }
            if (lightboxCounter) {
                lightboxCounter.textContent = (currentIndex + 1) + ' de ' + galleryImages.length;
            }
            criarDots();
        }
        
        function abrirLightbox(index) {
            currentIndex = index;
            atualizarLightbox();
            if (lightbox) {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        
        function fecharLightbox() {
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        function imgAnterior() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            atualizarLightbox();
        }
        
        function imgProxima() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            atualizarLightbox();
        }
        
        if (lightboxClose) lightboxClose.addEventListener('click', fecharLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', function(e) { e.stopPropagation(); imgAnterior(); });
        if (lightboxNext) lightboxNext.addEventListener('click', function(e) { e.stopPropagation(); imgProxima(); });
        
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) fecharLightbox();
            });
            
            lightbox.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            lightbox.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                var diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) imgProxima();
                    else imgAnterior();
                }
            }, { passive: true });
        }
        
        document.addEventListener('keydown', function(e) {
            if (!lightbox || !lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') fecharLightbox();
            if (e.key === 'ArrowLeft') imgAnterior();
            if (e.key === 'ArrowRight') imgProxima();
        });
    }
    
    // ============================================
    // SCROLL SUAVE PARA LINKS INTERNOS
    // ============================================
    function initScrollSuave() {
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            var href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            var target = document.querySelector(href);
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
