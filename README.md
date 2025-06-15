# Reptrix App

Reptrix is a web application designed to help users manage their workouts. It features user authentication, workout tracking, and account deletion using a modular, service-based architecture.

## Project Structure

### frontent/
The graphical user interface, built with React in JavaScript. Users can view, create, and edit their workouts, as well as manage their account.
### idm_service/ 
Identity Management Service - Handles user creation, authentication and authorization using JWT tokens, enabling secure access to protected resources across the platform.
### user_deletion_verification/ 
A service that processes and validates user account deletion requests before they are forwarded to the deletion service.
### user_deletion_service/ 
This service is responsible for executing account deletions, ensuring user data is removed from all relevant components (e.g., IDM, workouts).
### workouts_service/ 
Manages user workout data. Supports creating, updating, retrieving, and deleting workout sessions.

## Project diagram
<img src="diagram.jpg" alt="Application's diagram">