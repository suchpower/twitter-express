# The Twitter Express

This project uses Node.js & Express (https://expressjs.com/) to provide a report of metrics based on the activity of Twitter's Streaming API statuses/sample endpoint (https://dev.twitter.com/streaming/reference/get/statuses/sample).

## Available Metrics

* Total number of tweets received from the stream
* Average number of tweets per hour, minute, & second
* Total number of URLs used in tweets, as well as the number of unique URLs encountered
* Total number of emojis used in tweets, as well as the number of unique emojis encountered
* Total number of hashtags used in tweets, as well as the number of unique hashtags encountered
* Percent of tweets containing URLs
* Percent of tweets containing Emojis
* Percent of tweets containing Hashtags
* Percent of tweets containing photo URLs (pic.twitter.com or instagram)
* The top emojis used in the streamed tweets
* The top hashtags used in the streamed tweets
* The top domains used in tweets containing URLs
* A Count of errors (unparsible objects) encountered in the tweet stream

This application simply logs these values to your console/terminal, but the data could also be transmitted in a templated environment (such as React) or to the front-facing segment of Express (found in this implementation at http://localhost:3000/).

## Installation

In order to run this project locally, you'll need to install Node.js and npm. You can read instructions for this process here: https://docs.npmjs.com/getting-started/installing-node.

First, clone this repository and navigate to your working directory in your terminal.

Then install express and the project's dependencies with npm.

```
npm install
```

## Configure Twitter Authentication

You'll need valid credentials from an active Twitter development app. Details about setting this up can be found here: https://apps.twitter.com/.
Create a new app and then paste your keys and secrets into the config.js credentials object in your working directory, replacing the default string values.

```
...
credentials: {
  consumer_key: '0000000000000000000000000',
  consumer_secret: '00000000000000000000000000000000000000000000000000',
  access_token_key: '00000000000000000000000000000000000000000000000000',
  access_token_secret: '000000000000000000000000000000000000000000000'
},
...
```

You can also customize the terminal reporting interval with this setting:

```
reportInterval: 500
```

## Running the App

From your working directory, run

```
node bin/www
```

and watch the terminal for periodic updates from the application!
