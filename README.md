# Coros API Client Library

A cross-platform library (Python, JavaScript, and Google Apps Script) to interact with the Coros API. This library allows you to authenticate, query activities, and export workout data in various formats.

## 🚀 Supported Platforms

Python: Using requests (ideal for data analysis and automation).

JavaScript: sing fetch (ideal for web apps or Node.js).

Apps Script: Original implementation for Google Workspace automation.

## 🛠 Features

- Authentication: Secure login using MD5 hashed passwords.
- Activity Querying: Filter by sport type (e.g., Trail Run, Road Bike).
- Data Export: Download activities as `.fit`, `.tcx`, `.gpx`, `.kml`, or `.csv`.
- Pace Utilities: Convert raw speed data to human-readable pace (min/km).

## Query Activities

Query Parameters:
  
- `size`: number of activities to fetch (must be between 1 and 200)
- `pageNumber`: page number (must be at least one)
- `from`: start date (format YYYYMMDD), optional
- `end`: end date (format YYYYMMDD), optional
- `modeList`: list of sport to includes (comma separated values), optional
  - `100`: Run
  - `101`: Indoor Run
  - `102`: Trail Run
  - `103`: Track Run
  - `104`: Hike  
  - `105`: Mtn Climb  
  - `106`: Climb  
  - `200`: Road Bike  
  - `201`: Indoor Bike  
  - `202`: E-Bike  
  - `203`: Gravel Bike  
  - `204`: Mountain Bike  
  - `205`: E-MTB  
  - `299`: Helmet Riding  
  - `300`: Pool Swim  
  - `301`: Open Water  
  - `400`: Gym Cardio  
  - `401`: GPS Cardio  
  - `402`: Strength  
  - `500`: Ski  
  - `501`: Snowboard  
  - `502`: XC Ski  
  - `503`: Ski Touring  
  - `700`: Rowing  
  - `701`: Indoor Rower  
  - `702`: Whitewater  
  - `704`: Flatwater  
  - `705`: Windsurfing  
  - `706`: Speedsurfing  
  - `800`: Indoor Climb  
  - `801`: Bouldering  
  - `900`: Walk  
  - `901`: Jump Rope  
  - `902`: Floor Climb  
  - `10000`: Triathlon  
  - `10001`: Multisport  
  - `10002`: Ski Touring  
  - `10003`: Outdoor Climb


## Download Activity Detail
  
Query Parameters:
  
- `labelId`: label ID of the activity, you can get it from the `Query Activities` request
- `sportType`: sport type of the activity, you can get it from the `Query Activities` request
- `fileType`: one of the following depending on the type of file you want
  - `4`: fit
  - `3`: tcx
  - `2`: kml
  - `1`: gpx
  - `0`: csv