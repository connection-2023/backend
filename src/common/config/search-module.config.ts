import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

export const CustomElasticSearchModule = ElasticsearchModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    node:
      configService.get<string>('SEARCH_SERVER_URL') || 'http://localhost:9200',
    maxRetries: 10,
    requestTimeout: 600,
    pingTimeout: 600,
    auth: {
      username: configService.get<string>('ES_USERNAME'),
      password: configService.get<string>('ES_PASSWORD'),
    },
  }),
  inject: [ConfigService],
});
