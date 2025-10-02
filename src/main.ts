import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './common/interceptors/responseTransform.interceptor';
import { AllExceptionsFilter } from './common/filters/allExceptions.filter';
import { setupApp } from './config/appSetup';
import { I18nService } from 'nestjs-i18n';
import "reflect-metadata";
import { initializeTransactionalContext } from 'typeorm-transactional';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RateLimitMiddleware } from './common/middlewares/rateLimiter.midleware';



async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
  });
  

  //Serve public folder at /public URL
  app.useStaticAssets(join(__dirname, '..', 'src/public'), {
    prefix: '/src/public/',
  });

  //enable CORS
  app.enableCors({ origin: '*' });

  //main.ts setups
  //await setupApp(app);

  //global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true,
  }));

  //global interceptors
  app.useGlobalInterceptors(app.get(TransformResponseInterceptor)); 

  //get I18nService translate
  const i18n = app.get<I18nService>(I18nService);

  //middleware
  app.use(new RateLimitMiddleware().use);

  //global filters
  app.useGlobalFilters(new AllExceptionsFilter(i18n));

  //socket
  app.useWebSocketAdapter(new IoAdapter(app));


  //await app.listen(8080, '0.0.0.0');
  await app.listen(process.env.PORT ?? 8080)

}
bootstrap();
