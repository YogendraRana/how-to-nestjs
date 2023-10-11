import { ApiTags } from '@nestjs/swagger'; 
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { DeleteMessageDto } from './dtos/delete-message.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Controller, Post, Body, Delete, Get, Query, Param } from '@nestjs/common';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
    constructor(private readonly chatsService: ChatService) { }


    // send message
    @Public()
    @Post('messages')
    async sendMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.chatsService.sendMessage(createMessageDto);
    }


    // read all messages of a chat
    @Public()
    @Get('messages')
    async readMessagesOfChat(@Body('chatId') chatId: string) {
        return this.chatsService.readMessagesOfChat(chatId);
    }


    // delete message
    @Public()
    @Delete('messages')
    async deleteMessage(@Body() deleteMessageDto: DeleteMessageDto) {
        return this.chatsService.deleteMessage(deleteMessageDto);
    }


    // chat routes
    // read all chats of a user
    @Public()
    @Get()
    async readAllChatsOfUser(@Query('userId') userId: string) {
        return this.chatsService.readAllChatsOfUser(userId);
    }


    // delete chat
    @Public()
    @Delete()
    async deleteChat(@Param('chatId') chatId: string) {
        return this.chatsService.deleteChat(chatId);
    }
}
