import { ValidatorConstraint } from 'class-validator';
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { OAuthProvider } from '../constants/const';

@ValidatorConstraint()
export class ProviderValidator implements PipeTransform {
  transform(provider: string): OAuthProvider {
    const convertedProvider = OAuthProvider[provider.toUpperCase()];
    if (!OAuthProvider.hasOwnProperty(convertedProvider)) {
      throw new BadRequestException(
        '올바르지 않은 OAuthProvider 입니다.',
        'InvalidProvider',
      );
    }

    return convertedProvider;
  }
}
