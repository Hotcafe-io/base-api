export enum SuccessMessage {
    UPDATED = "User updated",
    DELETED = "User deleted",
    AUTHENTICATED = "User authenticated",
    LOGOUT = "User logged out",
}

export enum ErrorMessage {
    INTERNAL_SERVER_ERROR = "Internal server error",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden",
}

export interface IUserResponse {
    message: SuccessMessage | ErrorMessage;
}
