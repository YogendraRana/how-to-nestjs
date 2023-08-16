import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

@Injectable()
export class UpdateReactionDto {
    @ApiProperty({ example: "Love" })
    @IsString()
    @IsOptional()
    name?: string


    @ApiProperty({ example: 100 })
    @IsString()
    @IsOptional()
    price?: number;
}