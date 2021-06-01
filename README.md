# MLO_Accounting_app


### Purpose of app
- Accounting application for private use.

### Scope of app
- Limited to only MLO personel

### User Stories
- ```POST request to /client/search``` with form data will display the data a list of matched client, and let the user choose which client is the one they are searching.
- ```POST request to /client/search``` with form data without matched client will display "Client does not exist"
- ```POST request to /client/search``` with form data with no input (indexNumber, clientName, companyName) will respond "No input detected. Please input at least 1 seach field."
- ```POST request to /client/search``` with form data but with missing object properties will respond "Invalid request, reload page and try again".
- ```POST request to /client/search``` with form data the indexNumber entry must be a number only, or else respond with "Invalid index number entry. Please input numbers only"
- ```POST request to /client/search``` with form data the clientName must only be text with no special characters, or else respond with "Invalid characters detected. Please input letters only".
- ```POST request to /client/search``` must find matching clients regardless of letter case.

### Deployment
- Replit since it is only for private use.

### Database
- MongoDB personal, use client account when final  

### Tests
- Pending

### Authentication
- Pending

### Webchat
- No need 

### Security
- Pending

### User Review
- Pending



