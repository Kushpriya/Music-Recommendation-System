#!/usr/bin/env python
# coding: utf-8

# In[1]:


from flask import *
from flask import request, jsonify
from flask_cors import CORS
import json, time 
import pickle


# In[2]:


app = Flask(__name__)
CORS(app) 


# In[ ]:





# In[3]:


@app.route('/addedNewSong',methods=['Post'])
def addedNewSong():
    import pandas as pd
    from pymongo import MongoClient

    # Connect to MongoDB
    client = MongoClient("localhost:27017")
    db = client["Music"]
    collection = db["songs"]
    
    query = {}  # This example retrieves all documents; adjust the query as needed
    
    data_from_mongo = list(collection.find(query))
    df = pd.DataFrame(data_from_mongo)
    
    df.to_csv("your_dataset.csv", index=False)

   

    df = pd.read_csv('your_dataset.csv')

    df['lyrics'] = df['lyrics'].str.lower().replace(r'[a-zA-Z0-9]','').replace(r'\\n',' ',regex=True)

    df['lyrics'][0]

    import nltk
    from nltk.stem.porter import PorterStemmer

    nltk.download('punkt', quiet=True)

    def tokenization(txt):
    
        tokens = nltk.word_tokenize(txt)
        ps = PorterStemmer()  # Create an instance of the PorterStemmer
        stemming = [ps.stem(w) for w in tokens] 

        return " ".join(stemming)


    df['lyrics'] = df['lyrics'].apply(lambda x: tokenization(x))

    df['lyrics']

    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    tfid = TfidfVectorizer(stop_words='english')
    matrix = tfid.fit_transform(df['lyrics'])

    matrix.shape


    similarity = cosine_similarity(matrix)
    import pickle

    # Your data to be saved
    data_to_save = similarity
    
    
    # Specify the file path where you want to save the pickle file
    file_path = 'sim.pkl'
    df_path = 'df.pkl'
    
    # Open the file in binary write mode ('wb') and use the pickle.dump() method to save the data
    with open(file_path, 'wb') as file:
        pickle.dump(data_to_save, file)
    print(f'Data saved to {file_path}')

    with open(df_path, 'wb') as file:
      pickle.dump(df, file)
    print(f'Data saved to {df_path}')
   
    
    data_set ={'Page': 'Home','Message':'loaded successfully'}
    json_dump = json.dumps(data_set)
    return json_dump


# In[4]:


@app.route('/user/',methods=['GET'])
def request_page():
    user_query = str(request.args.get('user'))
    
    data_set ={'Page': 'Home','Message':'Successfully loaded the ${user_query}','Timestamp':time.time()}
    json_dump = json.dumps(data_set)
    return json_dump


# In[5]:


# Load data from pickle files
df = pickle.load(open('df.pkl', 'rb'))
similarity = pickle.load(open('sim.pkl', 'rb'))

def recommendation(title, threshold=0.8):
    if df.empty:
        # Handle the case when the DataFrame is empty
        return jsonify({'Page': 'recommendation', 'Message': 'DataFrame is empty', 'Timestamp': time.time()})
    
    if title not in df['title'].values:
        # Handle the case when the song is not in the DataFrame
        return jsonify({'Page': 'recommendation', 'Message': f'Song "{title}" not found in the DataFrame', 'Timestamp': time.time()})

    idx = df[df['title'] == title].index[0]
    distances = sorted(list(enumerate(similarity[idx])), reverse=True, key=lambda x: x[1])

    similar_songs = [(df.iloc[i[0]].title) for i in distances[0:6] if i[1] <= threshold]
    similar_ids = [(df['_id'][i[0]]) for i in distances[0:6] if i[1] <= threshold]

    data_set = {'Page': 'recommendation', 'Message': similar_songs, 'id' : similar_ids }
    json_dump = json.dumps(data_set)
    return json_dump;
        


# In[6]:


@app.route('/submit', methods=['POST'])
def submit_form():
    try:
        # Assuming the request data is in JSON format
        data = request.get_json()

        # Perform any server-side processing here
        result = recommendation(data)

        # Return a response to the client
        
        return (result),201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# In[7]:


if __name__ == '__main__':
    app.run(port=7777)


# In[8]:





# In[9]:





# In[ ]:




