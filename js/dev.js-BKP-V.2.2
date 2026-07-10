// ============================================
// MENU MOBILE (NÃO MEXER - FUNCIONANDO)
// ============================================
(function() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    if (menuToggle && navList) {
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        
        newToggle.addEventListener('click', function(e) {
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
        
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                const spans = document.querySelectorAll('#menuToggle span');
                if (spans.length) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!navList.contains(e.target) && !e.target.closest('#menuToggle')) {
                navList.classList.remove('active');
                const spans = document.querySelectorAll('#menuToggle span');
                if (spans.length) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }
})();

// ============================================
// CONTADOR DE AVALIAÇÕES
// ============================================
(function() {
    const ratingElement = document.getElementById('ratingCount');
    if (!ratingElement) return;
    
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
    }, { threshold: 0.5 });
    
    observer.observe(ratingElement);
})();

// ============================================
// GALERIA COM SCROLL INFINITO LEVE + LIGHTBOX
// ============================================
(function() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Lista de imagens (adicione mais URLs conforme necessário)
    const galleryImages = [
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
    
    let imagesLoaded = 0;
    const imagesPerLoad = 6;
    const loader = document.getElementById('galleryLoader');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Criar item da galeria
    function createGalleryItem(src, alt) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.dataset.src = src;
        img.alt = alt || 'Trabalho MontaTech Brasil';
        
        // Lazy load
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    img.onerror = () => {
                        img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23ddd"><rect width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="16">Imagem</text></svg>');
                        img.classList.add('loaded');
                    };
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });
        
        imgObserver.observe(img);
        
        // Clique para abrir lightbox
        item.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = src;
            document.body.style.overflow = 'hidden';
        });
        
        item.appendChild(img);
        return item;
    }
    
    // Carregar lote de imagens
    function loadImages() {
        const start = imagesLoaded;
        const end = Math.min(start + imagesPerLoad, galleryImages.length);
        
        const fragment = document.createDocumentFragment();
        
        for (let i = start; i < end; i++) {
            const item = createGalleryItem(galleryImages[i], `Projeto MontaTech ${i + 1}`);
            fragment.appendChild(item);
        }
        
        galleryGrid.appendChild(fragment);
        imagesLoaded = end;
        
        // Esconder loader quando acabar
        if (imagesLoaded >= galleryImages.length) {
            if (loader) loader.style.display = 'none';
        }
    }
    
    // Carregar primeiras imagens
    loadImages();
    
    // Observer para scroll infinito
    if (loader) {
        const loadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && imagesLoaded < galleryImages.length) {
                    loadImages();
                }
            });
        }, { threshold: 0.1, rootMargin: '100px' });
        
        loadObserver.observe(loader);
    }
    
    // Lightbox - fechar
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
})();

// ============================================
// SCROLL SUAVE PARA LINKS INTERNOS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
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
});
