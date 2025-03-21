export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  userType: UserType;
  createdAt: string;
}

export interface PartialUserResponse {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  createdAt: string;
}

export enum UserType {
  Student = 'student',
  Teacher = 'teacher',
  Parent = 'parent',
  PrivateTutor = 'private tutor',
}