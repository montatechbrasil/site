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
// GALERIA - MOSTRA 3 + BOTÃO "VER MAIS" + LIGHTBOX
// ============================================
(function() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Lista de imagens
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
    
    const itemsPerLoad = 3;
    let visibleCount = 0;
    
    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Criar todos os itens da galeria
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
            lightbox.classList.add('active');
            lightboxImg.src = src;
            document.body.style.overflow = 'hidden';
        });
        
        item.appendChild(img);
        galleryGrid.appendChild(item);
        allItems.push(item);
    });
    
    // Criar botão "Ver Mais"
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'gallery-actions';
    const verMaisBtn = document.createElement('button');
    verMaisBtn.className = 'btn-ver-mais';
    verMaisBtn.textContent = 'Ver Mais Fotos';
    actionsDiv.appendChild(verMaisBtn);
    galleryGrid.parentNode.insertBefore(actionsDiv, galleryGrid.nextSibling);
    
    // Mostrar primeiras 3 imagens
    function showItems(count) {
        for (let i = visibleCount; i < Math.min(count, allItems.length); i++) {
            allItems[i].classList.add('visible');
        }
        visibleCount = Math.min(count, allItems.length);
        
        // Esconder botão se todas estiverem visíveis
        if (visibleCount >= allItems.length) {
            verMaisBtn.classList.add('hidden');
        }
    }
    
    // Inicial: mostrar 3
    showItems(3);
    
    // Botão Ver Mais: mostra +3
    verMaisBtn.addEventListener('click', () => {
        showItems(visibleCount + itemsPerLoad);
    });
    
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
