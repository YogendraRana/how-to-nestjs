import axios from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException } from '@nestjs/common';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UpdateReactionDto } from './dtos/update-reaction.dto';


@Injectable()
export class ReactionsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) { }


    // create reaction
    async createReaction(image: Express.Multer.File, createReactionDto: CreateReactionDto) {

        // check if the reaction already exists
        const reaction = await this.prismaService.reaction.findUnique({
            where: {
                name: createReactionDto.name.toLowerCase(),
            }
        })

        if (reaction) throw new HttpException(`Reaction with the name ${createReactionDto.name} already exists`, 400);

        // prepare form data
        const formData = new FormData();
        formData.append('file', image.buffer, image.originalname);
        formData.append('requireSignedURLs', 'false');

        const response = await axios.post(process.env.CLOUDFLARE_IMAGES_URL, formData, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        let publicUrl: string
        const variants = response.data.result.variants;

        for (const variant of variants) {
            if (variant.includes('/public')) {
                publicUrl = variant;
            }
        }

        // create reaction
        await this.prismaService.reaction.create({
            data: {
                name: createReactionDto.name.toLowerCase(),
                price: Number(createReactionDto.price),
                url: publicUrl,
                imageId: response.data.result.id,
            },
        })

        return {
            success: true,
            message: 'Reaction created successfully',
        }
    }


    // read all reactions
    async readAllReactions() {
        const reactions = await this.prismaService.reaction.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        if (!reactions.length) throw new HttpException('No reactions found', 404);

        return {
            success: true,
            message: 'Reactions fetched successfully',
            data: reactions,
        }
    }


    // read a reaction
    async readReaction(reactionId: string) {
        const reaction = await this.prismaService.reaction.findUnique({
            where: { id: reactionId },
        });

        if (!reaction) throw new HttpException('Reaction not found', 404);

        return {
            success: true,
            message: 'Reaction fetched successfully',
            data: reaction,
        }
    }


    // update a reaction
    async updateReaction(image: Express.Multer.File, reactionId: string, updateReactionDto: UpdateReactionDto) {

        // check if the reaction exists
        const reaction = await this.prismaService.reaction.findUnique({
            where: { id: reactionId },
        })

        if (!reaction) throw new HttpException('Reaction not found', 404);

        // check if the name is already used
        if (updateReactionDto.name && reaction.name === updateReactionDto.name.toLocaleLowerCase()) {
            throw new HttpException(`Reaction with the name ${updateReactionDto.name} already exists`, 400);
        }

        // update data
        const updatedData: any = {
            name: updateReactionDto.name ? updateReactionDto.name.toLowerCase() : reaction.name,
            price: Number(updateReactionDto.price) || reaction.price,
        };

        // if image is provided
        if (image) {
            // delete old image
            await axios.delete(`${process.env.CLOUDFLARE_IMAGES_URL}/${reaction.imageId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            // upload new image
            const formData = new FormData();
            formData.append('file', image.buffer, image.originalname);
            formData.append('requireSignedURLs', 'false');

            const response = await axios.post(process.env.CLOUDFLARE_IMAGES_URL, formData, {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            let publicUrl: string
            const variants = response.data.result.variants;

            for (const variant of variants) {
                if (variant.includes('/public')) {
                    publicUrl = variant;
                }
            }

            // update data
            updatedData.url = publicUrl;
            updatedData.imageId = response.data.result.id;
        }

        await this.prismaService.reaction.update({
            where: { id: reactionId },
            data: updatedData
        })

        return {
            success: true,
            message: 'Reaction updated successfully',
            data: reaction,
        }
    }


    // delete a reaction
    async deleteReaction(reactionId) {
        // check if the reaction exists
        const reaction = await this.prismaService.reaction.findUnique({
            where: { id: reactionId },
        })

        if (!reaction) throw new HttpException('Reaction not found', 404);

        // delete image
        await axios.delete(`${process.env.CLOUDFLARE_IMAGES_URL}/${reaction.imageId}`, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        // delete data form database
        await this.prismaService.reaction.delete({
            where: { id: reactionId }
        })

        return {
            success: true,
            message: 'Reaction deleted successfully',
        }
    }
}