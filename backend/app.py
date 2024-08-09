from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3

app = Flask(__name__)
CORS(app)

# Initialize the recognizer
r = sr.Recognizer()

# Function to convert text to speech
def SpeakText(command):
    engine = pyttsx3.init()
    engine.say(command)
    engine.runAndWait()

# Function to ask questions and get responses with validation
def ask_question(question, expected_type=None):
    while True:
        SpeakText(question)
        print(question)
        try:
            with sr.Microphone() as source2:
                r.adjust_for_ambient_noise(source2, duration=0.2)
                audio2 = r.listen(source2)
                response = r.recognize_google(audio2).lower()
                print("Response:", response)
                
                # Check if the user wants to stop the program
                if "stop" in response:
                    SpeakText("Stopping the program.")
                    print("Stopping the program.")
                    exit()  # Exit the program immediately
                
                # Validation for tire pressure (only accept numbers)
                if expected_type == "number":
                    try:
                        pressure = float(response)
                        return response
                    except ValueError:
                        SpeakText("Please provide a valid number for the tire pressure.")
                        print("Please provide a valid number for the tire pressure.")
                
                # Validation for tire condition (only accept specific responses)
                elif expected_type == "condition":
                    if response in ["good", "ok", "needs replacement"]:
                        return response
                    else:
                        SpeakText("Please say Good, Ok, or Needs Replacement.")
                        print("Please say Good, Ok, or Needs Replacement.")
                
                # No specific validation required
                else:
                    return response
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            SpeakText("There was an error with the request, please try again.")
        except sr.UnknownValueError:
            print("Unknown error occurred, please say that again.")
            SpeakText("Sorry, I did not catch that. Please repeat.")

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

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    section = data['section']
    
    if section in questions:
        section_questions = questions[section]
        responses = []
        for q in section_questions:
            response = ask_question(q['text'], q.get('type'))
            responses.append(response)
        return jsonify({"response": " | ".join(responses)})
    else:
        return jsonify({"response": "Invalid section"})

if __name__ == "__main__":
    app.run(debug=True)