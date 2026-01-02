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

const corosUrl = "https://teameuapi.coros.com";
const accountType = 2;

function login(account, md5PasswordHash) {
    const loginUrl = `${corosUrl}/account/login`;

    const payload = {
        account: account,
        accountType: accountType,
        pwd: md5PasswordHash,
    };

    const options = {
        method: "POST",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(loginUrl, options);

    if (response.getResponseCode() === 200) {
        const result = JSON.parse(response.getContentText());

        if (result.data && result.data.accessToken) {
            return result;
        }
    }
    throw new Error("Login failed. Check credentials or API status.");
}

function latestActivities(accessToken, activityCount, activityCodes) {
    // Fetches only running activities
    var codes = activityCodes.join(",");
    const activitiesListUrl = `${corosUrl}/activity/query?size=${activityCount}&pageNumber=1&modeList=${codes}`;

    const options = {
        method: "GET",
        headers: {
            accessToken: accessToken,
        },
        muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(activitiesListUrl, options);
    const activitiesList = JSON.parse(response.getContentText()).data.dataList;
    return activitiesList;
}

function exportCSV(accessToken, activity) {
    const options = {
        method: "GET",
        headers: {
            accessToken: accessToken,
        },
        muteHttpExceptions: true,
    };
    const activityCSVDownloadUrl = `${corosUrl}/activity/detail/download?labelId=${activity.labelId}&sportType=${activity.sportType}&fileType=0`;
    let response = UrlFetchApp.fetch(activityCSVDownloadUrl, options);
    const fileUrl = JSON.parse(response.getContentText()).data.fileUrl;

    response = UrlFetchApp.fetch(fileUrl, options);
    const blob = response.getBlob();
    return Utilities.parseCsv(blob.getDataAsString());
}
