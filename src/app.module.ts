import { Module } from '@nestjs/common';

// import modules
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { PostModule } from './modules/posts/post.module';

// import controllers
import { AppController } from './app.controller';

// import services
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PostModule,
        PrismaModule,
        CommentsModule,

        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
        }),

        MailerModule.forRoot({
            transport: {
                host: process.env.SENDGRID_HOST,
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD,
                }
            }
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }