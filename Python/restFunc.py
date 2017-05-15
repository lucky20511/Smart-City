
from flask import Flask, request, Response, json, abort
# import requests 
from pymongo import MongoClient
import pprint
import bson
from bson.json_util import dumps

app = Flask(__name__)

client = MongoClient()
db = client.test_db

Users = db['users']
Status = db['status']
Clusters = db['clusters']

# TODO 
# Cascading Delete
# Return msg format
# Error Handling


# @app.route("/v1/expenses/<expense_id>", methods = ["GET", "PUT", "DELETE"])
# @app.route('/locations/<int:postID>', methods = ['GET', 'PUT', 'DELETE'])

# User
@app.route("/login", methods = ["POST"])
def login():

    p_body = json.loads(request.data)
    username = p_body["username"]
    password = p_body["password"]

    result = db.Users.find_one({"username" : username, "password":password})
    print(result)
    if result is None:
        msg = {"msg":"fail"}
    else:
        msg = {"msg":"succeed"}
    
    return msg

@app.route("/signup", methods = ["POST"])
def signUp() :     
    
    p_body = json.loads(request.data)
    username = p_body["username"]
    password = p_body["password"]
    cluster = p_body["cluster"]

    check = db.Users.find_one({"username":username})
    if check is None:
        query = {
                "username" : username,
                "password": password,
                "image": "",
                "bio": "",
                "cluster":cluster, 
                "type": "User"
            }  
        db.Users.insert_one(query)
        db.Clusters.update_one({"clustername":cluster},{"$addToSet":{"users":username}},upsert=False)
      
        msg = {"msg": "succeed"}
    else:
        msg = {"msg":"fail"}
    
    return msg

@app.route("/users", methods = ["GET"])
def getClusterAllUser() : 

    cluster = request.args['cluster']

    result = db.Users.find({"clustername":cluster}) 
    if result.count() > 0:
        for c in result:
            print(c)
        msg = {"msg": "succeed"} #TODO return JSON<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    else:
        msg = {"msg": "fail"}
     
    return dumps(msg)


def getAllClusterAllUser() : 
    result = db.Users.find()
    for c in result:
        print(c)
        msg = {} #TODO return JSON<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return msg

@app.route("/users", methods = ["DELETE"])
def deleteUser() : 
    username = request.args['username']
    result = db.Users.delete_one({"username":username})
    if result.delete_count() > 0:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}    
    return dumps(msg)

def createAdmin() : #TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    result = db.Users.delete_one({"username":username})
    if result.delete_count() > 0:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}    
    return msg

# Status
@app.route('/posts', methods = ['GET'])
def getAllClusterStatus() : 
    clustername = request.args['cluster']
    # clustername = clusterDict['cluster']
    print(clustername)

    result = db.Clusters.find({"clustername":clustername}) #TODO WRONG query, Sort Status by Time<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    # print("RRRRROOOUUUUTTTEEEEE")
    if result is None: 
        msg = {"msg":"fail"}
    else:
        msg = {"msg":"succeed"}
    
    return dumps(msg)

@app.route('/posts', methods = ['POST'])
def createStatus() :
    p_body = json.loads(request.data)
    username = p_body["username"]
    time = p_body["time"]
    body = p_body["body"]
    image= p_body["image"]

    query = {
            "username" : username,
            "time": time,
            "image": image,
            "body": body,
            "comments":[],
            "likes":[]
        }  
    result = db.Status.insert_one(query)
    if result is None:
        msg = {"msg":"fail"}
    else:    
        msg = {"msg":"succeed"}
    return dumps(msg)

@app.route('/posts', methods = ['DELETE'])
def deleteStatus() : 

    time = request.args['time']

    result = db.Status.delete_one({"time": time})
    if result.delete_count() > 0:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}
    return dumps(msg)

# Cluster
def createCluster(clustername) : 
    
    check = db.Clusters.find_one({"clustername": clustername})
    if check is None:
        query = {
            "clustername" : clustername,
            "users": []
        }
        db.Clusters.insert_one(query)

        signUp(clustername, "admin", clustername, "Moderator")

        msg = {"msg":"succeed"}
        return msg
    else:
        msg = {"msg":"fail"}
        return msg

def deleteCluster(clustername) :    
    #TODO Cascading delete    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    # Need to get users array from Cluster
    db.Clusters.delete_one({"clustername": clustername})
    db.Users.delete_many({"cluster": clustername})
    
    msg = {"msg":"succeed"}
    return msg

def getAllCluster() : 
    result = db.Clusters.find() 
    if result.count() > 0:    
        for c in result:
            print(c)
        msg = {"msg":"succeed"}
    else:
        msg = {"msg":"fail"}

    return msg

def getACluster(clustername):
    result = db.Clusters.find_one({"clustername": clustername})
    print(dumps(result))    ################################################## JSON FORMAT <------------------

def test():
    # getACluster("Cluster A")
    createCluster("ClusterA")
    # createCluster("Cluster B")
    signUp("Pig", 1234, "ClusterA")
    # signUp("George", 1234, "Cluster A")
    # signUp("Bob", 1234, "Cluster A")
    # signUp("Mary", 1234, "Cluster B")
    # signUp("Lisa", 1234, "Cluster B")

    createStatus("Jeremy", 1, "AAAAAAAAA", "")
    createStatus("George", 2, "BBBBBBBBB", "")
    # createStatus("Bob", 3, "CCCCCCCCC", "")
    # createStatus("Lisa", 4, "FFFFFFFF", "")
    # createStatus("Lisa", 5, "DDDDDDDD", "")



if __name__ ==  "__main__":
    app.run(host='0.0.0.0', port=1314, debug=True)


############## ICE BOX   ######################

# def likePost(username, time)

# def dislikePost(username, time)

# # Subscription

# def subscribe() :

# def unsubscribe(): 

# def getAllSubscription(): 

############   SCHEMA   #########################
#      User = {
#             "username" : "....",
#             "password": "....",
#             "image": "....",
#             "bio": "....",
#             "cluster":"...."
#             "type":"User/Moderator/SystemAdmin"
#         }

#         #Cluster
#         {
#             "cluster":"....",
#             "users":["alice", "george"]
#         }

#         #Status
#         {
#             "body": "....",
#             "time": "....",
#             "username": "....",
#             "image": "...."
#         }
#     return json.dumps(js)
