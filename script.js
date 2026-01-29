// Payment popup URLs
const PAYMENT_URLS = {
    1: 'https://mrng.to/kIwD4hJlLT',      // Basic Package Payment Link
    2: 'https://mrng.to/QnDXicGdqQ',    // Premium Package Payment Link
    3: 'https://mrng.to/xqfY0ISbgv'      // Deluxe Package Payment Link
};

// Google Form Configuration
const GOOGLE_FORM_CONFIG = {
    formBaseUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScvIhTRz5qipe5-LULmoJoRqSuJbidzK7pYAdfqM7gR5P9wZw/viewform',
    fields: {
        fullName: 'entry.2041262357',
        phone: 'entry.2134230907',
        address: 'entry.534616599',
        floor: 'entry.209408837',
        apartment: 'entry.1881659987',
        buildingCode: 'entry.628956368',
        packageType: 'entry.547527955'
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

// Submit form data to Google Forms using iframe pre-fill method
function submitToGoogleForms(formData) {
    // Map package type to the exact text in Google Form options
    const packageTypeMap = {
        'basic': 'מסלול ארד (120 ש"ח)',
        'premium': 'מסלול כסף (180 ש"ח)',
        'deluxe': 'מסלול זהב (300 ש"ח)'
    };

    // Build pre-filled URL with all form data
    const params = new URLSearchParams();
    params.append('embedded', 'true');
    params.append(GOOGLE_FORM_CONFIG.fields.fullName, formData.fullName);
    params.append(GOOGLE_FORM_CONFIG.fields.phone, formData.phone);
    params.append(GOOGLE_FORM_CONFIG.fields.address, formData.address);
    params.append(GOOGLE_FORM_CONFIG.fields.floor, formData.floor);
    params.append(GOOGLE_FORM_CONFIG.fields.apartment, formData.apartment);
    params.append(GOOGLE_FORM_CONFIG.fields.buildingCode, formData.buildingCode);
    params.append(GOOGLE_FORM_CONFIG.fields.packageType, packageTypeMap[formData.packageType]);

    const prefilledUrl = `${GOOGLE_FORM_CONFIG.formBaseUrl}?${params.toString()}`;

    console.log('Opening pre-filled Google Form:', prefilledUrl);

    // Open the pre-filled form in a new modal
    showGoogleFormModal(prefilledUrl);

    // Clear the form
    form.reset();
    window.pendingFormData = null;
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

// Show Google Form in a modal with pre-filled data
function showGoogleFormModal(prefilledUrl) {
    // Create modal overlay
    const formModal = document.createElement('div');
    formModal.id = 'googleFormModal';
    formModal.className = 'modal';
    formModal.style.display = 'block';

    formModal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeGoogleFormModal()">&times;</span>
            <h2>השלמת פרטי ההזמנה</h2>
            <p>הטופס מולא מראש עם הפרטים שלכם. אנא בדקו ולחצו "שליחה" בטופס למטה.</p>
            <div id="googleFormFrame">
                <iframe id="googleFormIframe" src="${prefilledUrl}" width="100%" height="1200" frameborder="0" marginheight="0" marginwidth="0">בטעינה…</iframe>
            </div>
        </div>
    `;

    document.body.appendChild(formModal);
    document.body.style.overflow = 'hidden';

    // Close modal when clicking outside
    formModal.addEventListener('click', function(event) {
        if (event.target === formModal) {
            closeGoogleFormModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && formModal.style.display === 'block') {
            closeGoogleFormModal();
        }
    });
}

// Close Google Form modal
function closeGoogleFormModal() {
    const formModal = document.getElementById('googleFormModal');
    if (formModal) {
        formModal.remove();
        document.body.style.overflow = 'auto';
        showSuccessMessage('תודה רבה! אם שלחתם את הטופס, ההזמנה שלכם נקלטה.');
    }
}

