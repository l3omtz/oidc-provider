import { UserManager, WebStorageStateStore, Log, UserManagerSettings, User } from "oidc-client";

export default class UserManagerClient {
    UserManager: UserManager;
    authority: string | undefined;
    client_id: string | undefined;

    constructor(oidcConfig: UserManagerSettings) {
        this.UserManager = new UserManager({
            ...oidcConfig,
            userStore: new WebStorageStateStore({ store: window.sessionStorage })
        });
        this.authority = oidcConfig.authority;
        this.client_id = oidcConfig.client_id;

        // Logger
        Log.logger = console;
        Log.level = Log.DEBUG;
        this.UserManager.events.addUserLoaded((user: any) => {
            console.log('user: ', user)
            if (window.location.href.indexOf("signin-oidc") !== -1) {
                this.navigateToScreen();
            }
        });
        this.UserManager.events.addSilentRenewError((e) => {
            console.log("silent renew error", e.message);
        });

        this.UserManager.events.addAccessTokenExpired(() => {
            console.log("token expired");
            this.logout();
        });
    }

    getUser = async () => {
        const user = await this.UserManager.getUser();
        if (!user) {
            return await this.UserManager.signinRedirectCallback();
        }
        return user;
    };

    parseJwt = (token: string) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };

    navigateToScreen = () => {
        window.location.replace("/en/dashboard");
    };


    isAuthenticated = () => {
        const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${this.authority!}:${this.client_id}`)!)
        console.log('has oidc storage: ', oidcStorage)
        return (!!oidcStorage && !!oidcStorage.access_token)
    };

    signinSilentCallback = () => {
        this.UserManager.signinSilentCallback();
    };
    signinSilent = () => {
        this.UserManager.signinSilent()
            .then((user) => {
                console.log("signed in", user);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    signinRedirectCallback = (): Promise<User> => {
        return this.UserManager.signinRedirectCallback()
    };
    signinRedirect = () => {
        localStorage.setItem("redirectUri", window.location.pathname);
        this.UserManager.signinRedirect({});
    };
    signinCallback = () => {
        return this.UserManager.signinCallback()
    }

    createSigninRequest = () => {
        return this.UserManager.createSigninRequest();
    };

    logout = () => {
        this.UserManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token")
        });
        this.UserManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        this.UserManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            window.location.replace(process.env.REACT_APP_PUBLIC_URL!);
        });
        this.UserManager.clearStaleState();
    };
}
