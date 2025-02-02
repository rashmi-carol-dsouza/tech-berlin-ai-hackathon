# Walkabout

## Frontend

### Running Locally

1. Open terminal - Run `make all` - this will start the development frontend server and print a URL that you can navigate to
2. In another terminal - run `cd server/chat_api && make all` - this will start the backend server

### CORS issues

The frontend development server uses a randomly generated URL and Port that is printed in the console when the server starts. Thus, you may encounter CORS related issues in the Browser (see console) as the backend server may not reognise the URL + port when the request originates from your local. In this case update the hardcoded local URL in `server/chat_api/main.py` to use your locally running frontend web server URL.


