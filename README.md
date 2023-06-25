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
cd crash_tests
python -m pip install -r requirements.txt
python image_classification.py
```
