// 예시 type/dto입니다. 필요에 따라 수정하거나 삭제하셔도 됩니다.

export default interface CreateUserDTO {
  email: string;
  nickname: string;
  password: string;
  departmentId: number;
}
