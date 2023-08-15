import { Module } from '@nestjs/common';

// import controllers
import { AppController } from './app.controller';

// import services
import { AppService } from './app.service';

// import modules
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReactionsModule } from './modules/reactions/reactions.module';


@Module({
    imports: [
        AuthModule,
        UserModule,
        PostsModule,
        CommentsModule,
        ReactionsModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }