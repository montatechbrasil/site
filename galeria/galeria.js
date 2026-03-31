// ============================================
// GALERIA DINÂMICA - Busca imagens do Cloudinary
// ============================================

class CarrosselGaleria {
    constructor() {
        this.container = document.getElementById('carouselContainer');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.autoplayInterval = null;
        this.isAutoplayActive = true;
        this.autoplaySpeed = 3000;
        this.images = [];
        
        this.init();
    }
    
    async init() {
        // Mostra loading
        this.track.innerHTML = '<div style="text-align:center; padding:40px;">Carregando imagens...</div>';
        
        // Busca as imagens do Cloudinary
        await this.loadImagesFromCloudinary();
        
        // Se encontrou imagens, cria a galeria
        if (this.images.length > 0) {
            this.createGallery();
            this.createDots();
            this.updateActiveDot();
            this.setupEventListeners();
            this.startAutoplay();
        } else {
            this.track.innerHTML = '<div style="text-align:center; padding:40px;">Nenhuma imagem encontrada.</div>';
        }
    }
    
    async loadImagesFromCloudinary() {
        try {
            // API do Cloudinary para listar imagens
            const cloudName = CLOUD_NAME;
            const folder = FOLDER ? `prefix=${FOLDER}&` : '';
            
            // Nota: Esta chamada é pública e só lista imagens (sem expor chaves)
            const url = `https://res.cloudinary.com/${cloudName}/image/list/${folder}.json`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.resources && data.resources.length > 0) {
                // Pega as últimas MAX_IMAGES imagens (mais recentes primeiro)
                this.images = data.resources
                    .slice(0, MAX_IMAGES)
                    .map(resource => ({
                        publicId: resource.public_id,
                        url: getOptimizedUrl(resource.public_id),
                        format: resource.format
                    }));
            } else {
                // Fallback: usa lista manual se a API não funcionar
                this.useManualFallback();
            }
        } catch (error) {
            console.log('API não disponível, usando lista manual');
            this.useManualFallback();
        }
    }
    
    useManualFallback() {
        // Lista manual das suas 6 imagens (funciona sempre)
        const manualImages = [
            'montagem-moveis-valparaiso-goias-01_izqrzz',
            'montagem-moveis-cidades-entorno-02_vin2np',
            'montagem-profissional-valparaiso-06_ztmhmi',
            'montagem-decoracao-interiores-09_z0fjvd',
            'excelencia-montagem-moveis-04._p1ef6q',
            'inteligencia-projetos-moveis-05_gr244d'
        ];
        
        this.images = manualImages.map(publicId => ({
            publicId: publicId,
            url: getOptimizedUrl(publicId),
            format: 'png'
        }));
    }
    
    createGallery() {
        this.track.innerHTML = '';
        
        this.images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('itemscope', '');
            slide.setAttribute('itemtype', 'https://schema.org/ImageObject');
            
            // Tenta extrair um título bonito do nome do arquivo
            let title = img.publicId
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .split(' ')
                .slice(0, 4)
                .join(' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            
            slide.innerHTML = `
                <img src="${img.url}" 
                     alt="Montagem de móveis - MontaTech Brasil"
                     title="${title}"
                     loading="lazy"
                     width="640"
                     height="480"
                     itemprop="contentUrl">
                <div class="slide-info">
                    <span class="slide-badge">Trabalho Realizado</span>
                    <h3 itemprop="name">${title}</h3>
                    <p itemprop="description">Montagem profissional em Valparaíso de Goiás</p>
                </div>
            `;
            
            this.track.appendChild(slide);
        });
    }
    
    createDots() {
        const slideCount = this.images.length;
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.scrollToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateActiveDot() {
        const scrollPosition = this.container.scrollLeft;
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        const activeIndex = Math.round(scrollPosition / slideWidth);
        
        const dots = this.dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    scrollToSlide(index) {
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        this.container.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
    }
    
    scrollNext() {
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        const currentScroll = this.container.scrollLeft;
        const maxScroll = this.container.scrollWidth - this.container.clientWidth;
        let newScroll = currentScroll + slideWidth;
        
        if (newScroll > maxScroll) {
            newScroll = 0;
        }
        
        this.container.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
    
    scrollPrev() {
        const firstSlide = this.track.children[0];
        if (!firstSlide) return;
        
        const slideWidth = firstSlide.offsetWidth + 20;
        const currentScroll = this.container.scrollLeft;
        let newScroll = currentScroll - slideWidth;
        
        if (newScroll < 0) {
            newScroll = this.container.scrollWidth - this.container.clientWidth;
        }
        
        this.container.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
    
    startAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        
        this.autoplayInterval = setInterval(() => {
            if (this.isAutoplayActive && !this.isDragging) {
                this.scrollNext();
            }
        }, this.autoplaySpeed);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoplay();
            this.scrollPrev();
            if (this.isAutoplayActive) this.startAutoplay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoplay();
            this.scrollNext();
            if (this.isAutoplayActive) this.startAutoplay();
        });
        
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.pageX - this.container.offsetLeft;
            this.scrollLeft = this.container.scrollLeft;
            this.container.style.cursor = 'grabbing';
            this.stopAutoplay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
            if (this.isAutoplayActive && !this.autoplayInterval) this.startAutoplay();
        });
        
        this.container.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
            if (this.isAutoplayActive && !this.autoplayInterval) this.startAutoplay();
        });
        
        this.container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 2;
            this.container.scrollLeft = this.scrollLeft - walk;
        });
        
        this.container.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].pageX - this.container.offsetLeft;
            this.scrollLeft = this.container.scrollLeft;
            this.stopAutoplay();
        });
        
        this.container.addEventListener('touchend', () => {
            this.isDragging = false;
            if (this.isAutoplayActive && !this.autoplayInterval) this.startAutoplay();
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            const x = e.touches[0].pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 2;
            this.container.scrollLeft = this.scrollLeft - walk;
        });
        
        this.container.addEventListener('scroll', () => {
            this.updateActiveDot();
        });
        
        this.track.addEventListener('click', (e) => {
            const slide = e.target.closest('.carousel-slide');
            if (slide) {
                this.openLightbox(slide);
            }
        });
    }
    
    openLightbox(slide) {
        const img = slide.querySelector('img');
        const info = slide.querySelector('.slide-info');
        const badge = info.querySelector('.slide-badge')?.innerText || '';
        const title = info.querySelector('h3')?.innerText || '';
        const desc = info.querySelector('p')?.innerText || '';
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${badge} - ${title}${desc ? ': ' + desc : ''}`;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        const closeBtn = document.querySelector('.lightbox-close');
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        };
        
        closeBtn.onclick = closeLightbox;
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        }, { once: true });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new CarrosselGaleria();
});
