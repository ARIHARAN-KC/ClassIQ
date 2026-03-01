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

==============================================================================================================================================

<!-- CREATE THE ASSIGNMENT[ONLY BY TEACHER] START-->

    URL: POST http://localhost:5000/api/classes/{classId}/assignments

    Example: POST http://localhost:5000/api/classes/69a303390ffa991b480a8470/assignments

    Headers:
        Bearer <your_teacher_token>
    
    BODY[FORM-DATA]:
    without attachment
    {
        "title": "ML-2",
        "description": "Solve all",
        "dueDate": "2026-03-10",
        "totalMarks":"100"
    }

    with attachment - file upload 5 can upload
     {
        "title": "ML",
        "description": "Solve exercises from Chapter",
        "dueDate": "2026-03-10",
        "totalMarks":"100",
        files:path 
    }
                
    Expected:
        STATUS CODE: 201
    without attachment
    {
        "success":true,
        "data":{
            "title":"ML-2",
            "description":"Solve all ",
            "dueDate":"2026-03-10T23:59:00.000Z",
            "totalMarks":100,
            "class":"69a303390ffa991b480a8470",
            "createdBy":"69a301f0461f3c007799e345",
            "attachments":[],
            "_id":"69a3ea26bf30f8d5dccc21e8",
            "createdAt":"2026-03-01T07:26:30.418Z",
            "updatedAt":"2026-03-01T07:26:30.418Z",
            "__v":0
        }
    }

    with attachment
    {
        "success":true,
        "data":{
            "title":"ML",
            "description":"Solve all from the upload doc",
            "dueDate":"2026-03-10T23:59:00.000Z",
            "totalMarks":100,
            "class":"69a303390ffa991b480a8470",
            "createdBy":"69a301f0461f3c007799e345",
            "attachments":[
                "/uploads/1772349837757-119922719.pdf",
                "/uploads/1772349837761-486233368.jpeg",
                "/uploads/1772349837762-717780689.pdf"
            ],
            "_id":"69a3e98dbf30f8d5dccc21e5",
            "createdAt":"2026-03-01T07:23:57.948Z",
            "updatedAt":"2026-03-01T07:23:57.948Z",
            "__v":0
        }
    }
<!-- CREATE THE ASSIGNMENT[ONLY BY TEACHER] END-->


<!-- GET ALL ASSIGNMENT START-->

    URL: GET http://localhost:5000/api/classes/{classId}/assignments

    Example: GET http://localhost:5000/api/classes/69a303390ffa991b480a8470/assignments

    Headers
        Authorization: Bearer YOUR_TOKEN

    Expected:
    STATUS CODE: 200
        {
            "success":true,
            "data":[{
                "_id":"69a3ea26bf30f8d5dccc21e8",
                "title":"ML-2",
                "description":"Solve all ",
                "dueDate":"2026-03-10T23:59:00.000Z",
                "totalMarks":100,
                "class":"69a303390ffa991b480a8470",
                "createdBy":{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                },
                "attachments":[],
                "createdAt":"2026-03-01T07:26:30.418Z",
                "updatedAt":"2026-03-01T07:26:30.418Z",
                "__v":0
            },
            {
                "_id":"69a3e98dbf30f8d5dccc21e5",
                "title":"ML",
                "description":"Solve all from the upload doc",
                "dueDate":"2026-03-10T23:59:00.000Z",
                "totalMarks":100,
                "class":"69a303390ffa991b480a8470",
                "createdBy":{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                },
                "attachments":[
                    "/uploads/1772349837757-119922719.pdf",
                    "/uploads/1772349837761-486233368.jpeg",
                    "/uploads/1772349837762-717780689.pdf"
                ],
                "createdAt":"2026-03-01T07:23:57.948Z",
                "updatedAt":"2026-03-01T07:23:57.948Z",
                "__v":0
            },
            {
                "_id":"69a3e87dbf30f8d5dccc21e2",
                "title":"ML",
                "description":"Solve all exeicis",
                "dueDate":"2026-03-10T23:59:00.000Z",
                "totalMarks":100,
                "class":"69a303390ffa991b480a8470",
                "createdBy":{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                },
                "attachments":[],
                "createdAt":"2026-03-01T07:19:25.582Z",
                "updatedAt":"2026-03-01T07:19:25.582Z",
                "__v":0
            },{
                "_id":"69a3e4cd3f6a5204c500f1d2",
                "title":"Machine learning 1",
                "description":"Solve all exercises from Chapter 1",
                "dueDate":"2026-03-05T23:59:00.000Z",
                "totalMarks":100,
                "class":"69a303390ffa991b480a8470",
                "createdBy":{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                },
                "attachments":[
                    "https://example.com/ml.pdf"
                ],
                "createdAt":"2026-03-01T07:03:41.754Z",
                "updatedAt":"2026-03-01T07:03:41.754Z",
                "__v":0
            }
        ]
    }
<!-- GET ALL ASSIGNMENT END-->

