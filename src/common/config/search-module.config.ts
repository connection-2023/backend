import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
// node: configService.get<string>('ES_NODE')||,

export const CustomElasticSearchModule = ElasticsearchModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    node: 'http://localhost:9200',
    maxRetries: 10,
    requestTimeout: 600,
    pingTimeout: 600,
    auth: {
      username: 'elastic',
      password: 'test123',
    },
  }),
  inject: [ConfigService],
});
