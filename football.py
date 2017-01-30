from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS1_NAME = 'liv'
DBS2_NAME = 'manu'
COLLECTION_NAME = 'data'
FIELDS = {'Season': True, 'OverallPosition': True, 'Team': True, '_id': False}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/liv/data")
def liv_data():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS1_NAME][COLLECTION_NAME]
    results = collection.find(projection=FIELDS, limit=225)
    liv_results = []
    for result in results:
        liv_results.append(result)
    liv_results = json.dumps(liv_results)
    connection.close()
    return liv_results

@app.route("/manu/data")
def manu_data():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS2_NAME][COLLECTION_NAME]
    results = collection.find(projection=FIELDS, limit=225)
    manu_results = []
    for result in results:
        manu_results.append(result)
    manu_results = json.dumps(manu_results)
    connection.close()
    return manu_results


if __name__ == "__main__":
    app.run(debug=True)
