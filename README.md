# Companies
Web App to manage organizations (Node JS, MongoDB, Mongoose, jQuery, jQuery Validation Plugin, jsTree)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Setup

### Prerequisites

1. Install [Node.js v4.5.0 or greater][node].
1. Install [MongoDB v3.6.0][mongoDB] and start MongoDB service.
1. Install [Visual Studio Code v1.24.0][vscode] or other Integrated Development Environment (IDE).
1. Clone this repository using Git Bash:

        git clone https://github.com/vinnbohdan/Companies.git
        
    or download it on local disk from [Project page][companies] and unzip.

1. Open project in IDE.

1. Install (if needed) Mongoose and fs packages. In terminal window:

    $ npm install mongoose --save
    $ npm install fs --save

1. Change in Companies\config.json (it needs for changing path to DB from external to local):

    **code**:

        {
            "urlconnection" : "mongodb://heroku_vs8p7lt2:9ni1jqin3njaevn1nllubaj9ah@ds219051.mlab.com:19051/heroku_vs8p7lt2"//,
            //"urlconnection" : "mongodb://localhost:27017/db"
        }

    **to**

        {
            //"urlconnection" : "mongodb://heroku_vs8p7lt2:9ni1jqin3njaevn1nllubaj9ah@ds219051.mlab.com:19051/heroku_vs8p7lt2",
            "urlconnection" : "mongodb://localhost:27017/db"
        }

1. Save Project.

1. Start *>node app.js* in terminal to get the app running on local host.

1. Open http://localhost:3000 in your Web Browser (at first time companies tree will be empty, because there will be no documents in MongoDB).

1. Get page like below, use Add/Edit/Delete buttons to manage companies.

![screenshot](https://github.com/vinnbohdan/Companies/blob/master/page.PNG)

[node]: https://nodejs.org/
[mongoDB]: https://www.mongodb.com/mongodb-3.6
[vscode]: https://code.visualstudio.com/
[companies]: https://github.com/vinnbohdan/Companies