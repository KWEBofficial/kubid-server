import Tag from '../entity/tag.entity';
import TagRepository from '../repository/tag.repository';
import { InternalServerError } from '../util/customErrors';

export default class TagService {
  static async getTagsById(productid: number): Promise<string[] | null> {
    try {
      const tags = await TagRepository.createQueryBuilder('tag')
        .select('tag.tag', 'tag') // tag 테이블에서 'tag'열만 선택합니다.
        .where('tag.product_id = :productId', { productId: productid }) // tag 테이블에서 parameter로 주어진 productid로 필터링 진행
        .getRawMany();

      return tags.map((tag) => tag.tag);
    } catch (error) {
      throw new InternalServerError('태그 정보를 불러오지 못했어요.');
    }
  }
}
