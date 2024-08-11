import React, { useState, useEffect } from 'react';

const UploadVideo = () => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load('client:auth2', initClient);
      };
      document.body.appendChild(script);
    };

    const initClient = () => {
      window.gapi.client.init({
        apiKey: "YOUR_API_KEY",
        clientId: "268842436496-885bg0cv24ks8k8553p5u32qspujcpqu.apps.googleusercontent.com",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
        scope: "https://www.googleapis.com/auth/youtube.upload"
      }).then(() => {
        console.log("GAPI client initialized");
      }).catch(err => {
        console.error("Error initializing GAPI client", err);
      });
    };

    loadGapi();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const authenticate = () => {
    return window.gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube" })
      .then(() => {
        console.log("Sign-in successful");
      }, (err) => {
        console.error("Error signing in", err);
      });
  };

  const loadClient = () => {
    return window.gapi.client.load("youtube", "v3")
      .then(() => {
        console.log("GAPI client loaded for API");
      }, (err) => {
        console.error("Error loading GAPI client for API", err);
      });
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a video file first.");
      return;
    }

    authenticate().then(loadClient).then(() => {
      const metadata = {
        snippet: {
          title: "Generic Title",
          description: "Had fun surfing in Santa Cruz",
          tags: ["surfing", "Santa Cruz"],
          categoryId: "22"
        },
        status: {
          privacyStatus: "private"
        }
      };

      const form = new FormData();
      form.append("file", file);
      form.append("snippet", new Blob([JSON.stringify(metadata.snippet)], { type: "application/json" }));
      form.append("status", new Blob([JSON.stringify(metadata.status)], { type: "application/json" }));

      fetch("https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`,
          "X-Upload-Content-Type": file.type,
        },
        body: form
      })
      .then(response => response.json())
      .then(data => {
        console.log("Video uploaded successfully:", data);
      })
      .catch(error => {
        console.error("Error uploading video:", error);
      });
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="video/*" />
      <button onClick={handleUpload}>Upload Video</button>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>Upload Video to YouTube</h1>
      <UploadVideo />
    </div>
  );
};

export default App;
