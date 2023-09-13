import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryFilter {
  buildWherePropForFind(filter: { [filterName: string]: number }) {
    const where = {};

    for (const key in filter) {
      if (!filter[key]) continue;

      where[key] = filter[key];
    }

    return where;
  }
}
