import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceModeController = () => {
  const [isVoiceModeOn, setIsVoiceModeOn] = useState(false);
  const [navPath, setNavPath] = useState(null); // 🌟 new state to hold path to navigate
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (command) => {
    const cmd = command.toLowerCase();
    console.log("✅ Command recognized:", cmd);

    // Home page navigation
    if (cmd.includes("home") || cmd.includes("main page") || cmd.includes("landing page")) {
      speak("Navigating to home page");
      setNavPath("/");
      return;
    }

    // About page
    if (cmd.includes("about") || cmd.includes("about us")) {
      speak("Navigating to about page");
      setNavPath("/about");
      return;
    }

    // Courses page
    if (cmd.includes("courses") || cmd.includes("all courses") || cmd.includes("browse courses")) {
      speak("Navigating to courses page");
      setNavPath("/courses");
      return;
    }

    // Authentication pages
    if (cmd.includes("login") || cmd.includes("sign in")) {
      speak("Navigating to login page");
      setNavPath("/login");
      return;
    }

    if (cmd.includes("register") || cmd.includes("sign up") || cmd.includes("create account")) {
      speak("Navigating to registration page");
      setNavPath("/register");
      return;
    }

    if (cmd.includes("forgot password") || cmd.includes("reset password")) {
      speak("Navigating to forgot password page");
      setNavPath("/forgot");
      return;
    }

    if (cmd.includes("verify") || cmd.includes("verification")) {
      speak("Navigating to verification page");
      setNavPath("/verify");
      return;
    }

    // Account page
    if (cmd.includes("account") || cmd.includes("profile") || cmd.includes("my account")) {
      speak("Navigating to account page");
      setNavPath("/account");
      return;
    }

    // User Dashboard routes (if user is logged in)
    if (user) {
      const userId = user._id || user.id;
      
      // My Courses
      if (cmd.includes("my courses") || cmd.includes("enrolled courses") || cmd.includes("my learning")) {
        speak("Navigating to my courses");
        setNavPath(`/${userId}/dashboard/my-courses`);
        return;
      }

      // Quiz History
      if (cmd.includes("quiz history") || cmd.includes("my quizzes") || cmd.includes("quiz results")) {
        speak("Navigating to quiz history");
        setNavPath(`/${userId}/dashboard/quiz-history`);
        return;
      }

      // Quiz Analytics
      if (cmd.includes("quiz analytics") || cmd.includes("quiz statistics") || cmd.includes("quiz performance")) {
        speak("Navigating to quiz analytics");
        setNavPath(`/${userId}/dashboard/quiz-analytics`);
        return;
      }

      // User Analytics
      if (cmd.includes("user analytics") || cmd.includes("my analytics") || cmd.includes("learning analytics")) {
        speak("Navigating to user analytics");
        setNavPath(`/${userId}/dashboard/user-analytics`);
        return;
      }

      // Dashboard (general)
      if (cmd.includes("dashboard") || cmd.includes("my dashboard")) {
        speak("Navigating to dashboard");
        setNavPath(`/${userId}/dashboard`);
        return;
      }
    }

    // Admin routes (if user is admin)
    if (user && user.role === "admin") {
      // Admin Dashboard
      if (cmd.includes("admin dashboard") || cmd.includes("admin panel")) {
        speak("Navigating to admin dashboard");
        setNavPath("/admin/dashboard");
        return;
      }

      // Admin Courses
      if (cmd.includes("manage courses") || cmd.includes("admin courses") || cmd.includes("course management")) {
        speak("Navigating to course management");
        setNavPath("/admin/course");
        return;
      }

      // Admin Users
      if (cmd.includes("manage users") || cmd.includes("admin users") || cmd.includes("user management")) {
        speak("Navigating to user management");
        setNavPath("/admin/users");
        return;
      }
    }

    // AI Quiz
    if (cmd.includes("ai quiz") || cmd.includes("artificial intelligence quiz") || cmd.includes("smart quiz")) {
      speak("Opening AI quiz");
      setNavPath("/aiquiz");
      return;
    }

    // Course study (requires course ID - this is a placeholder)
    if (cmd.includes("study course") || cmd.includes("start learning") || cmd.includes("begin course")) {
      speak("Please specify which course you want to study");
      return;
    }

    // Lectures (requires course ID - this is a placeholder)
    if (cmd.includes("lectures") || cmd.includes("course lectures") || cmd.includes("video lectures")) {
      speak("Please specify which course lectures you want to view");
      return;
    }

    // Help commands
    if (cmd.includes("help") || cmd.includes("commands") || cmd.includes("what can you do")) {
      speak("I can help you navigate to: home, about, courses, login, register, account, dashboard, my courses, quiz history, quiz analytics, user analytics, admin dashboard, manage courses, manage users, and AI quiz. Just say the page name!");
      return;
    }

    // Voice mode controls
    if (cmd.includes("stop listening") || cmd.includes("turn off voice") || cmd.includes("exit voice mode")) {
      speak("Turning off voice mode");
      setIsVoiceModeOn(false);
      stopVoiceRecognition();
      return;
    }

    if (cmd.includes("start listening") || cmd.includes("turn on voice") || cmd.includes("activate voice mode")) {
      speak("Voice mode is already active");
      return;
    }

    // Default response
    speak("Sorry, I didn't understand that command. Say 'help' to hear available commands.");
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("❌ SpeechRecognition not supported");
      speak("Sorry, your browser does not support speech recognition.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("🎙️ Voice recognition started");
        speak("Voice mode activated. Listening");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("🎧 Heard:", transcript);
        processCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error("❌ Recognition error:", event.error);
        speak("Error with voice recognition: " + event.error);
      };

      recognition.onend = () => {
        console.log("🛑 Recognition ended");
        if (isVoiceModeOn) {
          console.log("🔁 Restarting recognition...");
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("❌ Failed to start recognition:", error);
      speak("Could not start voice recognition.");
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      speak("Voice mode turned off.");
      console.log("🛑 Voice mode manually turned off");
    }
  };

  const toggleVoiceMode = () => {
    const nextState = !isVoiceModeOn;
    setIsVoiceModeOn(nextState);

    if (nextState) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  // ✅ Safely trigger navigation inside useEffect
  useEffect(() => {
    if (navPath) {
      navigate(navPath);
      setNavPath(null); // reset after navigating
    }
  }, [navPath, navigate]);

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <button
        onClick={toggleVoiceMode}
        style={{
          fontSize: '18px',
          padding: '15px 30px',
          borderRadius: '30px',
          backgroundColor: isVoiceModeOn ? '#e53935' : '#43a047',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {isVoiceModeOn ? '🔇 Stop Voice Mode' : '🎤 Start Voice Mode'}
      </button>
    </div>
  );
};

export default VoiceModeController;
