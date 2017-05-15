
from flask import Flask, request, Response, json, abort
# import requests 
from pymongo import MongoClient

import bson
from bson.json_util import dumps

app = Flask(__name__)

client = MongoClient()
db = client.test_db

Users = db['users']
Status = db['status']
Clusters = db['clusters']

# TODO 
# Return msg format
# Error Handling

# User
@app.route("/login", methods = ["POST"])
def login():

    p_body = json.loads(request.data)
    username = p_body["username"]
    password = p_body["password"]

    result = db.Users.find_one({"username" : username, "password":password})
    print(dumps(result))
    if result is None:
        msg = {"msg":"fail"}
    else:
        msg = {"msg":"succeed"}
    
    return dumps(msg)

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
    
    return dumps(msg)

@app.route("/users", methods = ["GET"])
def getClusterAllUser() : 
    cluster = request.args['cluster']
    result = db.Users.find({"cluster":cluster}) 
    msg = []
    if result.count() > 0:
        for c in result:
            msg.append(c)
    else:
        msg = {"msg": "fail"}
     
    return dumps(msg)

@app.route("/allclusters", methods = ["GET"])
def getAllClusterAllUser() : 
    result = db.Users.find()
    msg = []
    for c in result:
        print(c)
        msg.append(c)
    return dumps(msg)

@app.route("/users", methods = ["DELETE"])
def deleteUser() : 
    username = request.args['username']
    
    user = db.Users.find_one({'username':username})
    cluster = user['cluster']
    result = db.Users.delete_one({"username":username})
    db.Clusters.update_one({"clustername":cluster},{"$pull":{"users":username}},upsert=False)
    if result is not None:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}    

    return dumps(msg)

@app.route("/createsysadmin", methods = ["POST"])
def createAdmin() :
    query = {
        "username" : "sysadmin",
        "password": "admin",
        "type": "Sysadmin"
    }  

    result = db.Users.insert_one(query)
    if result is None:
        msg = {"msg": "fail"}
    else:
        msg = {"msg":"succeed"}

    return dumps(msg)

# Status
@app.route('/posts', methods = ['GET'])
def getAllClusterStatus() : 
    clustername = request.args['cluster']
    check = db.Clusters.find({"clustername":clustername})

    check = db.Clusters.find({"clustername":clustername})
    db.temp.drop()
    temp = db['temp']

    if check is not None:
        result = db.Users.find({"cluster":clustername})
        if result.count() > 0:
            for c in result:
                username = c['username']
                status_result = db.Status.find({"username":username})
                if status_result.count() > 0:
                    for c in status_result:
                        db.temp.insert(c)
                
                    ans = db.temp.find().sort('time',-1)
                    msg = ans   
        
        else:
            msg = {"msg":"fail"}
                
    else:
        msg = {"msg":"fail"}

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
    if result is not None:
        msg = {"msg": "succeed"}
    else: 
        msg = {"msg":"fail"}
    return dumps(msg)

# Cluster
@app.route('/clusters', methods = ['POST'])
def createCluster() : 
    
    p_body = json.loads(request.data)
    clustername = p_body["clustername"]
    check = db.Clusters.find_one({"clustername": clustername})

    if check is None:
        query = {
            "clustername" : clustername,
            "users": []
        }
        db.Clusters.insert_one(query)

        query = {
                "username" : clustername,
                "password": "admin",
                "image": "",
                "bio": "",
                "cluster":clustername, 
                "type": "Moderator"
            }  
        db.Users.insert_one(query)
        db.Clusters.update_one({"clustername":clustername},{"$addToSet":{"users":clustername}},upsert=False)

        msg = {"msg":"succeed"}
    else:
        msg = {"msg":"fail"}
    
    return dumps(msg)

@app.route('/clusters', methods = ['DELETE'])
def deleteCluster() :
    clustername = request.args['clustername']

    check = db.Clusters.find_one({"clustername":clustername})
    if check is not None:
        result = db.Users.find({"cluster":clustername})
        if result is not None:
            for c in result:
                username = c['username']
                print(username)
                bulk = db.Status.initialize_unordered_bulk_op()
                bulk.find({"username":username}).remove()
                bulk_result = bulk.execute()
                # print(dumps(bulk_result))

        db.Clusters.delete_one({"clustername": clustername})
        db.Users.delete_many({"cluster": clustername})
        msg = {"msg":"succeed"}
    
    else:
        msg = {"msg":"fail"}
    return dumps(msg)

@app.route('/clusters', methods = ['GET'])
def getAllCluster() : 
    result = db.Clusters.find() 
    msg = []
    if result.count() > 0:    
        for c in result:
            msg.append(c)
    else:
        msg = {"msg":"fail"}

    return dumps(msg) 

def getACluster(clustername):
    result = db.Clusters.find_one({"clustername": clustername})
    print(dumps(result))    ################################################## JSON FORMAT <------------------

@app.route('/test', methods = ['GET'])
def test():
    # getACluster("ClusterA")
    createCluster()
    # createCluster("ClusterB")
    signUp("Ass", 1234, "ClusterC")
    signUp("Tiger", 1234, "ClusterC")
    signUp("Mike", 1234, "ClusterC")
    # signUp("George", 1234, "Cluster A")
    # signUp("Bob", 1234, "Cluster A")
    # signUp("Mary", 1234, "Cluster B")
    # signUp("Lisa", 1234, "Cluster B")

    createStatus("Ass", 10, "AAAAAAAAA", "")
    createStatus("Tiger", 11, "BBBBBBBBB", "")
    createStatus("Tiger", 12, "BBBBBBBBB", "")
    # createStatus("Bob", 3, "CCCCCCCCC", "")


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
