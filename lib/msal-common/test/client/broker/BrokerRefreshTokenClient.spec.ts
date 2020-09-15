import { expect } from "chai";
import sinon from "sinon";
import {
    AUTHENTICATION_RESULT,
    DEFAULT_OPENID_CONFIG_RESPONSE,
    TEST_CONFIG,
    TEST_TOKENS,
    TEST_DATA_CLIENT_INFO,
    ID_TOKEN_CLAIMS,
} from "../../utils/StringConstants";
import { BaseClient } from "../../../src/client/BaseClient";
import { CredentialType } from "../../../src/utils/Constants";
import { ClientTestUtils } from "../ClientTestUtils";
import { Authority } from "../../../src/authority/Authority";
import { RefreshTokenClient } from "../../../src/client/RefreshTokenClient";
import { BrokerRefreshTokenClient } from "../../../src/client/broker/BrokerRefreshTokenClient";
import { IdToken } from "../../../src/account/IdToken";
import { RefreshTokenRequest } from "../../../src/request/RefreshTokenRequest";
import { AccountEntity } from "../../../src/cache/entities/AccountEntity";
import { RefreshTokenEntity } from "../../../src/cache/entities/RefreshTokenEntity";
import { CacheManager } from "../../../src/cache/CacheManager";

const testAccountEntity: AccountEntity = new AccountEntity();
testAccountEntity.homeAccountId = `${TEST_DATA_CLIENT_INFO.TEST_UID}.${TEST_DATA_CLIENT_INFO.TEST_UTID}`;
testAccountEntity.localAccountId = "testId";
testAccountEntity.environment = "login.windows.net";
testAccountEntity.realm = ID_TOKEN_CLAIMS.tid;
testAccountEntity.username = ID_TOKEN_CLAIMS.preferred_username;
testAccountEntity.authorityType = "MSSTS";

const testRefreshTokenEntity: RefreshTokenEntity = new RefreshTokenEntity();
testRefreshTokenEntity.homeAccountId = `${TEST_DATA_CLIENT_INFO.TEST_UID}.${TEST_DATA_CLIENT_INFO.TEST_UTID}`;
testRefreshTokenEntity.clientId = TEST_CONFIG.MSAL_CLIENT_ID;
testRefreshTokenEntity.environment = testAccountEntity.environment;
testRefreshTokenEntity.realm = ID_TOKEN_CLAIMS.tid;
testRefreshTokenEntity.secret = AUTHENTICATION_RESULT.body.refresh_token;
testRefreshTokenEntity.credentialType = CredentialType.REFRESH_TOKEN;

describe("BrokerRefreshTokenClient unit tests", () => {
    beforeEach(() => {
        ClientTestUtils.setCloudDiscoveryMetadataStubs();
    });

    afterEach(() => {
        sinon.restore();
    });

    it("creates a BrokerRefreshTokenClient", async () => {
        sinon.stub(Authority.prototype, <any>"discoverEndpoints").resolves(DEFAULT_OPENID_CONFIG_RESPONSE);
        const config = await ClientTestUtils.createTestClientConfiguration();
        const client = new BrokerRefreshTokenClient(config);
        expect(client).to.be.not.null;
        expect(client instanceof BrokerRefreshTokenClient).to.be.true;
        expect(client instanceof RefreshTokenClient).to.be.true;
        expect(client instanceof BaseClient).to.be.true;
    });

    it("acquireToken acquires a token", async () => {        
        sinon.stub(Authority.prototype, <any>"discoverEndpoints").resolves(DEFAULT_OPENID_CONFIG_RESPONSE);
        AUTHENTICATION_RESULT.body.client_info = TEST_DATA_CLIENT_INFO.TEST_DECODED_CLIENT_INFO;
        sinon.stub(RefreshTokenClient.prototype, <any>"executePostToTokenEndpoint").resolves(AUTHENTICATION_RESULT);
        sinon.stub(IdToken, "extractIdToken").returns(ID_TOKEN_CLAIMS);
        sinon.stub(CacheManager.prototype, "getAccount").returns(testAccountEntity);
        sinon.stub(CacheManager.prototype, "getRefreshTokenEntity").returns(testRefreshTokenEntity);

        const config = await ClientTestUtils.createTestClientConfiguration();
        const client = new BrokerRefreshTokenClient(config);
        const refreshTokenRequest: RefreshTokenRequest = {
            scopes: TEST_CONFIG.DEFAULT_GRAPH_SCOPE,
            refreshToken: TEST_TOKENS.REFRESH_TOKEN,
            claims: TEST_CONFIG.CLAIMS
        };

        const authResult = await client.acquireToken(refreshTokenRequest);
        expect(authResult.tokensToCache.accessToken.secret).to.deep.eq(AUTHENTICATION_RESULT.body.access_token);
        expect(authResult.tokensToCache.idToken.secret).to.deep.eq(AUTHENTICATION_RESULT.body.id_token);
        expect(authResult.tokensToCache.refreshToken).to.be.null;
    });
});
