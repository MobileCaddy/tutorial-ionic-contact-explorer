# MobileCaddy Tutorial App - Salesforce Account/Contact Explorer - Angular/Ionic

## Overview

This is a repo to accompany the MobileCaddy tutorial on building an offline ready Accounts and Contcat explorer for Salesforce. The Tutorial can be found [here](http://developer.mobilecaddy.net/docs/tutorials/accounts-contact-explorer)

The code here can be used as a guide to what the code should look like after each module in the tutorial. It has branches at each step of the tutorial;
* tut/0
* tut/1
* tut/3
* tut/3
* tut/4
* tut/5
* tut/6

## Getting Started

* Get the code and the supporting node and packages. The following depencies are needed (For detailed instructions see the [Getting Started Guide](http://developer.mobilecaddy.net/docs));
 * npm
 * grunt-cli
 * bower
 * ruby
 * sass


* Clone the repo and install the dependencies

```
git clone https://github.com/MobileCaddy/tutorial-ionic-contact-explorer.git
cd tutorial-ionic-contact-explorer
```

## What you get (prior to running any installs/grunt tasks)

```
├── apex-templates	  ## Templates for the platform's startpage and cache manifest
├── bower.json        ## Defines dependencies (MobileCaddy, Ionic)
├── Gruntfile.js      ## Defines our task automation
├── package.json      ## The node package file and core app configuration
├── README.md         ## This file
├── scss              ## Where you do your SCSS
├── test              ## Platform mock responses can go in here
└── www               ## Where you do your coding
    ├── css
    ├── img
    ├── index.html    ## This is used locally only
    ├── js
    ├── lib
    └── templates
```

* Install the required packages and dependencies (not you might need `sudo npm install` below)

```
npm install
bower install
grunt devsetup
```


## Task automation

The Grunt config (out of the box) offers the following commands

* **grunt devsetup** : This should be run once following _bower install_ command. It will copy dependency files over into the correct place in your app
* **grunt connect** : This will start a server up so you can run your app in the browser
* **grunt watch** : This will watch your template files, JS and SCSS files for changes. And will run will depending on the type of file that changed, run JSHint, SASS compilation and will create a .zip file containing your app. You JS will be unminified in this archive to aid debugging.
* **grunt dev** : This runs JSHint, SASS compilation and will create a .zip file containing your app. You JS will be unminified in this archive to aid debugging.
* **grunt prod** : This will do the same as **grunt dev** but your JS will be minified in the output archive.