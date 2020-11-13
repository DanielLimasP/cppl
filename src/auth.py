import requests as reqs

# Use local if local. Otherwise, use ngrok.
local = "http://localhost:4000"
ngrok = "https://83eb36bc36dd.ngrok.io"
heroku = "https://ai-store-api.herokuapp.com"

# Dumb is he whom makes tests without asserting
def signin(pin):
    url = heroku + "/auth/signin"
    res = reqs.post(url, json={"pin": pin})
    if res:
        return res.json()
    else:
        return "Couldn't signin"


def add_info(people_entering, store_pin, token):
    url = heroku + "/info/"
    res = reqs.post(url, json={"peopleEntering": people_entering, "storePin": store_pin}, headers={"x-access-token": token})
    if res:
        return res.json()
    else:
        return "Can't add info"

def get_info(pin):
    auth = signin(pin)
    url = heroku + "/info/"
    params = {"pin": pin}
    res = reqs.get(url, params, headers={"x-access-token": auth["authToken"]})
    if res:
        return res.json()
    else:
        return "Can't get info"

# Driver code to make tests
if __name__ == "__main__":
    print(signin("5431"))
    auth_token = signin("5431")["authToken"]
    print(add_info(1, "5431", auth_token))
    for obj in get_info("5431")["info"]:
        print("""
            People entering: {}
            People inside: {}
            Store pin: {}
            Timestamp: {}        
        """.format(obj["peopleEntering"], obj["peopleInside"], obj["storePin"], obj["timestamp"],))