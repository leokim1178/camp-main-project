<p align="center">
<img src="https://capsule-render.vercel.app/api?&type=waving&color=timeAuto&height=180&section=header&text=Main Project%20Tesla&fontSize=50&animation=fadeIn&fontAlignY=45" />
  </p>

> Tesla를 주제로 간단히 만든 백엔드

공부한 내용들을 바탕으로 api를 구성했습니다
Tesla 홈페이지를 참고했습니다만,
없는 기능이 들어가 있기도 합니다.
<br>


## 배포 주소

```sh
https://main-project.leo3179.shop/graphql
```

## 기술 스택

<br>
<div align='center'> 🖥&nbsp&nbsp&nbsp사용한 기술 스택</div>
<br>
<p align="center">
📑&nbsp&nbsp&nbsp구성 언어
  </p>
<p align="center">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/js-icon.svg">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/ts-icon.svg">
  </p>
 <p align="center">
🏠&nbsp&nbsp&nbsp데이터베이스
  </p>
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/mysql-icon.svg">
&nbsp
&nbsp
&nbsp
<img alt= "icon" wide="60" height="60" src ="https://cdn4.iconfinder.com/data/icons/redis-2/1451/Untitled-2-512.png">

  </p>
   <p align="center">
🚀&nbsp&nbsp&nbsp배포
  </p>
<p align="center">
<img alt= "icon" wide="60" height="60" src ="https://techstack-generator.vercel.app/kubernetes-icon.svg">
&nbsp
&nbsp
&nbsp
<img alt= "icon" wide="60" height="60" src="https://lirp.cdn-website.com/aa0ef369/dms3rep/multi/opt/google-cloud-icon-570w.png">
&nbsp
&nbsp
&nbsp
<img alt= "icon" wide="60" height="60" src="https://techstack-generator.vercel.app/aws-icon.svg">
  </p>
    </p>
       <p align="center">
🏖&nbsp&nbsp&nbspWith...
  </p>
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/restapi-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/graphql-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/docker-icon.svg">
  &nbsp&nbsp
<img alt= "icon" wide="60" height="60" src ="https://symbols.getvecta.com/stencil_89/37_nestjs-icon.a67daec196.svg">
  </p>
  <p align="center">
<img alt= "icon" wide="60" height="60" src ="./readme-imgs/elasticsearch.png">
<img alt= "icon" wide="60" height="60" src ="./readme-imgs/logstash.png">
<img alt= "icon" wide="60" height="60" src ="./readme-imgs/kibana.png">
  </p>
  <p align="center">
  <img alt= "icon" wide="60" height="60" src ="https://nesoy.github.io/assets/posts/20170413/1.PNG">
  </p>

## ERD 설계

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

## 파이프 라인

### 모델 정보 검색 파이프라인

![](/readme-imgs/검색%20파이프라인.001.jpeg)

### 로그인 파이프 라인

### 소셜 로그인 파이프 라인

## API 설계

- Nest.js
- Code-first build
- graphql build : module - resolver - service (소셜 로그인과 health-checking용 controller는 존재)
- typORM 적용

## 프로젝트 설치 및 실행 방법

```sh
# 설치
gcp kubenetes를 통해 설치

# graphql docs를 참고하여 api endpoint를 통해 프론트로 연결
https://main-project.leo3179.shop/graphql

# 소셜 로그인 endpoint
https://main-project.leo3179.shop/login/naver
https://main-project.leo3179.shop/login/kakao
https://main-project.leo3179.shop/login/google

#업데이트 방법
git add .
git commit -m "update this project"
git push origin main

```

## 업데이트 내역

- 1.01.0
  - 추가 : 문서 업데이트 README.md 작성
    - README.md 관련 이미지들 추가
  - 수정 : 폴더 정리
- 1.00.9
  - 무중단 배포 & github CI/CD 구현 성공
- 1.00.8
  - 무중단 배포 & github CI/CD 구현 시도

## 폴더 구조

```
🏠 b02-main-project
├─ 🐳 cloudbuild.yaml : CI/CD를 위한 github - gcp cloudbuild 연결 yaml
└─ main-project-for-deploy
   ├─ 🚀 backend
   │  ├─ 🐳 docker-compose.yaml
   │  ├─ 🐳 Dockerfile : my-backend
   │  ├─ 🐳 Dockerfile.logstash : my-logstash
   │  │                           데이터베이스는 gcp vm mysql로 대체했습니다
   │  ├─ 🍦 elk
   │  │  ├─ elasticsearch
   │  │  │  └─ car_type_template.json
   │  │  │      : elasticsearch settings & mappings template
   │  │  ├─ /kibana
   │  │  └─ /logstash : logstash.config 파일
   │  ├─ /functions : 배포한 gcp functions 정리
   │  ├─ 🎒 package.json
   │  └─ src
   │     ├─ 🍇 apis
   │     │  ├─ auth : 로그인,로그아웃,소셜로그인 api
   │     │  ├─ 🚗 car
   │     │  │  ├─ /carCustom
   │     │  │  ├─ /carImg
   │     │  │  ├─ /carModel
   │     │  │  ├─ /carTag
   │     │  │  ├─ /carType
   │     │  │  └─ /carWheel
   │     │  ├─ /iamport : iamport에 정보 요청 및 환불을 위한 api
   │     │  ├─ /payment : 결제 api
   │     │  └─ /user : 회원가입, 회원정보 조회,수정 등
   │     ├─ 👑 app.module.ts
   │     ├─ 📄 commons
   │     │  ├─ /auth : 로그인, 소셜 로그인, 로그아웃 auth strategies & guards
   │     │  └─ /filter : exception filter
   │     └─ main.ts
   └─ 🚀 frontend
      ├─ /img
      ├─ login
      │  ├─ index.css
      │  └─ index.html
      └─ payment.html

```

## .env 설정

1. 소셜 로그인 관련 keys(naver,google,kakao)
2. gcp storage & bigQuery 관련 keys

## 정보

블로그 : [leoKim's velog](https://story0tae.tistory.com/)
<br>
email : leo3179@naver.com

<!-- Markdown link & img dfn's -->
