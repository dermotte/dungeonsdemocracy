## Heroku Bot

Start it locally, requirements:
```
npm install express
```

Set up a heroku app
1) Create an app on Heroku
2) Install the heroku client
3) Add a [Procfile](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-a-procfile) to your project
4) Run npm init
4) Run ``heroku buildpacks:set heroku/nodejs```
Requirements to start the demo-app:


Setup 
1) Checkout from the branch heroku-bot
2) Run: ``heroku git:remote -a dungeonsdemocracy```
3) Deploy code ```git push heroku master```


Requirement
* setting a buildpack