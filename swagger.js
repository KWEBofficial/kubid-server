const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '', // by default: '1.0.0'
    title: 'KUBID API', // by default: 'REST API'
    description: 'KUBID API description', // by default: ''
  },
  servers: [
    {
      url: 'http://localhost:3000', //by default: 'http://localhost:3000'
      description: '', // by default: ''
    },
    // { ... }
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
        $email: 'sagjin0000@korea.ac.kr',
        $nickname: 'mobius',
        $password: 'test1234',
        $departmentId: 1,
      },
      CreateUserResDTO: {
        $id: 1,
        $email: 'sagjin0000@korea.ac.kr',
        $nickname: 'mobius',
        $departmentId: 1,
        $createdAt: '2024-01-04T00:00:00.000Z',
      },
      LoginReqDTO: {
        $email: 'sagjin0000@korea.ac.kr',
        $password: 'test1234',
      },
      LoginResDTO: {
        $accessToken: 'asfni1nienw1flni.1nfi12nfi1lwfni1.lasdnlfni1lf',
      },
      CurrentUserResDTO: {
        $id: 1,
        $email: 'sagjin0000@korea.ac.kr',
        $nickname: 'mobius',
        $departmentId: 1,
        $createdAt: '2024-01-04T00:00:00.000Z',
      },
      CurrentUserUpdateReqDTO: {
        $nickname: 'mobius',
        $password: 'test1234',
      },
      CurrentUserUpdateResDTO: {
        $id: 1,
        $email: 'sagjin0000@korea.ac.kr',
        $nickname: 'mobius',
        $departmentId: 1,
        $createdAt: '2024-01-04T00:00:00.000Z',
      },
      CurrentProductSellResDTO: {
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
    },
  }, // by default: empty object
};

const outputFile = './swagger-output.json';
const routes = ['./src/controller/router.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
