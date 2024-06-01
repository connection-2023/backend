import { Transform } from 'class-transformer';

export function ToFixedStars() {
  return function (target: any, key: string) {
    Transform(({ obj }) => formatStarsAsSingleDecimal(obj[key]), {
      toClassOnly: true,
    })(target, key);
  };
}

function formatStarsAsSingleDecimal(stars: string): string {
  const starsNumber = parseFloat(stars);
  return !isNaN(starsNumber) && starsNumber > 0 ? starsNumber.toFixed(1) : '0';
}