<!-- GET SINGLE ASSIGNMENT START -->

    URL: GET http://localhost:5000/api/assignments/{assignmentId}

    Example: GET http://localhost:5000/api/assignments/69a3ea26bf30f8d5dccc21e8

    Headers
        Authorization: Bearer YOUR_TOKEN

    Expected:
        STATUS CODE: 200
        {
            "success":true,
            "data":{
                "_id":"69a3ea26bf30f8d5dccc21e8",
                "title":"ML-2",
                "description":"Solve all ",
                "dueDate":"2026-03-10T23:59:00.000Z",
                "totalMarks":100,
                "class":{
                    "_id":"69a303390ffa991b480a8470"
                },
                "createdBy":{
                    "_id":"69a301f0461f3c007799e345",
                    "name":"Teacher02",
                    "email":"teacher02@gmail.com"
                },
                "attachments":[],
                "createdAt":"2026-03-01T07:26:30.418Z",
                "updatedAt":"2026-03-01T07:26:30.418Z",
                "__v":0
            }
        }
<!-- GET SINGLE ASSIGNMENT END -->

<!-- UPDATE THE ASSIGNMENT START -->

    URL: PUT http://localhost:5000/api/assignments/{assignmentId}

    Example: http://localhost:5000/api/assignments/69a3ea26bf30f8d5dccc21e8

    Headers
        Authorization: Bearer YOUR_TOKEN

    BODY{JSON}:
        {
            "title": "Updated Math Homework",
            "totalMarks": 150,
            FILEDS  WHAT NEED TO UPDATE
        }

    Expected:
    STATUS CODE: 200
    {
        "success":true,
        "data":{
            "_id":"69a3ea26bf30f8d5dccc21e8",
            "title":"Updated ML Assignment",
            "description":"Solve all ",
            "dueDate":"2026-03-10T23:59:00.000Z",
            "totalMarks":150,
            "class":"69a303390ffa991b480a8470",
            "createdBy":"69a301f0461f3c007799e345",
            "attachments":[],
            "createdAt":"2026-03-01T07:26:30.418Z",
            "updatedAt":"2026-03-01T07:39:59.586Z",
            "__v":0
        }
        }
<!-- UPDATE THE ASSIGNMENT END -->

<!-- DELETE ASSIGMENT [ONLY BY TEACHER] START-->

    URL: DELETE http://localhost:5000/api/assignments/{assignmentId}

    Example http://localhost:5000/api/assignments/69a3ea26bf30f8d5dccc21e8

    Headers:
        Authorization: Bearer YOUR_TOKEN
    
    Expected:
    STATUS CODE: 200
    {
        "success":true,
        "message":"Assignment deleted successfully"
    }
<!-- DELETE ASSIGMENT [ONLY BY TEACHER] END-->

=============================================================================================================================================

<!-- UPLOAD SUBMISSION FOR ASSIGNMENT[STUDENTS] START-->

    URL: POST http://localhost:5000/api/assignments/:assignmentId/submissions

    Example: POST http://localhost:5000/api/assignments/69a3e4cd3f6a5204c500f1d2/submissions

    Headers:
        Authorization: Bearer STUDENT_TOKEN
    
    BODY[FORM-DATA]:
    
    | KEY     | VALUE               | TYPE |
    | ------- | ------------------- | ---- |
    | comment | My final assignment | Text |
    | files   | upload.pdf          | File |
    | files   | diagram.png         | File |

    Expected:
    STATUS CODE: 201
    
    {
    "success": true,
    "data": {
        "assignment": "69a3e4cd3f6a5204c500f1d2",
        "student": "699ef235afcd63e2f9ef2b25",
        "comment": "My final assignment",
        "attachments": [
            "/uploads/1772352912596-902611278.pdf"
        ],
        "_id": "69a3f590623c975f6f131a82",
        "createdAt": "2026-03-01T08:15:12.912Z",
        "updatedAt": "2026-03-01T08:15:12.912Z",
        "__v": 0
        }
    }

<!-- UPLOAD SUBMISSION FOR ASSIGNMENT[STUDENTS] END-->

<!-- GET ALL SUBMISSION [TEACHER] START-->

    URL: GET http://localhost:5000/api/assignments/:assignmentId/submissions

    Example: GET http://localhost:5000/api/assignments/69a3e4cd3f6a5204c500f1d2/submissions
    
    Headers
        Authorization: Bearer TEACHER_TOKEN

    Expected:
    STATUS CODE: 200
    {
        "success":true,
        "data":[{
            "_id":"69a3f590623c975f6f131a82",
            "assignment":"69a3e4cd3f6a5204c500f1d2",
            "student":{
                "_id":"699ef235afcd63e2f9ef2b25",
                "name":"test07",
                "email":"test07@gmail.com"
                },
                "comment":"My final assignment",
                "attachments":[
                    "/uploads/1772352912596-902611278.pdf"
                    ],
                    "createdAt":"2026-03-01T08:15:12.912Z","
                    updatedAt":"2026-03-01T08:15:12.912Z",
                    "__v":0
                    }
                ]
            }
    
<!-- GET ALL SUBMISSION [TEACHER] END-->

