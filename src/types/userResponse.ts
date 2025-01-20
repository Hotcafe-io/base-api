export enum SuccessMessage {
    UPDATED = "User updated",
    DELETED = "User deleted",
    AUTHENTICATED = "User authenticated",
    LOGOUT = "User logged out",
}

export enum ErrorMessage {
    PHONE_ALREADY_EXISTS = "Phone number already exists",
    EMAIL_ALREADY_EXISTS = "Email already exists",
    INTERNAL_SERVER_ERROR = "Internal server error",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden",
}

export interface IUserResponse {
    message: SuccessMessage | ErrorMessage;
}
