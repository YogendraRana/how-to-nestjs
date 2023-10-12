import {
    MessageBody,
    OnGatewayInit,
    WebSocketServer,
    ConnectedSocket,
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayDisconnect,
    OnGatewayConnection,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { DeleteMessageDto } from './dtos/delete-message.dto';
import { CreateMessageDto } from './dtos/create-message.dto';


@WebSocketGateway({ cors: { origin: '*', credentials: true }, pingInterval: 10000, pingTimeout: 15000 })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly chatService: ChatService,
    ) { }

    private activeUsers = new Map<string, string>();


    @WebSocketServer() server: Server;


    // implement afterInt, handleConnection, and handleDisconnect
    afterInit() {
        console.log('Socket initialized.');
    }


    handleConnection(client: Socket) {

        if (!client.handshake.query.userId) {
            client.emit('unauthorized', { message: 'Missing or invalid authentication token.' });
            client.disconnect(true);
        }

        // we can verify user using the userId or token
        // it will be done in future
        const userId = client.handshake.query.userId as string;

        // if the userId is in the activeUsers map, it means the user is already connected
        if (!this.activeUsers.has(userId)) {
            this.activeUsers.set(userId, client.id);
        }

        const arrayOfObjects = Array.from(this.activeUsers, ([key, value]) => ({ key, value }));

        console.log(arrayOfObjects);

    }


    handleDisconnect(client: Socket) {
        // Find the user with the corresponding socket ID and remove them
        for (const [userId, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                this.activeUsers.delete(userId);
                break;
            }
        }

        console.log(`Client disconnected: ${client.id}`);
    }


    // listen for get_online_users event
    @SubscribeMessage('get_online_users')
    async getOnlineUsers(@MessageBody() message: { userId: string }, @ConnectedSocket() client: Socket) {
        // get the online users with whom user has chat history
        const onlineUsers = [];
        const userId = message.userId;
        const { chats } = await this.chatService.readAllChatsOfUser(userId);

        for (const chat of chats) {
            for (const member of chat.members) {
                if (member.id !== userId) {
                    const memberSocketId = this.activeUsers.get(member.id);

                    if (memberSocketId) {
                        onlineUsers.push(member.id);
                    }
                }
            }
        }

        client.emit('online_users', onlineUsers);
    }


    // listen for send_message event
    @SubscribeMessage('send_message')
    async createMessage(@MessageBody() message: CreateMessageDto, @ConnectedSocket() client: Socket) {
        await this.chatService.sendMessage(message);

        // get the receiver's socket ID and emit the message to them
        const receiverSocketId = this.activeUsers.get(message.receiverId);

        if (receiverSocketId) {
            client.to(receiverSocketId).emit('receive_message', message);
        }
    }


    // listen for delete_message event
    @SubscribeMessage('delete_message')
    async deleteMessage(@MessageBody() deleteMessageDto: DeleteMessageDto) {
        // delete message from db
        await this.chatService.deleteMessage(deleteMessageDto);

        const chat = await this.chatService.getChatById(deleteMessageDto.chatId);

        // iterate over the members of the chat
        for (const member of chat.members) {
            if (member.id !== deleteMessageDto.senderId) {
                const memberSocketId = this.activeUsers.get(member.id);

                if (memberSocketId) {
                    this.server.to(memberSocketId).emit('message_deleted', deleteMessageDto.messageId);
                }
            }
        }
    }


    // listen for typing event
    @SubscribeMessage('typing')
    async typing(@MessageBody() data: { senderId: string, chatId: string, isTyping: boolean }) {
        const chat = await this.chatService.getChatById(data.chatId);
        const sender = chat.members.find(member => member.id === data.senderId);

        // iterate over the members of the chat
        for (const member of chat.members) {
            if (member.id !== data.senderId) {
                const memberSocketId = this.activeUsers.get(member.id);

                if (memberSocketId) {
                    this.server.to(memberSocketId).emit('typing', {
                        message: `${sender.name} is typing...`
                    });
                }
            }
        }
    }
}