<!-- GRADE SUBMISSION[TEACHER] START -->

    URL: PUT http://localhost:5000/api/submissions/:submissionId/grade

    Example: PUT http://localhost:5000/api/submissions/69a3f590623c975f6f131a82/grade

    Headers:
        Authorization: Bearer TEACHER_TOKEN

    Expected:
        STATUS CODE: 200
        {
            "success":true,
            "data":{
                "_id":"69a3f590623c975f6f131a82",
                "assignment":{
                    "_id":"69a3e4cd3f6a5204c500f1d2",
                    "title":"Machine learning 1",
                    "description":"Solve all exercises from Chapter 1",
                    "dueDate":"2026-03-05T23:59:00.000Z",
                    "totalMarks":100,
                    "class":"69a303390ffa991b480a8470",
                    "createdBy":"69a301f0461f3c007799e345",
                    "attachments":["https://example.com/ml.pdf"],
                    "createdAt":"2026-03-01T07:03:41.754Z",
                    "updatedAt":"2026-03-01T07:03:41.754Z",
                    "__v":0
                },
                "student":"699ef235afcd63e2f9ef2b25",
                "comment":"My final assignment",
                "attachments":[
                    "/uploads/1772352912596-902611278.pdf"
                ],
                "createdAt":"2026-03-01T08:15:12.912Z",
                "updatedAt":"2026-03-01T08:27:49.329Z",
                "__v":0,
                "marksObtained":85,
                "feedback":"Good work, improve Flowchart.",
                "gradedBy":"69a301f0461f3c007799e345",
                "gradedAt":"2026-03-01T08:27:49.328Z"
            }
        }
<!-- GRADE SUBMISSION[TEACHER] END -->

<!-- GET SINGLE SUBMISSION[TEACHER/STUDENT] START -->

    URL: GET http://localhost:5000/api/submissions/:submissionId

    Example: GET http://localhost:5000/api/submissions/69a3f590623c975f6f131a82

    Headers:
        Authorization: Bearer TEACHER_TOKEN

    Expected:
        STATUS CODE: 200
    {
        "success":true,
        "data":{
            "_id":"69a3f590623c975f6f131a82",
            "assignment":{
                "_id":"69a3e4cd3f6a5204c500f1d2",
                "title":"Machine learning 1",
                "description":"Solve all exercises from Chapter 1",
                "dueDate":"2026-03-05T23:59:00.000Z",
                "totalMarks":100,
                "class":"69a303390ffa991b480a8470",
                "createdBy":"69a301f0461f3c007799e345",
                "attachments":["https://example.com/ml.pdf"],
                "createdAt":"2026-03-01T07:03:41.754Z",
                "updatedAt":"2026-03-01T07:03:41.754Z",
                "__v":0
            },
            "student":{
                "_id":"699ef235afcd63e2f9ef2b25",
                "name":"test07",
                "email":"test07@gmail.com"
            },
            "comment":"My final assignment",
            "attachments":[
                "/uploads/1772352912596-902611278.pdf"
                ],
            "createdAt":"2026-03-01T08:15:12.912Z",
            "updatedAt":"2026-03-01T08:27:49.329Z",
            "__v":0,
            "feedback":"Good work, improve Flowchart.",
            "gradedAt":"2026-03-01T08:27:49.328Z",
            "gradedBy":"69a301f0461f3c007799e345",
            "marksObtained":85
        }
    }
<!-- GET SINGLE SUBMISSION[TEACHER/STUDENT] EMD -->

==============================================================================================================================================

<!-- AI CHAT START -->

    URL: POST http://localhost:5000/api/ai/chat

     Headers:
        Authorization: Bearer TEACHER_TOKEN

    BODY{JSON}:
    {
        "message": "Explain polymorphism in Programming"
    }

    Expected:
        STATUS CODE: 200
        {
            "success":true,
            "data":"Polymorphism is a fundamental concept in programming, particularly in object-oriented programming (OOP). It allows objects of different classes to be treated as objects of a common superclass. The term \"polymorphism\" comes from the Greek words \"poly\" (meaning \"many\") and \"morph\" (meaning \"form\"), which reflects the idea that a single function or method can take many forms.\n\n### Types of Polymorphism\n\n1. **Compile-time Polymorphism (Static Polymorphism)**:\n   - Achieved through method overloading and operator overloading.\n   - Method Overloading: Multiple methods in the same class can have the same name with different parameters (different type or number of parameters).\n     ```python\n     class MathOperations:\n         def add(self, a: int, b: int) -> int:\n             return a + b\n         \n         def add(self, a: float, b: float) -> float:\n             return a + b\n     ```\n   - Operator Overloading: Customizing the behavior of operators for user-defined types.\n\n2. **Run-time Polymorphism (Dynamic Polymorphism)**:\n   - Achieved through method overriding, where a subclass provides a specific implementation of a method that is already defined in its superclass.\n   - Involves the use of virtual functions or interfaces in languages like Java, C++, and Python.\n     ```python\n     class Animal:\n         def make_sound(self):\n             pass\n\n     class Dog(Animal):\n         def make_sound(self):\n             return \"Bark\"\n\n     class Cat(Animal):\n         def make_sound(self):\n             return \"Meow\"\n\n     def animal_sound(animal: Animal):\n         print(animal.make_sound())\n\n     dog = Dog()\n     cat = Cat()\n     animal_sound(dog)  # Output: Bark\n     animal_sound(cat)  # Output: Meow\n     ```\n\n### Benefits of Polymorphism\n\n- **Code Reusability**: Write generic code that works with different types of objects.\n- **Flexibility and Maintainability**: Easier to extend and modify code without affecting existing functionality.\n- **Improved Readability**: Clearer and more intuitive code structure, allowing developers to understand behavior through interfaces and abstract classes.\n\n### Summary\n\nPolymorphism enhances the flexibility and scalability of code in object-oriented programming by allowing methods to operate on objects of various types. By leveraging polymorphism, developers can write more generic and reusable code, leading to better software design."
        }
<!-- AI CHAT END -->

