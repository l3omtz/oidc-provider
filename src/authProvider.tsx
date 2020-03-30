import * as React from 'react';
import UserManager from './userManager';
import { IAuthProvider } from './IAuthProvider'
import { AuthContext } from './authContext';

export class AuthProvider extends React.Component<IAuthProvider> {
    userManager: any;

    constructor(props: IAuthProvider) {
        super(props);
        this.userManager = new UserManager(props.authConfig)
    }

    render() {
        return (
            <AuthContext.Provider value={this.userManager}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}