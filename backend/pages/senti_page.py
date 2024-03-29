import googleapiclient.discovery
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
from scipy.special import softmax
import streamlit as st
import re
import matplotlib.pyplot as plt



def extract_video_id(url):
    pattern = re.compile(r"(?<=v=)[\w-]+")
    match = pattern.search(url)
    if match:
        return match.group()
    else:
        return None

def preprocess(text):
    new_text = []
    for t in text.split(" "):
        t = '@user' if t.startswith('@') and len(t) > 1 else t
        t = 'http' if t.startswith('http') else t
        new_text.append(t)
    return " ".join(new_text)

def get_youtube_sentiments(video_id):
    # Google API setup
    api_service_name = "youtube"
    api_version = "v3"
    DEVELOPER_KEY = "AIzaSyBn_z3QvDE4LOosiIL31EiGrzHmHLYeyzw"

    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey=DEVELOPER_KEY)

    # Retrieve comments for a specific video
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=100
    )
    response = request.execute()

    # Extract comments and create a DataFrame
    comments = []
    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']
        comments.append([
            comment['publishedAt'],
            comment['updatedAt'],
            comment['likeCount'],
            comment['textDisplay']
        ])

    df = pd.DataFrame(comments, columns=['published_at', 'updated_at', 'like_count', 'text'])

    # Sentiment Analysis setup
    task = 'sentiment'
    MODEL = f"cardiffnlp/twitter-roberta-base-{task}"

    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL)

    # Sentiment Analysis for each comment
    sentiments = []
    labels = ['negative', 'neutral', 'positive']

    for comment_text in df['text']:
        preprocessed_text = preprocess(comment_text)
        encoded_input = tokenizer(preprocessed_text, return_tensors='pt')
        output = model(**encoded_input)
        scores = output[0][0].detach().numpy()
        scores = softmax(scores)
        ranking = np.argsort(scores)
        ranking = ranking[::-1]
        
        top_label = labels[ranking[0]]
        sentiments.append((top_label))

    # Add sentiment information to the DataFrame
    df['label'] = sentiments

    # Convert DataFrame to JSON
    df_dict = df.to_dict(orient='records')
    
    return df_dict

st.title("YouTube Comment Sentiment Analysis")
url = st.text_input("Enter YouTube video URL:")
if url:
    # Extract video ID from URL
    video_id =  extract_video_id(url)
    st.write(f"Video ID: {video_id}")

    # Get sentiments
    df_dict = get_youtube_sentiments(video_id)

    col1, col2 = st.columns(2)
    
    # Plot Pie Chart
    with col1:
        st.subheader("Sentiment Distribution:", divider="grey")
        df = pd.DataFrame(df_dict)
        label_counts = df['label'].value_counts()
        fig, ax = plt.subplots()
        ax.pie(label_counts, labels=label_counts.index, autopct='%1.1f%%', startangle=90)
        ax.axis('equal')  # Equal aspect ratio ensures the pie chart is circular.
        st.pyplot(fig)

    # Display label counts in cards
    with col2:
        st.subheader("Label Counts:", divider="grey")
            
        for label, count in label_counts.items():
            color = 'green' if label == 'positive' else 'blue' if label == 'neutral' else 'red'
            st.markdown(f"##### {label.capitalize()}: **:{color}[{count}]**")
                
    # Display DataFrame
    st.subheader("Sentiment Analysis Results:")
    st.write(pd.DataFrame(df_dict))