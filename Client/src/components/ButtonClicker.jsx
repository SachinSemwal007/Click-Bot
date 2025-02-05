import { useState } from "react";
import axios from "axios";

const ButtonClicker = () => {
    const [url, setUrl] = useState("");          // Stores the URL input
    const [selector, setSelector] = useState(""); // Stores the button selector input
    const [message, setMessage] = useState("");   // Displays the success or error message

    const handleClick = async () => {
        try {
            // Send the URL and selector to the backend
            const response = await axios.post("http://localhost:5000/api/click", {
                url,
                selector,
            });
            setMessage(response.data.message); // Show success message
        } catch (error) {
            // Show error message from backend or fallback error
            console.error("Error from backend:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
            <h1>Button Click Bot</h1>
            <input
                type="text"
                placeholder="Enter the webpage URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
            />
            <input
                type="text"
                placeholder="Enter the button selector"
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
                style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
            />
            <button
                onClick={handleClick}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Start Clicking
            </button>
            {message && <p style={{ marginTop: "20px", color: "#00FF00" }}>{message}</p>}
        </div>
    );
};

export default ButtonClicker;
