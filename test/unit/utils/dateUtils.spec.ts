import { DateUtils } from '@src/common/utils/date.utils';

describe('DateUtils', () => {
  const year = 2023;
  const month = 0; // 달은 -1 해서 사용해야 함 5월이면 4로
  const startDay = 1;
  const endDay = 25;

  describe('getUTCStartAndEndOfRange', () => {
    it('날짜가 제공되지 않으면 현재 날짜의 00시와 23시59분 반환', () => {
      const { convertedStartDate, convertedEndDate } =
        DateUtils.getUTCStartAndEndOfRange();
      const now = new Date();

      expect(convertedStartDate.getTime()).toBe(now.setUTCHours(0, 0, 0, 0));
      expect(convertedEndDate.getTime()).toBe(now.setUTCHours(23, 59, 59, 999));
    });

    it('제공된 날짜의 00시와 23시59분을 반환', () => {
      const startDate = new Date(Date.UTC(year, month, startDay));
      const endDate = new Date(Date.UTC(year, month, endDay));

      const { convertedStartDate, convertedEndDate } =
        DateUtils.getUTCStartAndEndOfRange(startDate, endDate);

      expect(convertedStartDate.getTime()).toBe(
        startDate.setUTCHours(0, 0, 0, 0),
      );
      expect(convertedEndDate.getTime()).toBe(
        endDate.setUTCHours(23, 59, 59, 999),
      );
    });
  });

  describe('getUTCStartAndEndOfMonth', () => {
    it('주어진 달의 1일과 마지막 일을 반환', () => {
      const { convertedStartDate, convertedEndDate } =
        DateUtils.getUTCStartAndEndOfMonth(year, month);

      const startOfMonthExpected = new Date(Date.UTC(year, month, 1));
      startOfMonthExpected.setUTCHours(0, 0, 0, 0);

      const endOfMonthExpected = new Date(Date.UTC(year, month + 1, 0));
      endOfMonthExpected.setUTCHours(23, 59, 59, 999);

      expect(convertedStartDate.getTime()).toBe(startOfMonthExpected.getTime());
      expect(convertedEndDate.getTime()).toBe(endOfMonthExpected.getTime());
    });
  });
});
