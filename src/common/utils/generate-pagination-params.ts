import {
  IPaginationOptions,
  IPaginationParams,
} from '../interface/common-interface';

export const generatePaginationParams = (
  options: IPaginationOptions,
): IPaginationParams => {
  const { currentPage, targetPage, firstItemId, lastItemId, take } = options;

  const isPagination = currentPage && targetPage;
  const isInfiniteScroll = lastItemId && take;

  let cursor;
  let skip;
  let updatedTake = take;

  if (isPagination) {
    const pageDiff = currentPage - targetPage;
    cursor = { id: pageDiff <= -1 ? lastItemId : firstItemId };
    skip = Math.abs(pageDiff) === 1 ? 1 : (Math.abs(pageDiff) - 1) * take + 1;
    updatedTake = pageDiff >= 1 ? -take : take;
  } else if (isInfiniteScroll) {
    cursor = { id: lastItemId };
    skip = 1;
  }

  return { cursor, skip, take: updatedTake };
};
