export interface AppUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'USER';
}
