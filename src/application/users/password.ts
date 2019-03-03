import crypt from "bcrypt";
import Value from "../common/value";

const SALT_ROUNDS = 3;

class Password implements Value {
    constructor(private readonly hash: string) {}

    public check(password: string): Promise<boolean> {
        return crypt.compare(password.toString(), this.hash.toString());
    }

    public toString(): string {
        return this.hash.toString();
    }
}

export const generatePassword = async (password: string): Promise<Password> => {
    const salt = await crypt.genSalt(SALT_ROUNDS);
    const hash = await crypt.hash(password, salt);
    return new Password(hash.toString());
};

export default Password;
