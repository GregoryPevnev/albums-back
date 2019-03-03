import User from "./user";
import Id from "../common/id";
import { generateId } from "../common/id";

export enum UserExists {
    Email = "email",
    Username = "username"
}

abstract class UserRepo {
    public abstract find(id: Id): Promise<User | null>;
    public abstract delete(user: User): Promise<any>;

    public abstract save(user: User): Promise<User>;

    public abstract checkUser(user: User): Promise<UserExists | null>;
    public abstract getUserByEmail(email: string): Promise<User | null>;
}

export default UserRepo;
