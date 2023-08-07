import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePostDto {

    @IsOptional()
    @IsString()
    caption?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}