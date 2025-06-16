db.courses.insertMany([
  {
    name: "Introduction to Computer Science",
    description: "This course provides a comprehensive introduction to computer science, covering basic programming concepts, algorithms, and data structures.",
    teacherId: "CS101", // Replace with actual teacherId from your database
    teacher: ObjectId("teacherObjectId"), // Replace with actual teacher ObjectId
    students: [], // Will be populated as students enroll
    studentsRollNumbers: [], // Will be populated as students enroll
    createdAt: new Date()
  },
  {
    name: "Database Management Systems",
    description: "Learn about database design, normalization, SQL, and database management systems. Includes practical sessions on creating and querying databases.",
    teacherId: "CS101", // Replace with actual teacherId from your database
    teacher: ObjectId("teacherObjectId"), // Replace with actual teacher ObjectId
    students: [], // Will be populated as students enroll
    studentsRollNumbers: [], // Will be populated as students enroll
    createdAt: new Date()
  },
  {
    name: "Web Development Fundamentals",
    description: "Introduction to web development technologies including HTML, CSS, JavaScript, and various frameworks for building modern web applications.",
    teacherId: "CS102", // Replace with actual teacherId from your database
    teacher: ObjectId("anotherTeacherObjectId"), // Replace with actual teacher ObjectId
    students: [], // Will be populated as students enroll
    studentsRollNumbers: [], // Will be populated as students enroll
    createdAt: new Date()
  }
]);