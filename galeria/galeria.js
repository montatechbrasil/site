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
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateActiveDot();
        this.setupEventListeners();
        this.startAutoplay();
    }
    
    createDots() {
        const slides = this.track.children;
        const slideCount = slides.length;
        
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

document.addEventListener('DOMContentLoaded', () => {
    new CarrosselGaleria();
});
