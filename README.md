
# Blog aggregator

### Requirements

- node v22.15.0
- typescript
- tsx
- postgresql
- npm
- drizzle-orm

### Config setup

Create a config file at ```~/.gatorconfig.json``` with this shape: ```{
  "db_url": "connection_string_goes_here",
  "current_user_name": "username_goes_here"
}```
The connection string will depend on your setup of postgresql. The user name will be set and unset by the program itself via the ```login``` and ```register``` commands.

### Commands

- ```register <username>```
 	- adds a new user to the users table and switches to it
- ```login <username>```
 	- switches current user
- ```users```
 	- lists all users, displaying the current user
- ```reset```
 	- deletes all users
- ```addfeed <name> <url>```
 	- adds a new RSS feed
- ```feeds```
 	- lists all feeds
- ```follow <feed_name>```
 	- allows the user to follow a specific feed
- ```unfollow <url>```
 	- allows the user to unfollow a specific feed
- ```following```
 	- lists all feeds the current user is following
- ```agg <time_between_reqs>(in ms, s, m, or h)```
 	- begins aggregation loop. Creating posts for oldest feed the current user is following at a given delay period
- ```browse <limit>(optional)```
 	- displays most recent posts from the user's feeds. Default is 2
