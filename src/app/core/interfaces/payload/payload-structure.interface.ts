import { Roles } from '../../enums/role.enum';

export interface Payload {
  userId: string;
  userName: string;
  role: Roles;
  companyId?: string;
}