<!-- AI SUMMARY START -->

    URL: POST http://localhost:5000/api/ai/class-summary

    Headers:
        Authorization: Bearer TOKEN

    BODY{JSON}:
        {
            "classNotes": "Today we studied inheritance, encapsulation and polymorphism in Java."
        }

    Expected:
        STATUS CODE: 200
    {
        "success":true,
        "data":"It seems that there is no specific information provided about the class activity you would like summarized. Please provide the details of the class activity, and I’ll be happy to help you format a summary in markdown!"
    }
<!-- AI SUMMARY END -->

<!-- AI GENERATE ASSIGNMENT START -->

    URL: POST http://localhost:5000/api/ai/generate-assignment

    Headers:
        Authorization: Bearer TOKEN
    
    BODY{JSON}:
        {
            "topic": "Binary Trees",
            "difficulty": "medium",
            "classLevel": "B.Tech 2nd Year"
        }
    Expected:
        STATUS CODE: 200
    {
        "success":true,
        "data":"# Assignment Title: Exploring Binary Trees\n\n## Description:\nIn this assignment, students will explore the structure and functionality of binary trees, a fundamental data structure in computer science. Students will learn to implement basic operations such as insertion, traversal, and searching within a binary tree.\n\n## Instructions:\n1. **Research Binary Trees**:\n   - Understand what a binary tree is and its properties.\n   - Research different types of binary trees (e.g., full binary trees, complete binary trees, binary search trees).\n\n2. **Implement a Binary Tree**:\n   - Write a program in your preferred programming language that creates a binary tree. \n   - Include functions for the following operations:\n     - Insertion of nodes\n     - In-order, pre-order, and post-order traversal\n     - Searching for a specific value in the tree\n\n3. **Documentation**:\n   - Document your code clearly, explaining how each function works.\n   - Provide comments within the code to describe the logic behind key sections.\n\n4. **Test Your Implementation**:\n   - Create test cases to demonstrate the functionality of your binary tree implementation.\n   - Include at least three different scenarios for insertion and traversal.\n\n5. **Submission**:\n   - Submit your code along with a short report (1-2 pages) summarizing your findings about binary trees, the challenges you faced while implementing the tree, and how you resolved them.\n\n## Evaluation Criteria:\n| Criteria                       | Excellent (5 points) | Good (4 points) | Satisfactory (3 points) | Needs Improvement (2 points) | Unsatisfactory (1 point) |\n|--------------------------------|----------------------|------------------|-------------------------|------------------------------|--------------------------|\n| **Understanding of Concepts**  | Demonstrates a thorough understanding of binary trees and their types | Shows good understanding with minor gaps | Basic understanding but lacks depth | Limited understanding of concepts | No understanding of concepts |\n| **Code Implementation**        | Code is well-structured, efficient, and functions as intended | Code works with minor issues | Code works but is poorly structured | Code has significant issues | Code does not work |\n| **Documentation**              | Clear, comprehensive documentation | Good documentation with minor gaps | Basic documentation | Poor documentation | No documentation provided |\n| **Testing**                    | Comprehensive test cases that cover all scenarios | Good test cases with minor gaps | Basic test cases | Limited testing | No testing provided |\n| **Report Quality**             | Insightful, well-written report | Good report with minor gaps | Basic report | Poorly written report | No report provided |\n\n**Total Points: 25**\n\n---\n\n**Due Date**: [Insert Due Date Here]\n\n**Note**: Be sure to follow the code style guidelines for the language you are using. Collaboration is encouraged, but each student must submit their own work."
    }

<!-- AI GENERATE ASSIGNMENT END -->

<!-- AI EXPLAIN ASSIGMENTE START -->

    URL: POST http://localhost:5000/api/ai/explain-assignment

    Headers:
        Authorization: Bearer TOKEN
    
    BODY{JSON}:
        {
             "assignmentText": "Implement a binary search tree with insert, delete and traversal."
        }

    Expected:
        STATUS CODE:200
        {
            "success": true,
             "data": "Sure! Here's a simple explanation of your assignment:\n\n1️ **Introduction:** A Binary Search Tree (BST) is a data structure where each node has at most two children. The left child contains values smaller than the parent, and the right child contains values larger than the parent.\n\n2️ **Insert Method:**\n- Start at the root.\n- Compare the value to insert with the current node.\n- If smaller, go left; if larger, go right.\n- Repeat until you find an empty spot and insert the new node.\n\n3 **Delete Method:**\n- Find the node to delete.\n- If it has no children, just remove it.\n- If it has one child, replace it with its child.\n- If it has two children, find the smallest node in the right subtree (successor), replace the node with it, and delete the successor node.\n\n4️ **Traversal Methods:**\n- **Inorder (Left, Root, Right):** Gives values in sorted order.\n- **Preorder (Root, Left, Right):** Useful for copying the tree.\n- **Postorder (Left, Right, Root):** Useful for deleting the tree.\n\n5️ **Python Example:**\n```python\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\n# Example of insert, delete, and traversal functions here...\n```\n\nThis step-by-step explanation should help a beginner understand how to implement and work with a BST."
        }
<!-- AI EXPLAIN ASSIGMENTE END -->

