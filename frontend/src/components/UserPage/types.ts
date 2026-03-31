export interface UserPage {
    welcome: string;
    liked: string;
    cart: string;
    user: { show: string; hide: string };
    name: string;
    last: string;
    email: string;
}

export type UserPageProps = {
    User: {
        name: string;
        lastName: string;
        email: string;
    };
};
