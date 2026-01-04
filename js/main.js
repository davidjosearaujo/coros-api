// Copyright 2026 David Araújo
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const COROS_URL = "https://teameuapi.coros.com";
const ACCOUNT_TYPE = 2;

class CorosClient {
    constructor() {
        this.accessToken = null;
    }

    /**
     * Authenticates with Coros
     * @param {string} account - Email or username
     * @param {string} md5PasswordHash - MD5 hashed password
     */
    async login(account, md5PasswordHash) {
        const loginUrl = `${COROS_URL}/account/login`;

        const payload = {
            account: account,
            accountType: ACCOUNT_TYPE,
            pwd: md5PasswordHash,
        };

        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.data && result.data.accessToken) {
            this.accessToken = result.data.accessToken;
            return result;
        }

        throw new Error("Login failed. Check credentials or API status.");
    }

    /**
     * Fetches the latest activities
     * @param {number} activityCount - Number of activities to fetch
     * @param {number[]} activityCodes - Array of activity type IDs
     */
    async latestActivities(activityCount, activityCodes) {
        if (!this.accessToken) throw new Error("Not authenticated");

        const codes = activityCodes.join(",");
        const activitiesListUrl = `${COROS_URL}/activity/query?size=${activityCount}&pageNumber=1&modeList=${codes}`;

        const response = await fetch(activitiesListUrl, {
            method: "GET",
            headers: {
                accessToken: this.accessToken,
            },
        });

        const result = await response.json();
        return result.data?.dataList || [];
    }

    /**
     * Exports activity file (GPX, TCX, FIT, etc)
     * File types: 0 - csv, 1 - gpx, 2 - kml, 3 - tcx, 4 - fit
     * @param {Object} activity - The activity object from latestActivities
     * @param {number} fileType - Integer representing format
     * @returns {Promise<Blob>}
     */
    async exportActivity(activity, fileType) {
        if (!this.accessToken) throw new Error("Not authenticated");

        const activityDownloadUrl = `${COROS_URL}/activity/detail/download?labelId=${activity.labelId}&sportType=${activity.sportType}&fileType=${fileType}`;

        // Step 1: Get the download URL
        const metadataResponse = await fetch(activityDownloadUrl, {
            method: "GET",
            headers: {
                accessToken: this.accessToken,
            },
        });

        const metadata = await metadataResponse.json();
        const fileUrl = metadata.data?.fileUrl;

        if (!fileUrl) {
            throw new Error("Could not retrieve file download URL.");
        }

        const fileResponse = await fetch(fileUrl);
        return await fileResponse.blob();
    }
}