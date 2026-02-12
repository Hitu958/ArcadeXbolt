// 3D Tilt Effect using vanilla-tilt.js
// Must include vanilla-tilt.min.js before this script

document.addEventListener('DOMContentLoaded', () => {
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt not loaded');
        return;
    }

    // Feature Cards (Dashboard)
    VanillaTilt.init(document.querySelectorAll(".feature-card"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
    });

    // Pricing Cards (Index)
    VanillaTilt.init(document.querySelectorAll(".pricing-card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1,
        scale: 1.02
    });

    // Stat Cards
    VanillaTilt.init(document.querySelectorAll(".stat-card"), {
        max: 15,
        speed: 400,
        scale: 1.05
    });
});
