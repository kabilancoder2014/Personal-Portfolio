// Register GSAP ScrollTrigger Plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    /* -------------------------------------------------------------
       INITIALIZE LENIS SMOOTH SCROLL
       ------------------------------------------------------------- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* -------------------------------------------------------------
       CUSTOM CURSOR GLOW EFFECT
       ------------------------------------------------------------- */
    const cursor = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    /* -------------------------------------------------------------
       STICKY HEADER SCROLLED EFFECT
       ------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* -------------------------------------------------------------
       MOBILE NAV TOGGLE MENU
       ------------------------------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* -------------------------------------------------------------
       HERO TITLE INITIAL ANIMATIONS & NEON FLICKER
       ------------------------------------------------------------- */
    // Letter-by-letter reveal
    gsap.from(".hero-title span", {
        opacity: 0,
        y: 60,
        rotationX: 90,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(1.8)",
        delay: 0.2
    });

    // Subtitle & Button fades
    gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8
    });

    gsap.from(".hero-desc", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.0
    });

    gsap.from(".hero-badge", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)",
        delay: 1.1
    });

    gsap.from(".hero-btns .btn", {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.2
    });

    // Randomized Neon Flicker effect on the "WEB" part of the title
    const neonFlicker = () => {
        const targets = document.querySelectorAll(".hero-title .neon-text-cyan");
        const tl = gsap.timeline({
            onComplete: () => {
                // Delay before triggering the next flicker sequence
                gsap.delayedCall(Math.random() * 4 + 2, neonFlicker);
            }
        });

        tl.to(targets, { opacity: 0.25, duration: 0.03 })
          .to(targets, { opacity: 1, duration: 0.04 })
          .to(targets, { opacity: 0.4, duration: 0.05 })
          .to(targets, { opacity: 0.9, duration: 0.03 })
          .to(targets, { opacity: 0.3, duration: 0.08 })
          .to(targets, { opacity: 1, duration: 0.1 });
    };
    
    // Initial delay before starting the flicker cycles
    gsap.delayedCall(3, neonFlicker);

    /* -------------------------------------------------------------
       SCROLLTRIGGER ANIMATIONS WITH SCRUB: TRUE
       ------------------------------------------------------------- */

    // 1. Shift Background Glow Positions on Scroll
    gsap.to("body", {
        backgroundPosition: "30% 90%, 70% 10%, 50% 60%",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        }
    });

    // 2. About Cards Entrance Scroll Animation
    gsap.from("#about-card-left", {
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });

    gsap.from("#about-card-right", {
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });

    // 3. Skills Grid & Progress Bars Entrance Animation
    const skillsTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // Fade and slide in cards
    skillsTl.from(".skill-card", {
        y: 50,
        opacity: 0,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
    });

    // Animate progress bars filling inside the same timeline to prevent trigger shifts
    gsap.utils.toArray(".progress-fill").forEach((bar, index) => {
        const progressVal = bar.getAttribute("data-progress");
        skillsTl.fromTo(bar, 
            { width: "0%" },
            {
                width: progressVal,
                duration: 1.0,
                ease: "power2.out"
            },
            `-=${0.6 - (index * 0.05)}` // Staggered overlap
        );
    });

    // 5. Timeline Center Line Glowing Progress (Numeric scrub creates smooth, trailing visual growth)
    gsap.fromTo(".timeline-progress", 
        { height: "0%" },
        {
            height: "100%",
            scrollTrigger: {
                trigger: ".timeline-container",
                start: "top 30%",
                end: "bottom 80%",
                scrub: 2 // Lags behind scroll slightly for a liquid-draw effect
            }
        }
    );

    // 6. Timeline Content Items Slide In (Left/Right)
    gsap.utils.toArray(".timeline-item").forEach(item => {
        const isLeft = item.classList.contains("left");
        const slideDistance = isLeft ? -50 : 50;
        
        // Slide timeline cards
        gsap.from(item.querySelector(".timeline-content"), {
            x: slideDistance,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Scale timeline nodes/dots
        gsap.from(item.querySelector(".timeline-dot"), {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // 7. Project Cards Slide In
    gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    // 8. Contact Section Form and Details entrance
    gsap.from("#contact-info", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    gsap.from("#contact-form", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    // 9. Safety Fallback Timers (Guarantees card visibility if ScrollTrigger fails to fire)
    setTimeout(() => {
        const cards = document.querySelectorAll(".skill-card");
        let skillsHidden = false;
        cards.forEach(card => {
            if (gsap.getProperty(card, "opacity") < 0.1) {
                skillsHidden = true;
            }
        });
        if (skillsHidden) {
            console.warn("ScrollTrigger fallback: forcing skills grid visibility.");
            gsap.to(".skill-card", {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: 0.6,
                overwrite: "auto"
            });
            gsap.to(".progress-fill", {
                width: (i, target) => target.getAttribute("data-progress"),
                duration: 1.0,
                stagger: 0.08,
                overwrite: "auto"
            });
        }
    }, 1500);

    setTimeout(() => {
        const projCards = document.querySelectorAll(".project-card");
        let projectsHidden = false;
        projCards.forEach(card => {
            if (gsap.getProperty(card, "opacity") < 0.1) {
                projectsHidden = true;
            }
        });
        if (projectsHidden) {
            console.warn("ScrollTrigger fallback: forcing project cards visibility.");
            gsap.to(".project-card", {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.6,
                overwrite: "auto"
            });
        }
    }, 2000);

    /* -------------------------------------------------------------
       GENERAL SCROLL REVEAL FOR ALL ELEMENTS (EXCEPT NAVBAR)
       ------------------------------------------------------------- */
    const allContentElements = document.querySelectorAll(
        "section h1, section h2, section h3, section p:not(.scroll-text), section .btn:not(.hero-btns .btn), section .stat-item, section .form-group, section .contact-list li, section .social-link"
    );

    allContentElements.forEach(el => {
        // Exclude elements that already have custom timeline/slide ScrollTriggers
        if (el.closest('.skills-grid') || 
            el.closest('.projects-grid') || 
            el.closest('.timeline-items') || 
            el.closest('#about-card-left') || 
            el.closest('#about-card-right') || 
            el.closest('#contact-info') || 
            el.closest('#contact-form') || 
            el.closest('.hero-content')) {
            return;
        }

        gsap.from(el, {
            y: 35,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true
            }
        });
    });

    /* -------------------------------------------------------------
       STATS NUMBERS COUNTING ANIMATION
       ------------------------------------------------------------- */
    gsap.utils.toArray(".count").forEach(count => {
        const targetVal = parseInt(count.getAttribute("data-val"));
        gsap.fromTo(count, 
            { textContent: 0 },
            {
                textContent: targetVal,
                duration: 2.0,
                ease: "power2.out",
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: count,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                }
            }
        );
    });
});
