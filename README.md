<p align="center">
<img src="https://capsule-render.vercel.app/api?&type=waving&color=2c1aa3&height=180&section=header&text=Main Project%20Tesla&fontSize=50&animation=fadeIn&fontAlignY=45&fontColor=FFFFFF">
  </p>

# 🏎 TESLA 모의어플 백엔드

MySQL과 Nestjs를 이용해 구성했습니다.
Tesla 홈페이지를 참고하며 만들었습니다.
없는 기능이 들어가 있기도 합니다.
모델 정보 검색이 가능합니다

---

## 📑 목차

- [🏎 TESLA 모의어플 백엔드](#-tesla-모의어플-백엔드)
  - [📑 목차](#-목차)
  - [🚀 프로젝트 실행 및 테스트](#-프로젝트-실행-및-테스트)
  - [🕹 서버,DB 설계](#-서버db-설계)
  - [💻 기술 스택](#-기술-스택)
  - [💾 ERD 설계](#-erd-설계)
  - [🛠 파이프 라인](#-파이프-라인)
    - [모델정보 검색 파이프라인](#모델정보-검색-파이프라인)
  - [🗂 폴더 구조](#-폴더-구조)
  - [🔒 ENV](#-env)

---

## 🚀 프로젝트 실행 및 테스트

- local에서 테스트 💡

- 실행 명령어

```
git clone https://github.com/leokim1178/camp-main-project
cd main-project/backend
# .env 추가
docker compose build
docker compose up
```

- graphql에서 테스트하기
  - http://localhost:3000/graphql

---

## 🕹 서버,DB 설계

- Server FrameWork : Nest.js & Graphql
- Build :
  - Code-first build
  - Graphql build : module - resolver - service (소셜 로그인과 health-checking용 controller는 존재)
- DB : Mysql (RDBMS)
- ORM : TypeORM

---

## 💻 기술 스택

<div align="center">
📑&nbsp&nbsp&nbsp구성 언어
<br>
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
  <img src="https://img.shields.io/badge/typescript-02569B?style=for-the-badge&logo=typescript&logoColor=white"> 
  </div>

<div align="center">
  🚂  &nbsp&nbsp 서버
  <br>
  <img src="https://img.shields.io/badge/nestjs-D33A3F?style=for-the-badge&logo=nestjs&logoColor=white">
  <img src="https://img.shields.io/badge/docker-3c90e5?style=for-the-badge&logo=docker&logoColor=white"> 
  <img src="https://img.shields.io/badge/graphql-C74199?style=for-the-badge&logo=graphql&logoColor=white">
  </div>

   <div align="center">
🚀&nbsp&nbsp&nbsp 배포
<br>
  <img src="https://img.shields.io/badge/kubernetes-396EDC?style=for-the-badge&logo=kubernetes&logoColor=white">
    <img src="https://img.shields.io/badge/gcp-d44a33?style=for-the-badge&logo=googlecloud&logoColor=yellow"> 
  <img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> 
  </div>

 <div align="center">
💾&nbsp&nbsp&nbsp 데이터
<br>
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/redis-c03b28?style=for-the-badge&logo=redis&logoColor=white"> 
  </div>

 <div align="center">
🔍&nbsp&nbsp&nbsp 검색
<br>
  <img src="https://img.shields.io/badge/elasticsearch-59b2a7?style=for-the-badge&logo=elasticsearch&logoColor=hotpink"> 
  <img src="https://img.shields.io/badge/logstash-e8b631?style=for-the-badge&logo=logstash&logoColor=black"> 
  <img src="https://img.shields.io/badge/kibana-d34e7f?style=for-the-badge&logo=kibana&logoColor=lightgreen">
<br>
</div>

---

## 💾 ERD 설계

![](/readme-imgs/main-project-erd.png)

```
🚛 Car
 └─ 🚙 CarType : 커스타미징 대분류( ex. model3,modelS...)
     │
     └─ 🚗 CarModel : 커스터마이징 중분류   <──> CarTag
     ( ex. model3LongRange,modelSPlaid)
        │
        └─ 🏎 CarCustom : 커스터마이징 소분류
   ┌──────( ex. model3LongRange(color: red,interior:black...)
   │        └─ CarWheel : 커스터마이징 소분류(휠 커스텀)
   │
💰 Payment
   │
   │
👩🏻‍💻 User
```

## 🛠 파이프 라인

### [모델정보 검색 파이프라인](/readme-imgs/검색%20파이프라인.001.jpeg)

---

## 🗂 폴더 구조

```
🏠 main-project
├─ 🐳 cloudbuild.yaml : CI/CD를 위한 github - gcp cloudbuild 연결 yaml
└─ main-project-for-deploy
├─ 🚀 backend
│ ├─ 🐳 docker-compose.yaml
│ ├─ 🐳 Dockerfile : my-backend
│ ├─ 🐳 Dockerfile.logstash : my-logstash
│ │ 데이터베이스는 gcp vm mysql로 대체했습니다
│ ├─ 🍦 elk
│ │ ├─ elasticsearch
│ │ │ └─ car_type_template.json
│ │ │ : elasticsearch settings & mappings template
│ │ ├─ /kibana
│ │ └─ /logstash : logstash.config 파일
│ ├─ /functions : 배포한 gcp functions 정리
│ ├─ 🎒 package.json
│ └─ src
│ ├─ 🍇 apis
│ │ ├─ auth : 로그인,로그아웃,소셜로그인 api
│ │ ├─ 🚗 car
│ │ │ ├─ /carCustom
│ │ │ ├─ /carImg
│ │ │ ├─ /carModel
│ │ │ ├─ /carTag
│ │ │ ├─ /carType
│ │ │ └─ /carWheel
│ │ ├─ /iamport : iamport에 정보 요청 및 환불을 위한 api
│ │ ├─ /payment : 결제 api
│ │ └─ /user : 회원가입, 회원정보 조회,수정 등
│ ├─ 👑 app.module.ts
│ ├─ 📄 commons
│ │ ├─ /auth : 로그인, 소셜 로그인, 로그아웃 auth strategies & guards
│ │ └─ /filter : exception filter
│ └─ main.ts
└─ 🚀 frontend
├─ /img
├─ login
│ ├─ index.css
│ └─ index.html
└─ payment.html

```

---

## 🔒 ENV

```
IMP_KEY=
IMP_SECRET_KEY=
IMP_CODE=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
STORAGE_BUCKET=
STORAGE_KEY_FILENAME=
STORAGE_PROJECT_ID=
```

<!-- Markdown link & img dfn's -->
