export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "teacher" | "student";
  emailVerified: boolean;
  createdAt: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  totalSubjects?: number;
}

export interface Subject {
  id: number;
  departmentId: number;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  totalClasses?: number;
}

export interface Class {
  id: number;
  subjectId: number;
  teacherId: string;
  inviteCode: string;
  name: string;
  bannerCldPubId?: string;
  bannerUrl?: string;
  capacity: number;
  description?: string;
  status: "active" | "inactive" | "archived";
  schedules: Schedule[];
  createdAt: string;
  updatedAt: string;
  subject?: Subject;
  teacher?: User;
  totalEnrollments?: number;
}

export interface Enrollment {
  id: number;
  studentId: string;
  classId: number;
  createdAt: string;
  updatedAt: string;
  student?: User;
  class?: Class;
}

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}
