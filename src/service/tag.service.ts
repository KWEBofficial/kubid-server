import ProductRepository from '../repository/product.repository';
import Tag from '../entity/tag.entity';
import TagRepository from '../repository/tag.repository';
import { InternalServerError, NotFoundError } from '../util/customErrors';

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
  static async createTag(
    productid: number,
    tags: string[],
  ): Promise<string | null> {
    try {
      // 제품을 찾아옵니다.
      const product = await ProductRepository.findOne({
        where: { id: productid },
        relations: ['tag'],
      });

      if (!product) {
        throw new NotFoundError('제품을 찾을 수 없습니다.');
      }

      // 여러 개의 태그를 반복하여 생성하고 저장합니다.
      const createdTags: Tag[] = [];
      for (const tagText of tags) {
        const newTag = new Tag();
        newTag.tag = tagText;
        newTag.product = product; // 제품과 연결

        // 데이터베이스에 새로운 태그 레코드를 추가
        const savedTag = await TagRepository.save(newTag);
        createdTags.push(savedTag);
      }

      return '태그가 생성되었습니다.';
    } catch (error) {
      throw new InternalServerError('태그 정보를 불러오지 못했어요.');
    }
  }
}
