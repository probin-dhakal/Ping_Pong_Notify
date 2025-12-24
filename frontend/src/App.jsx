import { useState } from "react";
import "./App.css";

// API Base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "/api";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    linkedinEmail: "",
    linkedinPassword: "",
    notificationEmail: ""
  });

  const [status, setStatus] = useState("form"); 
  // form | loading | success | error | unsubscribe | unsubscribe-loading | unsubscribe-success | unsubscribe-error

  const [unsubscribeEmail, setUnsubscribeEmail] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(
        `${API_URL}/notifications/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleUnsubscribeClick = () => {
    setStatus("unsubscribe");
    setUnsubscribeEmail("");
  };

  const handleUnsubscribeSubmit = async (e) => {
    e.preventDefault();
    setStatus("unsubscribe-loading");

    try {
      const response = await fetch(
        `${API_URL}/notifications/unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: unsubscribeEmail })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      setStatus("unsubscribe-success");
    } catch (error) {
      console.error(error);
      setStatus("unsubscribe-error");
    }
  };

  // ---------------- UI STATES ----------------

  if (status === "loading") {
    return (
      <div className="container">
        <h2>Setting up your notifications… ⏳</h2>
        <p>Please wait while we configure your account.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container success">
        <h2>🎉 Setup Complete!</h2>
        <p>
          You will receive a notification email immediately after setup.
        </p>
        <p>
          After that, notifications will be sent every <strong>3 hours</strong>.
        </p>
        <p className="safe">
          Don’t worry — your data is encrypted and used only for the service you
          signed up for.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container error">
        <h2>❌ Something went wrong</h2>
        <p>
          We couldn’t complete your setup. Please check your details and try
          again.
        </p>
        <button onClick={() => setStatus("form")}>Go Back</button>
      </div>
    );
  }
  if (status === "unsubscribe") {
    return (
      <div className="container unsubscribe-modal">
        <h2>Stop Notifications</h2>
        <p>Enter the email associated with your account to unsubscribe.</p>
        <form onSubmit={handleUnsubscribeSubmit}>
          <input
            type="email"
            placeholder="LinkedIn email or notification email"
            value={unsubscribeEmail}
            onChange={(e) => setUnsubscribeEmail(e.target.value)}
            required
          />
          <button type="submit">Unsubscribe</button>
        </form>
        <button
          className="cancel-btn"
          onClick={() => setStatus("form")}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (status === "unsubscribe-loading") {
    return (
      <div className="container">
        <h2>Processing… ⏳</h2>
        <p>We're unsubscribing you from notifications.</p>
      </div>
    );
  }

  if (status === "unsubscribe-success") {
    return (
      <div className="container success">
        <h2>✅ Unsubscribed Successfully</h2>
        <p>You have been unsubscribed from all notifications.</p>
        <p>A confirmation email has been sent to your inbox.</p>
        <p>
          If you change your mind, you can sign up again anytime.
        </p>
        <button onClick={() => setStatus("form")}>Go Back</button>
      </div>
    );
  }

  if (status === "unsubscribe-error") {
    return (
      <div className="container error">
        <h2>❌ Unsubscribe Failed</h2>
        <p>
          We couldn't find an account with that email. Please check and try again.
        </p>
        <button onClick={() => setStatus("unsubscribe")}>Try Again</button>
        <button onClick={() => setStatus("form")}>Go Back</button>
      </div>
    );
  }
  // ---------------- FORM ----------------

  return (
    <div className="container">
      <h1>Welcome to LinkedIn Notification Service</h1>
      <p className="subtitle">
        Get periodic email updates about your unread LinkedIn messages and
        notifications.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Your Name"
          required
          onChange={handleChange}
        />

        <input
          type="email"
          name="linkedinEmail"
          placeholder="LinkedIn Email"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="linkedinPassword"
          placeholder="LinkedIn Password"
          required
          onChange={handleChange}
        />

        <input
          type="email"
          name="notificationEmail"
          placeholder="Email to receive notifications"
          required
          onChange={handleChange}
        />

        <button type="submit">Register & Start Notifications</button>
      </form>

      <div className="unsubscribe-section">
        <p>Already registered?</p>
        <button
          type="button"
          className="unsubscribe-btn"
          onClick={handleUnsubscribeClick}
        >
          Stop Notifications
        </button>
      </div>
    </div>
  );
}

export default App;
