import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest, graphConfig } from "./authConfig";

export default WrappedComponent =>
    class AuthProvider extends React.Component {
        msal;
        constructor(props) {
            super(props);
            this.state = {
                account: null,
                error: null,
                graphProfile: null
            };

            this.msal = new PublicClientApplication(msalConfig);
        }

        handleResponse(authResponse) {
            if (authResponse != null) {
                this.setState({
                    account: authResponse.account
                });
            } else {
                const currentAccounts = this.msal.getAllAccounts();
                if (currentAccounts.length > 0) {
                    this.setState({
                        account: currentAccounts[0]
                    })
                }
            }
        }

        async onSignIn(){
            this.props.interactionType === 'Redirect' ?
            this.msal.loginRedirect():
            this.msal.loginPopup().then(authResponse => {
                this.handleResponse(authResponse)
            }).catch((e) => {
                this.setState({
                    error: e
                });
                console.log(e);
            });
        }

        async onSignOut() {
            this.msal.logout({
                account: this.state.account
            });
        }

        async onRequestProfile() {
            this.msal.acquireTokenSilent({
                ...loginRequest,
                account: this.state.account
            }).then((response) => {
                this.callMsGraph(response.accessToken)
            }).catch(() => {
                const request = {
                    ...loginRequest,
                    loginHint: this.state.account.username    
                };

                if(this.props.interactionType === 'Redirect') {
                    this.msal.acquireTokenRedirect(request);
                } else {
                    this.msal.acquireTokenPopup(request).then(authResponse => {
                        this.handleResponse(authResponse)
                    }).catch((e) => {
                        this.setState({
                            error: e
                        });
                        console.log(e);
                    });

                }
            });
        }

        async callMsGraph(accessToken) {
            const headers = new Headers();
            const bearer = `Bearer ${accessToken}`;
        
            headers.append("Authorization", bearer);
        
            const options = {
                method: "GET",
                headers: headers
            };
        
            fetch(graphConfig.graphMeEndpoint, options)
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        graphProfile: response
                    });
                })
                .catch(error => console.log(error));
        }

        async componentDidMount() {
            this.msal.handleRedirectPromise().then(authResponse => {
                this.handleResponse(authResponse)
            }).catch((e) => {
                this.setState({
                    error: e
                });
                console.log(e);
            });
        }

        render() {
            return (
                <WrappedComponent 
                    {...this.props}
                    account={this.state.account}
                    error={this.state.error}
                    graphProfile={this.state.graphProfile}
                    onSignIn={() => this.onSignIn()}
                    onSignOut={() => this.onSignOut()}
                    onRequestProfile={() => this.onRequestProfile()}
                />
            )
        }
    }
