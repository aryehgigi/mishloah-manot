// Payment URLs
const PAYMENT_URLS = {
    1: 'https://mrng.to/kIwD4hJlLT',      // Basic Package (120 ₪)
    2: 'https://mrng.to/QnDXicGdqQ',      // Premium Package (180 ₪)
    3: 'https://mrng.to/xqfY0ISbgv'       // Deluxe Package (300 ₪)
};

// Get payment elements
const paymentContainer = document.getElementById('paymentContainer');
const paymentIframeEmbed = document.getElementById('paymentIframeEmbed');

// Select package and show embedded payment
function selectPackage(packageNumber, packageClass) {
    const paymentUrl = PAYMENT_URLS[packageNumber];

    if (!paymentUrl) {
        alert('שגיאה: מסלול לא נמצא');
        return;
    }

    // Remove 'selected' class from all buttons
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add 'selected' class to clicked button
    event.target.closest('.payment-btn').classList.add('selected');

    // Set the iframe source
    paymentIframeEmbed.src = paymentUrl;

    // Show the payment container
    paymentContainer.style.display = 'block';

    // Scroll to payment iframe smoothly
    setTimeout(() => {
        paymentContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    console.log(`Selected payment package ${packageNumber}: ${packageClass}`);
}
