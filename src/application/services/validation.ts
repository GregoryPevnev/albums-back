import { CreateUserData, CreateTokenData } from "../users/user";
import { AlbumData } from "../albums/album";
import { ReviewData } from "../albums/review";
import Song from "../albums/song";

interface Validator<T> {
    (data: any): T;
}

interface Validators {
    validateSignUp: Validator<CreateUserData>;
    validateSignIn: Validator<CreateTokenData>;
    validateAlbum: Validator<AlbumData>;
    validateReview: Validator<ReviewData>;
    validateDetails: Validator<AlbumData>;
}

export default Validators;
