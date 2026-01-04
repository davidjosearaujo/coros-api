# Copyright 2026 David Araújo
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     https://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import requests

COROS_URL = "https://teameuapi.coros.com"
ACCOUNT_TYPE = 2

class CorosClient:
    def __init__(self):
        self.access_token = None

    def login(self, account, md5_password_hash):
        """
        Authenticates with Coros
        :param account: Email or username
        :param md5_password_hash: MD5 hashed password
        """
        login_url = f"{COROS_URL}/account/login"

        payload = {
            "account": account,
            "accountType": ACCOUNT_TYPE,
            "pwd": md5_password_hash,
        }

        response = requests.post(
            login_url,
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 200:
            raise Exception(f"Login failed: {response.reason}")

        result = response.json()

        if result.get("data") and result["data"].get("accessToken"):
            self.access_token = result["data"]["accessToken"]
            return result

        raise Exception("Login failed. Check credentials or API status.")

    def latest_activities(self, activity_count, activity_codes):
        """
        Fetches the latest activities
        :param activity_count: Number of activities to fetch
        :param activity_codes: List of activity type IDs
        """
        if not self.access_token:
            raise Exception("Not authenticated")

        codes = ",".join(map(str, activity_codes))
        activities_list_url = f"{COROS_URL}/activity/query?size={activity_count}&pageNumber=1&modeList={codes}"

        response = requests.get(
            activities_list_url,
            headers={"accessToken": self.access_token}
        )

        result = response.json()
        return result.get("data", {}).get("dataList", [])

    def export_activity(self, activity, file_type):
        """
        Exports activity file (GPX, TCX, FIT, etc)
        File types: 0 - csv, 1 - gpx, 2 - kml, 3 - tcx, 4 - fit
        :param activity: The activity dict from latest_activities
        :param file_type: Integer representing format
        :returns: Bytes (The raw file content)
        """
        if not self.access_token:
            raise Exception("Not authenticated")

        label_id = activity.get("labelId")
        sport_type = activity.get("sportType")
        
        activity_download_url = f"{COROS_URL}/activity/detail/download?labelId={label_id}&sportType={sport_type}&fileType={file_type}"

        # Step 1: Get the download URL
        metadata_response = requests.get(
            activity_download_url,
            headers={"accessToken": self.access_token}
        )

        metadata = metadata_response.json()
        file_url = metadata.get("data", {}).get("fileUrl")

        if not file_url:
            raise Exception("Could not retrieve file download URL.")

        # Step 2: Download the actual file bytes
        file_response = requests.get(file_url)
        return file_response.content