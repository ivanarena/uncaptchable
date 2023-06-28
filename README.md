# UnCAPTCHAble 

UnCATPCHAble is a brand new CAPTCHA that makes life really hard for AIs while still being easy to solve for humans.

# Requirements
- Node.js v18.12.1
- Python 3.10.6

# Installation
## Clone
```
git clone git@github.com:ivanarena/uncaptchable.git
```

## Run API 
```
cd uncaptchable
node .
```
## Run client
```
cd client
npm start
```

## Run tests

Download the generated dataset [here](https://mega.nz/file/qvRyQD5a#C36x-_8RHR7SFafeaw9wehNZTvyOVUiZW4p-lXCpSj8) and extract it in the ```res``` folder.

```
cd crash_test
python -m pip install -r requirements.txt
jupyter lab
```
Once in jupyter lab you can execute the tests in ```crash_test.ipynb``` and customise the parameters as you like. In ```res/tests``` you can find some logs of the tests I run.

# Documentation

The documentation is accessible while running the app at http://localhost:9999/api-docs/ (in case you've changed the port where the API is running be sure to use the same one to access the documentation). 