<!-- AI SUBMISSION SUMMARY START-->

    URL: POST http://localhost:5000/api/ai/submission-summary

    Headers:
        Authorization: Bearer TOKEN

    BODY{JSON}:
        {
            "submissionText": "**Introduction:** A Binary Search Tree (BST) is a data structure where each node has at most two children. The left child contains values smaller than the parent, and the right child contains values larger than the parent.\n\n2️ **Insert Method:**\n- Start at the root.\n- Compare the value to insert with the current node.\n- If smaller, go left; if larger, go right.\n- Repeat until you find an empty spot and insert the new node.\n\n3 **Delete Method:**\n- Find the node to delete.\n- If it has no children, just remove it.\n- If it has one child, replace it with its child.\n- If it has two children, find the smallest node in the right subtree (successor), replace the node with it, and delete the successor node.\n\n4️ **Traversal Methods:**\n- **Inorder (Left, Root, Right):** Gives values in sorted order.\n- **Preorder (Root, Left, Right):** Useful for copying the tree.\n- **Postorder (Left, Right, Root):** Useful for deleting the tree.\n\n5️ **Python Example:**\n```python\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\n# Example of insert, delete, and traversal functions here...\n```\n\nThis step-by-step explanation should help a beginner understand how to implement and work with a BST."
        }
    
    Expected:
        STATUS CODE: 200
    
    {
        "success":true,
        "data":"..."
    }

<!-- AI SUBMISSION SUMMARY END-->

<!-- NOTES GENERATOR (PDF/DOC Upload) START-->

    URL: POST http://localhost:5000/api/ai/generate-notes

    Headers:
        Authorization: Bearer TOKEN

    BODY{FORM-DATA}:
    
        file            d:\DOC\AgriTrace.pdf
        instructions    Make short notes with bullet points

    Expected:
    STATUS CODE: 200
    {
        "success":true,
        "data":"# Study Notes on AgriTrace – Digital Traceability and Certification Platform for Agricultural Produce\n\n## 1. Title of Proposed Idea\n**AgriTrace**  \nDigital Traceability and Certification Platform for Agricultural Produce\n\n---\n\n## 2. Problem Definition and Relevance\n### Problem\nIn the agricultural ecosystem, there is a lack of transparency in the supply chain leading to:\n- **Consumer Distrust**: Concerns over the authenticity of organic, fair trade, and high-quality products.\n- **Market Access Issues**: Small-scale farmers are losing access to markets due to insufficient certifications and traceability.\n- **Export Challenges**: Non-compliance or unverifiable produce origins result in export rejections.\n- **Middlemen Dominance**: This reduces fair pricing and profitability for actual producers.\n\n### Relevance\n- Growing global demand for safe, sustainable, and traceable food necessitates digitally verifiable supply chain records.\n- Supports government initiatives towards digital agriculture, farm-to-fork transparency, and sustainable consumption (SDG 12).\n\n---\n\n## 3. Proposed Solution\n**AgriTrace** is a software-only digital platform enabling:\n- **Farmers**: Register harvest batches with key details (location, inputs, harvest dates).\n- **Certification Authorities**: Digitally approve and tag certifications (e.g., organic, FSSAI).\n- **Processors and Distributors**: Log activities such as packaging and transport.\n- **Consumer Transparency**: QR code-based traceability for consumers and regulators to view product journeys.\n- **Admin Tools**: For auditing, analytics, and multi-lingual access.\n\n**Inclusivity**: Designed for online and offline use, ensuring accessibility in remote rural areas.\n\n---\n\n## 4. Unique Features and Newness\n- **Blockchain-inspired Logging**: Immutable event records without costly infrastructure.\n- **Farmer-first Usability**: Minimal input burden with vernacular UI and offline support.\n- **Digital Certification Workflow**: Direct linking of approved certificates with produce batches.\n- **QR-based Consumer Transparency**: Open access for consumers to scan QR codes and view product journeys.\n- **AI-readiness**: Architecture supports future features like fraud detection and yield prediction.\n- **Affordability & Scalability**: Suitable for widespread rural deployment without dependency on high-tech tools.\n\n---\n\n## 5. Competitive Analysis\n| Feature                        | Existing Solutions                        | AgriTrace                               |\n|--------------------------------|------------------------------------------|-----------------------------------------|\n| Blockchain                     | Needed (costly, complex)                 | No                                      |\n| Mobile-first, Offline Support   | Rare                                     | Yes                                     |\n| Farmer-Centric UI/UX          | Moderate                                 | High                                    |\n| QR-based Consumer Traceability  | Limited or gated                         | Open Access                             |\n| Built-in Certification Workflow | Not integrated                           | Fully embedded                          |\n| Multilingual Support           | Limited                                  | Yes (Modular)                          |\n\n---\n\n## 6. Intellectual Property Considerations\n- **Originality**: The idea does not rely on existing intellectual property.\n- **Future Plans**: IP filing proposed for the certificate integration and batch traceability module.\n\n---\n\n## 7. Potential Areas of Application\n- **Organic Farming Cooperatives**\n- **Agricultural Exporters & Processing Units**\n- **Retail & E-commerce Grocery Chains** (interested in transparency)\n- **Farmer Producer Organizations (FPOs)**\n- **Agri-insurance Providers and Traceability Audits**\n- **Certification Agencies** (FSSAI, India Organic, GlobalGAP)\n- **NGOs** working in sustainable agriculture\n- **Agri-Tech Startups**\n- **State Agriculture Departments**\n\n---\n\n## 8. Market Data\n### Market Size (India)\n- Organic food market: ₹12,000+ crore (2024)\n- Export market for fresh produce: ₹45,000+ crore\n- Total agricultural supply chain tech market: Growing at 12-14% CAGR\n\n### Market Growth Rate\n- Traceability demand rising at 20% CAGR globally.\n- Digitization of supply chain expected to reach $12 billion by 2027 in India.\n\n### Profitability\n- High demand from retailers for certified supply chains.\n- Low operational cost due to software-only model.\n\n### Product and Consumer Type\n- B2B SaaS for processors, certifiers, exporters.\n- B2C (QR scan access for consumers).\n- B2G (government traceability programs).\n\n---\n\n## 9. Current Development Status\n- **UI/UX Designs**: Completed (farmer dashboard, certification screen, QR trace viewer).\n- **Backend Architecture**: Drafted with append-only logs.\n- **Prototype**: In progress using React and Node.js.\n- **QR Generation & Traceability Viewer**: Functional alpha developed.\n\n### Expected Completion Time\n- **6 months** for MVP (Minimum Viable Product) with core modules.\n\n---\n\n## 10. Financial Requirements\n| Sl. No. | Description                            | Expected Expenditure (₹) |\n|---------|----------------------------------------|---------------------------|\n| 1       | Cost of purchase of raw materials      | 0 (software-only)         |\n| 2       | Cost of contingencies                  | ₹50,000                   |\n| 3       | Product development cost                | ₹6,00,000                 |\n| 4       | Other expenditure (testing, hosting)   | ₹1,00,000                 |\n| **Total** |                                      | **₹7,50,000**            |\n\n---\n\n## 11. Activity-wise Break-up\n| Particulars/Items                                    | Total Project Cost (Rs. In Lakh) | Amount GOI Assistance (Rs. In Lakh) | Incubatee Share (Rs. In Lakh) |\n|-----------------------------------------------------|----------------------------------|-------------------------------------|--------------------------------|\n| Technology-related Expenditure (Hosting, cloud infra, dev tools, testing, QA) | 6.00                             | 5.00                                | 1.00                           |\n| Charges for mentor/handholding supporting team       | 1.00                             | 1.00                                | 0.00                           |\n| Travelling expenses (farmer interviews, pilot demo)  | 0.50                             | 0.50                                | 0.00                           |\n| **Total Cost**                                       | **7.50**                        | **6.50**                            | **1.00**                      |\n\n--- \n\nThis structured format provides a comprehensive overview of the AgriTrace innovation proposal, highlighting its relevance, solution details, unique features, competitive analysis, market data, and financial requirements."
}

