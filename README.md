# Express-TS-TypeORM Server Boilerplate

This is a boilerplate for creating a server with express, typescript and typeorm. It is configured to work with mysql/mariadb. I have also added eslint and prettier settings for code formatting. You can use this boilerplate to create a server for your project.

I have created a user entity and 3 API endpoints about user entity. These 3 APIs have no functional purpose. The purpose of these APIs is only to show how to create an API and how to use typeorm, express and typescript together.

Additionally, I have added a middleware to handle errors and custom errors in `src/util` directory. You can use this middleware to handle errors in your project. You can also remove this middleware if you want.

# Project Setup

## Database

Default DBMS is mysql/mariadb. Install mysql/mariadb and create database with the name you want. If you want to use another DBMS, you can change the `dataSource.ts` file in the `src/config` directory.

## Environment Variable

If you are in development mode, create a `.env.dev` file in the root directory of the project and add the following variables:

```
CLIENT_URL=http://localhost:4000

PORT=3000 # port on which the server will listen

DB_HOST=localhost # host(ip) of the database
DB_PORT=3306 # port of the database
DB_USER=root # username of the database
DB_PASSWORD=pwd # password of the database
DB_NAME=kubid # name of the database, which you created in the previous step
```

If you are in production mode, create a `.env.prod` file in the root directory of the project and add the above configuration variables with the appropriate values.

## Execution

Execute the following commands in the root directory of the project to run the server according to the mode you want.

### Development Mode

```bash
npm install
npm run dev
```

### Production Mode

```bash
npm install
npm run build
npm run prod
```

---

# KWEB 브랜치 전략/커밋 컨벤션 가이드라인

## 브랜치 전략

### 작업 순서

- 평소
  1. `develop`에서 `feature/~` 브랜치 생성 후 작업
  2. 로컬 테스트 후 이상 없을 시 `develop`으로 PR
  3. 상호 코드 리뷰
  4. `Approve`시 `develop`에 merge
  5. 어느 정도 커밋이 쌓이면 `develop`에서 `release/<version>` 브랜치 생성
  6. QA 진행, 수정사항 발생 시 해당 release 브랜치에서 작업 후 commit
  7. 모든 테스트 완료 후 `main`으로 merge 및 배포
- 긴급 수정(hotfix)
  1. 관리자에게 연락
  2. `main`에서 `hotfix`브랜치 생성 후 작업
  3. 로컬 테스트 후 `main` 으로 PR
  4. 관리자 확인 후 `merge`

### Git 사용하기

- Branch Usage
  - Repository name should be like following format
    - `feature/<issue_number>`
    - `feature/<feature_name>`
    - `release/<version_number>`
    - `hotfix/<issue_number>`
- Commit Message
  - Commit with the smallest change unit
  - Use category in commit messages
    - `int`: only for initial commit
    - `doc`: changes document or comment
    - `ftr`: add new feature
    - `mod`: modify existing feature
    - `fix`: fix an error or issue
    - `rfc`: refactor code
    - `add`: add new file or directory
    - `rmv`: remove existing file or directory
  - Example
    - `int: initial commit`
