<img align="right" src="https://visitor-badge.laobi.icu/badge?page_id=towaquimbayo.IntelliScan">

# IntelliScan

![IntelliScan Thumbnail](screenshots/intelliscan-thumbnail.jpg)
An AI-powered web application that enables users to upload PDF files, ask questions based on the document, and receive answers. Utilizing our proprietary AI-Predictive model, the application scans the PDF document and provides answers based on user prompts. Additionally, IntelliScan offers an admin dashboard for administrators to manage users and monitor API usage.

> [!IMPORTANT]
> Due to maintenance, the ask question API endpoint is temporarily unavailable to prevent misuse.

_Check out the live project [_here_](https://intelliscan.towaquimbayo.com/)._

## Table of Contents

* [Screenshots](#screenshots)
* [Acknowledgements](#acknowledgements)
* [Technologies](#technologies)
* [Features](#features)
  * [User Management](#user-management)
  * [PDF File Upload](#pdf-file-upload)
  * [AI Document Processing](#ai-document-processing)
  * [Admin Dashboard](#admin-dashboard)

## Screenshots

| ![Login Page](screenshots/login.png) | ![Forgot Password Page](screenshots/forgot-password.png) |
|:--:|:--:|
| _Login Page_ | _Forgot Password Page_ |
| ![Home Page](screenshots/home.png) | ![Prompt and AI-Model Response](screenshots/ai-model-response.png) |
| _Home Page_ | _Prompt and AI-Model Response_ |
| ![Admin Dashboard Page](screenshots/admin-dashboard.png) | ![User API Usage Page](screenshots/user-api-usage.png) |
| _Admin Dashboard Page_ | _User API Usage Page_ |

## Acknowledgements

* Towa Quimbayo [GitHub](https://github.com/towaquimbayo) [LinkedIn](https://www.linkedin.com/in/towa-quimbayo/)
* Noufil Saqib [GitHub](https://github.com/noufilsaqib) [LinkedIn](https://www.linkedin.com/in/muhammad-noufil-saqib/)
* Maximillian Yong [GitHub](https://github.com/MaximillianYong) [LinkedIn](https://www.linkedin.com/in/maximillianyong)
* Juan Escalada [GitHub](https://github.com/jescalada) [LinkedIn](https://www.linkedin.com/in/jescalada/)

[![Contributors](https://contrib.rocks/image?repo=towaquimbayo/IntelliScan)](https://github.com/towaquimbayo/IntelliScan/graphs/contributors)

## Technologies

* React.js `v18.2.0`
* CSS3
* React Helmet `v6.1.0`
* React Redux `v8.1.1`
* React Verification-Input `v4.1.1`
* Redux `v4.2.1`
* Redux-Thunk `v2.4.2`
* Node.js
* Express `v4.18.2`
* JWT Authentication `v9.0.0`
* MongoDB / Mongoose `v6.3.3`
* Multer `v1.4.5`
* Nodemailer `v6.9.13`
* Nodemon `v3.1.0`
* TypeScript `v4.9.4`
* Zod `v3.20.2`
* Python
* FastAPI
* Google Gemma `Gemma2B-IT`
* Pydantic
* PyPDF2
* Torch
* Transformers
* Uvicorn

## Features

### User Management

Secure and efficient user management functionalities to ensure smooth user operations.

* __JWT Authentication__: Our authentication system ensures secure access to the application using JSON Web Tokens (JWT) stored in HttpOnly cookies. This approach protects user integrity and ensures secure session management.
* __Login/Signup__: Users can sign up and log in with a straightforward system that requires standard information: name, email, and password. This setup, combined with JWT authentication, provides robust security and seamless session handling.
* __Forgot Password__: Users who forget their password can easily reset it through a secure process. An OTP (One-Time Password) token is sent to the user's registered email for verification, ensuring the validity of the request and enabling secure password reset functionality.

### PDF File Upload

Simple and intuitive file upload system for user convenience.

* __Document File Upload:__ Users can upload PDF files either by drag-and-drop or by selecting from their local machine. The application validates the file size and type before processing. This user-friendly upload mechanism ensures that files are correctly sent to the backend for further processing by our AI model.

### AI Document Processing

Advanced AI capabilities to process documents and interact with users based on the document content.

* __AI-Predictive Model:__ Our AI-Predictive model enables users to upload PDF documents and ask questions about the content. The AI model processes the extracted text from the PDF and provides relevant answers, facilitating an interactive experience with the document.
* __PDF to Plain Text Converter__: A dedicated microservice extracts and converts PDF document text to plain text. This text is then formatted and passed to our AI model, which processes user prompts and generates accurate responses.

### Admin Dashboard

Comprehensive dashboard for administrators to manage users and monitor system usage.

* __User Management__: Administrators have access to a detailed list of users registered on the application. They can view user information, edit details, and delete users if necessary, ensuring effective user management.
* __API Usage Tracking__: The admin dashboard includes a feature to monitor API usage, allowing administrators to track the number of requests per API endpoint. This helps in rate-limiting users who exceed a certain threshold, preventing backend and microservice overload.
