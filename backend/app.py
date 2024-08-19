import time
import threading
import json
import speech_recognition as sr
import pymongo
import subprocess
from flask import Flask, Response, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Initialize MongoDB client and connect to the database
client = MongoClient(os.getenv('Mongo'))
db = client['test']
collection = db['inspection']

# Initialize global variables
stop_event = threading.Event()
responses = {}
r = sr.Recognizer()

# Sample questions (you can adjust this according to your needs)
questions = {
    "Tires": [
        {"text": "Tire Pressure for Left Front", "type": "number"},
        {"text": "Tire Pressure for Right Front", "type": "number"},
        {"text": "Tire Condition for Left Front – Good, Ok, or Needs Replacement", "type": "condition"},
        {"text": "Tire Condition for Right Front – Good, Ok, or Needs Replacement", "type": "condition"},
        {"text": "Tire Pressure for Left Rear", "type": "number"},
        {"text": "Tire Pressure for Right Rear", "type": "number"},
        {"text": "Tire Condition for Left Rear – Good, Ok, or Needs Replacement", "type": "condition"},
        {"text": "Tire Condition for Right Rear – Good, Ok, or Needs Replacement", "type": "condition"},
        {"text": "Overall Tire Summary (1000 characters max)"}
    ],
    "Battery": [
        {"text": "Battery Make (Example CAT, ABC, XYZ)"},
        {"text": "Battery replacement date"},
        {"text": "Battery Voltage (Example 12V / 13V)"},
        {"text": "Battery Water level – Good, Ok, or Low"},
        {"text": "Condition of Battery – Any damage Y/N. If yes attach image"},
        {"text": "Any Leak / Rust in battery Y/N"},
        {"text": "Battery overall Summary (1000 characters max)"}
    ],
    "Exterior": [
        {"text": "Rust, Dent or Damage to Exterior Y/N. If yes explain in notes and attach images"},
        {"text": "Oil leak in Suspension Y/N"},
        {"text": "Overall Summary (1000 characters max)"}
    ],
    "Brakes": [
        {"text": "Brake Fluid level – Good, Ok, or Low"},
        {"text": "Brake Condition for Front – Good, Ok, or Needs Replacement", "type": "condition"},
        {"text": "Brake Condition for Rear – Good, Ok, or Needs Replacement", "type": "condition"},
        {"text": "Emergency Brake – Good, Ok, or Low"},
        {"text": "Brake Overall Summary (1000 characters max)"}
    ],
    "Engine": [
        {"text": "Rust, Dents or Damage in Engine Y/N. If yes explain in notes and attach images"},
        {"text": "Engine Oil Condition - Good or Bad"},
        {"text": "Engine Oil Color - Clean, Brown, or Black"},
        {"text": "Brake Fluid Condition - Good or Bad"},
        {"text": "Brake Fluid Color: Clean, Brown, or Black"},
        {"text": "Any oil leak in Engine Y/N"},
        {"text": "Overall Summary (1000 characters max)"}
    ],
    "Voice of Customer": [
        {"text": "Any feedback from Customer"},
        {"text": "Images related to the issues discussed with customer"}
    ]
}

def SpeakText(command):
    # This function uses a TTS engine to speak the text
    # Implement TTS functionality according to your requirements
    print(f"Speaking: {command}")

def store_responses_to_db():
    global responses
    # Prepare the document to be stored in MongoDB
    document = {
        "responses": responses,
        "timestamp": time.time()
    }
    print("Storing responses to DB:", document)  # Debugging output
    result = collection.insert_one(document)
    print(f"Stored responses with id: {result.inserted_id}")

def ask_question(question, expected_type=None):
    global stop_event
    global responses

    response_list = []

    # Emit the question to the frontend immediately
    question_response = json.dumps({"question": question, "response": ""}) + "\n"
    print("Emitting question:", question_response.strip())
    yield question_response

    # Speak the question
    SpeakText(question)

    # Add a short delay to allow the TTS engine to finish
    time.sleep(1.5)  # Adjust the duration if needed

    while not stop_event.is_set():  # Check if stop event is set
        try:
            with sr.Microphone() as source2:
                r.adjust_for_ambient_noise(source2, duration=0.2)
                audio2 = r.listen(source2)
                response = r.recognize_google(audio2).lower()

                if "stop" in response:
                    SpeakText("Stopping the program.")
                    stop_response = json.dumps({"question": question, "response": "Process stopped by user."}) + "\n"
                    print("Stopping the program:", stop_response.strip())
                    yield stop_response
                    stop_event.set()  # Set stop event
                    return

                # Check for "skip" keyword or process valid responses
                if "skip" in response:
                    response_list.append("Question skipped by user.")
                    skip_response = json.dumps({"question": question, "response": "Question skipped by user."}) + "\n"
                    print("Skipping the question:", skip_response.strip())
                    yield skip_response
                    break

                if expected_type == "number" and response.isdigit():
                    response_list.append(response)
                    valid_response = json.dumps({"question": question, "response": response}) + "\n"
                    print("Valid number response:", valid_response.strip())
                    yield valid_response
                    break
                elif expected_type == "text":
                    response_list.append(response)
                    valid_response = json.dumps({"question": question, "response": response}) + "\n"
                    print("Valid text response:", valid_response.strip())
                    yield valid_response
                    break

        except sr.RequestError as e:
            SpeakText("There was an error with the request, please try again.")
        except sr.UnknownValueError:
            SpeakText("Sorry, I did not catch that. Please repeat.")

    responses[question] = response_list

def generate_responses():
    global responses
    global stop_event

    stop_event.clear()  # Clear stop event at the start
    responses = {}  # Clear previous responses
    all_questions = [question for section in questions.values() for question in section]

    for i, q in enumerate(all_questions):
        if stop_event.is_set():
            store_responses_to_db()  # Save responses when stopped
            break  # Stop processing if stop event is set

        # Emit the question immediately
        response_generator = ask_question(q['text'], q.get('type'))
        for r in response_generator:
            if stop_event.is_set():
                store_responses_to_db()  # Save responses when stopped
                return  # Return to avoid saving twice
            yield r
        time.sleep(1)  # To simulate delay for real-time effect

    # Save responses when the last question is processed
    if not stop_event.is_set():
        store_responses_to_db()

@app.route('/ask', methods=['POST'])
def ask():
    return Response(generate_responses(), content_type='application/json')

if __name__ == '__main__':
    app.run(debug=True)
    app.run(port=4000)