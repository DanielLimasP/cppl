# People counting with OpenCV.

This is the foundation for the AI project.

### Some useful links

* [Link to the tutorial](https://ubidots.com/blog/people-counting-with-opencv-python-and-ubidots/)
* [Link to unittesting](https://docs.python.org/3/library/unittest.html)
* [Link to packaging](https://packaging.python.org/tutorials/packaging-projects/)
* [Link to requests guide](https://realpython.com/python-requests/)
* [Link to color](https://pypi.org/project/colorclass/)

## Installation

### Clone the repo

```bash
git clone REPO_URL
```

### cd to it in console

```bash
cd cppl
```

### Install the dependencies of the api

```bash
cd api
npm install
```

### Run the API service in dev mode

```bash
npm run dev
```

## Usage

Consume the API using Postman or Arc

### Auth routes
<pre>
/auth/?pin=""          [GET]                      Gets the info of a store  
</pre>
```json
{
    "x-access-token": "Token generated in signin"
}
```
<pre>
/auth/signup           [POST]                     Creates a new store in db  
</pre>
```json
{
    "storeName": "Alsuper Robinson",
    "pin": "5431",
    "storeCapacity": 50,
    "peopleInside": 10,
    "hash": "06d80eb0c50b49a509b49f2424e8c805"
}
```
<pre>
/auth/signin           [POST]                     Returns a JWT if valid pin is sent 
</pre>
```json
{
    "pin": "5431"
}
```
<pre>
/auth/new-pin          [POST]                     Changes the pin of a store 
</pre>
```json
{
    "pin": "5431",
    "newPin": "5556"
}
```
```json
{
    "x-access-token": "Token generated in signin"
}
```
<pre>
/auth/logout           [POST]                     Logs us off 
</pre>

### Info routes
<pre>
/info/                 [POST]                     Creates a new info log in the server
</pre>
```json
{
    "peopleEntering": 1,
    "storePin": "5431"
}
```
<pre>
/info/?pin=""          [GET]                      Returns all the logs of a store 
</pre>
```json
{
    "x-access-token": "Token generated in signin"
}
```
## Contributing
Just ask for permission.

