import * as Mocha from "mocha";
import { expect } from "chai";
import { ClientTestUtils } from "../ClientTestUtils";
import { Authority } from "../../../src/authority/Authority";
import { ClientConfiguration } from "../../../src/config/ClientConfiguration";
import { DEFAULT_OPENID_CONFIG_RESPONSE, TEST_URIS, TEST_CONFIG, AUTHENTICATION_RESULT, TEST_DATA_CLIENT_INFO, TEST_TOKENS } from "../../utils/StringConstants";
import { AuthorizationCodeClient } from "../../../src/client/AuthorizationCodeClient";
import { BrokerAuthorizationCodeClient } from "../../../src/client/broker/BrokerAuthorizationCodeClient";
import sinon from "sinon";
import { BaseClient } from "../../../src/client/BaseClient";
import { AuthorizationUrlRequest } from "../../../src/request/AuthorizationUrlRequest";
import { Constants, AADServerParamKeys, ResponseMode } from "../../../src/utils/Constants";
import { IdToken } from "../../../src/account/IdToken";
import { AuthorizationCodeRequest } from "../../../src/request/AuthorizationCodeRequest";

describe("BrokerAuthorizationCodeClient unit tests", () => {
    beforeEach(() => {
        ClientTestUtils.setCloudDiscoveryMetadataStubs();
    });

    afterEach(() => {
        const config = null;
        sinon.restore();
    });

    it("creates a BrokerAuthorizationCodeClient that extends AuthorizationCodeClient", async () => {
        sinon.stub(Authority.prototype, <any>"discoverEndpoints").resolves(DEFAULT_OPENID_CONFIG_RESPONSE);
        const config: ClientConfiguration = await ClientTestUtils.createTestClientConfiguration();
        const client = new BrokerAuthorizationCodeClient(config);
        expect(client).to.be.not.null;
        expect(client instanceof BrokerAuthorizationCodeClient).to.be.true;
        expect(client instanceof AuthorizationCodeClient).to.be.true;
        expect(client instanceof BaseClient).to.be.true;
    });

    it("Acquires a token successfully", async () => {
        sinon.stub(Authority.prototype, <any>"discoverEndpoints").resolves(DEFAULT_OPENID_CONFIG_RESPONSE);
        sinon.stub(AuthorizationCodeClient.prototype, <any>"executePostToTokenEndpoint").resolves(AUTHENTICATION_RESULT);
        const createTokenRequestBodySpy = sinon.spy(BrokerAuthorizationCodeClient.prototype, <any>"createTokenRequestBody");

        const config: ClientConfiguration = await ClientTestUtils.createTestClientConfiguration();
        // Set up required objects and mocked return values
        const testState = `eyAiaWQiOiAidGVzdGlkIiwgInRzIjogMTU5Mjg0NjQ4MiB9${Constants.RESOURCE_DELIM}userState`;
        const decodedLibState = "{ \"id\": \"testid\", \"ts\": 1592846482 }";
        config.cryptoInterface.base64Decode = (input: string): string => {
            switch (input) {
                case TEST_DATA_CLIENT_INFO.TEST_RAW_CLIENT_INFO:
                    return TEST_DATA_CLIENT_INFO.TEST_DECODED_CLIENT_INFO;
                case "eyAiaWQiOiAidGVzdGlkIiwgInRzIjogMTU5Mjg0NjQ4MiB9":
                    return decodedLibState;
                default:
                    return input;
            }
        };

        config.cryptoInterface.base64Encode = (input: string): string => {
            switch (input) {
                case "123-test-uid":
                    return "MTIzLXRlc3QtdWlk";
                case "456-test-utid":
                    return "NDU2LXRlc3QtdXRpZA==";
                case TEST_DATA_CLIENT_INFO.TEST_RAW_CLIENT_INFO:
                    return TEST_DATA_CLIENT_INFO.TEST_DECODED_CLIENT_INFO;
                default:
                    return input;
            }
        };
        // Set up stubs
        const idTokenClaims = {
            "ver": "2.0",
            "iss": `${TEST_URIS.DEFAULT_INSTANCE}9188040d-6c67-4c5b-b112-36a304b66dad/v2.0`,
            "sub": "AAAAAAAAAAAAAAAAAAAAAIkzqFVrSaSaFHy782bbtaQ",
            "exp": 1536361411,
            "name": "Abe Lincoln",
            "preferred_username": "AbeLi@microsoft.com",
            "oid": "00000000-0000-0000-66f3-3332eca7ea81",
            "tid": "3338040d-6c67-4c5b-b112-36a304b66dad",
            "nonce": "123523",
        };
        sinon.stub(IdToken, "extractIdToken").returns(idTokenClaims);
        const client = new BrokerAuthorizationCodeClient(config);
        const authCodeRequest: AuthorizationCodeRequest = {
            authority: Constants.DEFAULT_AUTHORITY,
            scopes: [...TEST_CONFIG.DEFAULT_GRAPH_SCOPE, ...TEST_CONFIG.DEFAULT_SCOPES],
            redirectUri: TEST_URIS.TEST_REDIRECT_URI_LOCALHOST,
            code: TEST_TOKENS.AUTHORIZATION_CODE,
            codeVerifier: TEST_CONFIG.TEST_VERIFIER,
            claims: TEST_CONFIG.CLAIMS
        };

        const authenticationResult = await client.acquireToken(authCodeRequest, idTokenClaims.nonce, testState);

        expect(authenticationResult.tokensToCache.accessToken.secret).to.deep.eq(AUTHENTICATION_RESULT.body.access_token);
        expect(authenticationResult.tokensToCache.idToken.secret).to.deep.eq(AUTHENTICATION_RESULT.body.id_token);
        expect(authenticationResult.tokensToCache.refreshToken).to.be.null;
    });

    it("Creates an authorization url with default parameters", async () => {
        sinon.stub(Authority.prototype, <any>"discoverEndpoints").resolves(DEFAULT_OPENID_CONFIG_RESPONSE);
        const config: ClientConfiguration = await ClientTestUtils.createTestClientConfiguration();
        const client = new BrokerAuthorizationCodeClient(config);

        const brokerGetAuthCodeSpy = sinon.spy(BrokerAuthorizationCodeClient.prototype, <any>"createAuthCodeUrlQueryString");
        const getAuthCodeSpy = sinon.spy(AuthorizationCodeClient.prototype, <any>"createAuthCodeUrlQueryString");

        const authCodeUrlRequest: AuthorizationUrlRequest = {
            redirectUri: TEST_URIS.TEST_REDIRECT_URI_LOCALHOST,
            scopes: TEST_CONFIG.DEFAULT_SCOPES,
            codeChallenge: TEST_CONFIG.TEST_CHALLENGE,
            codeChallengeMethod: Constants.S256_CODE_CHALLENGE_METHOD
        };
        const loginUrl = await client.getAuthCodeUrl(authCodeUrlRequest);
        // Verify broker query string param is called and it calls the base function
        expect(brokerGetAuthCodeSpy.calledOnce).to.be.true;
        expect(getAuthCodeSpy.calledAfter(brokerGetAuthCodeSpy)).to.be.true;

        // Validate default fields are added to query string
        expect(loginUrl).to.contain(Constants.DEFAULT_AUTHORITY);
        expect(loginUrl).to.contain(DEFAULT_OPENID_CONFIG_RESPONSE.body.authorization_endpoint.replace("{tenant}", "common"));
        expect(loginUrl).to.contain(`${AADServerParamKeys.SCOPE}=${Constants.OPENID_SCOPE}%20${Constants.PROFILE_SCOPE}%20${Constants.OFFLINE_ACCESS_SCOPE}`);
        expect(loginUrl).to.contain(`${AADServerParamKeys.RESPONSE_TYPE}=${Constants.CODE_RESPONSE_TYPE}`);
        expect(loginUrl).to.contain(`${AADServerParamKeys.CLIENT_ID}=${TEST_CONFIG.MSAL_CLIENT_ID}`);
        expect(loginUrl).to.contain(`${AADServerParamKeys.REDIRECT_URI}=${encodeURIComponent(TEST_URIS.TEST_REDIRECT_URI_LOCALHOST)}`);
        expect(loginUrl).to.contain(`${AADServerParamKeys.RESPONSE_MODE}=${encodeURIComponent(ResponseMode.QUERY)}`);
        expect(loginUrl).to.contain(`${AADServerParamKeys.CODE_CHALLENGE}=${encodeURIComponent(TEST_CONFIG.TEST_CHALLENGE)}`);
        expect(loginUrl).to.contain(`${AADServerParamKeys.CODE_CHALLENGE_METHOD}=${encodeURIComponent(Constants.S256_CODE_CHALLENGE_METHOD)}`);
    });
});
