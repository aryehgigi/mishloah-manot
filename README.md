# Mishloah Manot Order Form

A responsive web form that integrates with Google Forms for data collection and includes payment popup functionality. Built for deployment on GitHub Pages.

## Features

- Clean, modern form design with responsive layout
- Three selectable package options (Basic, Premium, Deluxe)
- **Submits to Google Forms** - You can view all responses in your Google Forms dashboard
- Payment popup opens **before** form submission (integrated in page)
- Form automatically submits to Google Forms after payment window is closed
- Form validation
- Mobile-friendly design

## How It Works

1. User fills out the order form
2. User selects a package type (Basic/Premium/Deluxe)
3. User clicks "Proceed to Payment"
4. Payment popup opens in a modal window (stays on the same page)
5. User completes payment
6. When payment window is closed, form automatically submits to Google Forms
7. User sees success message
8. You can view the submission in your Google Forms responses

## Setup Instructions

### 1. Set Up Google Form Integration

**IMPORTANT:** Follow the detailed guide in `SETUP_GOOGLE_FORM.md` to:
- Create your Google Form
- Get the form entry IDs
- Configure the form action URL
- Update `script.js` with your form configuration

This step is required for the form to save responses to Google Forms.

### 2. Configure Payment Links

The payment URLs are already set in `script.js`:
- Basic Package: https://mrng.to/kIwD4hJlLT
- Premium Package: https://mrng.to/QnDXicGdqQ
- Deluxe Package: https://mrng.to/xqfY0ISbgv

If you need to change them, edit the `PAYMENT_URLS` object in `script.js`.

### 3. Customize Form Content

Edit `index.html` to customize:
- Page title and header
- Form fields (add/remove as needed)
- Package names, prices, and descriptions
- Footer contact information

### 4. Deploy to GitHub Pages

#### Option A: Using GitHub Web Interface

1. Create a new repository on GitHub
2. Go to your repository settings
3. Navigate to "Pages" section
4. Under "Source", select your main branch
5. Click "Save"
6. Upload all files (index.html, styles.css, script.js) to the repository

#### Option B: Using Git Command Line

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Order form with payment popup"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main

# Enable GitHub Pages in repository settings
```

### 5. Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Viewing Form Responses

After deployment, all form submissions will appear in your Google Form:

1. Go to your Google Form
2. Click the **Responses** tab
3. View responses in:
   - **Summary** - Overview with charts
   - **Individual** - See each submission separately
   - **Spreadsheet** - Click the Sheets icon to export to Google Sheets

You can also set up email notifications:
1. In your Google Form, click the three dots menu in the Responses tab
2. Select "Get email notifications for new responses"

## Configuration Options

### Payment Window Behavior

The payment opens in a **modal popup** (overlay on the same page) by default. This ensures:
- User stays on your page
- Better mobile experience
- Form submits to Google Forms after payment window closes

The form automatically submits to Google Forms when the user closes the payment modal, regardless of whether payment was completed.

### Passing Form Data to Payment

Form data is automatically passed to the payment URL as query parameters:
- `name` - Customer's full name
- `email` - Customer's email
- `phone` - Customer's phone number
- `quantity` - Order quantity
- `package` - Selected package type

You can customize which data is sent in the `appendFormDataToUrl()` function in `script.js`.

### Custom Confirmation Message

You can customize the success message shown after submission by editing the `showSuccessMessage()` call in `script.js` (around line 160).

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design works on all major mobile browsers

## Troubleshooting

### Popup Blocked by Browser

If popups are blocked:
1. The modal popup (default) should work without issues
2. For new window popups, users may need to allow popups in their browser settings

### HTTPS Required for Payment Processing

Most payment processors require HTTPS. GitHub Pages automatically provides HTTPS for all sites.

### iframe Restrictions

Some payment providers may not allow iframe embedding. In this case:
- Use the new window popup option
- Or redirect directly to the payment page

## Security Considerations

- Never store sensitive payment information in your form
- Use HTTPS (automatic with GitHub Pages)
- Payment processing should only happen through secure, PCI-compliant providers
- Form data is only passed via URL parameters (visible to user)
- For sensitive data, consider using a backend server

## Customization

### Colors and Styling

Edit `styles.css` to change:
- Color scheme (search for `#667eea` and `#764ba2`)
- Font families
- Spacing and sizing
- Button styles

### Form Fields

Add or remove fields in `index.html` and update the form data collection in `script.js`.

## Support

For issues or questions:
- Check GitHub Pages documentation: https://docs.github.com/pages
- Review the code comments in script.js
- Test in browser console for JavaScript errors

## License

This project is free to use and modify for your needs.
