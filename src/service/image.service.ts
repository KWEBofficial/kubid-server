import ImageRepository from '../repository/image.repository';
import { InternalServerError } from '../util/customErrors';

export default class ImageService {
  static async prepareUploadImage(): Promise<number> {
    try {
      const image = ImageRepository.create();
      await ImageRepository.save(image);

      return image.id;
    } catch (error) {
      throw new InternalServerError('이미지를 준비하는데 실패했습니다.');
    }
  }

  static async uploadImage(id: number, fileName: string): Promise<void> {
    try {
      await ImageRepository.update(
        { id },
        { url: `http://localhost:3000/${fileName}` },
      );
    } catch (error) {
      throw new InternalServerError('이미지를 업로드하는데 실패했습니다.');
    }
  }
}
