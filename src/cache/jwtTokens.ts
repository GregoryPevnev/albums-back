import { RedisClient } from "redis";
import jwt from "jsonwebtoken";
import Id from "../application/common/id";
import TokenService, { Token } from "../application/services/tokens";

class JWTTokens implements TokenService {
    private static readonly TOKENS = "expired-tokens";
    private static readonly DEFAULT_EXP = 60 * 60 * 24; // 1 Day - SECONDS (NOT MILLISECONDS)

    private getExp() {
        return this.expiration + Date.now() / 1000; // IMPORTANT: Secodns, NOT MILLISECONDS
    }

    constructor(
        private readonly client: RedisClient,
        private readonly secret: string,
        private readonly expiration: number = JWTTokens.DEFAULT_EXP
    ) {}

    public async getToken(id: Id): Promise<Token> {
        try {
            return jwt.sign({ id, exp: this.getExp() }, this.secret.toString()).toString();
        } catch (e) {
            return null;
        }
    }

    public async getData(token: Token): Promise<Id> {
        try {
            const check = await new Promise((res, rej) =>
                this.client.sismember(JWTTokens.TOKENS, token, (err, result) => {
                    if (err) rej(err);
                    else res(result);
                })
            );
            if (check) return null;

            const { id } = <any>jwt.verify(token, this.secret.toString());
            return id;
        } catch (e) {
            console.log("Cannot extrcat token", e);
            return null;
        }
    }

    public invalidateToken(token: Token): Promise<any> {
        return new Promise(res => {
            this.client.sadd(JWTTokens.TOKENS, token, res);
        });
    }
}

export default JWTTokens;
