# WRECK
We Resolve Every Conflict Kindly
CS 188 Project, Fall 2018

WRECK is an app that helps roommates safely communicate problems to each other while incentivizing conflict resolution through monetary penalties. Resolved issues are dismissed, while unresolved issues cause transfer of money from individual balances to the apartment group balance. At the end of the month, the group balance is used towards a group outing such as dinner.


## Project Structure
The entry point to our app can be found at [index.html](https://github.com/katrinaduong/wreck/blob/master/index.html). The other HTML pages for our login/signup workflow and issues dashboard can be found under the [/html](https://github.com/katrinaduong/wreck/tree/master/html) directory. For each HTML page, we also have a corresponding CSS and JavaScript file, located in the [/js](https://github.com/katrinaduong/wreck/tree/master/js) and [/css](https://github.com/katrinaduong/wreck/tree/master/css) directories. The [/img](https://github.com/katrinaduong/wreck/tree/master/img) directory contains image assets.

The main functionalities can be found in:
* [issues.js](https://github.com/katrinaduong/wreck/blob/master/js/issues.js) - Posting and reacting to issues
* [profile.js](https://github.com/katrinaduong/wreck/blob/master/js/profile.js) - Creating a new user or logging in an existing user
