import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import "./Worker.css"; // Import the CSS file for styling

function Worker({ customerid, truckSerialNumber, email, employeeid }) {
  const [messages, setMessages] = useState([]); // Store messages as an array
  const [isAsking, setIsAsking] = useState(false);
  const [showPdfButton, setShowPdfButton] = useState(false); // State for showing the PDF button
  const chatboxRef = useRef(null); // Reference for auto-scrolling

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAsking(true);
    setShowPdfButton(false); // Hide the button when starting a new inspection
    setMessages([]); // Clear messages when starting a new inspection

    // Prepare the request payload with additional values
    const requestPayload = {
      customerid,
      truckSerialNumber,
      email,
      employeeid,
    };

    const res = await fetch("http://127.0.0.1:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let currentQuestionText = "";
    let questionAnswered = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      lines.forEach((line) => {
        if (line) {
          try {
            const responsePart = JSON.parse(line);

            if (
              responsePart.question &&
              responsePart.question !== currentQuestionText
            ) {
              currentQuestionText = responsePart.question;
              questionAnswered = false;

              // Add new question to the messages array
              setMessages((prevMessages) => [
                ...prevMessages,
                { type: "question", text: responsePart.question },
              ]);
            }

            if (responsePart.response && !questionAnswered) {
              // Add new response to the messages array
              setMessages((prevMessages) => [
                ...prevMessages,
                { type: "response", text: responsePart.response },
              ]);
              questionAnswered = true;

              // Check if the response indicates the end of the inspection
              if (responsePart.response === "Process stopped by user.") {
                setIsAsking(false);
                setShowPdfButton(true); // Show the PDF button
                return;
              }
            }
          } catch (e) {
            // Ignore parsing errors for incomplete JSON strings
          }
        }
      });
    }
  };

  const handlePdfGeneration = () => {
    const doc = new jsPDF();
    let yPosition = 10; // Starting y position for text

    // Add messages to the PDF
    messages.forEach((message, index) => {
      doc.text(
        10,
        yPosition,
        `${message.type === "question" ? "Q" : "A"}: ${message.text}`
      );
      yPosition += 10; // Move down for the next line

      // Handle page breaks if needed
      if (yPosition > 280) {
        // Adjust based on your margins and font size
        doc.addPage();
        yPosition = 10;
      }
    });

    // Save the generated PDF to the user's system
    doc.save("inspection_report.pdf");
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbox-container">
      <h1>Vehicle Inspection</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={isAsking}>
          {isAsking ? "Asking..." : "Start Inspection"}
        </button>
      </form>
      <div className="chatbox" ref={chatboxRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chatbox-message ${message.type}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
      </div>
      {showPdfButton && (
        <button onClick={handlePdfGeneration} className="hello">
          Generate PDF
        </button>
      )}
    </div>
  );
}

export default Worker;