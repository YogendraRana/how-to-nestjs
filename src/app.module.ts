import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import controllers
import { AppController } from './app.controller';

// import services
import { AppService } from './app.service';

// import modules
import { OtpModule } from './modules/otp/otp.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { PostReactionsModule } from './modules/postreactions/postreactions.module';


@Module({
    imports: [
        OtpModule,
        AuthModule,
        UserModule,
        ChatModule,
        PostsModule,
        CommentsModule,
        ReactionsModule,
        PostReactionsModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ],
    controllers: [AppController],
    providers: [AppService],
})


export class AppModule { }