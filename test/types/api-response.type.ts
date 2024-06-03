import { IServerErrorResponse } from '@test/interface/interface';

// e2e 테스트의 성공, 비즈니스 로직 실패 response에 접근하기 위해 사용하는 타입
export type ApiResponse<
  T,
  SuccessType extends (...args: any) => any,
> = T extends IServerErrorResponse
  ? IServerErrorResponse
  : Awaited<ReturnType<SuccessType>>;
