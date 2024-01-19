import ProductRepository from '../repository/product.repository';
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
      throw new InternalServerError('태그 정보를 불러오지 못했어요');
    }
  }
  static async createTag(
    productid: number,
    tags: string[],
  ): Promise<string | null> {
    try {
      // 제품을 찾아옴
      const product = await ProductRepository.findOne({
        where: { id: productid },
      });
      if (!product) {
        throw new InternalServerError('제품을 찾을 수 없습니다');
      }

      const existingTags = await TagRepository.find({
        where: {
          product: {
            id: productid,
          },
        },
      });

      if (existingTags && existingTags.length > 0) {
        throw new InternalServerError('이미 태그가 지정되어 있습니다');
      }

      // 태그가 3개 이상인 경우 오류 발생
      if (tags.length > 3) {
        throw new InternalServerError('태그는 최대 3개까지 지정할 수 있습니다');
      }

      // 여러 개의 태그를 생성하고 저장합니다.
      const newTags: Tag[] = tags.map((tagText) => {
        const newTag = new Tag();
        newTag.tag = tagText;
        newTag.product = product; // 제품과 연결
        return newTag;
      });

      // 데이터베이스에 새로운 태그 레코드를 한 번에 추가
      await TagRepository.save(newTags);

      return '태그가 생성되었습니다';
    } catch (error) {
      throw new InternalServerError('태그 생성에 실패했습니다');
    }
  }
  static async deleteTag(tagId: number): Promise<string | null> {
    try {
      // 태그를 삭제하기 전에 존재하는지 확인
      const tagToDelete = await TagRepository.findOne({
        where: { id: tagId },
      });

      if (!tagToDelete) {
        throw new InternalServerError('삭제할 태그를 찾을 수 없습니다');
      }

      // 태그를 삭제
      await TagRepository.delete(tagId);

      return '태그가 삭제되었습니다';
    } catch (error) {
      throw new InternalServerError('태그 삭제에 실패했습니다');
    }
  }
}
