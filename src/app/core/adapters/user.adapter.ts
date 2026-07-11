import { AppUser } from '../models/app-user.model';
import { PublicUser } from '../models/public-user.model';

export function mapPublicUserToAppUser(user: PublicUser): AppUser {
  return {
    id: user.id,
    fullName: user.name,
    email: user.email,
    phone: user.phone,
    role: user.id === 1 ? 'ADMIN' : 'USER',
  };
}

export function mapPublicUsersToAppUsers(users: PublicUser[]): AppUser[] {
  return users.map((user) => mapPublicUserToAppUser(user));
}
