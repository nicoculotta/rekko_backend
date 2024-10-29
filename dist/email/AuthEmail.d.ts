interface iEmail {
    email: string;
    name: string;
    token: string;
}
export declare class AuthEmail {
    static sendConfirmationEmail({ email, name, token }: iEmail): Promise<void>;
}
export {};
