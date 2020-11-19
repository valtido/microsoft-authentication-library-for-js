/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PublicClientApplication } from "@azure/msal-browser";
import React from "react";
import { WithMsalProps, withMsal, MsalProvider } from "../../src";
import { defaultMsalConfig } from "../msalInstance";

export default {
    title: "MSAL React/Components/withMsal",
};

const withMsalExample = (args) => {
    const WelcomeMessage: React.FunctionComponent<WithMsalProps> = (props) => {
        const accounts = props.msalContext.accounts;
        
        if (accounts.length > 0) {
            return <span>Welcome! The <pre style={{display: "inline"}}>withMsal()</pre> higher-order component can see you are logged in with {accounts.length} accounts.</span>;
        } else {
            return <span>Welcome! The <pre style={{display: "inline"}}>withMsal()</pre> higher-order component has detected you are logged out!</span>;
        }
    };
    const WithMsalExample = withMsal(WelcomeMessage);
    const msalInstance = new PublicClientApplication(args.msalConfig);

    return (
        <MsalProvider instance={msalInstance}>
            <WithMsalExample />
        </MsalProvider>
    );
};

export const withMsalStory = withMsalExample.bind({});
withMsalStory.storyName = "withMsal Higher Order Component";
withMsalStory.args = {
    msalConfig: defaultMsalConfig
};
withMsalStory.parameters = {
    docs: {
        source: {
            type: "code"
        }
    }
};
