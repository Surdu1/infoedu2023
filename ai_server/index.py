from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime, timedelta
from flask_cors import CORS

client = MongoClient("mongodb://localhost:27017")
db = client['vive-vice']
video = db["videos"]
like = db["likes"]
comentari = db["comentarius"]
view = db["vizionaris"]

def ai_verification():
    all_documents = video.find()
    all_video = video.find({})
    categorizat = []
    like_count = 0
    view_count = 0
    comentari_count = 0
    for clip in all_video:
        like_object = like.find({"video_id": clip["id"]})
        for likeuri in like_object:
            like_count += 1
        view_object = view.find({"video_id": clip["id"]})
        for viewu in view_object:
            view_count += 1
        comentari_object = comentari.find({"video_id": clip["id"]})
        for comentariu in comentari_object:
            comentari_count += 1
        time = clip["time"]
        categorizat.append({"id": clip["id"],"time": int(time),"like": like_count,"view": view_count,"comentari": comentari_count})

    def functie_de_sortare(obiect):
        print(obiect["time"] + 3 * obiect["view"] + 3 * obiect["like"] + 2* obiect["comentari"])
        return(obiect["time"] + 10 * obiect["view"] + 10 * obiect["like"] +  5 * obiect["comentari"])
    
    sorted_arr = sorted(categorizat, key=functie_de_sortare, reverse=True)
    sorted_arr_id = []
    for sort in sorted_arr:
        sorted_arr_id.append(sort["id"])
    return sorted_arr_id

app = Flask(__name__)
CORS(app)
@app.route('/get_video_nelogat')
def get_video_nelogat():
    sorted_arr = ai_verification()
    return jsonify(sorted_arr[:5])

@app.route('/get_video_id',methods=['POST'])
def get_video_id():
    sorted_arr = ai_verification()
    return jsonify(sorted_arr[0 : 100])

if __name__ == '__main__':
    app.run(port=8000)
