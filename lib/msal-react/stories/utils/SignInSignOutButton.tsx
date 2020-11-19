/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "../../src";

export const SignInSignOutButton = ({...args}) => {
    const { instance } = useMsal();
    return (
        <>
            <AuthenticatedTemplate {...args}>
                <button onClick={() => instance.logout()}>Logout</button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate {...args}>
                <button onClick={() => instance.loginPopup()}>Login</button>
            </UnauthenticatedTemplate>
        </>
    );
};
