
# Watchadoin' - back end
Developed as the final project of our web development bootcamp at Ironhack Barcelona. It's a MERN Stack application, check the frontend repository [here](https://github.com/youraccount/repo).
Watchadoin' is a social network that allows users to share and join casual plans within their peer group. Users will be able to know what their friends are up to and join in on their plans. Users will only be shown events, that the event creator welcomes them to join.

## About us
Our names are Camila Buldin, Lisa Schwetlick and Raquel Barrio.

![Project Image](https://t4.ftcdn.net/jpg/01/45/03/99/360_F_145039942_TlScPbqEWiBMPpfSyJyhBBCPcr1l52dP.jpg "Project Image")

## Deployment
You can check the app fully deployed [here](https://www.cactuscoleccion.com/). If you wish to view the API deployment instead, check [here](https://www.cactuscoleccion.com/).

## Work structure
We used [Discord](https://discord.com/) to organize our workflow.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd project-back
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  inviteLists: [{ type: Schema.Types.ObjectID, ref: "List" }],
  friendsConfirmed: [{ type: Schema.Types.ObjectID, ref: "User" }], 
  friendsPending: [{ type: Schema.Types.ObjectID, ref: "User" }],
  notifications: 
  role: {
        type: String,
        enum : ['newbie','pro'],
        default: 'newbie'
    },
  eventsCreated: [{ type: schema.Types.ObjectID, ref: "Event" }],
  eventsJoined: [{ type: schema.Types.ObjectID, ref: "Event" }],
  eventsPending: [{ type: schema.Types.ObjectID, ref: "Event" }],
});
```
#### Event.model.js
```js
const eventSchema = new Schema({
  title: { type: String, required: true },
  creator: { type: Schema.Types.ObjectID, ref: "User" },
  description: { type: String },
  icon: { type: String },
  dateTime: { type: Date },
  location: { type: String },
  coordinates: {type: Object}, 
  pendingJoiners: [{ type: schema.Types.ObjectID, ref: "User" }],
  confirmedJoiners: [{ type: schema.Types.ObjectID, ref: "User" }],
  shareable: { type: Boolean },
  
});
```
#### List.model.js
```js
const listSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: schema.Types.ObjectID, ref: "User" }]
});
```
#### Notification.model.js
```js
const notificationSchema = new Schema({
    sentBy: { type: Schema.Types.ObjectID, ref: "User" },
    type: { type: String, enum: ["friendReq", "friendAcc", "eventJoin", "comments"] },
    eventId: { type: Schema.Types.ObjectID, ref: "Event" },
    new: {type: Boolean, default: true}
  },
  {
    timestamps: true,
  });
```


## API Routes
| Method | Endpoint                    | Require                                             | Response (200)                         | Action                                                                    |
| :----: | --------------------------- | --------------------------------------------------- |----------------------------------------| ------------------------------------------------------------------------- |
| POST   | /auth/signup                | const { username, email, password, passwordRepeat } = req.body | json({user: user})                     | Registers the user in the database and returns the user object.        |
| POST   | /auth/login                 | const { username, password } = req.body                | json({authToken: authToken})           | Logs in an already registered user.                                        |
| GET    | /auth/verify                |                                                     | json(req.payload)                      | Get payload object with the information of the current user.                      |
| GET    | /users/:username              |                                                     | json(response.data)                    | Retrieve  user data. Events, friends, lists of the user can be populated |
| POST   | /users/:username/edit         |const userId = req.params.userId; const {picture,email} = req.body | json(response.data)                    | Update user information (picture, email).                                        |
| POST   | /events/create              |const {title,description,icon,dateTime,location,coordinates,pendingJoiners} = req.body| json(response.data)           | Create a new event, add pendingJoiners Id's, update the 'eventsPending' property of each user in pendingJoiners with the event ID                                        |
| POST   | /events/:eventId/update     |const eventId = req.params.eventId; const {title,description,icon,dateTime,location,coordinates} = req.body| json(response.data)           | Update event details (excluding any pending or confirmed joiners)                               |
| POST   | /events/:eventId/delete     | const eventId = req.params.eventId                  | json(response.data)                    | Delete an event of the current user from the database, remove the event ID from any pending or confirmed joiner                                              |
| POST   | /events/:eventId/reject     | const eventId = req.params.eventId                  | json(response.data)                    | If the current user is a pending joiner of an event, it will remove their ID from the event, and the event ID from the current user.                                                          |
| POST   | /events/:eventId/unjoin     | const eventId = req.params.eventId                  | json(response.data)                    | If the current user is a confirmed joiner of an event, it will remove their ID from the event's confirmed joiners and add to pending joiners, and update the user respectively.
| POST   | /events/:eventId/accept     | const eventId = req.params.eventId                  | json(response.data)                    | If the current user is a pending joiner of an event, it moves their ID to confirmed joiners and updates the user object respectively, moving the event ID from pending to confirmed events.                                         |
| POST   |/friendstatus/:friendId/accept| const friendId = req.params.friendId, current userId                 | json(response.data)                    | The friendship status will be updated: change to accepted - both user objects will be updated by moving the other users' ID from pending to confirmed friends, create a notification for both users|
| POST   |/friendstatus/:friendId/remove| const friendId = req.params.friendId, current userId               | json(response.data)                    | Will remove the current user ID from the other users' confirmed friends and vice versa.|
| POST   |/friendstatus/:friendId/sendRequest| const friendId = req.params.friendId, current user Id               | json(response.data)                    | Add the current user Id to pending friends of the other user, add a notification for the other user.|
| POST   | /lists/create               | {name, userIds}                | json(response.data)                    |Create a new object inside the current users' array of inviteLists, adding list Id to users' lists, adding the Id of each user that was added to the list.     
| POST   | /lists/:listId/update       | const { name } = req.body, const { listId } = req.params               | json(response.data)                    | Changing name of a friendList of current user.                                       |
| POST   | /lists/:listId/delete       |  const { listId } = req.params | json(response.data)                    | Deleting a invitelist, removing it's Id from current user lists                                       |
| POST   | /lists/:listId/addFriend       | const { listId } = req.params, const { userId } = req.body | json(response.data)                    | Adding the Id of a user to a friend list                                       |
| POST   | /lists/:listId/removeFriend       |   const { listId } = req.params, const { userId } = req.body | json(response.data)                    | Removing a userId from a friendList                                     |
FUNCTION notifications-create
FUNCTION notifications-unNew


                               


## External API used

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultricies ante id ligula pretium, a volutpat augue lobortis. Pro

| Method | Endpoint                    | Require                                             | Response (200)                                                        | Action                                                                    |
| :----: | --------------------------- | --------------------------------------------------- |----------------------------------------| ------------------------------------------------------------------------- |
| POST   | /signup                     | const { username, email, password } = req.body      | json({user: user})                     | Registers the user in the database and returns the logged in user.        |
| POST   | /login                      | const { email, password } = req.body                | json({authToken: authToken})           | Logs in a user already registered.                                        |