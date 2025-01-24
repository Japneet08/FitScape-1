// Smooth scrolling for navigation links
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Sticky header
const header = document.querySelector('header');
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (window.scrollY > hero.offsetHeight - header.offsetHeight) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// Modal functionality
const crisisButton = document.querySelector('.crisis-button');
const premiumButton = document.querySelector('.premium-button');
const crisisModal = document.getElementById('crisisModal');
const premiumModal = document.getElementById('premiumModal');
const closeBtns = document.querySelectorAll('.close');

crisisButton.onclick = function() {
    crisisModal.style.display = "block";
}

premiumButton.onclick = function() {
    premiumModal.style.display = "block";
}

closeBtns.forEach(btn => {
    btn.onclick = function() {
        crisisModal.style.display = "none";
        premiumModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target == crisisModal) {
        crisisModal.style.display = "none";
    }
    if (event.target == premiumModal) {
        premiumModal.style.display = "none";
    }
}

// Form submission (you would typically send this data to a server)
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    console.log('Form submitted with data:', Object.fromEntries(formData));
    // Here you would typically send the data to a server
    alert('Thank you for your message. We will get back to you soon!');
    contactForm.reset();
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-fadeInUp');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Psychiatrist filter functionality
const psychiatristGrid = document.querySelector('.psychiatrist-grid');
const psychiatrists = Array.from(psychiatristGrid.children);

const filterPsychiatrists = (specialty) => {
    psychiatrists.forEach(card => {
        const cardSpecialty = card.querySelector('p:nth-child(3)').textContent.toLowerCase();
        if (specialty === 'all' || cardSpecialty.includes(specialty.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// You can call filterPsychiatrists('anxiety') to filter for anxiety specialists, for example

// Testimonial carousel
const testimonials = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

const showTestimonial = (index) => {
    testimonials.forEach((testimonial, i) => {
        if (i === index) {
            testimonial.style.display = 'block';
        } else {
            testimonial.style.display = 'none';
        }
    });
};

const nextTestimonial = () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
};

setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds

// Initialize the testimonial display
showTestimonial(currentTestimonial);

// Premium feature preview
const previewPremiumFeature = (feature) => {
    // This function would show a preview of the premium feature
    // For now, we'll just log it to the console
    console.log(`Previewing premium feature: ${feature}`);
    alert(`This is a preview of the ${feature} feature. Upgrade to premium to access it!`);
};

// You can call previewPremiumFeature('Video Call') to show a preview of the video call feature, for example

// Resource search functionality
const searchResources = (query) => {
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// You can call searchResources('meditation') to filter resources related to meditation, for example

// Forum post preview
const previewForumPost = (postId) => {
    // This function would show a preview of a forum post
    // For now, we'll just log it to the console
    console.log(`Previewing forum post: ${postId}`);
    alert(`This is a preview of forum post #${postId}. Click to view the full post and responses.`);
};

// You can call previewForumPost(123) to show a preview of forum post #123, for example

// Accessibility: Add keyboard navigation for modal closing
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        crisisModal.style.display = 'none';
        premiumModal.style.display = 'none';
    }
});

// Lazy loading for images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Call lazy loading function
lazyLoadImages();

// Mood tracker functionality
const logMood = (mood) => {
    // This function would log the user's mood
    console.log(`Mood logged: ${mood}`);
    alert(`Your mood "${mood}" has been logged. Keep tracking to see patterns over time!`);
};

// Meditation timer
const startMeditation = (duration) => {
    let timer = duration;
    const timerDisplay = document.createElement('div');
    timerDisplay.style.position = 'fixed';
    timerDisplay.style.top = '50%';
    timerDisplay.style.left = '50%';
    timerDisplay.style.transform = 'translate(-50%, -50%)';
    timerDisplay.style.fontSize = '48px';
    timerDisplay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    timerDisplay.style.color = 'white';
    timerDisplay.style.padding = '20px';
    timerDisplay.style.borderRadius = '10px';
    document.body.appendChild(timerDisplay);

    const countDown = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (--timer < 0) {
            clearInterval(countDown);
            timerDisplay.textContent = 'Meditation Complete';
            setTimeout(() => {
                document.body.removeChild(timerDisplay);
            }, 3000);
        }
    }, 1000);
};

// Journal entry
const saveJournalEntry = (entry) => {
    // This function would save the journal entry
    console.log('Journal entry saved:', entry);
    alert('Your journal entry has been saved.');
};

// Community event registration
const registerForEvent = (eventId) => {
    // This function would register the user for an event
    console.log(`Registered for event: ${eventId}`);
    alert(`You have successfully registered for event #${eventId}. We look forward to seeing you there!`);
};

// Self-assessment quiz
const startSelfAssessment = (quizType) => {
    // This function would start a self-assessment quiz
    console.log(`Starting ${quizType} assessment`);
    alert(`You are about to start the ${quizType} assessment. This will help you gain insights into your mental health.`);
};

// Add more interactivity and features as needed

const menuToggle = document.querySelector('.menu-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');

menuToggle.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!dropdownMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

const modal = document.getElementById("signup-modal");
    const signupBtn = document.getElementById("signup-btn");
    const closeBtn = document.querySelector(".close-btn");

    signupBtn.addEventListener("click", function (event) {
        event.preventDefault(); 
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    const searchModal = document.getElementById("searchModal");
const searchBtn = document.getElementById("search-btn");
const closeSearchModal = document.getElementById("close-search-modal");
const searchInput = document.getElementById("search-input");

searchBtn.onclick = function() {
    searchModal.style.display = "block";
}

closeSearchModal.onclick = function() {
    searchModal.style.display = "none";
}


window.onclick = function(event) {
    if (event.target == searchModal) {
        searchModal.style.display = "none";
    }
}


const suggestionBubbles = document.querySelectorAll('.suggestion-bubble');
suggestionBubbles.forEach(bubble => {
    bubble.addEventListener('click', function() {
        searchInput.value = this.getAttribute('data-value'); 
        searchModal.style.display = "none";
    });
});  script.js