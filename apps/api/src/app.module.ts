import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';
import { TaskListsModule } from './tasklists/tasklists.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { HistoriesModule } from './histories/histories.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'client', 'dist'),
    }),
    TasksModule,
    TaskListsModule,
    PrioritiesModule,
    HistoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
