# Notes Management Application

A full-stack Notes Management Application built with React, Spring Boot, MySQL, and JWT Authentication. Users can register, log in, and manage their personal notes securely.

---

## Tech Stack

**Frontend**
- React
- Vite

**Backend**
- Spring Boot
- Spring Security
- Spring Data JPA

**Database**
- MySQL

**Authentication**
- JWT (JSON Web Token)

**Build Tool**
- Maven

---

## Features

- User Registration
- User Login
- User Logout
- Create Notes
- View Notes
- Update Notes
- Delete Notes
- JWT Authentication
- User-specific Notes

---

## Project Structure

```text
notes-management-app/
│
├── notes-app                 # React Frontend
├── notes_management_backend  # Spring Boot Backend
└── README.md
```

---

## Backend Setup

1. Open the backend folder.

```bash
cd notes_management_backend
```

2. Configure your MySQL database in:

```text
src/main/resources/application.properties
```

3. Run the backend.

```bash
mvn spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

---

## Frontend Setup

1. Open the frontend folder.

```bash
cd notes-app
```

2. Install dependencies.

```bash
npm install
```

3. Start the application.

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## API

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Notes

- GET `/api/notes`
- POST `/api/notes`
- PUT `/api/notes/{id}`
- DELETE `/api/notes/{id}`

---

## Live Demo

Deployment in progress.

- Frontend: Coming Soon
- Backend: Coming Soon

---

## Author

**Vishal Kothimire**

GitHub: https://github.com/Vishal9496

LinkedIn: Add your LinkedIn profile link

---

## License

This project is created for learning and portfolio purposes.
