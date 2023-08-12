import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
    @ApiProperty({example: "This is a post caption."})
    @IsOptional()
    @IsString()
    caption?: string;


    @ApiProperty({example: "Pokhara, Nepal"})
    @IsOptional()
    @IsString()
    location?: string;


    @ApiProperty({example: true})
    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;
}