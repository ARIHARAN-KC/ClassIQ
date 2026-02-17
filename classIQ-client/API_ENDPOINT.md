<!-- REGISTER ENDPOINT START-->

    URL: POST http://localhost:5000/api/auth/register
    
    BODY(JSON):
        {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "Password123",
            "role": "student"
        }

    Expected Response:
    STATUS CODE: 201
        {
            "success":true,
            "data":{
                "user":{
                    "name":"John Doe",
                    "email":"john@example.com",
                    "password":"$2b$10$3fU6ewBhYKsYV2SskVLVWeI9AmsOJL5cSl4iovWbO22dqOglAhWoa",
                    "role":"student",
                    "_id":"6994048e46c75206c6e69dfd",
                    "createdAt":"2026-02-17T06:02:54.657Z",
                    "updatedAt":"2026-02-17T06:02:54.657Z",
                    "__v":0
                    },
                    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTQwNDhlNDZjNzUyMDZjNmU2OWRmZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzcxMzA4MTc0LCJleHAiOjE3NzE5MTI5NzR9.MKN6uqgM2w1QLpt3rczVpDO_IbPS5baaT77jCO8Rs1s"
                }
            }

<!-- REGISTER ENDPOINT END  -->

<!-- LOGIN ENDPOINT START -->

    URL: POST http://localhost:5000/api/auth/login

    BODY(JSON):
        {
        "email": "john@example.com",
        "password": "Password123"
        }

    Expected Response:
    STATUS CODE: 200
        {
            "success":true,
            "data":{
                "user":{
                    "_id":"6994048e46c75206c6e69dfd",
                    "name":"John Doe",
                    "email":"john@example.com",
                    "password":"$2b$10$3fU6ewBhYKsYV2SskVLVWeI9AmsOJL5cSl4iovWbO22dqOglAhWoa",
                    "role":"student",
                    "createdAt":"2026-02-17T06:02:54.657Z",
                    "updatedAt":"2026-02-17T06:02:54.657Z",
                    "__v":0
                    },
                    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTQwNDhlNDZjNzUyMDZjNmU2OWRmZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzcxMzA4NDI2LCJleHAiOjE3NzE5MTMyMjZ9.iKwiFdnqJ1eEQyFl4nhpCzUCx_QIGTT7Cf2akMcVWRY"
                    }
        }
<!-- LOGIN ENDPOINT END -->

<!-- PROTECTED ROUTE START -->

    URL: GET http://localhost:5000/api/users/me
    
    Header:
        Authorization: Bearer YOUR_TOKEN

    Expected:
    STATUS CODE: 200
         {
            "success":true,
            "statusCode":200,
            "message":"User fetched successfully",
            "data":{
                "id":"6994048e46c75206c6e69dfd",
                "role":"student"
                }
        }


TEACHER DASHBOARD:

    URL: GET http://localhost:5000/api/users/teacher-dashboard

    Header: 
        Authorization: Bearer YOUR_TOKEN

    Expected:
    STATUS CODE: 200
        {
            "success":true,
            "statusCode":200,
            "message":"Welcome Teacher!!!",
            "data":null
        }
    
        if students try to login as teacher means
        Expected:
            {
                "success":false,
                "message":"Forbidden. You don't have permission."
            }

        
STUDEND DASHBOARD:

    URL: GET http://localhost:5000/api/users/student-dashboard

    
    Header: 
        Authorization: Bearer YOUR_TOKEN

    Expected:
    STATUS CODE: 200
        {
            "success":true,
            "statusCode":200,
            "message":"Welcome Student!!!",
            "data":null
        }
     
    if teacher try to login as student means
    Expected:
        {
                "success":false,
                "message":"Forbidden. You don't have permission."
        }

<!-- PROTECTED ROUTE END  -->

<!-- FORGET PASSWORD START-->

STEP 1: 
    URL: POST http://localhost:5000/api/auth/forgot-password

    BODY(JSON):
        {
            "email": "johntoe@example.com"
        }

    Expected:
    STATUS CODE: 200
        {
            "success":true,
            "message":"Reset token generated",
            "resetToken":"cd077de944ac5e726536f0d6c2a67471a04fd6d3d0cb7a0b525b52e1ab1a7250"
        }

STEP 2:
    URL: POST http://localhost:5000/api/auth/reset-password

    BODY(JSON):
        {
            "token": "cd077de944ac5e726536f0d6c2a67471a04fd6d3d0cb7a0b525b52e1ab1a7250",
            "newPassword": "NewPassword1234"
        }

    Expected:
    STATUS CODE: 200
        {
            "success":true,
            "message":"Password reset successful"
        }
<!-- FORGET PASSWORD END -->

<!-- LOGOUT START -->

    URL: POST http://localhost:5000/api/auth/logout

    Expected:
    STATUS CODE: 200

    {
        "success":true,
        "message":"Logged out successfully"
    }
<!-- LOGOUT END -->