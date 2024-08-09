import speech_recognition as sr
import pyttsx3

# Initialize the recognizer 
r = sr.Recognizer()

# Function to convert text to speech
def SpeakText(command):
    # Initialize the engine
    engine = pyttsx3.init()
    engine.say(command)
    engine.runAndWait()

# Loop infinitely for user to speak
while True:    
    try:
        # Use the microphone as source for input.
        with sr.Microphone() as source2:
            # Wait for a second to let the recognizer adjust the energy threshold based on the surrounding noise level 
            r.adjust_for_ambient_noise(source2, duration=0.2)
            
            # Listen for the user's input 
            audio2 = r.listen(source2)
            
            # Using Google to recognize audio
            MyText = r.recognize_google(audio2)
            MyText = MyText.lower()

            print("Did you say: ", MyText)
            SpeakText(MyText)

            # If the user says "stop", break the loop and exit the program
            if "stop" in MyText:
                SpeakText("Stopping the program.")
                print("Stopping the program.")
                break
            
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
        
    except sr.UnknownValueError:
        print("Unknown error occurred")