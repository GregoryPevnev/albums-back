import Knex from "knex";
import _ from "lodash";
import User from "../application/users/user";
import Id, { generateId } from "../application/common/id";
import UserRepo from "../application/users/userRepo";
import { UserExists } from "../application/users/userRepo";
import Password from "../application/users/password";

interface UserDTO {
    id?: Id;
    email: string;
    username: string;
    password: string;
}

export const USER_TABLE = "users";

class UserSqlRepo extends UserRepo {
    private toEntity(data: UserDTO): User {
        return { id: data.id, username: data.username, email: data.email, password: new Password(data.password) };
    }

    private toDTO(user: User): UserDTO {
        return { ..._.pick(user, ["id", "username", "email"]), password: user.password.toString() };
    }

    private async update(user: UserDTO): Promise<any> {
        await this.client
            .update(user)
            .table(USER_TABLE)
            .where({ id: user.id })
            .thenReturn();
    }

    private async insert(user: UserDTO): Promise<any> {
        await this.client
            .insert(user)
            .table(USER_TABLE)
            .thenReturn();
    }

    constructor(private readonly client: Knex) {
        super();
    }

    public async find(id: Id): Promise<User | null> {
        const users = await this.client
            .select(["id", "username", "email", "password"])
            .from(USER_TABLE)
            .where({ id });
        if (!users || users.length == 0) return null;
        return this.toEntity(users[0]);
    }

    public async delete(user: User): Promise<any> {
        await this.client
            .delete()
            .table(USER_TABLE)
            .where({ id: user.id });
    }

    public async save(user: User): Promise<User> {
        const isNew = !user.id;

        if (!user.id) user.id = generateId();

        const dto = this.toDTO(user);

        if (!isNew) await this.update(dto);
        else await this.insert(dto);
        return user;
    }

    public async checkUser(user: User): Promise<UserExists | null> {
        const result = await this.client
            .select(["id", "username", "email"])
            .from(USER_TABLE)
            .where({ email: user.email })
            .orWhere({ username: user.username });

        for (let u of result) {
            if (u.id !== user.id && u.email === user.email) return UserExists.Email;
            if (u.id !== user.id && u.username === user.username) return UserExists.Username;
        }

        return null;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const data = await this.client
            .select(["id", "username", "email", "password"])
            .from(USER_TABLE)
            .where({ email });

        if (!data || data.length == 0) return null;

        return this.toEntity(data[0]);
    }
}

export default UserSqlRepo;
