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
    URL: POST <http://localhost:5000/api/auth/forgot-password>

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
    URL: POST <http://localhost:5000/api/auth/reset-password>

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

=======================================================PROFILE END POINTS STARTS HERE==========================================================

<!-- PROFILE UPDATE START-->

    URL: PUT http://localhost:5000/api/users/me

    Header: 
        Authorization: Bearer YOUR_TOKEN

    BODY(JSON):
        {
            "name": "New Name"
        }

    Expected:
    STATUS CODE: 200

    {
    "success": true,
    "statusCode": 200,
    "message": "Profile updated successfully",
    "data": {
        "_id": "699eecd0afcd63e2f9ef2b17",
        "name": "New Name",
        "email": "test01@gmail.com",
        "role": "student",
        "createdAt": "2026-02-25T12:36:32.990Z",
        "updatedAt": "2026-02-28T14:31:19.049Z",
        "__v": 0
    }
}
<!-- PROFILE UPDATE END-->

<!-- GET THE PROFILE BY ID START-->

    URL: GET http://localhost:5000/api/users/699eecd0afcd63e2f9ef2b17

    Header: 
        Authorization: Bearer YOUR_TOKEN

    Expected:
        STATUS CODE: 200
        
        {
            "success": true,
            "statusCode": 200,
            "message": "User fetched successfully",
            "data": {
                "_id": "699eecd0afcd63e2f9ef2b17",
                "name": "New Name",
                "email": "test01@gmail.com",
                "role": "student",
                "createdAt": "2026-02-25T12:36:32.990Z",
                "updatedAt": "2026-02-28T14:31:19.049Z",
                "__v": 0
        }
}

<!-- GET THE PROFILE BY ID END-->

=======================================================CLASSES END POINTS STARTS HERE==========================================================

<!-- CREATE CLASSES - ONLY BY TEACHERS START-->

    URL: POST http://localhost:5000/api/classes

    Header: 
        Authorization: Bearer YOUR_TOKEN

    
    BODY(JSON):

        {
            "title": "Math 101",
            "description": "Basic algebra"
        }
    
    Expected:
        STATUS CODE: 201

        {
            "success":true,
            "statusCode":201,
            "message":"Class created successfully",
            "data":{"
                title":"Math 101",
                "description":"Basic algebra",
                "teachers":[
                    "69a301f0461f3c007799e345"
                ],
                "students":[],
                "joinCode":"0FB25D",
                "_id":"69a303390ffa991b480a8470",
                "createdAt":"2026-02-28T15:01:13.046Z",
                "updatedAt":"2026-02-28T15:01:13.046Z",
                "__v":0
            }
        }
<!-- CREATE CLASSES - ONLY BY TEACHERS END-->

<!--JOIN CLASS (Student Only) START-->

    URL: POST http://localhost:5000/api/classes/join

    Header: 
        Authorization: Bearer YOUR_TOKEN

    BODY(JSON):
        {
            "joinCode": "0FB25D"
        }

    Expected:
        STATUS CODE: 200

        {
            "success": true,
            "statusCode": 200,
            "message": "Joined class successfully",
            "data": {
                "_id": "69a303390ffa991b480a8470",
                "title": "Math 101",
                "description": "Basic algebra",
                "teachers": [
                    "69a301f0461f3c007799e345"
                ],
                "students": [
                    "699ef235afcd63e2f9ef2b25"
                ],
                "joinCode": "0FB25D",
                "createdAt": "2026-02-28T15:01:13.046Z",
                "updatedAt": "2026-02-28T15:11:35.168Z",
                "__v": 1
            }
        }
<!--JOIN CLASS (Student Only) END-->

<!-- GET ALL CLASSES[DASHBOARD] START -->

    URL: GET http://localhost:5000/api/classes

    Headers
        Authorization: Bearer TOKEN

        Teacher → sees classes they created

        Student → sees classes they joined

    Expected: 
        STATUS CODE: 200
    
        {
            "success":true,
            "statusCode":200,
            "message":"Classes fetched successfully",
            "data":[{"_id":"69a303390ffa991b480a8470",
            "title":"Math 101",
            "description":"Basic algebra",
            "teachers":[{
                "_id":"69a301f0461f3c007799e345",
                "name":"Teacher02",
                "email":"teacher02@gmail.com"
                }
            ],
            "students":[
                "699ef235afcd63e2f9ef2b25"
            ],
            "joinCode":"0FB25D",
            "createdAt":"2026-02-28T15:01:13.046Z",
            "updatedAt":"2026-02-28T15:11:35.168Z",
            "__v":1},
            {
                "_id":"69a308300ffa991b480a8480",
                "title":"Machine Learning",
                "description":"Welcome to ML classroom",
                "teachers":[{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                }
            ],
            "students":[
                "699ef235afcd63e2f9ef2b25"
            ],
            "joinCode":"91F64B",
            "createdAt":"2026-02-28T15:22:24.186Z",
            "updatedAt":"2026-02-28T15:23:11.187Z",
            "__v":1
            }
        ]
    }
