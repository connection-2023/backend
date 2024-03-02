# 💃connection-backend🕺
- 댄스 클래스 중개 플렛폼 connection입니다.

<br>
  
## 🛠Member

| **김현수** | **이재현** |
| :------: |  :------: |
| [<img src="https://avatars.githubusercontent.com/u/96464209?v=4" height=150 width=150> <br/> @0119Kimsoo](https://github.com/0119Kimsoo) | [<img src="https://avatars.githubusercontent.com/u/121776954?v=4" height=150 width=150> <br/> @Cheorizzang](https://github.com/Cheorizzang) |


<br>
<div>
    <h1>📚 TECH STACKS</h1>
    <ul>
      <h3>Back-end</h3>
      <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
      <img src="https://img.shields.io/badge/Nest.js-E0234E?style=flat&logo=NestJS&logoColor=white"/>
      <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=Prisma&logoColor=white"/>
      <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=PostgreSQL&logoColor=white"/>
      <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=black"/>
      <img src="https://img.shields.io/badge/JSON%20Web%20Tokens-000000?style=flat-square&logo=jsonwebtokens&logoColor=white"/>
      <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white"/>
      </br>
      <h3>Cloud</h3>
      <img src="https://img.shields.io/badge/AmazonEC2-FF9900?style=flat-square&logo=AmazonEC2&logoColor=white"/>
      <img src="https://img.shields.io/badge/AmazonS3-569A31?style=flat-square&logo=AmazonS3&logoColor=white"/>
      <img src="https://img.shields.io/badge/AmazonRDS-527FFF?style=flat-square&logo=AmazonRDS&logoColor=white"/>
      </br>
      <h3>CI/CD</h3>
      <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/>
      <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=GitHubActions&logoColor=white"/>
    </ul>
  </div>
  
  <br><br>
  
  <div>
    <h1>📄 ERD</h1>
    # Prisma Markdown
Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

```mermaid
erDiagram
Users {
    Int id PK
    Int regionId FK
    String nickname UK
    Boolean isProfileOpen
    String phoneNumber UK "nullable"
    String detailAddress "nullable"
    Int gender "nullable"
    DateTime createdAt
    DateTime updatedAt
    DateTime deletedAt "nullable"
}
UserProfileImage {
    Int id PK
    Int userId FK
    String image_url
}
Region {
    Int id PK
    String administrativeDistrict
    String district "nullable"
}
Lecturer {
    Int id PK
    Int userId FK
    String nickname
    String siteUrl
    String workTime
    String description
    Int stars
    Int reviewCount
    DateTime createdAt
    DateTime updatedAt
    DateTime deletedAt "nullable"
}
Lecture {
    Int id PK
    Int danceLecturerId FK
    Int regionId FK
    Int lectureTypeId FK
    Int danceCategoryId FK
    Int lectureMethodId FK
    String title UK
    String detailAddress
    Int duration
    String difficultyLevel
    Int minCapacity
    Int maxCapacity "nullable"
    Boolean isGroup
    DateTime reservationDeadline
    String reservationComment "nullable"
    Int price
    Int noShowDeposit "nullable"
    Int reviewCount
    Int stars
    DateTime createdAt
    DateTime updatedAt
    DateTime deletedAt "nullable"
}
LectureGroup {
    Int id PK
    Int lectureId FK
    Int groupMinCapacity
    Int groupMaxCapacity
}
DanceCategory {
    Int id PK
    String genre
}
LectureType {
    Int id PK
    String name
}
LectureReview {
    Int id PK
    Int lectureId FK
    Int userId FK
    Int stars
    String description "nullable"
}
LecturerReview {
    Int id PK
    Int lecturerId FK
    Int userId FK
    Int stars
    String description "nullable"
}
DailySmsUsage {
    Int id PK
    Int userId FK
    Int dailySentCount
}
LectureMethod {
    Int id PK
    String name
}
LikedLecture {
    Int id PK
    Int lectureId FK
    Int userId FK
}
Users }|--|| Region : region
UserProfileImage |o--|| Users : users
Lecturer |o--|| Users : users
Lecture }|--|| Lecturer : lecturer
Lecture }|--|| Region : region
Lecture }|--|| LectureType : lectureType
Lecture }|--|| DanceCategory : danceCategory
Lecture }|--|| LectureMethod : lectureMethod
LectureGroup }|--|| Lecture : lecture
LectureReview }|--|| Lecture : lecture
LectureReview }|--|| Users : users
LecturerReview }|--|| Lecturer : lecturer
LecturerReview }|--|| Users : users
DailySmsUsage |o--|| Users : users
LikedLecture }|--|| Lecture : lecture
LikedLecture }|--|| Users : user
```

<br>

## 💰 Payment Flow
![image](https://github.com/connection-2023/backend/assets/96464209/458a55cc-5812-40cd-a05a-f084a4ca302b)
<br>

## 🔍 Search Server Data Flow
![image](https://github.com/connection-2023/backend/assets/96464209/cdcd03c7-9d6e-467b-8c5b-59ae605a15bc)
<br>

## 🤖 CI/CD Flow
![image](https://github.com/connection-2023/backend/assets/96464209/fbdc2122-0b70-4e44-a6a8-57d6f734e6ee)
<br>


<br>

  </div>
  <br><br>
  <div>
    <h1>📜 Commit Convention </h1>
    <ul>
      - `feat` : 새로운 기능 추가 <br>
      - `fix` : 버그 수정  <br>
      - `docs` : 문서 수정  <br>
      - `style` : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우  <br>
      - `refactor` : 코드 리펙토링  <br>
      - `test` : 테스트 코드, 리펙토링 테스트 코드 추가  <br>
      - `chore` : 빌드 업무 수정, 패키지 매니저 수정  <br>
      - `conflict`: 충돌 해결  <br>
     </ul>
  </div>
