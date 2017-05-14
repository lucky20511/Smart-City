
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
# Unicode String 

# @app.route("/v1/expenses/<expense_id>", methods = ["GET", "PUT", "DELETE"])
# @app.route('/locations/<int:postID>', methods = ['GET', 'PUT', 'DELETE'])

# User
def login(username, password):

    result = db.Users.find_one({"username" : username, "password":password})
    print(result)
    if result is None:
        msg = {"msg":"fail"}
    else:
        msg = {"msg":"succeed"}
    
    return msg

def signUp(username, password, cluster) :     
    check = db.Users.find_one({"username":username})
    if check is None:
        query = {
                "username" : username,
                "password": password,
                "image": "",
                "bio": "",
                "cluster":cluster
            }  
        db.Users.insert_one(query)
        msg = {"msg": "succeed"}
    else:
        msg = {"msg":"fail"}
    
    return msg

def getClusterAllUser(cluster) : 
    result = db.Users.find({"cluster":cluster}) 
    if result.count() > 0:
        for c in result:
            print(c)
        msg = {"msg": "succeed"} #TODO return JSON
    else:
        msg = {"msg": "fail"}
     
    return msg

def getAllClusterAllUser() : 
    result = db.Users.find()
    for c in result:
        print(c)
        msg = {} #TODO return JSON
    return msg

def deleteUser(username) : 
    result = db.Users.delete_one({"username":username})
    if result.delete_count() > 0:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}    
    return msg

# Status

def getAllClusterStatus(clustername) : 
    result = db.Status.find({"clustername":clustername}) #TODO WRONG query
    if result is None: 
        msg = {"msg":"fail"}
    else:
        msg = {"msg":"succeed"}
    return msg

def createStatus(username, time, body, image) :
    query = {
            "username" : username,
            "time": time,
            "image": image,
            "body": body,
            "comments":[],
            "likes":[]
        }  
    db.Status.insert_one(query)

    msg = {"msg":"succeed"}
    return msg

def deleteStatus(time) : 
    result = db.Status.delete_one({"time": time})
    if result.delete_count() > 0:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}
    return msg

# Cluster
def createCluster(clustername) : 
    check = db.Clusters.find_one({"clustername": clustername})
    if check is None:
        query = {
            "clustername" : clustername,
            "users": []
        }
        db.Clusters.insert_one(query)

        msg = {"msg":"succeed"}
        return msg
    else:
        msg = {"msg":"fail"}
        return msg

#TODO Cascading delete
def deleteCluster(clustername) :    
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
    getACluster("Cluster A")
    # createCluster("Cluster A")
    # createCluster("Cluster B")
    # signUp("Jeremy", 1234, "Cluster A")
    # signUp("George", 1234, "Cluster A")
    # signUp("Bob", 1234, "Cluster A")
    # signUp("Mary", 1234, "Cluster B")
    # signUp("Lisa", 1234, "Cluster B")

    # createStatus("Jeremy", 1, "AAAAAAAAA", "")
    # createStatus("George", 2, "BBBBBBBBB", "")
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
#            
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
