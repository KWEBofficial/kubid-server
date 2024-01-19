import { ImageDTO } from '../image/image.dto';

export interface UpdateUserPasswordDTO {
  password: string;
}
export interface UpdateUserNicknameDTO {
  nickname: string;
}
export interface UpdateUserProfileImageDTO {
  image: ImageDTO;
}
