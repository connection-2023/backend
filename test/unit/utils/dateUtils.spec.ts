import { DateUtils } from '@src/common/utils/date.utils';

describe('DateUtils', () => {
  describe('getUTCStartAndEndOfRange', () => {
    it('날짜가 제공되지 않으면 현재 날짜의 시작과 끝을 반환해야 한다', () => {
      const { startOfDay, endOfDay } = DateUtils.getUTCStartAndEndOfRange();
      const now = new Date();

      expect(startOfDay.getUTCFullYear()).toBe(now.getUTCFullYear());
      expect(startOfDay.getUTCMonth()).toBe(now.getUTCMonth());
      expect(startOfDay.getUTCDate()).toBe(now.getUTCDate());
      expect(startOfDay.getUTCHours()).toBe(0);
      expect(startOfDay.getUTCMinutes()).toBe(0);
      expect(startOfDay.getUTCSeconds()).toBe(0);
      expect(startOfDay.getUTCMilliseconds()).toBe(0);

      expect(endOfDay.getUTCFullYear()).toBe(now.getUTCFullYear());
      expect(endOfDay.getUTCMonth()).toBe(now.getUTCMonth());
      expect(endOfDay.getUTCDate()).toBe(now.getUTCDate());
      expect(endOfDay.getUTCHours()).toBe(23);
      expect(endOfDay.getUTCMinutes()).toBe(59);
      expect(endOfDay.getUTCSeconds()).toBe(59);
      expect(endOfDay.getUTCMilliseconds()).toBe(999);
    });

    it('제공된 날짜의 시작과 끝을 반환해야 한다', () => {
      const startDate = new Date(Date.UTC(2023, 0, 1));
      const endDate = new Date(Date.UTC(2023, 0, 1));
      const { startOfDay, endOfDay } = DateUtils.getUTCStartAndEndOfRange(
        startDate,
        endDate,
      );

      expect(startOfDay.getTime()).toBe(startDate.setUTCHours(0, 0, 0, 0));
      expect(endOfDay.getTime()).toBe(endDate.setUTCHours(23, 59, 59, 999));
    });
  });

  describe('getUTCStartAndEndOfMonth', () => {
    it('주어진 달의 시작과 끝을 반환해야 한다', () => {
      const { startOfMonth, endOfMonth } = DateUtils.getUTCStartAndEndOfMonth(
        2023,
        0,
      );

      expect(startOfMonth.getUTCFullYear()).toBe(2023);
      expect(startOfMonth.getUTCMonth()).toBe(0);
      expect(startOfMonth.getUTCDate()).toBe(1);
      expect(startOfMonth.getUTCHours()).toBe(0);
      expect(startOfMonth.getUTCMinutes()).toBe(0);
      expect(startOfMonth.getUTCSeconds()).toBe(0);
      expect(startOfMonth.getUTCMilliseconds()).toBe(0);

      expect(endOfMonth.getUTCFullYear()).toBe(2023);
      expect(endOfMonth.getUTCMonth()).toBe(0);
      expect(endOfMonth.getUTCDate()).toBe(31);
      expect(endOfMonth.getUTCHours()).toBe(23);
      expect(endOfMonth.getUTCMinutes()).toBe(59);
      expect(endOfMonth.getUTCSeconds()).toBe(59);
      expect(endOfMonth.getUTCMilliseconds()).toBe(999);
    });
  });
});
