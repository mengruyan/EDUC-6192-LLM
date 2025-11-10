import { User, UserRole } from '../types';

// Note: Passwords are in plaintext for this simulation.
// In a real application, never store passwords this way.
export const DEFAULT_USERS: User[] = [
  {
    id: 'teacher-1',
    name: 'Ms. Wang (王老师)',
    email: 'teacher@school.edu',
    password: 'password123',
    role: UserRole.Teacher,
  },
  {
    id: 'student-li-wei', // This ID matches the original hardcoded student
    name: 'Li Wei (李伟)',   // This name matches the original hardcoded student
    email: 'li.wei@school.edu',
    password: 'password123',
    role: UserRole.Student,
  },
];