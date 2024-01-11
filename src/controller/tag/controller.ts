import { RequestHandler } from 'express';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../util/customErrors';
import productService from '../../service/product.service';
import TagService from '../../service/tag.service';
import UserService from '../../service/user.service';
import CreateTagDTO from '../../type/tag/CreateTagDTO';
//import DeleteTagDTO from '../../type/tag/DeleteTagDTO';

export const createTag: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId; // 인증된 사용자 ID 가져오기
    //CreateTagDTO 형식으로 필터링 된 value를 가져온다
    const { productId, tag: tags } = req.body as CreateTagDTO;

    // 인증된 사용자만 태그 생성을 허용
    if (!userId)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    // 로그인한 사용자와 글을 작성한 사용자가 같은지 확인
    const user = await UserService.getUserByProductId(productId);
    if (!user)
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    if (user.id !== userId)
      throw new BadRequestError('판매자만 태그를 생성할 수 있어요.');

    const product = await productService.getProductByProductId(productId);
    if (!product) {
      throw new NotFoundError('제품을 찾을 수 없습니다.');
    }

    // 태그 생성 요청을 서비스로 전달
    const createdTag = await TagService.createTag(productId, tags);

    res.status(201).json(createdTag);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
/*
export const deleteTag: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId; // 사용자 정보는 미들웨어에서 설정되어야 합니다.
    const { tagId } = req.params as DeleteTagDTO;

    // 인증된 사용자만 태그 삭제를 허용
    if (!userId) {
      throw new InternalServerError(
        '일시적인 오류가 발생했어요. 다시 시도해주세요.',
      );
    }

    // 태그 삭제 요청을 서비스로 전달
    await TagService.deleteTag(tagId, userId);

    res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
*/
