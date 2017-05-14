
from flask import Flask, request, Response, json, abort
import requests 
from pymongo import MongoClient
import pprint

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
def login(username, password) : 

    result = db.Users.find_one({"username" : username, "password":password})
    print(result)
    if result is None:
        msg = {"msg", "fail"}
    else:
        msg = {"msg", "succeed"}
    
    return msg

def signUp(username, password, clustername) : 
    
    check = db.Users.find_one({"username":username})
    if check is None:
        query = {
                "username" : username,
                "password": password,
                "image": "",
                "bio": "",
                "cluster":clustername
            }  
        db.Users.insert_one(query)
        msg = {"msg", "succeed"}
    else:
        msg = {"msg", "failed"}
    
    return msg

def getClusterAllUser(clustername) : 
    result = db.Users.find({"clustername":clustername}) 
    if result.count() > 0
        for c in result:
            print(c)
        msg = {"msg", "succeed"} #TODO return JSON
    else:
        msg = {"msg", "failed"}
     
    return msg

def getAllClusterAllUser() : 


    return msg

def deleteUser(username) : 

    return msg

# Status
def getAllClusterStatus(clustername) : 
    result = db.Clusters.find_one({"clustername":clustername})
    print(result)
    if result is None: 
        print("DHSDHFHDHDHHDHD")
    msg = {"msg", "succeed"}
    return msg

def createStatus(username, time, body, image) :
    query = {
            "username" : username,
            "time": time,
            "image": image,
            "body": body,
        }  
    db.Status.insert_one(query)

    msg = {"msg", "succeed"}
    return msg

def deleteStatus(time) : 
    result = db.Status.delete_one({"time": time})
    msg = {"msg", "succeed"}
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

        msg = {"msg", "succeed"}
        return msg
    else:
        msg = {"msg", "Duplicate Name"}
        return msg

#TODO Cascading delete
def deleteCluster(clustername) :    
    db.Clusters.delete_one({"clustername": clustername})
    msg = {"msg", "succeed"}
    return msg

def getAllCluster() : 
    result = db.Clusters.find() 
    for c in result:
        print(c)
    return ""




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
