import { Gender } from '@prisma/client';

export interface UserInterface {
    id: string;
    email: string;
    phone: string;
    name: string;
    gender: Gender;
    date_of_birth: Date;
    password: string;
    isPrivate: boolean;

    created_at: Date;
    updated_at: Date;
}