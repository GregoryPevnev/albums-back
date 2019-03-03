import Entity from "../common/entity";
import Password from "./password";
import { generatePassword } from "./password";

interface User extends Entity {
    username: string;
    email: string;
    password: Password;
}

export interface CreateUserData {
    email: string;
    username: string;
    password: string;
}

export interface CreateTokenData {
    email: string;
    password: string;
}

export const generateUser = async ({ password, username, email }: CreateUserData): Promise<User> => {
    const hash = await generatePassword(password);
    return { username, email, password: hash };
};

export default User;