<!-- GET ALL CLASSES[DASHBOARD] END-->

<!-- GET SINGLE CLASS START -->

    URL: GET http://localhost:5000/api/classes/69a303390ffa991b480a8470

     Headers
        Authorization: Bearer TOKEN

        Teacher → sees classes they created

        Student → sees classes they joined

    Expected: 
        STATUS CODE: 200

        {
            "success":true,
            "statusCode":200,
            "message":"Class fetched successfully",
            "data":{
                "_id":"69a303390ffa991b480a8470",
                "title":"Math 101",
                "description":"Basic algebra",
                "teachers":[{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                }
            ],
            "students":[{
                "_id":"699ef235afcd63e2f9ef2b25",
                "name":"test07",
                "email":"test07@gmail.com"
                }
            ],
            "joinCode":"0FB25D",
            "createdAt":"2026-02-28T15:01:13.046Z",
            "updatedAt":"2026-02-28T15:11:35.168Z",
            "__v":1
            }
        }
<!-- GET SINGLE CLASS START END-->

<!-- UPDATE CLASS (Teacher Only) START-->

    URL: PUT http://localhost:5000/api/classes/69a308300ffa991b480a8480

    Headers
        Authorization: Bearer TOKEN
    
    Expected: 
        STATUS CODE: 200

        {
            "success":true,
            "statusCode":200,
            "message":"Class updated successfully",
            "data":{
                "_id":"69a308300ffa991b480a8480",
                "title":"Advanced Machine Learning",
                "description":"Welcome to ML classroom",
                "teachers":[
                    "69a301f0461f3c007799e345"
                ],
                "students":[
                    "699ef235afcd63e2f9ef2b25"
                ],
                "joinCode":"91F64B",
                "createdAt":"2026-02-28T15:22:24.186Z",
                "updatedAt":"2026-02-28T15:28:16.762Z",
                "__v":1
            }
        }
<!-- UPDATE CLASS (Teacher Only) END-->

<!-- DELETE CLASS (TEACHER ONLY) START-->

    URL: DELETE http://localhost:5000/api/classes/69a308300ffa991b480a8480

     Headers
        Authorization: Bearer TOKEN

    Expected:

    STATUS CODE: 200

    {
        "success":true,
        "statusCode":200,
        "message":"Class deleted successfully",
        "data":null
    }

<!-- DELETE CLASS (TEACHER ONLY) END-->
===============================================================================================================================================

<!-- STREAM END POINTS START (Teacher of that class can make StreamS) -->

    URL: http://localhost:5000/api/classes/:classId/streams

    EXAMPLE: POST http://localhost:5000/api/classes/69a303390ffa991b480a8470/streams

    Headers
        Authorization: Bearer YOUR_JWT_TOKEN
    
    BODY(JSON):
        {
        "content": "Tomorrow is project submission deadline."
        }
    
    Expected:
    STATUS CODE: 201

    {
        "success":true,
        "data":{
            "content":"Tomorrow is project submission deadline.",
            "class":"69a303390ffa991b480a8470",
            "author":"69a301f0461f3c007799e345",
            "_id":"69a3cedf7f62e542b09d3c4a",
            "createdAt":"2026-03-01T05:30:07.451Z",
            "updatedAt":"2026-03-01T05:30:07.451Z",
            "__v":0
        }
    }

<!-- STREAM END POINTS END (Teacher of that class can make StreamS) -->

<!-- GET ALL STREAMS START-->

    URL: GET http://localhost:5000/api/classes/:classId/streams

    EXAMPLE: GET http://localhost:5000/api/classes/69a303390ffa991b480a8470/streams

    Headers:
        Authorization: Bearer YOUR_JWT_TOKEN
    
    Expected:
        STATUS CODE: 200

        {
            "success":true,
            "data":[{
                "_id":"69a3cedf7f62e542b09d3c4a",
                "content":"Tomorrow is project submission deadline.",
                "class":"69a303390ffa991b480a8470",
                "author":{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                    },
                "createdAt":"2026-03-01T05:30:07.451Z",
                "updatedAt":"2026-03-01T05:30:07.451Z",
                "__v":0
                }
            ]
        }

<!-- GET ALL STREAMS END-->

<!-- DELETE STREAM BY TEACHER START-->

    URL: DELETE http://localhost:5000/api/streams/:streamId

    Example: DELETE http://localhost:5000/api/streams/69a3cedf7f62e542b09d3c4a

    Headers:
        Authorization: Bearer YOUR_JWT_TOKEN

    Expected:
        STATUS CODE: 200
        {
            "success":true,
            "message":"Stream deleted successfully"
        }
<!-- DELETE STREAM BY TEACHER END -->
