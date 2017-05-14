from pymongo import MongoClient
import pprint

client = MongoClient()
db = client.test_db
#collection = db['test-collection']
# post = {"user" : "Chen"}
# db.collection.insert_one(post)

Users = db['users']
Posts = db['posts']
Clusters = db['clusters']

# User
def login(user_name, password) : 

    msg = {"msg", "succeed"}
    return msg

def signUp(user_name, password, cluster_name) : 
    query = {
            "username" : user_name,
            "password": password,
            "image": "",
            "bio": "",
            "cluster":cluster_name,
            "subscription":[]
        }  
    db.Users.insert_one(query)
    msg = {"msg", "succeed"}
    return msg

def getClusterAllUser(cluster_name) : 

    # posts.find_one({"author": "Mike"})
    return msg

def getAllClusterAllUser() : 


    return msg

def deleteUser(user_name) : 

    return msg

# Post
def getAllClusterPost(cluster_name) : 
    msg = {"msg", "succeed"}
    return msg

def createPost(user_name, time, body, image) :
    query = {
            "username" : user_name,
            "time": time,
            "image": image,
            "body": body,
        }  
    db.Posts.insert_one(query)

    msg = {"msg", "succeed"}
    return msg

def deletePost(time) : 
    result = db.Posts.delete_one({"time": time})
    msg = {"msg", "succeed"}
    return msg

# Cluster
def createCluster(cluster_name) : 
    query = {
        "cluster_name" : cluster_name,
        "users": []
    }
    db.Clusters.insert_one(query)

    msg = {"msg", "succeed"}
    return msg

def deleteCluster(cluster_name) :
    result = db.Clusters.delete_one({"cluster_name": cluster_name})
    msg = {"msg", "succeed"}
    return msg

def getAllCluster() : 
    result = db.Clusters.find() 
    for c in result:
        print(str(c))
    return ""

# createPost("Jeremy", 222222, "GLBHDHFDFSD", "")
# deletePost(222222)

# signUp("Jeremy", 1234, "fire_dept")
# createCluster("Cluster A")
# createCluster("Cluster B")

getAllCluster()

############## ICE BOX   ######################

# def likePost(user_name, time)

# def dislikePost(user_name, time)

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
#             "cluster":"....",
#             "subscription":["alice", "george"]
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
#             "image": "....",
#             #comments: [],
#             "likes": ["alice", "george"]
#         }
#     return json.dumps(js)
