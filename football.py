from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'manu'
COLLECTION_NAME = 'data'
FIELDS = {'Season': True, 'OverallPosition': True, '_id': False}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/manu/data")
def football_data():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    results = collection.find(projection=FIELDS, limit=225)
    json_results = []
    for result in results:
        json_results.append(result)
    json_results = json.dumps(json_results)
    connection.close()
    return json_results


if __name__ == "__main__":
    app.run(debug=True)