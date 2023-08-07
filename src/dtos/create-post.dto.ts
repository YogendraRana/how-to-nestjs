import { IsString } from "class-validator";

export class CreatePostDto {

    @IsString()
    userId: string;

    @IsString()
    caption: string;

    @IsString()
    location: string;

    images: object[]
}