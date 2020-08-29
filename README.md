# Notice board server
![Build Status](https://github.com/kimoofey/notice-board-server/workflows/Node.js%20CI/badge.svg)

Project for "Security of Internet applications" in Peter the Great St.Petersburg Polytechnic University

### Tech

In this path of project we use:
* [NodeJS](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Firebase](https://firebase.google.com/)

### Installation

Before start you need to have **[Git](https://git-scm.com/)**, **[Node JS](https://nodejs.org/en/)**, **npm**, **[Express](https://expressjs.com/)** installed on your machine.

1. Clone repository using Git.
2. Install project's dependencies by running `npm install` from root folder.
3. Run `npm run start:dev` from root folder. It will run Express on 3001 port via nodemon. To restart it just save changes and nodemon will automatically restarting the server.

### Deployment

1. To check if everything working well after working on your branch, you need to create pull request;
2. Then Github Actions automatically will check your pull request (tests and build);
3. After that on Heroku will be created pipeline (the link on it will be in the pull request);
4. When your request will be approved, it will be merged into dev branch, that also will be checked by Github Actions and deployed on Dev pipeline;
5. Only pipelines from Dev stage can be promoted to Production stage.

### Links
[Dev server](https://web-notice-board-server-dev.herokuapp.com/)

---
### REST API description:


|          |               |
|----------|:-------------:|
|Title|Get All users|
|URL|/api/user|
|Method	|GET|
|URL Parameters	||
|Success Response|Code: 200<br> Content:[{<br>docId: string,<br>id: string,<br>name: string,<br>messages: array[],<br>URL: string,<br>description: string<br>}]|
|Error Response|Code: 500|
|Notes| Response contain array of all users|

|          |               |
|----------|:-------------:|
|Title|Create user|
|URL|/api/user|
|Method	|POST|
|URL Parameters	|Required:<br>Body: `email: string, password: string, nickname: string`|
|Success Response|Code: 200<br>Content:{<br>docId: string,<br>id: string,<br>name: string,<br>email: string,<br>password: string,<br>URL: string,<br>description: string<br>}|
|Error Response|Code: 500|
|Notes| Response contain information about user|

|          |               |
|----------|:-------------:|
|Title|Update user|
|URL|/api/user|
|Method	|PUT|
|URL Parameters	|Required:<br>Body: `userId: string, docId: string, name: string, url: string, description: string`|
|Success Response|Code: 200 Content:{}|
|Error Response|Code: 500|
|Notes| Update user information|

|          |               |
|----------|:-------------:|
|Title|Auth user|
|URL|/api/user/auth|
|Method	|POST|
|URL Parameters	|Required:<br>Body: `email: string, password: string`|
|Success Response|Code: 200<br>Content:{<br>docId: string,<br>id: string,<br>name: string,<br>email: string,<br>password: string,<br>URL: string,<br>description: string<br>}|
|Error Response|Code: 500|
|Notes| Response contain information about user|

|          |               |
|----------|:-------------:|
|Title|Upload user's avatar|
|URL|/api/user/avatar|
|Method	|POST|
|URL Parameters	|Required:<br>Body: `file: file`|
|Success Response|Code: 200<br> Content:{<br>downloadURL: string,<br>}|
|Error Response|Code: 500|
|Notes| Upload avatar image to firebase storage and contain in response URL of image |

|          |               |
|----------|:-------------:|
|Title|Get user's messages|
|URL|/api/user/messages|
|Method	|GET|
|URL Parameters	|Required:<br>Query: `docId: string`|
|Success Response|Code: 200 Content:{}|
|Error Response|Code: 500|
|Notes||

|          |               |
|----------|:-------------:|
|Title|Update user's messages|
|URL|/api/user/messages|
|Method	|PUT|
|URL Parameters	|Required:<br>Body: `docId: string, messages: string`|
|Success Response|Code: 200 Content:{}|
|Error Response|Code: 500|
|Notes||

|          |               |
|----------|:-------------:|
|Title|Get messages by chat id|
|URL|/api/messages|
|Method	|GET|
|URL Parameters	|Required:<br>Query: `groupChatId: string`|
|Success Response|Code: 200<br>Content:[{<br>_id: string,<br>createdAt: string,<br>idFrom: string,<br>idTo: string,<br>text: string,<br>user: {<br>_id: string,<br>avatar: string,<br>name: string,<br>},<br>}]|
|Error Response|Code: 500|
|Notes||

|          |               |
|----------|:-------------:|
|Title|Add message in chat by id|
|URL|/api/messages|
|Method	|POST|
|URL Parameters	|Required:<br>Body: `_id: string, text: string, createdAt: string, currentUserId: string, id: string, user: object, groupChatId: string, timestamp: string`|
|Success Response|Code: 200 Content:{}|
|Error Response|Code: 500|
|Notes||