<!-- NOTES GENERATOR (PDF/DOC Upload) END-->

<!-- SUMMARIZE-TEXT START -->

    URL: POST http://localhost:5000/api/ai/summarize-text

    Headers: 
        Authorization: Bearer TOKEN

    BODY{JSON}:
        
    {
        "text": "Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.[38] Python is dynamically type-checked and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented and functional programming.Guido van Rossum began working on Python in the late 1980s as a successor to the ABC programming language. Python 3.0, released in 2008, was a major revision and not completely backward-compatible with earlier versions. Beginning with Python 3.5,[39] capabilities and keywords for typing were added to the language, allowing optional static typing.[40] As of 2026, the Python Software Foundation supports Python 3.10, 3.11, 3.12, 3.13, and 3.14, following the project's annual release cycle and five-year support policy. Python 3.15 is currently in the alpha development phase, and the stable release is expected to come out in October 2026.[41] Earlier versions in the 3.x series have reached end-of-life and no longer receive security updates.Python has gained widespread use in the machine learning community.[42][43][44][45] It is widely taught as an introductory programming language.[46] Since 2003, Python has consistently ranked in the top ten of the most popular programming languages in the TIOBE Programming Community Index, which ranks based on searches in 24 platforms.[47]"
    }

    Expected:
    STATUS CODE: 200
        {
            "success":true,
            "data":"**Summary of Python Programming Language:**\n\n- **Overview**: Python is a high-level, general-purpose programming language known for its emphasis on code readability and significant indentation.\n- **Features**: It is dynamically typed and garbage-collected, supporting various programming paradigms such as structured (procedural), object-oriented, and functional programming.\n- **History**: Developed by Guido van Rossum in the late 1980s as a successor to the ABC language. Python 3.0 was released in 2008, marking a major revision that was not fully backward-compatible.\n- **Typing**: Starting with Python 3.5, optional static typing features were introduced.\n- **Current Support**: As of 2026, the Python Software Foundation supports versions 3.10 to 3.14, adhering to an annual release cycle and a five-year support policy. Python 3.15 is in alpha development, with a stable release anticipated in October 2026.\n- **Usage**: Python is extensively used in the machine learning community and is commonly taught as an introductory programming language. It has consistently ranked in the top ten of the TIOBE Programming Community Index since 2003, which measures popularity based on search queries across various platforms."
        } 
<!-- SUMMARIZE-TEXT END -->

