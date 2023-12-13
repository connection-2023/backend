import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiReadManyLectureByNonMemeber() {
  return applyDecorators(
    ApiOperation({
      summary: '비회원용 강사 id로 강의 조회',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('강의 조회 성공', {
        statusCode: 200,
        data: {
          lecture: [
            {
              id: 26,
              lecturerId: 4,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:32.000Z',
              endDate: '2023-11-24T23:38:19.000Z',
              title: '가비쌤과 함께하는 왁킹 클래스22',
              introduction:
                '원데이 단체, 개인레슨, 그룹레슨(친구와)으로 댄스를 맘껏 배워보고 개인소장 영상까지 간직할 수 있는 클래스입니다. \n몸쓰는 방법, 안무디테일 최대한 잡아드리며 알려드립니다. \n(초보자분들도 어려움없이 따라오실 수 있도록 도와드려요!)개인, 그룹레슨 진행원하실 경우 문의바랍니다 :)',
              curriculum:
                "<p>(글자제한 몇으로할지???)<br>\"잘추는게 중요한가요?잘가르치는게 중요하지 \"<br>여러분의 굳 티쳐!! 세상에 몸치는 없다!!<br>수강생들의 진심<span style=\"color: rgb(103, 0, 0)\">어린 리뷰로 자신</span>합니다&gt;_&lt; <br>재미있게 춤 배우실부운!!!!<br><br>안녕하세요! 먼저 제 소개를 할게요!<br>방송댄스 레슨 전문 춤토니 입니다!<br>어릴적 배반의 장미(엄정화) 가 흘러나올 <span style=\"background-color: rgb(255, 0, 0)\">때 엉덩이를 씰룩거리던 아이가 !!</span><br><span style=\"background-color: rgb(255, 0, 0)\">각 반의 대표자 나오세요 ! 라는 소리에 뛰쳐나가 테크노를 추던 소녀가</span> !!(급 늙어보임)<br>초등학교 5학년 하늘의 웃기네 라는 노래의 안무습득 및 레슨 ( 그당시는 친구들에게 알려주기겠죠)을 시작으로 어느새 이렇게나 컸습니다 !!<br>한가지를 열심히 파고들면 그 분야에 전문가가 된다는 말이 사실이라는 것을 느끼며 어느새 레슨자의 자리에 섰습니다<br> '잘춰서 부러워요' '저도 잘 추고 싶어요' ' 전 몸치에<del>요'많은 주변인, 수강생들에게 이러한 말을 들으며' 그럼 내가 그들에게 동작만을 알려주는 것이 아닌 잘 추기위한 방법을 알려줘야</del>겠구나'라는 생각과 함께 ! <br>취미로 배우는 분들이 많은 경우이기에전문적인 기술 보다 본인이 즐기며 출수 있는 점을 알려줘야겠다 !라는 생각으로 레슨을 진행하였고, 경험 만큼 저의 수업도 많이 성장해 왔다고 자부합니다 !<br></p><p><br></p><p><em>ⓐ 수원과학대 공연연기과 졸업 (3년연속 축제 참가 및 수상이력 보유)</em><br>ⓑ 토니의 춤정모 개설<em> (개인그룹레슨)</em><br><em>ⓒ 유튜브 '춤토니' 커버댄스 컨텐</em>츠 활동중<br>ⓓ 유튜브 크리에이터 바이올리니스트 '제니윤' 댄스올린 컨텐츠 영상 촬영 및 삼성전자런치콘서트,남이섬페스티발,잠실롯데월드몰 행사 백댄서 참여<br>ⓔ 결혼식 축하댄스 전문 업체 소속 댄서활동 경력 (레슨및 공연댄서활동)<br>ⓕ 방송댄스 개인레슨 원데이클라스 및 취미반 경력 다수<br>ⓖ 장기자랑 전문 3회완성 클라스 레슨 경력 다수<br>ⓗ JTBC 알짜왕 원데이클라스 강사 출연!<br>ⓘ MBC 경제매거진 직장인 강사 출연 !!<br>ⓙ 줌바댄스 강사 자격증 2018년 5월 취득 !<br>ⓚ 한국일보 재능공유강사 취재!<br>ⓛ L기업 직장인 취미 동호회 강사<br></p><p>(글자제한 몇으로할지???)<br>\"잘추는게 중요한가요?잘가르치는게 중요하지 \"<br>여러분의 굳 티쳐!! 세상에 몸치는 없다!!<br>수강생들의 진심<span style=\"color: rgb(103, 0, 0)\">어린 리뷰로 자신</span>합니다&gt;_&lt; <br>재미있게 춤 배우실부운!!!!<br><br>안녕하세요! 먼저 제 소개를 할게요!<br>방송댄스 레슨 전문 춤토니 입니다!<br>어릴적 배반의 장미(엄정화) 가 흘러나올 <span style=\"background-color: rgb(255, 0, 0)\">때 엉덩이를 씰룩거리던 아이가 !!</span><br><span style=\"background-color: rgb(255, 0, 0)\">각 반의 대표자 나오세요 ! 라는 소리에 뛰쳐나가 테크노를 추던 소녀가</span> !!(급 늙어보임)<br>초등학교 5학년 하늘의 웃기네 라는 노래의 안무습득 및 레슨 ( 그당시는 친구들에게 알려주기겠죠)을 시작으로 어느새 이렇게나 컸습니다 !!<br>한가지를 열심히 파고들면 그 분야에 전문가가 된다는 말이 사실이라는 것을 느끼며 어느새 레슨자의 자리에 섰습니다<br> '잘춰서 부러워요' '저도 잘 추고 싶어요' ' 전 몸치에<del>요'많은 주변인, 수강생들에게 이러한 말을 들으며' 그럼 내가 그들에게 동작만을 알려주는 것이 아닌 잘 추기위한 방법을 알려줘야</del>겠구나'라는 생각과 함께 ! <br>취미로 배우는 분들이 많은 경우이기에전문적인 기술 보다 본인이 즐기며 출수 있는 점을 알려줘야겠다 !라는 생각으로 레슨을 진행하였고, 경험 만큼 저의 수업도 많이 성장해 왔다고 자부합니다 !<br></p><p><br></p><p><em>ⓐ 수원과학대 공연연기과 졸업 (3년연속 축제 참가 및 수상이력 보유)</em><br>ⓑ 토니의 춤정모 개설<em> (개인그룹레슨)</em><br><em>ⓒ 유튜브 '춤토니' 커버댄스 컨텐</em>츠 활동중<br>ⓓ 유튜브 크리에이터 바이올리니스트 '제니윤' 댄스올린 컨텐츠 영상 촬영 및 삼성전자런치콘서트,남이섬페스티발,잠실롯데월드몰 행사 백댄서 참여<br>ⓔ 결혼식 축하댄스 전문 업체 소속 댄서활동 경력 (레슨및 공연댄서활동)<br>ⓕ 방송댄스 개인레슨 원데이클라스 및 취미반 경력 다수<br>ⓖ 장기자랑 전문 3회완성 클라스 레슨 경력 다수<br>ⓗ JTBC 알짜왕 원데이클라스 강사 출연!<br>ⓘ MBC 경제매거진 직장인 강사 출연 !!<br>ⓙ 줌바댄스 강사 자격증 2018년 5월 취득 !<br>ⓚ 한국일보 재능공유강사 취재!<br>ⓛ L기업 직장인 취미 동호회 강사<br></p>",
              duration: 120,
              difficultyLevel: '상급',
              minCapacity: 1,
              maxCapacity: 12,
              reservationDeadline: 2,
              reservationComment: '누구나 가능한!',
              price: 40000,
              noShowDeposit: null,
              reviewCount: 0,
              stars: 0,
              isActive: false,
              locationDescription: '버스타고 한번에',
              createdAt: '2023-11-07T05:21:53.483Z',
              updatedAt: '2023-11-07T05:21:53.483Z',
              deletedAt: null,
            },
            {
              id: 59,
              lecturerId: 4,
              lectureTypeId: 1,
              lectureMethodId: 1,
              isGroup: true,
              startDate: '2023-11-24T23:38:40.000Z',
              endDate: '2024-11-24T23:38:27.000Z',
              title: '결제 테스트',
              introduction: '잘 운영할 예정',
              curriculum: '1주차 휴강',
              duration: 2,
              difficultyLevel: '상',
              minCapacity: 1,
              maxCapacity: 10,
              reservationDeadline: 2,
              reservationComment: '유의사항 변경하기!!~~??',
              price: 40000,
              noShowDeposit: 30000,
              reviewCount: 0,
              stars: 0,
              isActive: true,
              locationDescription: '버스타고 한번에 갈 수 있어욤',
              createdAt: '2023-11-24T10:36:30.399Z',
              updatedAt: '2023-12-07T13:41:06.138Z',
              deletedAt: null,
            },
          ],
        },
      }),
    ),
  );
}
