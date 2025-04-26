# Database Update Instructions for Code Screenshot Feature

This document provides instructions for updating your database schema to support the code screenshot feature in your portfolio.

## Background

The code screenshot feature requires several new fields in the database schema:

- `is_code_screenshot`: Boolean flag to indicate if an image is a code screenshot
- `code_language`: The programming language of the code
- `code_title`: The file name or title for the code snippet
- `code_content`: The actual code content (if using direct code input)
- `use_direct_code_input`: Boolean flag to indicate if code is directly pasted instead of uploading an image

## Automatic Schema Update

We've created a script to automatically update your database schema. Follow these steps:

1. Run the update script:

```bash
npm run update-db-schema
```

2. This script will:
   - Connect to your MySQL database
   - Check if the code screenshot columns already exist
   - Add the new columns if they don't exist
   - Print a success message when done

3. After the schema is updated, restart your application:

```bash
npm run dev
```

## Verifying the Update

To verify the database update was successful:

1. Go to the admin area and create a new project.
2. Enable the "This is a code screenshot" option in the form.
3. Add a title, select a language, and either upload a code screenshot or paste code directly.
4. Save the project and verify it displays correctly in the project gallery.

## Manual Database Update (If Needed)

If the automatic script doesn't work, you can manually update your database using these SQL commands:

```sql
ALTER TABLE projects 
ADD COLUMN is_code_screenshot BOOLEAN DEFAULT FALSE,
ADD COLUMN code_language VARCHAR(255),
ADD COLUMN code_title VARCHAR(255),
ADD COLUMN code_content TEXT,
ADD COLUMN use_direct_code_input BOOLEAN DEFAULT FALSE;
```

Run these commands in your MySQL database management tool or command line.

## Troubleshooting

If you encounter any issues:

1. Check the console logs for error messages
2. Verify that the database connection settings in `lib/mysql.js` are correct
3. Try running the migration script with verbose logging:

```bash
NODE_DEBUG=mysql npm run update-db-schema
```

## Database Connection Details

The database connection uses these environment variables:

- `MYSQL_HOST` (default: 'metro.proxy.rlwy.net')
- `MYSQL_PORT` (default: '28228')
- `MYSQL_USER` (default: 'root')
- `MYSQL_PASSWORD` (default: 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc')
- `MYSQL_DATABASE` (default: 'railway')

You can set these in your `.env` file if they differ from the defaults.

## Need Help?

If you continue to experience issues with the database update, please contact support or check the project GitHub repository for updates. 