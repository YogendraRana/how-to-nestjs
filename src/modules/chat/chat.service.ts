import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { DeleteMessageDto } from './dtos/delete-message.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';


@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }


    // get chat by id
    async getChatById(chatId: string) {
        const chat = await this.prismaService.chat.findUnique({
            where: { id: chatId },
            include: {
                members: true,
            },
        });
        
        if (!chat) throw new HttpException("Chat not found", 404);

        return chat;
    }


    // create private chat
    async createPrivateChat(senderId: string, receiverId: string) {
        if (!senderId || !receiverId) throw new HttpException("Please provide the ID of members of the chat", 400);

        const sender = await this.prismaService.user.findUnique({ where: { id: senderId } });
        const receiver = await this.prismaService.user.findUnique({ where: { id: receiverId } });

        if (!sender || !receiver) throw new HttpException("One of the user ID is invalid", 400);

        const chat = await this.prismaService.chat.create({
            data: {
                isGroup: false,
                members: {
                    connect: [
                        { id: senderId },
                        { id: receiverId }
                    ]
                }
            },
        });

        return chat;
    }

    // create message
    async createMessage(createMessageDto: CreateMessageDto) {
        const message = await this.prismaService.message.create({
            data: createMessageDto
        });

        return {
            success: true,
            message: "Message created successfully",
            new_message: message
        };
    }


    // send message
    async sendMessage(createMessageDto: CreateMessageDto) {
        if (!createMessageDto.chatId || createMessageDto.chatId === "") {

            // check if there is a chat between the two users but the frontend made a mistake in sending the chatId
            const chatExists = await this.prismaService.chat.findFirst({
                where: {
                    AND: [
                        { isGroup: false },
                        { members: { some: { id: createMessageDto.senderId }}},
                        { members: { some: { id: createMessageDto.receiverId }}}
                    ]
                }
            });

            if (chatExists) throw new HttpException("Chat exists between users but the chat ID is invalid or not provided", 400);

            // create chat
            const chat = await this.createPrivateChat(createMessageDto.senderId, createMessageDto.receiverId);
            createMessageDto.chatId = chat.id;

            // create message
            this.createMessage(createMessageDto);
        } else {
            const chat = await this.prismaService.chat.findUnique({ where: { id: createMessageDto.chatId } });
            if (!chat) throw new HttpException("Chat not found", 404);

            // create message
            this.createMessage(createMessageDto);
        }
    }


    // read all messages
    async readMessagesOfChat(chatId: string) {
        const messages = await this.prismaService.message.findMany({
            where: { chatId: chatId },
        })

        return messages;
    }


    // delete message
    async deleteMessage(deleteMessageDto: DeleteMessageDto) {
        const message = await this.prismaService.message.findUnique({ where: { id: deleteMessageDto.messageId } });
        if (!message) throw new HttpException("Message not found", 404);

        if (message.senderId !== deleteMessageDto.senderId) throw new HttpException("You are not authorized to delete this message", 401);

        await this.prismaService.message.delete({ where: { id: deleteMessageDto.messageId } });

        return {
            success: true,
            message: "Message deleted successfully",
            deleted_message: message
        };
    }


    // chat services
    // find all chats of user
    async readAllChatsOfUser(userId: string) {
        const chats = await this.prismaService.chat.findMany({
            where: {
                members: {
                    some: {
                        id: {
                            equals: userId,
                        },
                    },
                },
            },
            include: {
                members: true,
                messages: false,
            },
        });

        return {
            success: true,
            message: "Chats found successfully",
            chats: chats
        };
    }


    // delete chat
    async deleteChat(chatId: string) {
        const chat = await this.prismaService.chat.findUnique({ where: { id: chatId } });
        if (!chat) throw new HttpException("Chat not found", 404);

        await this.prismaService.chat.delete({ where: { id: chatId } });

        return {
            success: true,
            message: "Chat deleted successfully",
            deleted_chat: chat
        };
    }
}