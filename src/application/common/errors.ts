import { UserExists } from "../users/userRepo";
// Interfaces using Enums - Like Actions => If / Switch

export enum ErrorType {
    Validation = "validation",
    Authentication = "auth",
    UserExists = "user-exists",
    NotFound = "not-found"
}

export interface ValidationError {
    type: ErrorType.Validation;
    errors: string[];
}

export interface AuthenticationError {
    type: ErrorType.Authentication;
}

export interface UserExistsError {
    type: ErrorType.UserExists;
    kind: UserExists;
}

export interface NotFoundError {
    type: ErrorType.NotFound;
}

export const getAuthenticationError = (): AuthenticationError => ({ type: ErrorType.Authentication });

export const getValidationError = (errors: string[]): ValidationError => ({ type: ErrorType.Validation, errors });

export const getUserExistsError = (kind: UserExists): UserExistsError => ({ type: ErrorType.UserExists, kind });

export const getNotFoundError = (): NotFoundError => ({ type: ErrorType.NotFound });

type AppError = ValidationError | AuthenticationError | UserExistsError | NotFoundError;

export const isAppError = (error: any): error is AppError => Object.values(ErrorType).includes(error.type);

export default AppError;
