import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    linkedinEmail: "",
    linkedinPassword: "",
    notificationEmail: ""
  });

  const [status, setStatus] = useState("form"); 
  // form | loading | success | error

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
        "/api/notifications/register",
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
    </div>
  );
}

export default App;
