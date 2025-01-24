// Get elements
let userEmail;
const popupOverlay = document.getElementById('popupOverlay');
const signInButton = document.querySelector('.sign-in-btn');
const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const otpForm = document.getElementById('otpForm');
const otpInputs = document.querySelectorAll('.otp-input');
const successMessage = document.getElementById('successMessage');
const errorContainer = document.getElementById('errorMessages');
const otpError = document.getElementById('otpError');

// Utility function to reset forms and messages
function resetFormsAndMessages() {
    // Clear form inputs
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });

    // Hide success and error messages
    if (successMessage) {
        successMessage.style.display = 'none';
        successMessage.innerHTML = '';
    }

    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }

    if (otpError) {
        otpError.style.display = 'none';
        otpError.innerHTML = '';
    }
}

// Show popup when "Sign In" is clicked
signInButton.addEventListener('click', () => {
    popupOverlay.style.display = 'flex';
    resetFormsAndMessages(); // Reset forms and messages on popup open
    loginForm.style.display = 'block'; // Default to login form
    registerForm.style.display = 'none';
    otpForm.style.display = 'none';
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
});

// Switch to Login Form
loginTabBtn.addEventListener('click', () => {
    resetFormsAndMessages(); // Reset forms and messages when switching to login
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    otpForm.style.display = 'none';
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
});

// Switch to Register Form
registerTabBtn.addEventListener('click', () => {
    resetFormsAndMessages(); // Reset forms and messages when switching to register
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    otpForm.style.display = 'none';
    loginTabBtn.classList.remove('active');
    registerTabBtn.classList.add('active');
});

// Close popup if clicking outside
window.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
        resetFormsAndMessages(); // Reset forms and messages on popup close
    }
});

// Handle Register Form Submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const fullname = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';
    successMessage.innerHTML = ``;

    try {
        // Send registration data to the backend
        const response = await fetch('http://localhost:4000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, password }),
        });
        userEmail = email;
        const result = await response.json();

        if (response.ok) {
            // Show success message and OTP form
            successMessage.style.display = 'block';
            successMessage.innerHTML = `<p style="color: blue;">${result.message}</p>`;
            registerForm.style.display = 'none';
            otpForm.style.display = 'block';
        } else if (result.success === false && result.errors && result.errors.length > 0) {
          // Display validation errors
          errorContainer.style.display = 'block';
          errorContainer.innerHTML = result.errors.map(error => `<p>${error.msg}</p>`).join('');
      } else if (result.success === false) {
          errorContainer.style.display = 'block';
          errorContainer.innerHTML = result.message;
      }
    } catch (err) {
        console.error('Error during registration:', err);
        errorContainer.style.display = 'block';
        errorContainer.innerHTML = 'Something went wrong. Please try again later.';
    }
});

// Handle OTP Input Navigation
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// Handle OTP Form Submission
otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const otp = Array.from(otpInputs).map(input => input.value).join('');

    if (otp.length < 6) {
        otpError.style.display = 'block';
        otpError.innerHTML = '<p>Please enter a valid 6-digit OTP.</p>';
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/user/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp }),
        });

        const result = await response.json();

        if (response.ok) {
            successMessage.style.display = 'block';
            successMessage.innerHTML = `<p style="color: green;">OTP Verified Successfully!</p>`;
            setTimeout(() => {
                popupOverlay.style.display = 'none'; // Close popup after 3 seconds
                resetFormsAndMessages(); // Reset everything after successful OTP
            }, 3000);
        } else {
            otpError.style.display = 'block';
            otpError.innerHTML = `<p>${result.message || 'Invalid OTP. Please try again.'}</p>`;
        }
    } catch (err) {
        console.error('Error during OTP verification:', err);
        otpError.style.display = 'block';
        otpError.innerHTML = 'Error verifying OTP. Please try again later.';
    }
});

// Handle Resend OTP
document.getElementById('resendOtpLink').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:4000/user/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
        });

        const result = await response.json();

        if (response.ok) {
            successMessage.style.display = 'block';
            successMessage.innerHTML = `<p style="color: blue;">OTP has been resent to your email!</p>`;
        } else {
            otpError.style.display = 'block';
            otpError.innerHTML = result.message || 'Failed to resend OTP. Please try again.';
        }
    } catch (err) {
        console.error('Error resending OTP:', err);
        otpError.style.display = 'block';
        otpError.innerHTML = 'Failed to resend OTP. Please try again later.';
    }
});

// Handle Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    resetFormsAndMessages(); // Clear messages on login submission
    successMessage.style.display = 'block';
    successMessage.innerHTML = `<p style="color: green;">Login successful!</p>`;
    setTimeout(() => {
        popupOverlay.style.display = 'none'; // Close popup after 3 seconds
        resetFormsAndMessages(); // Reset everything after successful login
    }, 3000);
});
