from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
import json
import time
from threading import Event

app = Flask(__name__)
CORS(app)

r = sr.Recognizer()

responses = {}
stop_event = Event()  # Event to signal stop

def SpeakText(command):
    engine = pyttsx3.init()
    engine.say(command)
    engine.runAndWait()

def ask_question(question, expected_type=None):
    global stop_event
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

                if expected_type == "number":
                    try:
                        float(response)
                        valid_response = json.dumps({"question": question, "response": response}) + "\n"
                        print("Valid number response:", valid_response.strip())
                        yield valid_response
                        responses[question] = response  # Store the response
                        return
                    except ValueError:
                        SpeakText("Please provide a valid number.")
                        continue

                elif expected_type == "condition":
                    if response in ["good", "ok", "needs replacement"]:
                        valid_response = json.dumps({"question": question, "response": response}) + "\n"
                        print("Valid condition response:", valid_response.strip())
                        yield valid_response
                        responses[question] = response  # Store the response
                        return
                    else:
                        SpeakText("Please say Good, Ok, or Needs Replacement.")
                        continue

                else:
                    generic_response = json.dumps({"question": question, "response": response}) + "\n"
                    print("Generic response:", generic_response.strip())
                    yield generic_response
                    responses[question] = response  # Store the response
                    return
        except sr.RequestError as e:
            SpeakText("There was an error with the request, please try again.")
        except sr.UnknownValueError:
            SpeakText("Sorry, I did not catch that. Please repeat.")

def generate_responses():
    global responses
    global stop_event

    stop_event.clear()  # Clear stop event at the start
    all_questions = [question for section in questions.values() for question in section]

    for i, q in enumerate(all_questions):
        if stop_event.is_set():
            break  # Stop processing if stop event is set

        # Emit the question immediately
        response_generator = ask_question(q['text'], q.get('type'))
        for r in response_generator:
            if stop_event.is_set():
                stop_response = json.dumps({"question": q['text'], "response": "Process stopped by user."}) + "\n"
                print("Stopping response:", stop_response.strip())
                yield stop_response
                break  # Break out of response loop if stop event is set
            print("Generated response:", r.strip())
            yield r
        time.sleep(1)  # To simulate delay for real-time effect

        # If it's the last question, stop the process automatically
        if i == len(all_questions) - 1:
            stop_event.set()  # Set stop event after the last question

    # Print final responses after all questions are asked
    print("Final Responses:")
    for question, response in responses.items():
        print(f"{question}: {response}")

@app.route('/ask', methods=['POST'])
def ask():
    response = Response(generate_responses(), content_type='application/json')
    print("Request received for all sections.")
    return response

@app.route('/stop', methods=['POST'])
def stop():
    stop_event.set()  # Set stop event to signal stopping
    stop_response = jsonify({"response": "Process stopping."})
    print("Stop endpoint hit:", stop_response.get_data(as_text=True).strip())
    return stop_response

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

def ask_question(question, expected_type=None):
    global stop_event
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

                if "skip"  in response:
                    SpeakText("Skipping the question.")
                    skip_response = json.dumps({"question": question, "response": "Question skipped by user."}) + "\n"
                    print("Skipping the question:", skip_response.strip())
                    yield skip_response
                    return  # Skip to the next question

                if expected_type == "number":
                    try:
                        float(response)
                        valid_response = json.dumps({"question": question, "response": response}) + "\n"
                        print("Valid number response:", valid_response.strip())
                        yield valid_response
                        responses[question] = response  # Store the response
                        return
                    except ValueError:
                        SpeakText("Please provide a valid number.")
                        continue

                elif expected_type == "condition":
                    if response in ["good", "ok", "needs replacement"]:
                        valid_response = json.dumps({"question": question, "response": response}) + "\n"
                        print("Valid condition response:", valid_response.strip())
                        yield valid_response
                        responses[question] = response  # Store the response
                        return
                    else:
                        SpeakText("Please say Good, Ok, or Needs Replacement.")
                        continue

                else:
                    generic_response = json.dumps({"question": question, "response": response}) + "\n"
                    print("Generic response:", generic_response.strip())
                    yield generic_response
                    responses[question] = response  # Store the response
                    return
        except sr.RequestError as e:
            SpeakText("There was an error with the request, please try again.")
        except sr.UnknownValueError:
            SpeakText("Sorry, I did not catch that. Please repeat.")


if __name__ == "__main__":
    app.run(debug=True)