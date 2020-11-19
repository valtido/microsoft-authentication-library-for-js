/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as React from "react";
import { AuthenticatedTemplate, AuthenticatedTemplateProps, MsalProvider, UnauthenticatedTemplate } from "../../src";
import { DisplayNotSignedInMessage } from "../utils/DisplayNotSignedInMessage";
import { DisplayWelcomeMessage } from "../utils/DisplayWelcomeMessage";
import { defaultMsalConfig } from "../msalInstance";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export default {
    title: "MSAL React/Components/Authenticated Templates"
};

type StoryType = AuthenticatedTemplateProps & {
    msalConfig: Configuration
};

const StoryTemplate = ({msalConfig, ...args}: StoryType) => {
    const msalInstance = new PublicClientApplication(msalConfig);
    return (
        <MsalProvider instance={msalInstance}>
            <p>This page has content that will only render if you are authenticated.</p>
            <p>Authentication status templates can optionally be scoped to a specific user.</p>
            <AuthenticatedTemplate {...args}>
                <DisplayWelcomeMessage {...args} />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate {...args}>
                <DisplayNotSignedInMessage {...args} />
            </UnauthenticatedTemplate>
        </MsalProvider>
    );
};

export const AuthenticatedStory = StoryTemplate.bind({});
AuthenticatedStory.storyName = "Authenticated Templates";
AuthenticatedStory.args = {
    username: "",
    msalConfig: defaultMsalConfig
};
