# VoteSphere_nodejs - A Secure Voting System

## About the Project
VoteSphere is a secure voting application that allows users to cast votes for candidates while ensuring **one-person-one-vote** policy. The system supports user authentication via **Aadhar card number**, role-based access control, and **real-time vote counting**.

## Features
 User Signup and Login using Aadhar Card Number  
 Secure authentication with JWT tokens  
 One-time voting restriction  
 Live vote count with real-time updates  
 Admin-only candidate management  
 Users can update their passwords  
 **Role-based access**: Users can vote, Admin can manage candidates but cannot vote  

## Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB, Mongoose  
- **Authentication**: JWT (JSON Web Tokens)  
- **Password Security**: Bcrypt  
- **Environment Variables**: dotenv  

## API Endpoints

### **User Authentication**
| Endpoint | Method | Description |
|----------|--------|--------------|
| `/signup` | POST | Register a new user |
| `/login` | POST | User login using Aadhar card number and password |

### **Voting**
| Endpoint | Method | Description |
|----------|--------|--------------|
| `/candidates` | GET | Get the list of candidates |
| `/vote/:candidateId` | POST | Vote for a candidate |

### **Live Vote Count**
| Endpoint | Method | Description |
|----------|--------|--------------|
| `/vote/count` | GET | Get the list of candidates sorted by votes |

### **User Profile**
| Endpoint | Method | Description |
|----------|--------|--------------|
| `/profile` | GET | Fetch user profile details |
| `/profile/password` | PUT | Change user password |

### **Admin Candidate Management**
| Endpoint | Method | Description |
|----------|--------|--------------|
| `/candidates` | POST | Create a new candidate |
| `/candidates/:candidateId` | PUT | Update candidate details |
| `/candidates/:candidateId` | DELETE | Remove a candidate |

## Installation and Setup
1. Clone the repository:
git clone https://github.com/abhishek-kr01/VoteSphere_nodejs.git

2. Navigate to the project directory:
   cd votesphere

3. Install dependencies:
   npm install

4. create a .env file nad add:
   PORT=3000
   MONGODB_URL_LOCAL=your_mongo_db_url
   JWT_SECRET=your_secret_key

5. Run the server:
   npm run dev / npm start
