// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        clientId: "4c837770-7a2b-471e-aafa-3328d04a23b1",
        authority: "https://login.microsoftonline.com/tfp/msidlabb2c.onmicrosoft.com/B2C_1_SISOPolicy/",
        knownAuthorities: ["login.microsoftonline.com"]
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
    scopes: ["https://msidlabb2c.onmicrosoft.com/4c837770-7a2b-471e-aafa-3328d04a23b1/read "]
};

export const forgotPasswordRequest = {
    authority: "https://login.microsoftonline.com/tfp/msidlabb2c.onmicrosoft.com/B2C_1_PasswordResetPolicy/"
}
