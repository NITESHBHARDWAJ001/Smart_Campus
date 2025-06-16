/**
 * Course API Test Cases
 * 
 * These tests verify the functionality of the course management API.
 * To run these tests, you can use a tool like Postman or curl.
 */

// 1. Create Course (Teacher)
// POST http://localhost:5000/api/courses
// Headers: Authorization: Bearer {teacher-token}
// Body:
/*
{
  "name": "Test Course",
  "description": "This is a test course created for API testing."
}
*/
// Expected: 201 Created with course data

// 2. Get All Courses (Teacher)
// GET http://localhost:5000/api/courses
// Headers: Authorization: Bearer {teacher-token}
// Expected: 200 OK with array of courses created by this teacher

// 3. Get All Courses (Student)
// GET http://localhost:5000/api/courses
// Headers: Authorization: Bearer {student-token}
// Expected: 200 OK with array of courses the student is enrolled in

// 4. Get Single Course
// GET http://localhost:5000/api/courses/{courseId}
// Headers: Authorization: Bearer {token}
// Expected: 200 OK with course data if the user is the teacher or an enrolled student

// 5. Update Course (Teacher)
// PUT http://localhost:5000/api/courses/{courseId}
// Headers: Authorization: Bearer {teacher-token}
// Body:
/*
{
  "name": "Updated Course Name",
  "description": "This description has been updated."
}
*/
// Expected: 200 OK with updated course data

// 6. Add Student to Course (Teacher)
// POST http://localhost:5000/api/courses/{courseId}/students
// Headers: Authorization: Bearer {teacher-token}
// Body:
/*
{
  "rollNumber": "S12345"
}
*/
// Expected: 200 OK with updated course data including the new student

// 7. Remove Student from Course (Teacher)
// DELETE http://localhost:5000/api/courses/{courseId}/students/{studentId}
// Headers: Authorization: Bearer {teacher-token}
// Expected: 200 OK with updated course data without the removed student

// 8. Delete Course (Teacher)
// DELETE http://localhost:5000/api/courses/{courseId}
// Headers: Authorization: Bearer {teacher-token}
// Expected: 200 OK with empty data object

// 9. Error Case: Creating Course with Missing Fields
// POST http://localhost:5000/api/courses
// Headers: Authorization: Bearer {teacher-token}
// Body:
/*
{
  "name": "Incomplete Course"
  // Missing description
}
*/
// Expected: 400 Bad Request

// 10. Error Case: Unauthorized Course Creation (Student)
// POST http://localhost:5000/api/courses
// Headers: Authorization: Bearer {student-token}
// Body:
/*
{
  "name": "Student Course",
  "description": "This should fail"
}
*/
// Expected: 403 Forbidden