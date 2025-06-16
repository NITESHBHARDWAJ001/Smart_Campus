// Mock API service for development and testing
const mockAPI = {
  // Auth Service
  login: async (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: '123',
              name: 'Test User',
              email: credentials.email,
              role: credentials.email.includes('teacher') ? 'teacher' : 
                    credentials.email.includes('admin') ? 'admin' : 'student'
            },
            token: 'mock-jwt-token'
          }
        });
      }, 800);
    });
  },
  
  // Placement Service
  getPlacements: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              _id: 'p1',
              title: 'Software Engineer Intern',
              company: 'Tech Innovations Inc.',
              description: 'Looking for a talented software engineer intern to join our team.',
              location: 'San Francisco, CA',
              type: 'Internship',
              salary: '$25/hour',
              requirements: 'Knowledge of JavaScript, React, and Node.js',
              deadline: '2023-12-15',
              active: true,
              createdAt: '2023-10-01',
              createdBy: {
                _id: 'admin1',
                name: 'Admin User'
              }
            },
            {
              _id: 'p2',
              title: 'Full Stack Developer',
              company: 'Global Solutions Ltd.',
              description: 'Join our team to work on exciting projects.',
              location: 'Remote',
              type: 'Full-time',
              salary: '$80,000-$100,000/year',
              requirements: '2+ years experience with full stack development',
              deadline: '2024-01-15',
              active: true,
              createdAt: '2023-10-05',
              createdBy: {
                _id: 'admin1',
                name: 'Admin User'
              }
            },
            {
              _id: 'p3',
              title: 'Data Analyst',
              company: 'Data Insights Corp.',
              description: 'Help us make sense of data and provide valuable insights.',
              location: 'New York, NY',
              type: 'Full-time',
              salary: '$70,000-$85,000/year',
              requirements: 'Experience with SQL, Python, and data visualization tools',
              deadline: '2023-11-30',
              active: false,
              createdAt: '2023-09-15',
              createdBy: {
                _id: 'admin1',
                name: 'Admin User'
              }
            }
          ]
        });
      }, 600);
    });
  },
  
  getPlacement: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: id,
            title: 'Software Engineer Intern',
            company: 'Tech Innovations Inc.',
            description: 'Looking for a talented software engineer intern to join our team.\nYou will be working on real-world projects and gaining valuable experience.',
            location: 'San Francisco, CA',
            type: 'Internship',
            salary: '$25/hour',
            requirements: '- Knowledge of JavaScript, React, and Node.js\n- Strong problem-solving skills\n- Good communication skills\n- Currently enrolled in a computer science or related program',
            deadline: '2023-12-15',
            active: true,
            createdAt: '2023-10-01',
            createdBy: {
              _id: 'admin1',
              name: 'Admin User'
            },
            hasApplied: false
          }
        });
      }, 400);
    });
  },
  
  createPlacement: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: 'new-placement-id',
            ...data,
            createdAt: new Date().toISOString(),
            active: true,
            createdBy: {
              _id: 'admin1',
              name: 'Admin User'
            }
          }
        });
      }, 800);
    });
  },
  
  updatePlacement: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: id,
            ...data,
            createdAt: '2023-10-01',
            active: true,
            createdBy: {
              _id: 'admin1',
              name: 'Admin User'
            }
          }
        });
      }, 800);
    });
  },
  
  deletePlacement: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {}
        });
      }, 600);
    });
  },
  
  togglePlacementActive: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: id,
            active: true // This would toggle in a real API
          }
        });
      }, 400);
    });
  },
  
  getPlacementApplications: async (placementId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              _id: 'app1',
              placementId: placementId,
              studentId: {
                _id: 'student1',
                name: 'John Doe',
                email: 'john@example.com',
                rollNumber: 'CS2021001',
                department: 'Computer Science'
              },
              status: 'Applied',
              coverLetter: 'I am excited to apply for this position...',
              resumeLink: 'https://example.com/resume.pdf',
              applicationDate: '2023-10-10T10:00:00Z'
            },
            {
              _id: 'app2',
              placementId: placementId,
              studentId: {
                _id: 'student2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                rollNumber: 'CS2021002',
                department: 'Computer Science'
              },
              status: 'Under Review',
              coverLetter: 'Please consider my application for this role...',
              resumeLink: 'https://example.com/jane-resume.pdf',
              applicationDate: '2023-10-09T14:30:00Z'
            }
          ]
        });
      }, 600);
    });
  },
  
  getMyApplications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              _id: 'app1',
              placementId: {
                _id: 'p1',
                title: 'Software Engineer Intern',
                company: 'Tech Innovations Inc.',
                location: 'San Francisco, CA',
                type: 'Internship',
                deadline: '2023-12-15',
                active: true
              },
              status: 'Applied',
              applicationDate: '2023-10-10T10:00:00Z'
            },
            {
              _id: 'app3',
              placementId: {
                _id: 'p2',
                title: 'Full Stack Developer',
                company: 'Global Solutions Ltd.',
                location: 'Remote',
                type: 'Full-time',
                deadline: '2024-01-15',
                active: true
              },
              status: 'Under Review',
              applicationDate: '2023-10-07T09:15:00Z'
            }
          ]
        });
      }, 600);
    });
  },
  
  applyForPlacement: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: 'new-application-id',
            placementId: data.placementId,
            status: 'Applied',
            coverLetter: data.coverLetter,
            resumeLink: data.resumeLink,
            applicationDate: new Date().toISOString()
          }
        });
      }, 800);
    });
  },
  
  updateApplicationStatus: async (id, { status }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: id,
            status: status,
            updatedAt: new Date().toISOString()
          }
        });
      }, 600);
    });
  },
  
  deleteApplication: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {}
        });
      }, 500);
    });
  },
  
  // Admin API Methods
  getUsers: async (page = 1, limit = 10, filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = [
          {
            _id: 'u1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            department: 'IT',
            createdAt: '2023-01-15T10:00:00Z'
          },
          {
            _id: 'u2',
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'teacher',
            department: 'Computer Science',
            createdAt: '2023-02-20T10:00:00Z'
          },
          {
            _id: 'u3',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            role: 'student',
            rollNumber: 'CS2021001',
            department: 'Computer Science',
            createdAt: '2023-03-10T10:00:00Z'
          },
          {
            _id: 'u4',
            name: 'Robert Johnson',
            email: 'robert@example.com',
            role: 'student',
            rollNumber: 'EE2021002',
            department: 'Electrical Engineering',
            createdAt: '2023-03-15T10:00:00Z'
          },
          {
            _id: 'u5',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            role: 'teacher',
            department: 'Mathematics',
            createdAt: '2023-02-25T10:00:00Z'
          }
        ];
        
        // Filter by role if provided
        let filteredUsers = users;
        if (filters.role) {
          filteredUsers = users.filter(user => user.role === filters.role);
        }
        
        // Filter by search term if provided
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchLower) || 
            user.email.toLowerCase().includes(searchLower)
          );
        }
        
        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / limit);
        
        // Paginate results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        resolve({
          success: true,
          data: paginatedUsers,
          count: paginatedUsers.length,
          total,
          totalPages,
          currentPage: page
        });
      }, 600);
    });
  },
  
  getUserById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: id,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            role: 'student',
            rollNumber: 'CS2021001',
            department: 'Computer Science',
            year: 3,
            contactNumber: '+1234567890',
            createdAt: '2023-03-10T10:00:00Z'
          }
        });
      }, 400);
    });
  },
  
  deleteUser: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {}
        });
      }, 500);
    });
  },
  
  getAdminPlacements: async (page = 1, limit = 10, filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const placements = [
          {
            _id: 'p1',
            title: 'Software Engineer Intern',
            company: 'Tech Innovations Inc.',
            description: 'Looking for a talented software engineer intern.',
            location: 'San Francisco, CA',
            type: 'Internship',
            salary: '$25/hour',
            deadline: '2023-12-15',
            active: true,
            createdAt: '2023-10-01',
            createdBy: {
              _id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com'
            },
            applications: 5,
            selected: 2
          },
          {
            _id: 'p2',
            title: 'Full Stack Developer',
            company: 'Global Solutions Ltd.',
            description: 'Join our team to work on exciting projects.',
            location: 'Remote',
            type: 'Full-time',
            salary: '$80,000-$100,000/year',
            deadline: '2024-01-15',
            active: true,
            createdAt: '2023-10-05',
            createdBy: {
              _id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com'
            },
            applications: 8,
            selected: 0
          },
          {
            _id: 'p3',
            title: 'Data Analyst',
            company: 'Data Insights Corp.',
            description: 'Help us make sense of data and provide valuable insights.',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$70,000-$85,000/year',
            deadline: '2023-11-30',
            active: false,
            createdAt: '2023-09-15',
            createdBy: {
              _id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com'
            },
            applications: 3,
            selected: 1
          },
          {
            _id: 'p4',
            title: 'UI/UX Designer',
            company: 'Creative Design Studio',
            description: 'Design user interfaces for web and mobile applications.',
            location: 'Chicago, IL',
            type: 'Full-time',
            salary: '$75,000-$90,000/year',
            deadline: '2023-12-20',
            active: true,
            createdAt: '2023-10-10',
            createdBy: {
              _id: 'admin2',
              name: 'Another Admin',
              email: 'admin2@example.com'
            },
            applications: 6,
            selected: 1
          }
        ];
        
        // Filter by active status if provided
        let filteredPlacements = placements;
        if (filters.active !== undefined) {
          const activeValue = filters.active === 'true';
          filteredPlacements = placements.filter(placement => placement.active === activeValue);
        }
        
        // Filter by search term if provided
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPlacements = filteredPlacements.filter(placement => 
            placement.title.toLowerCase().includes(searchLower) || 
            placement.company.toLowerCase().includes(searchLower)
          );
        }
        
        const total = filteredPlacements.length;
        const totalPages = Math.ceil(total / limit);
        
        // Paginate results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPlacements = filteredPlacements.slice(startIndex, endIndex);
        
        resolve({
          success: true,
          data: paginatedPlacements,
          count: paginatedPlacements.length,
          total,
          totalPages,
          currentPage: page
        });
      }, 600);
    });
  },
  
  getAdminStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            users: {
              total: 120,
              students: 100,
              teachers: 15,
              admins: 5
            },
            placements: {
              total: 25,
              active: 18,
              inactive: 7
            },
            applications: {
              total: 350,
              pending: 180,
              selected: 75
            }
          }
        });
      }, 400);
    });
  },

  createPlacement: async (placementData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            _id: 'new-placement-' + Date.now(),
            ...placementData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            applications: 0,
            selected: 0
          }
        });
      }, 500);
    });
  }
};

export default mockAPI;