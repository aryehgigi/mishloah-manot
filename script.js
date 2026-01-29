// Payment popup URLs
const PAYMENT_URLS = {
    1: 'https://mrng.to/kIwD4hJlLT',      // Basic Package Payment Link
    2: 'https://mrng.to/QnDXicGdqQ',    // Premium Package Payment Link
    3: 'https://mrng.to/xqfY0ISbgv'      // Deluxe Package Payment Link
};

// Google Form Configuration
const GOOGLE_FORM_CONFIG = {
    formActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScvIhTRz5qipe5-LULmoJoRqSuJbidzK7pYAdfqM7gR5P9wZw/formResponse',
    fields: {
        fullName: 'entry.1161423959',
        phone: 'entry.289359022',
        address: 'entry.302692334',
        floor: 'entry.131956440',
        apartment: 'entry.812903452',
        buildingCode: 'entry.1096938954'
    }
};

// Get DOM elements
const form = document.getElementById('orderForm');
const modal = document.getElementById('paymentModal');
const closeBtn = document.querySelector('.close');
const paymentIframe = document.getElementById('paymentIframe');

// Track if payment popup was opened (we'll submit to Google Forms after)
let paymentProcessed = false;

// Form submission handler
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get selected package type
    const selectedPackage = document.querySelector('input[name="packageType"]:checked');

    if (!selectedPackage) {
        alert('אנא בחרו מסלול לפני המשך לתשלום');
        return;
    }

    // Validate all required fields
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get the popup number from the data attribute
    const popupNumber = selectedPackage.getAttribute('data-popup');
    const paymentUrl = PAYMENT_URLS[popupNumber];

    // Store form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        floor: document.getElementById('floor').value,
        apartment: document.getElementById('apartment').value,
        buildingCode: document.getElementById('buildingCode').value,
        packageType: selectedPackage.value
    };

    console.log('Form Data:', formData);

    // Show message to user
    showInfoMessage('פותחים חלון תשלום. לאחר השלמת התשלום או סגירת החלון, פרטי ההזמנה שלכם יישלחו.');

    // Open payment modal
    openModalPopup(paymentUrl, formData);

    // Store form data for later submission
    window.pendingFormData = formData;
});

// Function to open payment in modal
function openModalPopup(url, formData) {
    // You can append form data as URL parameters if needed
    const urlWithParams = appendFormDataToUrl(url, formData);

    // Set the iframe source
    paymentIframe.src = urlWithParams;

    // Show the modal
    modal.style.display = 'block';

    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Function to open payment in new window
function openNewWindowPopup(url, formData) {
    const urlWithParams = appendFormDataToUrl(url, formData);

    // Open in new window with specific dimensions
    const width = 800;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
        urlWithParams,
        'PaymentWindow',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}

// Helper function to append form data to URL as query parameters
function appendFormDataToUrl(url, formData) {
    const params = new URLSearchParams();

    // Add relevant fields to URL parameters
    params.append('name', formData.fullName);
    params.append('phone', formData.phone);
    params.append('address', formData.address);
    params.append('floor', formData.floor);
    params.append('apartment', formData.apartment);
    params.append('buildingCode', formData.buildingCode);
    params.append('package', formData.packageType);

    // Return URL with parameters
    return `${url}?${params.toString()}`;
}

// Close modal when clicking X
closeBtn.addEventListener('click', function() {
    closeModal();
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
    paymentIframe.src = '';  // Clear iframe
    document.body.style.overflow = 'auto';  // Re-enable body scroll

    // After closing payment modal, show Google Form with pre-filled data
    if (window.pendingFormData && !paymentProcessed) {
        paymentProcessed = true;
        submitToGoogleForms(window.pendingFormData);
    }
}

// Listen for messages from payment iframe (optional - for advanced integration)
window.addEventListener('message', function(event) {
    // Verify the origin of the message for security
    // Replace with your payment domain if your payment provider supports postMessage
    // if (event.origin !== 'https://mrng.to') return;

    if (event.data.type === 'payment_success') {
        console.log('Payment successful!');
        closeModal(); // This will trigger form submission
    } else if (event.data.type === 'payment_cancelled') {
        console.log('Payment cancelled');
        closeModal(); // This will still trigger form submission
    }
});

// Submit form data to Google Forms via POST (without packageType field)
function submitToGoogleForms(formData) {
    console.log('Submitting to Google Forms:', formData);

    // Create FormData for POST request
    const googleFormData = new FormData();

    // Add only the delivery fields (no packageType since it was removed from Google Form)
    googleFormData.append(GOOGLE_FORM_CONFIG.fields.fullName, formData.fullName);
    googleFormData.append(GOOGLE_FORM_CONFIG.fields.phone, formData.phone);
    googleFormData.append(GOOGLE_FORM_CONFIG.fields.address, formData.address);
    googleFormData.append(GOOGLE_FORM_CONFIG.fields.floor, formData.floor);
    googleFormData.append(GOOGLE_FORM_CONFIG.fields.apartment, formData.apartment);

    // Only add buildingCode if it has a value
    if (formData.buildingCode) {
        googleFormData.append(GOOGLE_FORM_CONFIG.fields.buildingCode, formData.buildingCode);
    }

    // Log what we're sending
    console.log('Form fields being submitted:');
    for (let [key, value] of googleFormData.entries()) {
        console.log(`  ${key}: ${value}`);
    }

    // Submit to Google Forms
    fetch(GOOGLE_FORM_CONFIG.formActionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData
    })
    .then(() => {
        console.log('✓ Form submitted successfully to Google Forms');
        showSuccessMessage('תודה רבה! פרטי המשלוח נשלחו בהצלחה.');

        // Clear the form and pending data
        form.reset();
        window.pendingFormData = null;
    })
    .catch(error => {
        console.error('✗ Error submitting to Google Forms:', error);
        showSuccessMessage('השליחה נכשלה');
    });
}

// Helper function to show info message
function showInfoMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'info-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);

    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Helper function to show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <div class="success-text">${message}</div>
        </div>
    `;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);

    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}


