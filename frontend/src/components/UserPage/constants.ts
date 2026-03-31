import { UserPage, UserPageProps } from "./types";

export const USERDATA: UserPageProps = {
    User: {
        name: "User.user.name",
        lastName: "User.user.last",
        email: "User.user.email",
    },
};
export const USERPAGE: UserPage = {
    welcome: "User.userpage.welcome",
    liked: "User.userpage.liked",
    cart: "User.userpage.cart",
    user: { show: "User.userpage.user.show", hide: "User.userpage.user.hide" },
    name: "User.userpage.name",
    last: "User.userpage.last",
    email: "User.userpage.email",
};
