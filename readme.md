![Demonstration](/animation.gif)

Sample project to demonstrate a REST api with a frontend that integrates with a
Google API.

## REST API

### `POST /v1/jobs`

Create a running job given an array of names and addresses. Returns a job ID.

### Example: start a job

```text
POST /v1/jobs HTTP/1.1
Accept: application/json
Content-Type: application/json

{
  "rows": [
    {
      "name": "AginicX",
      "address": "135 Wickham Terrace, Spring Hill QLD 4000"
    },
    {
      "name": "Espresso Garage",
      "address": "176 Grey St, South Brisbane QLD 4101"
    }
  ]
}
```

```text
HTTP/1.1 200 OK
Content-Type: application/json

{"id": "3b786c00-6492-11e7-8db3-c520543c7b61"}
```

### `GET /v1/jobs`

Returns the status of a job if it's still processing, or the geocoded data if
it's finished.

### Example: when a job hasn't finished processing yet

```text
GET /v1/jobs/3b786c00-6492-11e7-8db3-c520543c7b61 HTTP/1.1
Accept: application/json
```

```text
HTTP/1.1 202 Accepted
Content-Type: application/json

{}
```

### Example: when a job has finished processing, get the result

```text
GET /v1/jobs/3b786c00-6492-11e7-8db3-c520543c7b61 HTTP/1.1
Accept: application/json
```

```text
HTTP/1.1 200 OK
Content-Type: application/json

{
  "rows": [
    {
      "name": "AginicX",
      "address": "135 Wickham Terrace, Spring Hill QLD 4000",
      "lat": -27.4643931,
      "lng": 153.0254013
    },
    {
      "name": "Espresso Garage",
      "address": "176 Grey St, South Brisbane QLD 4101",
      "lat": -27.4792355,
      "lng": 153.0222656
    }
  ]
}
```

### Possible HTTP responses

| Status | Description              |
|--------|--------------------------|
| 200    | Success.                 |
| 202    | Not finished processing. |
| 400    | Invalid request.         |
| 404    | Not found.               |
| 500    | Internal server error.   |

## Install and run

 1. `git clone https://github.com/mcjohnalds/geocode-csv-file.git`
 2. `cd geocode-csv-file`
 3. Create a project in the
    [Google API console](https://console.developers.google.com).
 4. Enable the Google Maps Geocoding API.
 5. Create an API key in the Credentials menu.
 6. `echo $API_KEY > google-api-key`. Replace `$API_KEY` with your Google API
    key.
 7. `npm install`
 8. `npm start`
 9. Try uploading the `example-input.csv` file included in this repo.
