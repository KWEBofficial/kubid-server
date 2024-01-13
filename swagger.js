const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '1.0.0', // by default: '1.0.0'
    title: 'KUBID API',
    description: 'KUBID API description',
  },
  servers: [
    {
      url: 'http://localhost:3000', //by default: 'http://localhost:3000'
      description: '',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authorization endpoints',
    },
    {
      name: 'User',
      description: 'User endpoints',
    },
    {
      name: 'Product',
      description: 'Product endpoints',
    },
    {
      name: 'Bidding',
      description: 'Bidding endpoints',
    },
    {
      name: 'Tag',
      description: 'Tag endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      CreateUserReqDTO: {
        $email: 'rinothehero@korea.ac.kr',
        $nickname: 'superrino',
        $password: 'test1234',
        $departmentId: 49,
      },
      CreateUserResDTO: {
        $id: 1,
        $email: 'rinothehero@korea.ac.kr',
        $nickname: 'superrino',
        $departmentId: 49,
        $createdAt: '2024-01-04T00:00:00.000Z',
      },
      LoginReqDTO: {
        $email: 'rinothehero@korea.ac.kr',
        $password: 'test1234',
      },
      LoginResDTO: {
        $accessToken: 'asfni1nienw1flni.1nfi12nfi1lwfni1.lasdnlfni1lf',
      },
      CurrentUserResDTO: {
        $id: 1,
        $email: 'rinothehero@korea.ac.kr',
        $nickname: 'superrino',
        $departmentId: {
          $id: 49,
          $departmentName: '컴퓨터학과',
        },
        $createdAt: '2024-01-04T00:00:00.000Z',
      },
      CurrentUserUpdateReqDTO: {
        $nickname: 'superrino',
        $password: 'test1234',
      },
      CurrentUserUpdateResDTO: {
        $id: 1,
        $email: 'rinothehero@korea.ac.kr',
        $nickname: 'mobius',
        $departmentId: 49,
        $createdAt: '2024-01-04T00:00:00.000Z',
      },
      CurrentProductSellResDTO: {
        $id: 1,
        $productName: '[급처] 판매 중',
        $userId: 1,
        $status: 'progress',
        $currentHighestPrice: 5000,
        $upperBound: 10000,
        $imageId: 1,
        $departmentId: 1,
        $createdAt: '2024-01-04T00:00:00.000Z',
        $updatedAt: '2024-01-04T00:00:00.000Z',
      },
      CurrentProductBuyResDTO: [
        {
          $id: 1,
          $product_name: '전공책 팝니다',
          $user_id: 1,
          $status: 'progress',
          $user_highest_price: 35000,
          $upper_bound: 50000,
          $image_id: 1,
          $department_id: 1,
          $created_at: '2024-01-10T07:10:11.684Z',
          $updated_at: '2024-01-10T07:10:11.684Z',
          $current_highest_price: 40000,
        },
      ],
      ProductsProductsIDResDTO: {
        $id: 1,
        $product_name: '[급처] 판매 중',
        $user_id: 1,
        $status: 'progress',
        $lower_bound: 5000,
        $upper_bound: 10000,
        $image_id: 1,
        $department_id: 1,
        $created_at: '2024-01-04T00:00:00.000Z',
        $updated_at: '2024-01-04T00:00:00.000Z',
      },
      ProductReqDTO: {
        $search: '전공책',
      },
      ProductResDTO: [
        {
          $id: 1,
          $product_name: '[급처] 판매 중',
          $user_id: 1,
          $status: 'progress',
          $lower_bound: 5000,
          $upper_bound: 10000,
          $image: {
            $id: 1,
            $image_url: 'http://localhost:3000/1',
          },
          $department_id: 1,
          $created_at: '2024-01-04T00:00:00.000Z',
          $updated_at: '2024-01-04T00:00:00.000Z',
        },
      ],
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['./src/controller/router.ts'];

swaggerAutogen(outputFile, routes, doc);
