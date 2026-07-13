import { AppUser } from '../models/app-user.model';

export function mapJHipsterUserToAppUser(u: {
  id: number;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  authorities: string[];
}): AppUser {
  const roleAuthority = u.authorities.find((authority) => authority === 'ROLE_ADMIN') ?? u.authorities[0];

  return {
    id: u.id,
    fullName: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.login,
    email: u.email ?? '',
    role: roleAuthority?.replace('ROLE_', '') ?? '',
  };
}
