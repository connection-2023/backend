<div align="center">
  <img src="https://github.com/connection-2023/frontend/assets/90231153/1a0ff299-fc6e-4f0a-8131-de25a3823f74" width="80%">
</div>

<br/>

## 🔎 서비스 소개

> 댄서와 수강생을 매칭 서비스, 『 CONNECTION 』

수강생들에게는 간편한 댄스 수업 검색부터 비교까지, 그리고 강사들에게는 클래스 예약부터 종합적인 관리 및 홍보 서비스까지 제공합니다.<br/>
본 서비스는 사용자의 요구를 파악하기 위해 설문조사를 기반으로 기획되었으며, <br/>
댄스 수업 정보의 불균형을 해소하고 수요와 공급 사이의 연결을 강화하는 것이 핵심 목표입니다.

<br/>

## 🛠Member

|                                                                **김현수**                                                                |                                                           **이재현**                                                            |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
| [<img src="https://avatars.githubusercontent.com/u/96464209?v=4" height=150 width=150> <br/> @Kimsoo0119](https://github.com/Kimsoo0119) | [<img src="https://avatars.githubusercontent.com/u/121776954?v=4" height=150 width=150> <br/> @j-zzi](https://github.com/j-zzi) |

## ✨ 주요 기능

### 회원

|                                                 **클래스 탐색**                                                  |                                                 **클래스 커리큘럼&리뷰**                                                  |
| :--------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
| ![클래스 탐색](https://github.com/connection-2023/frontend/assets/90231153/1d094058-d7ba-4271-96af-f4b6b9e295ad) | ![클래스 커리큘럼&리뷰](https://github.com/connection-2023/frontend/assets/90231153/3f8106c2-52be-4476-a9d8-501e9316cfa5) |
|                                         <center>**간편한 신청**</center>                                         |                                                                                                                           |
| ![간편한 신청](https://github.com/connection-2023/frontend/assets/90231153/89290ef2-6e67-4816-ba7e-54d9fea09d8a) |                                                                                                                           |

### 강사

|                                                    **클래스 등록**                                                     |                                                    **패스권/쿠폰 생성**                                                     |
| :--------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
| ![클래스 등록(강사)](https://github.com/connection-2023/frontend/assets/90231153/6bc7bab9-29b8-4945-9a90-fe9fb4a4551a) | ![패스권/쿠폰 생성(강사)](https://github.com/connection-2023/frontend/assets/90231153/ecd6c8c4-af79-43a0-a43c-e86a937de5f8) |
|                                            <center>**수강생 모집**</center>                                            |                                                   **신청한 수강생 확인**                                                    |
|    ![수강생 모집](https://github.com/connection-2023/frontend/assets/90231153/ae188bb3-8226-4663-8377-1aeb073b7c57)    |   ![신청한 수강생 확인](https://github.com/connection-2023/frontend/assets/90231153/5400b282-6603-4a44-8999-fa5ac76e866f)   |

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
   # Shopping Mall
> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [default](#default)

```mermaid
erDiagram
"Users" {
  Int id PK
  String uuid
  String name
  String nickname UK
  String email UK
  Boolean isProfileOpen
  String phoneNumber UK "nullable"
  Int gender "nullable"
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"UserProfileImage" {
  Int id PK
  Int userId FK
  String imageUrl "nullable"
}
"Region" {
  Int id PK
  String administrativeDistrict
  String district "nullable"
}
"Lecturer" {
  Int id PK
  Int userId FK
  String nickname UK
  String email
  String phoneNumber
  String profileCardImageUrl "nullable"
  String youtubeUrl "nullable"
  String instagramUrl "nullable"
  String homepageUrl "nullable"
  String affiliation "nullable"
  String introduction
  String experience "nullable"
  Float stars
  Int reviewCount
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"Lecture" {
  Int id PK
  Int lecturerId FK
  Int lectureTypeId FK
  Int lectureMethodId FK
  Boolean isGroup
  DateTime startDate
  DateTime endDate
  String title
  String introduction "nullable"
  String curriculum
  Int duration
  String difficultyLevel
  Int minCapacity "nullable"
  Int maxCapacity "nullable"
  Int reservationDeadline
  String reservationComment "nullable"
  Int price
  Int noShowDeposit "nullable"
  Int reviewCount
  Float stars
  Boolean isActive
  String locationDescription "nullable"
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"DanceCategory" {
  Int id PK
  String genre
}
"LectureType" {
  Int id PK
  String name
}
"LectureReview" {
  Int id PK
  Int lectureId FK
  Int userId FK
  Int reservationId FK
  Int stars
  String description "nullable"
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"LikedLectureReview" {
  Int id PK
  Int lectureReviewId FK
  Int userId FK
}
"LecturerReview" {
  Int id PK
  Int lecturerId FK
  Int userId FK
  Int stars
  String description "nullable"
}
"DailySmsUsage" {
  Int id PK
  Int userId FK
  Int dailySentCount
}
"LectureMethod" {
  Int id PK
  String name
}
"LikedLecture" {
  Int id PK
  Int lectureId FK
  Int userId FK
}
"LikedLecturer" {
  Int id PK
  Int lecturerId FK
  Int userId FK
}
"BlockedLecturer" {
  Int id PK
  Int lecturerId FK
  Int userId FK
}
"LectureNotification" {
  Int id PK
  Int lectureId FK
  String notification
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"LectureImage" {
  Int id PK
  Int lectureId FK
  String imageUrl
}
"LectureCoupon" {
  Int id PK
  Int lecturerId FK
  String title
  Int percentage "nullable"
  Int discountPrice "nullable"
  Int maxDiscountPrice "nullable"
  Int maxUsageCount "nullable"
  Int usageCount
  Boolean isDisabled
  Boolean isStackable
  Boolean isPrivate
  DateTime startAt
  DateTime endAt
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"LectureCouponTarget" {
  Int id PK
  Int lectureCouponId FK
  Int lectureId FK
}
"UserCoupon" {
  Int id PK
  Boolean isUsed
  Int userId FK
  Int lectureCouponId FK
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"Auth" {
  Int id PK
  Int userId FK
  String email UK
  Int signUpTypeId FK
  DateTime createdAt
  DateTime deletedAt "nullable"
}
"SignUpType" {
  Int id PK
  String type
}
"LecturerRegion" {
  Int id PK
  Int regionId FK
  Int lecturerId FK
}
"LecturerDanceGenre" {
  Int id PK
  Int danceCategoryId FK
  Int lecturerId FK
  String name "nullable"
}
"LecturerInstagramPostUrl" {
  Int id PK
  Int lecturerId FK
  String url
}
"LecturerProfileImageUrl" {
  Int id PK
  Int lecturerId FK
  String url
}
"LectureSchedule" {
  Int id PK
  Int lectureId FK
  Int day
  DateTime startDateTime
  DateTime endDateTime
  Int numberOfParticipants
}
"LectureDay" {
  Int id PK
  Int lectureId FK
  String day
  String dateTime
}
"LectureToRegion" {
  Int id PK
  Int regionId FK
  Int lectureId FK
}
"LectureToDanceGenre" {
  Int id PK
  Int danceCategoryId FK
  Int lectureId FK
  String name "nullable"
}
"LectureHoliday" {
  Int id PK
  Int lectureId FK
  DateTime holiday
}
"TemporaryLecture" {
  Int id PK
  Int lecturerId FK
  Int step "nullable"
  Int lectureTypeId FK "nullable"
  Int lectureMethodId FK "nullable"
  Boolean isGroup "nullable"
  DateTime startDate "nullable"
  DateTime endDate "nullable"
  String title "nullable"
  String introduction "nullable"
  String curriculum "nullable"
  Int duration "nullable"
  String difficultyLevel "nullable"
  Int minCapacity "nullable"
  Int maxCapacity "nullable"
  Int reservationDeadline "nullable"
  String reservationComment "nullable"
  Int price "nullable"
  Int noShowDeposit "nullable"
  String locationDescription "nullable"
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"TemporaryLectureSchedule" {
  Int id PK
  Int lectureId FK
  String date "nullable"
  String dateTime "nullable"
  Int numberOfParticipants "nullable"
}
"TemporaryLectureToRegion" {
  Int id PK
  Int regionId FK "nullable"
  Int lectureId FK
}
"TemporaryLectureToDanceGenre" {
  Int id PK
  Int danceCategoryId FK "nullable"
  Int lectureId FK
  String name "nullable"
}
"TemporaryLectureHoliday" {
  Int id PK
  Int lectureId FK
  DateTime holiday "nullable"
}
"TemporaryLectureCouponTarget" {
  Int id PK
  Int lectureCouponId FK "nullable"
  Int lectureId FK
}
"TemporaryLectureNotification" {
  Int id PK
  Int lectureId FK
  String notification "nullable"
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"TemporaryLectureImage" {
  Int id PK
  Int lectureId FK
  String imageUrl "nullable"
}
"Payment" {
  Int id PK
  String paymentKey UK "nullable"
  Int paymentProductTypeId FK
  String orderId UK
  String secret "nullable"
  String orderName
  Int originalPrice
  Int finalPrice
  Int userId FK "nullable"
  Int lecturerId FK "nullable"
  Int paymentMethodId FK "nullable"
  Int statusId FK
  DateTime createdAt
  DateTime updatedAt
  DateTime refundableDate "nullable"
}
"PaymentMethod" {
  Int id PK
  String name
}
"PaymentStatus" {
  Int id PK
  String name
}
"PaymentCouponUsage" {
  Int id PK
  Int paymentId FK
  Int couponId "nullable"
  String couponTitle "nullable"
  Int couponPercentage "nullable"
  Int couponDiscountPrice "nullable"
  Int couponMaxDiscountPrice "nullable"
  Int stackableCouponId "nullable"
  String stackableCouponTitle "nullable"
  Int stackableCouponPercentage "nullable"
  Int stackableCouponDiscountPrice "nullable"
  Int stackableCouponMaxDiscountPrice "nullable"
}
"PaymentProductType" {
  Int id PK
  String name
}
"Reservation" {
  Int id PK
  Int userId FK
  Int paymentId FK
  Int lectureId FK
  Int lectureScheduleId FK "nullable"
  Int regularLectureStatusId FK "nullable"
  String representative
  String phoneNumber
  Int participants
  String requests "nullable"
  Boolean isEnabled
}
"CardPaymentInfo" {
  Int id PK
  Int paymentId FK
  String issuerCode FK
  String acquirerCode FK "nullable"
  String number
  Int installmentPlanMonths
  String approveNo
  String cardType
  String ownerType
  Boolean isInterestFree
}
"Card" {
  String code PK
  String name
  String krCode
  String enCode
}
"VirtualAccountPaymentInfo" {
  Int id PK
  Int paymentId FK
  String accountNumber
  String bankCode FK
  String customerName
  DateTime dueDate
  Boolean expired
}
"Bank" {
  String code PK
  String name
  String kftCode
  String krCode
  String enCode
}
"RefundStatus" {
  Int id PK
  String name
}
"TemporaryLectureDay" {
  Int id PK
  Int lectureId FK
  String day
}
"TemporaryLectureDaySchedule" {
  Int id PK
  Int lectureDayId FK
  String dateTime "nullable"
}
"LectureLocation" {
  Int id PK
  Int lectureId FK
  String address
  String detailAddress
  String buildingName
}
"TemporaryLectureLocation" {
  Int id PK
  Int lectureId FK
  String address "nullable"
  String detailAddress "nullable"
  String buildingName "nullable"
}
"RegisterConsent" {
  Int id PK
  String name
  String description
  Boolean required
}
"RegisterConsentAgreement" {
  Int id PK
  Int registerConsentId FK
  Int userId FK
}
"LecturePass" {
  Int id PK
  Int lecturerId FK
  String title
  Int price
  Int maxUsageCount
  Int availableMonths
  Int salesCount
  Boolean isDisabled
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"LecturePassTarget" {
  Int id PK
  Int lectureId FK
  Int lecturePassId FK
}
"UserPass" {
  Int id PK
  Int userId FK
  Int paymentId FK
  Int remainingUses
  Int lecturePassId FK
  Boolean isEnabled
  DateTime startAt "nullable"
  DateTime endAt "nullable"
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"PaymentPassUsage" {
  Int id PK
  Int paymentId FK
  Int lecturePassId FK
  Int usedCount
}
"ReportType" {
  Int id PK
  String name
  String description
}
"UserReport" {
  Int id PK
  Int reportedUserId FK
  Int targetUserId FK "nullable"
  Int targetLecturerId FK "nullable"
  String reason "nullable"
  Boolean isAnswered
  DateTime createdAt
  DateTime updatedAt
}
"UserReportedReview" {
  Int id PK
  Int reportId FK
  Int lectureReviewId FK "nullable"
  Int lecturerReviewId FK "nullable"
  String description "nullable"
}
"UserReportType" {
  Int id PK
  Int reportId FK
  Int reportTypeId FK
}
"LecturerReport" {
  Int id PK
  Int reportedLecturerId FK
  Int targetUserId FK "nullable"
  Int targetLecturerId FK "nullable"
  String reason "nullable"
  Boolean isAnswered
  DateTime createdAt
  DateTime updatedAt
}
"LecturerReportedReview" {
  Int id PK
  Int reportId FK
  Int lectureReviewId FK "nullable"
  Int lecturerReviewId FK "nullable"
  String description "nullable"
}
"LecturerReportType" {
  Int id PK
  Int reportId FK
  Int reportTypeId FK
}
"LecturerReportResponse" {
  Int id PK
  Int reportId FK
  Int adminId FK
  String description
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"UserReportResponse" {
  Int id PK
  Int reportId FK
  Int adminId FK
  String description
  DateTime createdAt
  DateTime updatedAt
  DateTime deletedAt "nullable"
}
"Admin" {
  Int id PK
  String name
  String nickname UK
  String email UK
  String profileImage "nullable"
}
"LecturerLearner" {
  Int id PK
  Int userId FK
  Int lecturerId FK
  Int enrollmentCount
  String memo "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"TransferPaymentInfo" {
  Int id PK
  Int paymentId FK
  Int lecturerBankAccountId FK
  String senderName
  Int noShowDeposit "nullable"
}
"LecturerBankAccount" {
  Int id PK
  Int lecturerId FK
  String holderName
  String bankCode FK
  String accountNumber
  DateTime createdAt
  DateTime updatedAt
}
"UserBankAccount" {
  Int id PK
  Int userId FK
  String holderName
  String bankCode FK
  String accountNumber
  DateTime createdAt
  DateTime updatedAt
}
"RefundPaymentInfo" {
  Int id PK
  Int paymentId FK
  Int refundStatusId FK
  Int refundUserBankAccountId FK "nullable"
  Int cancelAmount "nullable"
  String cancelReason "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"RegularLectureStatus" {
  Int id PK
  Int lectureId FK
  String day
  String dateTime
  Int numberOfParticipants
}
"RegularLectureSchedule" {
  Int id PK
  Int regularLectureStatusId FK
  DateTime startDateTime
  DateTime endDateTime
  Int day
}
"SearchHistory" {
  Int id PK
  Int userId FK
  String searchTerm
  DateTime createdAt
  DateTime updatedAt
}
"PopularSearch" {
  Int id PK
  String searchTerm UK
  Int searchCount
}
"UserProfileImage" |o--|| "Users" : users
"Lecturer" |o--|| "Users" : users
"Lecture" }o--|| "Lecturer" : lecturer
"Lecture" }o--|| "LectureType" : lectureType
"Lecture" }o--|| "LectureMethod" : lectureMethod
"LectureReview" }o--|| "Lecture" : lecture
"LectureReview" }o--|| "Users" : users
"LectureReview" |o--|| "Reservation" : reservation
"LikedLectureReview" }o--|| "LectureReview" : lectureReview
"LikedLectureReview" }o--|| "Users" : user
"LecturerReview" }o--|| "Lecturer" : lecturer
"LecturerReview" }o--|| "Users" : users
"DailySmsUsage" |o--|| "Users" : users
"LikedLecture" }o--|| "Lecture" : lecture
"LikedLecture" }o--|| "Users" : user
"LikedLecturer" }o--|| "Lecturer" : lecturer
"LikedLecturer" }o--|| "Users" : user
"BlockedLecturer" }o--|| "Lecturer" : lecturer
"BlockedLecturer" }o--|| "Users" : user
"LectureNotification" |o--|| "Lecture" : lecture
"LectureImage" }o--|| "Lecture" : lecture
"LectureCoupon" }o--|| "Lecturer" : lecturer
"LectureCouponTarget" }o--|| "LectureCoupon" : lectureCoupon
"LectureCouponTarget" }o--|| "Lecture" : lecture
"UserCoupon" }o--|| "LectureCoupon" : lectureCoupon
"UserCoupon" }o--|| "Users" : users
"Auth" |o--|| "Users" : users
"Auth" }o--|| "SignUpType" : signUpType
"LecturerRegion" }o--|| "Region" : region
"LecturerRegion" }o--|| "Lecturer" : lecturer
"LecturerDanceGenre" }o--|| "DanceCategory" : danceCategory
"LecturerDanceGenre" }o--|| "Lecturer" : lecturer
"LecturerInstagramPostUrl" }o--|| "Lecturer" : lecturer
"LecturerProfileImageUrl" }o--|| "Lecturer" : lecturer
"LectureSchedule" }o--|| "Lecture" : lecture
"LectureDay" }o--|| "Lecture" : lecture
"LectureToRegion" }o--|| "Region" : region
"LectureToRegion" }o--|| "Lecture" : lecture
"LectureToDanceGenre" }o--|| "DanceCategory" : danceCategory
"LectureToDanceGenre" }o--|| "Lecture" : lecture
"LectureHoliday" }o--|| "Lecture" : lecture
"TemporaryLecture" }o--|| "Lecturer" : lecturer
"TemporaryLecture" }o--o| "LectureType" : lectureType
"TemporaryLecture" }o--o| "LectureMethod" : lectureMethod
"TemporaryLectureSchedule" }o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureToRegion" }o--o| "Region" : region
"TemporaryLectureToRegion" }o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureToDanceGenre" }o--o| "DanceCategory" : danceCategory
"TemporaryLectureToDanceGenre" }o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureHoliday" }o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureCouponTarget" }o--o| "LectureCoupon" : lectureCoupon
"TemporaryLectureCouponTarget" }o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureNotification" |o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureImage" }o--|| "TemporaryLecture" : temporaryLecutre
"Payment" }o--o| "Users" : user
"Payment" }o--o| "Lecturer" : lecturer
"Payment" }o--|| "PaymentStatus" : paymentStatus
"Payment" }o--o| "PaymentMethod" : paymentMethod
"Payment" }o--|| "PaymentProductType" : paymentProductType
"PaymentCouponUsage" |o--|| "Payment" : payment
"Reservation" }o--|| "Users" : user
"Reservation" }o--o| "LectureSchedule" : lectureSchedule
"Reservation" }o--|| "Lecture" : lecture
"Reservation" }o--o| "RegularLectureStatus" : regularLectureStatus
"Reservation" |o--|| "Payment" : payment
"CardPaymentInfo" |o--|| "Payment" : payment
"CardPaymentInfo" }o--|| "Card" : issuer
"CardPaymentInfo" }o--o| "Card" : acquirer
"VirtualAccountPaymentInfo" |o--|| "Payment" : payment
"VirtualAccountPaymentInfo" }o--|| "Bank" : bank
"TemporaryLectureDay" }o--|| "TemporaryLecture" : temporaryLecture
"TemporaryLectureDaySchedule" }o--|| "TemporaryLectureDay" : temporaryLectureDay
"LectureLocation" |o--|| "Lecture" : lecture
"TemporaryLectureLocation" |o--|| "TemporaryLecture" : temporaryLecture
"RegisterConsentAgreement" }o--|| "RegisterConsent" : registerConsent
"RegisterConsentAgreement" }o--|| "Users" : user
"LecturePass" }o--|| "Lecturer" : lecturer
"LecturePassTarget" }o--|| "Lecture" : lecture
"LecturePassTarget" }o--|| "LecturePass" : lecturePass
"UserPass" }o--|| "Users" : users
"UserPass" }o--|| "LecturePass" : lecturePass
"UserPass" |o--|| "Payment" : payment
"PaymentPassUsage" |o--|| "Payment" : payment
"PaymentPassUsage" }o--|| "LecturePass" : lecturePass
"UserReport" }o--|| "Users" : reportedUser
"UserReport" }o--o| "Users" : targetUser
"UserReport" }o--o| "Lecturer" : targetLecturer
"UserReportedReview" |o--|| "UserReport" : report
"UserReportedReview" }o--o| "LectureReview" : lectureReview
"UserReportedReview" }o--o| "LecturerReview" : lecturerReview
"UserReportType" }o--|| "UserReport" : report
"UserReportType" }o--|| "ReportType" : reportType
"LecturerReport" }o--|| "Lecturer" : reportedLecturer
"LecturerReport" }o--o| "Users" : targetUser
"LecturerReport" }o--o| "Lecturer" : targetLecturer
"LecturerReportedReview" |o--|| "LecturerReport" : report
"LecturerReportedReview" }o--o| "LectureReview" : lectureReview
"LecturerReportedReview" }o--o| "LecturerReview" : lecturerReview
"LecturerReportType" }o--|| "LecturerReport" : report
"LecturerReportType" }o--|| "ReportType" : reportType
"LecturerReportResponse" |o--|| "LecturerReport" : report
"LecturerReportResponse" }o--|| "Admin" : admin
"UserReportResponse" |o--|| "UserReport" : report
"UserReportResponse" }o--|| "Admin" : admin
"LecturerLearner" }o--|| "Users" : user
"LecturerLearner" }o--|| "Lecturer" : lecturer
"TransferPaymentInfo" |o--|| "Payment" : payment
"TransferPaymentInfo" }o--|| "LecturerBankAccount" : lecturerBankAccount
"LecturerBankAccount" }o--|| "Lecturer" : lecturer
"LecturerBankAccount" }o--|| "Bank" : bank
"UserBankAccount" }o--|| "Users" : user
"UserBankAccount" }o--|| "Bank" : bank
"RefundPaymentInfo" |o--|| "Payment" : payment
"RefundPaymentInfo" }o--|| "RefundStatus" : refundStatus
"RefundPaymentInfo" }o--o| "UserBankAccount" : refundUserBankAccount
"RegularLectureStatus" }o--|| "Lecture" : lecture
"RegularLectureSchedule" }o--|| "RegularLectureStatus" : regularLectureStatus
"SearchHistory" }o--|| "Users" : users
```

<br>

## 💰 Payment Flow

![image](https://github.com/connection-2023/backend/assets/96464209/cd628c6c-0a45-4b54-957a-928ebda6e166)

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