<!-- ANALYZE DIFICULTY START -->

    URL: POST http://localhost:5000/api/ai/analyze-difficulty

    Headers:
        Authorization: Bearer TOKEN
    
    BODY{JSON}:
        {
             "question": "Explain time complexity of quicksort in programming language"
        }
    
    Expected:
    STATUS CODE: 200

    {
        "success":true,
        "data":"It seems like you've mentioned \"undefined,\" which can refer to several different concepts depending on the context (e.g., mathematics, programming, etc.). However, I will analyze the difficulty level of understanding \"undefined\" in common contexts:\n\n### 1. Mathematics (e.g., Division by Zero)\n- **Difficulty Level: Medium**\n- **Explanation**: In mathematics, \"undefined\" often refers to expressions that do not have a meaningful value, such as division by zero. For instance, \\( \\frac{1}{0} \\) is considered undefined because there is no number that can be multiplied by 0 to yield 1. Understanding why this is the case requires a grasp of basic arithmetic and the properties of numbers, which may pose a challenge for some students.\n\n### 2. Programming (e.g., Undefined Variables)\n- **Difficulty Level: Medium**\n- **Explanation**: In programming, \"undefined\" typically indicates a variable that has been declared but has not been assigned a value. Understanding this concept requires knowledge of programming syntax and semantics. It can be tricky for beginners who are still learning how variables function within a programming language.\n\n### 3. Philosophy (e.g., Conceptual Understanding)\n- **Difficulty Level: Hard**\n- **Explanation**: In philosophical discussions, \"undefined\" can refer to concepts or ideas that lack a clear definition or are open to interpretation. Analyzing and debating these concepts requires critical thinking skills and a deep understanding of the subject matter, which can be quite challenging for many students.\n\n### Conclusion\nThe difficulty level of \"undefined\" varies depending on the context in which it is used. Generally, it can be categorized as Medium in mathematics and programming, while it can be considered Hard in philosophical discussions. Understanding the specific context is crucial for accurately assessing the difficulty level. If you have a specific context in mind, please provide more details for a more tailored analysis."
    }
<!-- ANALYZE DIFICULTY END -->

<!-- PLAGIARISM CHECK START-->

    URL: POST http://localhost:5000/api/ai/plagiarism-check

    Headers:
         Authorization: Bearer TOKEN

    BODY{JSON}:
        {
             "text": "Student submission text here..."
        }
    
    Expected:
        STATUS CODE: 200
    {
        "success":true,
        "data":{...}
    }
<!-- PLAGIARISM CHECK END-->

<!-- STUDY PLANNER START -->

    URL: POST http://localhost:5000/api/ai/study-planner

    Headers:
         Authorization: Bearer TOKEN

    BODY{JSON}:
        {
            "subjects": ["DBMS", "OS", "Java"],
            "examDate": "2026-03-10",
            "hoursPerDay": 3    
        }

    Expected:
        STATUS CODE: 200

        {
            "success":true,
            "data":"Here's a structured daily study plan for DBMS (Database Management Systems), OS (Operating Systems), and Java that you can follow until March 10, 2026. This plan assumes you will study each subject on alternating days to keep the material fresh and balanced. You can adjust the hours based on your availability and understanding of each subject.\n\n### Daily Study Plan\n\n**Weekly Structure:**\n- **Monday**: DBMS\n- **Tuesday**: OS\n- **Wednesday**: Java\n- **Thursday**: DBMS\n- **Friday**: OS\n- **Saturday**: Java\n- **Sunday**: Review/Practice\n\n### Subject Breakdown\n\n#### 1. **Database Management Systems (DBMS)**\n- **Topics to Cover**:\n  - Introduction to DBMS\n  - Database Models\n  - SQL Queries\n  - Normalization\n  - Transactions and Concurrency\n  - Indexing and Hashing\n  - NoSQL Databases\n\n#### 2. **Operating Systems (OS)**\n- **Topics to Cover**:\n  - Process Management\n  - Threads and Concurrency\n  - CPU Scheduling\n  - Memory Management\n  - File Systems\n  - I/O Systems\n  - Security and Protection\n\n#### 3. **Java Programming**\n- **Topics to Cover**:\n  - Basics of Java\n  - Object-Oriented Programming (OOP) Concepts\n  - Exception Handling\n  - Collections Framework\n  - Java Streams and I/O\n  - Java GUI Development\n  - Multithreading\n\n### Example Daily Schedule\n\n#### **Daily Study Routine**\n- **Morning Session (2-3 hours)**\n  - Review previous topics\n  - Learn new concepts\n  - Take notes\n\n- **Afternoon Session (2-3 hours)**\n  - Hands-on practice (coding for Java, SQL queries for DBMS, etc.)\n  - Work on exercises or projects\n\n- **Evening Session (1-2 hours)**\n  - Review what you've learned\n  - Prepare for the next day\n\n### Weekly Goals\n- **Week 1-4**: Focus on foundational concepts for each subject.\n- **Week 5-8**: Move to intermediate topics, start mini-projects or assignments.\n- **Week 9-12**: Advanced topics and concepts, enhance hands-on practice.\n\n### Review and Practice\n- Every Sunday, review the topics studied during the week.\n- Take quizzes or practice problems.\n- Work on small projects to reinforce learning.\n\n### Adjustments\n- **If you feel confident**: You can reduce the study time for that subject and increase focus on the next topic.\n- **If struggling**: Spend extra time on difficult topics and consider additional resources (books, videos, etc.).\n\n### Long-Term Planning\n- Aim to complete all foundational topics by December 2025.\n- Use January to February 2026 for in-depth projects or preparation for exams.\n- March 2026 should be reserved for revision and practice exams.\n\n### Conclusion\nThis study plan is flexible; feel free to adjust the hours and focus areas according to your progress and understanding of each subject. Remember to take breaks and ensure a balanced study routine to avoid burnout. Happy studying!"
        }

