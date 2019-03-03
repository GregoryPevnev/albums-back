import Id from "../common/id";

export type Token = string;

interface TokenService {
    getToken(id: Id): Promise<Token>;
    getData(token: Token): Promise<Id>;
    invalidateToken(token: Token): Promise<any>;
}

export default TokenService;
