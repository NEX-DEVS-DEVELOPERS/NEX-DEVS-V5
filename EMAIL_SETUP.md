# Email Setup for Contact Form

This document explains how to set up the contact form to send emails to your Gmail address (nexwebs.org@gmail.com).

## Prerequisites

1. A Gmail account (nexwebs.org@gmail.com)
2. Two-factor authentication enabled on your Gmail account

## Setting Up App Password for Gmail

Google requires an App Password for sending emails through scripts and applications. Here's how to set it up:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Under "Signing in to Google," find and select "2-Step Verification"
4. Scroll to the bottom and select "App passwords"
5. Click "Select app" and choose "Mail"
6. Click "Select device" and choose "Other (Custom name)"
7. Enter a name like "Website Contact Form" and click "Generate"
8. Google will display a 16-character password. Copy this password.

## Configuring the Environment Variable

1. Open the `.env.local` file in the root of your project
2. Update the EMAIL_PASSWORD value with the 16-character App Password you copied:
   ```
   EMAIL_PASSWORD=your16characterapppassword
   ```
3. Save the file

## Testing the Contact Form

1. Make sure your development server is running
2. Go to the contact page
3. Fill out the form and submit it
4. Check your nexwebs.org@gmail.com inbox for the submitted form data

## Troubleshooting

If you're not receiving emails:

1. Check your console logs for any error messages
2. Verify that the EMAIL_PASSWORD in `.env.local` is correct
3. Check your spam folder
4. Ensure your Gmail account doesn't have any additional security restrictions preventing the login

## Production Deployment

When deploying to production:

1. Add the EMAIL_PASSWORD environment variable to your hosting platform (Vercel, Netlify, etc.)
2. Make sure the environment variable is set correctly in your deployment settings
3. Test the form after deployment to ensure it works correctly

## Security Notes

- Never commit your App Password to your Git repository
- Consider setting up restricted access to your API routes in production
- Regularly rotate your App Password for enhanced security 