<!-- STUDY PLANNER END -->

<!-- GENERATE QUIZ START -->

    URL: POST http://localhost:5000/api/ai/generate-quiz

    Headers:
         Authorization: Bearer TOKEN
        
    BODY{JSON}:
        {
            "topic": "DBMS",
            "numberOfQuestions": 5,
            "difficulty": "easy"
        }
    
    Expected:
        STATUS CODE: 200

        {
            "success":true,
            "data":"Here are 5 multiple-choice questions (MCQs) on the topic of Operating Systems, along with their correct answers:\n\n### Question 1:\nWhich of the following is NOT a function of an operating system?\n\nA) Memory management  \nB) Process scheduling  \nC) Data encryption  \nD) Device management  \n\n**Answer:** C) Data encryption\n\n---\n\n### Question 2:\nIn a multi-user operating system, which of the following is a primary responsibility of the OS?\n\nA) Providing internet access  \nB) Managing user accounts and permissions  \nC) Compiling programs  \nD) Displaying graphics  \n\n**Answer:** B) Managing user accounts and permissions\n\n---\n\n### Question 3:\nWhat does the term \"deadlock\" refer to in the context of operating systems?\n\nA) A situation where a process is waiting for a resource that is held by another process  \nB) A method of managing memory allocation  \nC) The process of loading an OS into memory  \nD) A system crash due to hardware failure  \n\n**Answer:** A) A situation where a process is waiting for a resource that is held by another process\n\n---\n\n### Question 4:\nWhich of the following scheduling algorithms can lead to starvation?\n\nA) Round Robin  \nB) First-Come, First-Served  \nC) Shortest Job Next  \nD) Priority Scheduling  \n\n**Answer:** D) Priority Scheduling\n\n---\n\n### Question 5:\nWhat is the purpose of a system call in an operating system?\n\nA) To provide a graphical user interface  \nB) To allow user programs to request services from the OS  \nC) To execute user commands directly  \nD) To manage hardware resources  \n\n**Answer:** B) To allow user programs to request services from the OS\n\n--- \n\nFeel free to use these questions for educational purposes or assessments!"
        }
<!-- GENERATE QUIZ END-->

<!-- TRANSLATE START -->
    
    URL: POST http://localhost:5000/api/ai/translate

    Headers:
         Authorization: Bearer TOKEN

    BODY{JSON}:
       {
            "text": "The statement The C programming is faster than other programming languages can be translated into a more structured and grammatically correct form as follows C programming is faster than other programming languages.If you meant to request something different by using undefined,please clarify so I can assist you accordingly!",
            "targetLanguage": "Tamil"
        }
    
    Expected:
        STATUS CODE: 200
        {
            "success":true,
            "data":"..."
        }
<!-- TRANSLATE END -->

<!-- SEMANTIC SEARCH START -->

    URL : POST http://localhost:5000/api/ai/semantic-search

    Header:
        Authorization: Bearer TOKEN
    
    BODY{JSON}:
        {
            "query": "What is normalization in database?",
            "documents": [
                "Normalization reduces redundancy",
                "Binary trees are data structures"
            ]
        }
    
    Expected:
        STATUS CODE: 200

        {
            "success":true,
            "data":"Normalization in databases is a process used to organize data to minimize redundancy and improve data integrity. It involves dividing a database into smaller, related tables and defining relationships between them. The main goals of normalization are to eliminate duplicate data, ensure data dependencies are properly enforced, and enhance the efficiency of data retrieval.\n\n### Key Concepts of Normalization:\n\n1. **Redundancy Reduction**: By structuring data into multiple related tables, normalization reduces the amount of duplicate information stored in the database.\n\n2. **Functional Dependency**: Normalization relies on the concept of functional dependency, which indicates that a column is dependent on another column. This helps in organizing data logically.\n\n3. **Normal Forms**: There are several levels (normal forms) of normalization, each with specific rules:\n   - **First Normal Form (1NF)**: Ensures that all columns contain atomic, indivisible values and that each entry in a column is unique.\n   - **Second Normal Form (2NF)**: Requires that the database is in 1NF and that all non-key attributes are fully functionally dependent on the primary key.\n   - **Third Normal Form (3NF)**: Requires that the database is in 2NF and that all the attributes are not only dependent on the primary key but also independent of each other.\n   - Higher normal forms (like BCNF and 4NF) address more complex scenarios of redundancy and dependency.\n\n### Benefits of Normalization:\n\n- **Improved Data Integrity**: Reduces the risk of anomalies (insert, update, and delete anomalies) that can occur when data is duplicated.\n- **Efficient Data Management**: Makes it easier to maintain and update data since changes need to be made in fewer places.\n- **Better Query Performance**: By organizing data logically, queries can be more efficient, especially when properly indexed.\n\n### Considerations:\n\nWhile normalization has many advantages, it's important to find a balance. Over-normalization can lead to complex queries and may impact performance negatively. In some cases, denormalization (the process of combining tables) might be employed for performance reasons in read-heavy applications.\n\n### Conclusion:\n\nNormalization is a fundamental concept in database design that helps in creating efficient, reliable, and maintainable databases. Understanding its principles is crucial for database administrators and developers to ensure optimal data management practices."
        }
<!-- SEMANTIC SEARCH END -->