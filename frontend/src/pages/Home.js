import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import Layout from "../components/Layout";
import AlertMessage from "../components/AlertMessage";
import Button from "../components/Button";
import "../css/home.css";

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [uploadFile, setUploadFile] = useState(null);
  const [isFileDragEnter, setIsFileDragEnter] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("Please summarize the document.");
  const [modelAPIResponse, setModelAPIResponse] = useState("");
  const apiCalls = 20; // @TODO: Hardcoded

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  function handleFileDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragEnter(true);
  }

  function handleFileDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragEnter(false);
  }

  function handleFileDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragEnter(true);
  }

  function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setFieldErrors({});
    setIsFileDragEnter(false);
    handleFileUpload(e.dataTransfer.files[0]);
  }

  function handleFileUpload(file) {
    console.log(file);
    setFieldErrors({});
    if (file.size > 2097152) {
      // 2MB
      setFieldErrors((prev) => ({
        ...prev,
        uploadFile: "File size exceeds 2MB. Please upload a smaller file.",
      }));
      return;
    }
    if (file.type !== "application/pdf") {
      setFieldErrors((prev) => ({
        ...prev,
        uploadFile: "Invalid file format. Please upload a PDF file.",
      }));
      return;
    }
    setUploadFile(file);
  }

  async function submitFile() {
    setLoading(true);
    setModelAPIResponse("");

    if (!uploadFile) {
      setFieldErrors({ uploadFile: "Please select a file to upload." });
      setLoading(false);
      return;
    }

    if (prompt.trim() === "") {
      setFieldErrors({ prompt: "Please enter a prompt." });
      setPrompt("");
      setLoading(false);
      return;
    }

    if (prompt.trim().length > 500) {
      setFieldErrors({ prompt: "Prompt cannot exceed 500 characters." });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    const promptFormatted = prompt.trim().replace(/\n/g, " ");
    formData.append("file", uploadFile);
    formData.append("prompt", promptFormatted);

    try {
      const response = await fetch("/api/file/prompt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const message = await response.text();
        setModelAPIResponse(message);
        setFieldErrors({});
        setLoading(false);
      } else {
        // Handle error case
        const res = await response.json();
        setFieldErrors({ uploadFile: res.errMsg });
        console.error("File upload failed", res);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setFieldErrors({
        uploadFile: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout isLandingPage>
      <div id="uploadFileContainer">
        {uploadFile ? (
          <>
            {fieldErrors?.prompt && (
              <AlertMessage msg={fieldErrors.prompt} type="error" />
            )}
            <div className="fileSubmitContainer">
              <div className="fileSubmitHeader">
                <h2>Ready to Submit Prompt?</h2>
                <span>You have {apiCalls} API calls left.</span>
              </div>
              <Button
                title="Submit file"
                onClick={submitFile}
                loading={loading}
                text="Submit File"
              />
            </div>
            <div className="fileInfoContainer">
              <div className="instructions">
                <div className="instructionHeading">
                  <img src="./media/pdf-logo.png" alt="PDF Logo" />
                  <h2>{uploadFile.name}</h2>
                </div>
                <p>
                  File uploaded successfully. Please click the button above to
                  start processing the file.
                </p>
              </div>
              <div className="removeFileContainer">
                <input
                  type="button"
                  title="Remove file for submission"
                  onClick={() => {
                    setUploadFile(null);
                    setFieldErrors({});
                    setPrompt("");
                  }}
                  value="Remove"
                />
              </div>
            </div>
            <div className="promptContainer">
              <label
                htmlFor="prompt"
                className="promptLabel"
                title="Enter a prompt about the document"
              >
                Enter a prompt about the document
              </label>
              <textarea
                id="prompt"
                placeholder="Please summarize the document."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setFieldErrors({});
                }}
              ></textarea>
            </div>
            <div className="modelAPIResponseContainer">
              <h2>Model API Response</h2>
              <div className="modelAPIResponse">
                <p>{modelAPIResponse}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {fieldErrors?.uploadFile && (
              <AlertMessage msg={fieldErrors.uploadFile} type="error" />
            )}
            <div
              className={`dragdropContainer ${isFileDragEnter ? "active" : ""}`}
              onDragOver={handleFileDragOver}
              onDragEnter={handleFileDragEnter}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
            >
              <label htmlFor="fileInput" title="Select a file to upload">
                <IoCloudUploadOutline />
                <p>
                  Drag and Drop file here or <span>Choose File</span>
                </p>
              </label>
              <input
                id="fileInput"
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </div>
            <div className="dragDropFooter">
              <p>Supported formats: PDF</p>
              <p>Max file size: 2MB</p>
            </div>
            <div className="fileInfoContainer">
              <div className="instructions">
                <div className="instructionHeading">
                  <img src="./media/pdf-logo.png" alt="PDF Logo" />
                  <h2>File Example</h2>
                </div>
                <p>
                  You can download the attached file as an example of to test
                  out the LLM api feature.
                </p>
              </div>
              <a href="./media/homework-pdf-example.pdf" download>
                Download
              </a>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
