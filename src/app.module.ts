import { Module } from '@nestjs/common';

// import modules
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CommentsModule } from './modules/comments/comments.module';

// import controllers
import { AppController } from './app.controller';

// import services
import { AppService } from './app.service';
import { ReactionsModule } from './modules/reactions/reactions.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PostsModule,
        PrismaModule,
        CommentsModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        ReactionsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }