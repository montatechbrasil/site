// ============================================
// MENU MOBILE - CORRIGIDO
// ============================================
(function() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    if (menuToggle && navList) {
        // Remove listeners antigos se existirem
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navList.classList.toggle('active');
            
            // Animação do ícone hamburguer
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
        
        // Fechar menu ao clicar em links
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
        
        // Fechar menu ao clicar fora
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
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing suave
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        ratingElement.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            ratingElement.textContent = target;
        }
    }
    
    // Iniciar animação quando elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(animate);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(ratingElement);
})();

// ============================================
// GALERIA COM LAZY LOAD
// ============================================
(function() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Imagens da galeria (adicione mais URLs conforme necessário)
    const galleryImages = [
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
    
    function loadImages() {
        const start = imagesLoaded;
        const end = Math.min(start + imagesPerLoad, galleryImages.length);
        
        for (let i = start; i < end; i++) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = galleryImages[i];
            img.alt = 'Trabalho MontaTech Brasil';
            img.loading = 'lazy';
            
            img.onload = () => img.classList.add('loaded');
            img.onerror = () => {
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23ddd"><rect width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="16">Imagem</text></svg>';
                img.classList.add('loaded');
            };
            
            item.appendChild(img);
            galleryGrid.appendChild(item);
        }
        
        imagesLoaded = end;
        
        if (imagesLoaded >= galleryImages.length) {
            document.getElementById('galleryLoader').style.display = 'none';
        }
    }
    
    // Carregar primeiras imagens
    loadImages();
    
    // Scroll infinito leve
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && imagesLoaded < galleryImages.length) {
                loadImages();
            }
        });
    }, { threshold: 0.1 });
    
    const loader = document.getElementById('galleryLoader');
    if (loader) {
        observer.observe(loader);
    }
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
