# Smart Campus Portal - Postman Collection Guide

This guide explains how to use the included Postman collection for testing the Smart Campus Portal API.

## Setting Up Postman

1. **Install Postman**: Download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Import the Collection**:
   - Open Postman
   - Click on "Import" button in the top left
   - Select the `POSTMAN_COLLECTION.json` file from the project directory
   - Click "Import"

3. **Configure Environment Variables**:
   - Click on the "Environments" tab in Postman
   - Click "Create Environment" and name it "Smart Campus Portal"
   - Add the following variables:
     - `baseUrl`: `http://localhost:5000` (or your server URL)
     - `token`: Leave this blank for now (will be filled automatically)
     - `nonAdminToken`: Leave this blank for now (will be filled manually)
   - Click "Save"
   - Select your new environment from the dropdown in the top right corner

## Authentication Flow

The collection is organized to follow a typical authentication flow:

1. **Login**:
   - First, send the "Login" request with admin credentials
   - In the "Tests" tab of the Login request, there's a script that automatically extracts the JWT token and sets it to the `token` environment variable
   - This token will be used for all subsequent admin-protected API calls

2. **Get Current User**:
   - After logging in, you can test the "Get Current User" request to verify your token is working

3. **Testing Other Endpoints**:
   - All the request specifications are already set up, so you can simply click "Send" on each request

## Testing Different User Roles

To test the API with different user roles:

1. **Login with Admin**: Use the "Login" request with `"rollNo": "nitesh", "password": "nitesh"`

2. **Login with Teacher**: Modify the "Login" request with `"rollNo": "teacher1", "password": "password"`
   - Save the returned token to the `nonAdminToken` environment variable manually for testing access restrictions

3. **Login with Student**: Modify the "Login" request with `"rollNo": "student1", "password": "password"`
   - Save the returned token to the `nonAdminToken` environment variable manually for testing access restrictions

## Testing Access Control

To test role-based access control:

1. **Login as Admin**: Use the admin credentials to get a token

2. **Create a Notice**: Send the "Create Notice" request, which should succeed with the admin token

3. **Login as Teacher/Student**: Login with non-admin credentials

4. **Try to Create a Notice**: Change the Authorization token to your `nonAdminToken` and send the "Create Notice" request again
   - This should fail with a 403 Forbidden error, confirming that the role-based protection works

## Testing Notice CRUD Operations

1. **Get All Notices**: This request doesn't require authentication, simply send it to see all notices

2. **Create a Notice**: Requires admin authentication, sends a POST request with notice data

3. **Update a Notice**:
   - First, get the ID of an existing notice from the "Get All Notices" response
   - Update the `:id` path parameter in the "Update Notice" request
   - Send the request with admin authentication

4. **Delete a Notice**:
   - Use the ID of an existing notice
   - Update the `:id` path parameter in the "Delete Notice" request
   - Send the request with admin authentication

## Common Issues and Solutions

### Authentication Errors

- **Problem**: `"error": "No token, authorization denied"`
- **Solution**: Make sure you've logged in and the `token` environment variable is set correctly

### Forbidden Access

- **Problem**: `"error": "Access denied. Admin only."`
- **Solution**: You're using a non-admin token for an admin-only endpoint. Login with admin credentials.

### Notice Not Found

- **Problem**: `"error": "Notice not found"`
- **Solution**: The notice ID in your request doesn't exist. Get current IDs from "Get All Notices" request.

### Server Connection Errors

- **Problem**: "Could not send request"
- **Solution**: Ensure your backend server is running at the URL specified in the `baseUrl` environment variable

## Example Workflow

1. Start the backend server
2. Send the "Login" request with admin credentials
3. Verify the token is set in your environment variables
4. Send the "Get All Notices" request to see existing notices
5. Send the "Create Notice" request to create a new notice
6. Send the "Get All Notices" request again to see your new notice
7. Copy the ID of your new notice
8. Update the "Update Notice" request with this ID and send it
9. Send the "Get All Notices" request to verify the update
10. Update the "Delete Notice" request with the same ID and send it
11. Send the "Get All Notices" request to verify deletion

By following these instructions, you can thoroughly test all aspects of the Smart Campus Portal API.