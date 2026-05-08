// Modern animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Gallery Slider Functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(n) {
        // Handle slide overflow
        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }

        // Update slider position using transform
        const gallerySlider = document.querySelector('.gallery-slider');
        if (gallerySlider) {
            gallerySlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event listeners for buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-play functionality
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const gallerySlider = document.querySelector('.gallery-slider');
    if (gallerySlider) {
        gallerySlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        gallerySlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (gallerySlider) {
        gallerySlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        gallerySlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe left
        } else if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe right
        }
    }

    // Fullscreen Gallery Functionality
    const fullscreenGallery = document.querySelector('.fullscreen-gallery');
    const fullscreenImg = document.querySelector('.fullscreen-img');
    const closeFullscreen = document.querySelector('.close-fullscreen');
    const fullscreenPrev = document.querySelector('.fullscreen-prev');
    const fullscreenNext = document.querySelector('.fullscreen-next');
    const fullscreenLike = document.querySelector('.fullscreen-like');
    const fullscreenBtns = document.querySelectorAll('.fullscreen-btn');
    const likeBtns = document.querySelectorAll('.like-btn');

    let currentFullscreenSlide = 0;
    let likes = [false, false, false, false]; // Track likes for each slide

    // Open fullscreen gallery on image click
    const galleryImgs = document.querySelectorAll('.gallery-img');
    galleryImgs.forEach(img => {
        img.addEventListener('click', (e) => {
            const slide = e.target.closest('.slide');
            const slideIndex = parseInt(slide.getAttribute('data-slide'));
            openFullscreen(slideIndex);
        });
    });

    function openFullscreen(index) {
        currentFullscreenSlide = index;
        fullscreenImg.src = document.querySelector(`.slide[data-slide="${index}"] img`).src;
        updateFullscreenLikeButton();

        fullscreenGallery.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close fullscreen gallery
    if (closeFullscreen) {
        closeFullscreen.addEventListener('click', () => {
            fullscreenGallery.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Fullscreen navigation
    if (fullscreenNext) {
        fullscreenNext.addEventListener('click', () => {
            currentFullscreenSlide = (currentFullscreenSlide + 1) % slides.length;
            fullscreenImg.src = document.querySelector(`.slide[data-slide="${currentFullscreenSlide}"] img`).src;
            updateFullscreenLikeButton();
        });
    }

    if (fullscreenPrev) {
        fullscreenPrev.addEventListener('click', () => {
            currentFullscreenSlide = (currentFullscreenSlide - 1 + slides.length) % slides.length;
            fullscreenImg.src = document.querySelector(`.slide[data-slide="${currentFullscreenSlide}"] img`).src;
            updateFullscreenLikeButton();
        });
    }

    // Fullscreen like functionality
    if (fullscreenLike) {
        fullscreenLike.addEventListener('click', () => {
            likes[currentFullscreenSlide] = !likes[currentFullscreenSlide];
            updateFullscreenLikeButton();
            updateGalleryLikeButton(currentFullscreenSlide);
        });
    }

    function updateFullscreenLikeButton() {
        if (likes[currentFullscreenSlide]) {
            fullscreenLike.textContent = '❤️';
            fullscreenLike.style.background = 'rgba(255, 0, 0, 0.9)';
        } else {
            fullscreenLike.textContent = '🤍';
            fullscreenLike.style.background = 'rgba(255, 0, 0, 0.8)';
        }
    }

    // Gallery like functionality
    likeBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            likes[index] = !likes[index];
            updateGalleryLikeButton(index);
        });
    });

    function updateGalleryLikeButton(index) {
        const btn = document.querySelector(`.like-btn[data-slide="${index}"]`);
        if (likes[index]) {
            btn.classList.add('liked');
            btn.textContent = '❤️';
        } else {
            btn.classList.remove('liked');
            btn.textContent = '🤍';
        }
    }

    // Close fullscreen on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenGallery.classList.contains('active')) {
            fullscreenGallery.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close fullscreen on click outside
    fullscreenGallery.addEventListener('click', (e) => {
        if (e.target === fullscreenGallery) {
            fullscreenGallery.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Poll functionality
    const pollBtns = document.querySelectorAll('.poll-btn');
    const pollModal = document.querySelector('.poll-modal');
    const pollCloseBtn = document.querySelector('.poll-close-btn');
    const pollOkBtn = document.querySelector('.poll-ok-btn');

    pollBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (pollModal) {
                pollModal.classList.add('active');
            }
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });

    if (pollCloseBtn) {
        pollCloseBtn.addEventListener('click', () => {
            pollModal.classList.remove('active');
        });
    }

    if (pollOkBtn) {
        pollOkBtn.addEventListener('click', () => {
            pollModal.classList.remove('active');
        });
    }

    // Close poll modal on click outside
    if (pollModal) {
        pollModal.addEventListener('click', (e) => {
            if (e.target === pollModal) {
                pollModal.classList.remove('active');
            }
        });
    }

    // Basketball game functionality
    const basketball = document.getElementById('basketball');
    const aimLine = document.getElementById('aim-line');
    const attemptsSpan = document.getElementById('attempts');
    const hitsSpan = document.getElementById('hits');

    let attempts = 0;
    let hits = 0;
    let isDragging = false;
    let startX, startY, startBallX, startBallY;

    if (basketball && aimLine) {
        // Make basketball draggable
        basketball.addEventListener('mousedown', (e) => {
            isDragging = true;
            basketball.classList.add('dragging');

            // Get initial positions
            const rect = basketball.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startBallX = rect.left;
            startBallY = rect.top;

            // Show aim line
            aimLine.style.display = 'block';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            // Calculate distance from start position
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Update basketball position
            basketball.style.left = `${startBallX + dx}px`;
            basketball.style.top = `${startBallY + dy}px`;

            // Update aim line angle
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            aimLine.style.transform = `rotate(${angle}deg)`;
            aimLine.style.opacity = '0.7';
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;

            isDragging = false;
            basketball.classList.remove('dragging');
            aimLine.style.opacity = '0';

            // Calculate throw power based on drag distance
            const rect = basketball.getBoundingClientRect();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Get hoop position
            const hoop = document.querySelector('.basketball-hoop');
            const hoopRect = hoop.getBoundingClientRect();
            const hoopCenterX = hoopRect.left + hoopRect.width / 2;
            const hoopCenterY = hoopRect.top + hoopRect.height / 2;

            // Calculate direction to hoop
            const toHoopDx = hoopCenterX - rect.left;
            const toHoopDy = hoopCenterY - rect.top;
            const toHoopDistance = Math.sqrt(toHoopDx * toHoopDx + toHoopDy * toHoopDy);

            // Check if hit (based on distance to hoop and throw power)
            const hit = toHoopDistance < 100 && distance > 50;

            attempts++;
            attemptsSpan.textContent = attempts;

            if (hit) {
                hits++;
                hitsSpan.textContent = hits;
                basketball.style.transition = 'transform 0.5s ease-out';
                basketball.style.transform = 'scale(1.5) rotate(360deg)';

                // Return to start position after success
                setTimeout(() => {
                    basketball.style.transition = 'all 0.3s ease';
                    basketball.style.left = '50px';
                    basketball.style.top = '250px';
                    basketball.style.transform = 'scale(1)';
                }, 500);
            } else {
                // Miss animation
                basketball.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                basketball.style.left = '80%';
                basketball.style.top = '-50px';
                basketball.style.transform = 'rotate(180deg)';

                // Return to start position
                setTimeout(() => {
                    basketball.style.transition = 'all 0.3s ease';
                    basketball.style.left = '50px';
                    basketball.style.top = '250px';
                    basketball.style.transform = 'scale(1) rotate(0deg)';
                }, 800);
            }

            setTimeout(() => {
                aimLine.style.display = 'none';
            }, 1000);
        });
    }
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add parallax effect to header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        header.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    });

    // Add floating animation to photo
    const photo = document.querySelector('.egorka-photo');
    if (photo) {
        photo.addEventListener('mouseenter', () => {
            photo.style.transform = 'scale(1.05) rotate(2deg)';
        });

        photo.addEventListener('mouseleave', () => {
            photo.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Add particle animation to header
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'rgba(255, 255, 255, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.zIndex = '1';
        particle.style.opacity = '0';

        header.appendChild(particle);

        // Animate particle
        const animation = particle.animate([
            { transform: 'translateY(0px)', opacity: 0.6 },
            { transform: 'translateY(-100px)', opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }

    setInterval(createParticle, 300);

    // Add click effect to contact button
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '0.6';
            ripple.style.pointerEvents = 'none';

            // Get click position
            const rect = contactButton.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            contactButton.appendChild(ripple);

            // Animate ripple
            ripple.animate([
                { transform: 'scale(0)', opacity: 0.6 },
                { transform: 'scale(4)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                ripple.remove();
            };
        });
    }
});
