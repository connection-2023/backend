import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

export const CustomElasticSearchModule = ElasticsearchModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    node: configService.get<string>('SEARCH_SERVER_URL'),
    maxRetries: 10,
    requestTimeout: 1200,
    pingTimeout: 1200,
    auth: {
      username: configService.get<string>('ES_USERNAME'),
      password: configService.get<string>('ES_PASSWORD'),
    },
  }),
  inject: [ConfigService],
});
