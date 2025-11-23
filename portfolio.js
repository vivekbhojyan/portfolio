document.addEventListener('DOMContentLoaded', () => {
    // Select all anchor links in the navigation
    const navLinks = document.querySelectorAll('nav ul li a');

    // Attach click listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default jump behavior
            e.preventDefault();

            // Get the target section's ID (e.g., '#projects')
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Scroll smoothly to the target section
                window.scrollTo({
                    top: targetSection.offsetTop - 50, // Adjust -50px for header/nav space
                    behavior: 'smooth'
                });
            }
        });
    });
});

// You can add more JavaScript here for mobile menus, animations, etc., as you learn!