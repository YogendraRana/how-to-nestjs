import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNotEmpty } from "class-validator";

export class CreatePostDto {
    @ApiProperty({example: "cll36uuxa0000yzh8vte1hcqw"})
    @IsString()
    @IsNotEmpty()
    userId: string;


    @ApiProperty({example: "This is a post caption."})
    @IsString()
    caption?: string;


    @ApiProperty({example: "Pokhara, Nepal"})
    @IsString()
    location?: string;


    @ApiProperty({example: false})
    @IsBoolean()
    isPrivate: boolean;
}