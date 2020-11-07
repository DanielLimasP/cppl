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

if __name__ == "__main__":
    #req_test_get()
    req_test_post()