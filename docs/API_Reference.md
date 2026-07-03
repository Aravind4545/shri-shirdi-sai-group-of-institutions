# SSSI API Reference

## Authentication
`POST /api/auth/login`
- **Body**: `{ "email": "user@sssi.edu.in", "password": "password" }`
- **Response**: JWT Token & User Details

## ERP & Administration
`GET /api/admissions/pending`
- **Headers**: `x-auth-token: <jwt>`
- **Response**: List of applications awaiting review.

`POST /api/finance/generate-record`
- **Body**: `{ "studentId": "...", "feeStructureId": "..." }`
- **Response**: Instantiates a Payment Ledger with Installments.

## AI Ecosystem
`POST /api/ai/chat`
- **Body**: `{ "message": "Physics doubt", "program": "IIT" }`
- **Response**: AI Assistant Reply & Conversation History

`POST /api/ai/generate-plan`
- **Body**: `{ "program": "UPSC", "planType": "Weekly" }`
- **Response**: Study Plan JSON object.

## Teacher Portal
`GET /api/teacher/students`
- **Headers**: `x-auth-token: <jwt>`
- **Response**: Array of students filtered strictly by the Teacher's assigned program.
