const getElement = id => document.getElementById(id);
const showError = (id, show) => getElement(id).style.display = show ? 'block' : 'none';

const validateName = () => {
    const name = getElement('name').value.trim();
    const isValid = name && /^[a-zA-Z\s]+$/.test(name);
    showError('name-error', !isValid);
    return isValid;
};

const validateEmail = () => {
    const email = getElement('email').value.trim();
    const isValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    showError('email-error', !isValid);
    return isValid;
};

const validateContact = () => {
    const contact = getElement('contact').value.trim();
    const isValid = contact && /^\d{10}$/.test(contact);
    showError('contact-error', !isValid);
    return isValid;
};

const validateGender = () => {
    const gender = getElement('gender').value;
    const isValid = !!gender;
    showError('gender-error', !isValid);
    return isValid;
};

const validatePassword = () => {
    const password = getElement('password').value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{6,}$/;
    const isValid = password && passwordRegex.test(password);
    showError('password-error', !isValid);
    if (isValid) validateConfirmPassword(); 
    return isValid;
};

const validateConfirmPassword = () => {
    const password = getElement('password').value;
    const confirmPassword = getElement('confirm-password').value;
    const isMatch = password === confirmPassword;
    const isFilled = confirmPassword.length > 0;
    const isValid = isFilled && isMatch;
    
    const shouldShowError = isFilled && !isMatch; 
    showError('confirm-password-error', shouldShowError);
    return isValid;
};

getElement('name').addEventListener('keyup', validateName);
getElement('email').addEventListener('keyup', validateEmail);
getElement('contact').addEventListener('keyup', validateContact);
getElement('gender').addEventListener('change', validateGender);
getElement('password').addEventListener('keyup', validatePassword);
getElement('confirm-password').addEventListener('keyup', validateConfirmPassword);


getElement('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameValid = validateName();
    const emailValid = validateEmail();
    const contactValid = validateContact();
    const genderValid = validateGender();
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword(); 

    const isFormValid = nameValid && emailValid && contactValid && genderValid && passwordValid && confirmPasswordValid;

    if (isFormValid) {
        showError('success-msg', true);
        getElement('registration-form').reset();
        setTimeout(() => { showError('success-msg', false); }, 3000);
    }
});

let carouselPositions = { 'trending': 0, 'movies': 0, 'music': 0, 'rating': 0 }; 

function moveCarousel(direction, type) {
    const carousel = getElement(type + '-carousel');
    
    let visibleItems = 1; 
    if (type === 'rating') {
        if (window.innerWidth > 992) {
            visibleItems = 3; 
        } else if (window.innerWidth > 600) {
            visibleItems = 2; 
        } else {
            visibleItems = 1; 
        }
    } else {
        visibleItems = 1; 
    }

    const totalItems = carousel.children.length;
    let maxPosition = totalItems - visibleItems;
    
    carouselPositions[type] += direction;

    if (carouselPositions[type] < 0) {
        carouselPositions[type] = maxPosition; 
    } else if (carouselPositions[type] > maxPosition) {
        carouselPositions[type] = 0; 
    }
    
    let percentagePerSlide = (type === 'rating') ? (100 / visibleItems) : 100;
    
    let offset = carouselPositions[type] * percentagePerSlide;

    carousel.style.transform = `translateX(-${offset}%)`;
}

setInterval(() => { moveCarousel(1, 'trending'); }, 5000);

const allStarsContainers = document.querySelectorAll('.stars-container');

function resetStars(container) { 
    container.querySelectorAll('.star').forEach(s => { s.classList.remove('active', 'hover'); }); 
}

function highlightStars(container, rating, isPermanent) {
    resetStars(container);
    container.querySelectorAll('.star').forEach(star => {
        if (parseInt(star.dataset.rating) <= rating) { 
            star.classList.add(isPermanent ? 'active' : 'hover'); 
        }
    });
    const textElement = container.nextElementSibling;
    if(textElement && textElement.classList.contains('rating-text')) {
        textElement.textContent = rating === 0 ? 'Rate this!' : `Your rating: ${rating} \u2605`;
    }
}

allStarsContainers.forEach(container => {
    let selectedRating = parseInt(container.dataset.rating) || 0;
    
    container.addEventListener('mouseenter', function(e) {
        if (e.target.classList.contains('star')) { highlightStars(container, parseInt(e.target.dataset.rating), false); }
    });
    
    container.addEventListener('mouseleave', function() {
        highlightStars(container, parseInt(container.dataset.rating) || 0, true);
    });
    
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const clickedRating = parseInt(e.target.dataset.rating);
            let currentLockedRating = parseInt(container.dataset.rating) || 0;
            
            if (clickedRating === currentLockedRating) {
                container.dataset.rating = 0;
                alert(`Rating cleared for ${container.closest('.rating-card').dataset.title}.`);
            } else {
                container.dataset.rating = clickedRating;
                alert(`You gave ${clickedRating} stars to ${container.closest('.rating-card').dataset.title}!`);
            }
            highlightStars(container, parseInt(container.dataset.rating), true); 
        }
    });
    
    highlightStars(container, selectedRating, true);
});

function submitGeneralFeedback() {
    const feedbackText = getElement('general-feedback-text').value.trim();
    if (!feedbackText) { alert('Please write your feedback!'); return; }
    alert(`Thank you for your general feedback! We've received your comments.`);
    getElement('general-feedback-text').value = '';
}

document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
    });
});