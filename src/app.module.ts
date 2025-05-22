import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: `.env/${process.env.NODE_ENV || 'development'}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('mongo.user');
        const password = configService.get<string>('mongo.password');
        const host = configService.get<string>('mongo.host');
        const port = configService.get<string>('mongo.port');
        const database = configService.get<string>('mongo.database');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
