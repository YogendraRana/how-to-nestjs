import { Gender } from '@prisma/client';

export interface UserInterface {
    id: string;
    email: string;
    phone?: string;
    name: string;
    gender: Gender;
    dob: Date;
    password: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}