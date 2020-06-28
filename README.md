# zipper_mern
Web application for creating zip file from bunch of files 

## Getting Started
You can upload single file or multiple file less than 60kb(max 10 at a time) in the index page. Once clicking ***DOWNLOAD ZIP*** button a zip with name ***yourzip.zip*** will get downloaded in your browser.

A history of zip files will be saved in the mysql database with a time to leave of 10 minutes.


### Prerequisites
    Node js,
    npm,
    MySQL

### Installing
```
npm install
npm start
```
For starting in development mode
```
npm run start-dev
```

Create a event to delete the zips after 10 minutes with the following query
```
CREATE EVENT IF NOT EXISTS clearOldZips ON SCHEDULE EVERY 10 MINUTE STARTS CURRENT_TIMESTAMP ENDS CURRENT_TIMESTAMP + INTERVAL 1 HOUR DO     DELETE FROM files WHERE TIMESTAMPDIFF(MINUTE, createdAt , NOW()) > 140;
```

### Running the tests
```
npm test
```

