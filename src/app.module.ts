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

@Module({
    imports: [
        AuthModule,
        UserModule,
        PostModule,
        PrismaModule,

        ConfigModule.forRoot({envFilePath: '.development.env'}),

        JwtModule.register({
            global: true, 
            secret: process.env.JWT_SECRET, 
        }),

        MailerModule.forRoot({
            transport: {
                host: 'smtp.sendgrid.net',
                auth: {
                    user: 'apikey',
                    pass: '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'
                }
            }
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }