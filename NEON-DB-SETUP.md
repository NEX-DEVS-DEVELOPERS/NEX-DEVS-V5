# Neon PostgreSQL Database Setup Guide

This guide provides instructions for setting up and using the Neon PostgreSQL database with this project.

## Overview

Neon is a serverless PostgreSQL database that separates compute from storage. It offers automatic scaling, branching capabilities, and high performance. This project uses Neon as the primary database for storing project data.

## Setup Instructions

### 1. Create a Neon Account and Project

1. Visit [Neon](https://neon.tech/) and create an account
2. Create a new project
3. Once your project is created, copy the connection string from the connection details page

### 2. Configure Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add your Neon connection string:
   ```
   DATABASE_URL='postgresql://<user>:<password>@<endpoint_hostname>.neon.tech/<dbname>?sslmode=require'
   ```
3. Replace `<user>`, `<password>`, `<endpoint_hostname>`, and `<dbname>` with your actual connection details

### 3. Test the Connection

Run the test script to verify that the connection is working:

```bash
npm run test-neon
```

This script will:
- Test the basic connection
- Create a test table if it doesn't exist
- Perform CRUD operations (Create, Read, Update, Delete) on the test table
- Check if the projects table exists

### 4. Initialize the Database

The database will be automatically initialized when the application starts. However, you can manually initialize it by making a GET request to the `/api/test-neon` endpoint:

```
http://localhost:3000/api/test-neon
```

This will:
- Test the connection
- Create the necessary tables if they don't exist
- Return information about the database status

## Database Structure

The main table in the database is `projects`, which stores information about each project. The schema includes:

- `id`: Primary key
- `title`: Project title
- `description`: Project description
- `detailed_description`: Detailed project description
- `image_url`: URL to the project image
- `second_image`: URL to a secondary project image
- `category`: Project category
- `technologies`: JSON array of technologies used
- `project_link`: Link to the project
- `featured`: Boolean indicating if the project is featured
- And many more fields for additional project details

## CRUD Operations

The application provides API endpoints for performing CRUD operations on projects:

### Create a Project

POST to `/api/projects` with project data and password:

```json
{
  "title": "Project Title",
  "description": "Project Description",
  "category": "Web Development",
  "image": "/projects/image.jpg",
  "technologies": ["React", "Next.js"],
  "link": "https://example.com",
  "password": "your-admin-password"
}
```

### Read Projects

GET from `/api/projects` to get all projects

GET from `/api/projects/{id}` to get a specific project

### Update a Project

PUT to `/api/projects/{id}` with updated project data and password:

```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "password": "your-admin-password"
}
```

### Delete a Project

DELETE to `/api/projects/{id}` with password as query parameter or bearer token:

```
/api/projects/{id}?password=your-admin-password
```

## Admin Interface

The admin interface provides a user-friendly way to manage projects:

- View all projects at `/admin/projects`
- Create a new project at `/admin/projects/new`
- Edit a project at `/admin/projects/edit/{id}`

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. Verify that your connection string is correct
2. Check if your IP is allowed in the Neon project settings
3. Ensure that the `sslmode=require` parameter is included in the connection string
4. Try running the test script to see specific error messages: `npm run test-neon`

### Data Not Saving

If changes made in the admin section are not being saved to the database:

1. Check the browser console and server logs for error messages
2. Verify that the correct password is being used for admin operations
3. Make sure all required fields are filled out in the form
4. Try accessing the test endpoint to verify the database connection: `/api/test-neon`

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless) - The serverless driver used in this project 