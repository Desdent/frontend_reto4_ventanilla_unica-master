import { UpdatePasswordRequestStructure } from '../../interfaces/user/update-password-rquest-structure.interface';

export class UpdatePasswordRequestDto {
  password: string;

  constructor(data: UpdatePasswordRequestStructure) {
    this.password = data.password;
  }
}
