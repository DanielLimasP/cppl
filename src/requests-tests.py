import requests as reqs

# Dumb is he whom makes tests without asserting
def req_test_get():
    # Pin for alsuper Robinson or something
    storePin = "5431"
    dog_hash = "06d80eb0c50b49a509b49f2424e8c805"

    url = "http://localhost:4000/auth/"
    params = {"pin": storePin, "hash": dog_hash}
    res = reqs.get(url, params)

    if res:
        print("Success")
        print(res.json())
    else:
        print("Failure")

def req_test_post():
    storePin = "5431"
    dog_hash = "06d80eb0c50b49a509b49f2424e8c805"
    url = "http://localhost:4000/info/"
    res = reqs.post(url, json={"peopleEntering": 1, "storePin": storePin, "hash": dog_hash})

    if res:
        print("Success")
        print(res.json())
    else:
        print("Failure")

def signin(pin):
    url = "http://localhost:4000/auth/signin"
    res = reqs.post(url, json={"pin": pin})
    if res:
        return res.json()
    else:
        return "Failure"


def add_info(people_entering, store_pin):
    auth = signin(store_pin)
    url = "http://localhost:4000/info/"
    res = reqs.post(url, json={"peopleEntering": people_entering, "storePin": store_pin}, headers={"x-access-token": auth["authToken"]})
    if res:
        return res.json()
    else:
        return "Failure"

def get_info(pin):
    auth = signin(pin)
    url = "http://localhost:4000/info/"
    params = {"pin": pin}
    res = reqs.get(url, params, headers={"x-access-token": auth["authToken"]})
    if res:
        return res.json()
    else:
        return "Failure"

if __name__ == "__main__":
    print(signin("5431"))
    print(add_info(1, "5431"))
    for obj in get_info("5431")["info"]:
        print("""
            People entering: {}
            People inside: {}
            Store pin: {}
            Timestamp: {}        
        """.format(obj["peopleEntering"], obj["peopleInside"], obj["storePin"], obj["timestamp"],))