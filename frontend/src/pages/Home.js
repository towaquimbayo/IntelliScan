/**
 * Main page of the application where the user can upload a PDF file and enter a prompt to summarize the document.
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import Layout from "../components/Layout";
import AlertMessage from "../components/AlertMessage";
import Button from "../components/Button";
import { config } from "../config";
import { updateUserApiCalls } from "../redux/actions/UserAction";
import messages from "../messages/lang/en/user.json";
import "../css/home.css";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const apiCalls = useSelector((state) => state.user.apiCalls);
  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.id);

  const endpoint = config.url;
  const [uploadFile, setUploadFile] = useState(null);
  const [isFileDragEnter, setIsFileDragEnter] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [modelAPIResponse, setModelAPIResponse] = useState("");
  const [modelAPIResponseRows, setModelAPIResponseRows] = useState(2);
  const apiConsumption = {
    safe: {
      color: "#0dc08a",
      status: "Safe Zone!",
      limit: 10,
    },
    warning: {
      color: "#e4cf14",
      status: "Warning Zone!",
      limit: 15,
    },
    danger: {
      color: "#e22315",
      status: "Danger Zone!",
      limit: 20,
    },
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // Dynamically adjust the number of rows in the model API response textarea
  useEffect(() => {
    const rows = modelAPIResponse.split("\n").length + 1;
    setModelAPIResponseRows(Math.max(2, rows));
  }, [modelAPIResponse]);

  /**
   * Get the API consumption rate as a percentage.
   * @returns the API consumption rate as a percentage
   */
  function getConsumptionRate() {
    const rate = (apiCalls / 20) * 100;
    return rate > 100 ? 100 : rate;
  }

  /**
   * Get the color of the API consumption status.
   * @returns the color of the API consumption status
   */
  function getConsumptionColor() {
    if (apiCalls < 10) return apiConsumption.safe.color;
    if (apiCalls < 15) return apiConsumption.warning.color;
    return apiConsumption.danger.color;
  }

  /**
   * Get the API consumption status message.
   * @returns the API consumption status message
   */
  function getConsumptionStatus() {
    if (apiCalls < 10) {
      return (
        <p>
          Your API consumption status is in the{" "}
          <b style={{ color: apiConsumption.safe.color }}>
            {apiConsumption.safe.status}
          </b>{" "}
          You have{" "}
          <b style={{ color: apiConsumption.safe.color }}>{20 - apiCalls}</b>{" "}
          API calls remaining.
        </p>
      );
    }
    if (apiCalls < 15) {
      return (
        <p>
          Your API consumption status is in the{" "}
          <b style={{ color: apiConsumption.warning.color }}>
            {apiConsumption.warning.status}
          </b>{" "}
          You have{" "}
          <b style={{ color: apiConsumption.warning.color }}>{20 - apiCalls}</b>{" "}
          API calls remaining.
        </p>
      );
    }
    if (apiCalls < 20) {
      return (
        <p>
          Your API consumption status is in the{" "}
          <b style={{ color: apiConsumption.danger.color }}>
            {apiConsumption.danger.status}
          </b>{" "}
          You have{" "}
          <b style={{ color: apiConsumption.danger.color }}>{20 - apiCalls}</b>{" "}
          API calls remaining.
        </p>
      );
    }
    return (
      <p>
        Your API consumption status is in the{" "}
        <b style={{ color: apiConsumption.danger.color }}>
          {apiConsumption.danger.status}
        </b>{" "}
        You have exceeded the API call limit.
      </p>
    );
  }

  /**
   * Handles the drag enter event for file upload.
   * @param {*} e the drag enter event
   */
  function handleFileDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragEnter(true);
  }

  /**
   * Handles the drag leave event for file upload.
   * @param {*} e the drag leave event
   */
  function handleFileDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragEnter(false);
  }

  /**
   * Handles the drag over event for file upload.
   * @param {*} e the drag over event
   */
  function handleFileDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragEnter(true);
  }

  /**
   * Handles the drop event for file upload.
   * @param {*} e the drop event
   */
  function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setErrMsg("");
    setIsFileDragEnter(false);
    handleFileUpload(e.dataTransfer.files[0]);
  }

  /**
   * Handles the file upload event.
   * @param {*} file the file to upload
   * @returns the file upload response
   */
  function handleFileUpload(file) {
    console.log(file);
    setErrMsg("");
    if (file.size > 2097152) {
      // 2MB
      setErrMsg(messages.filesizeExceededError);
      return;
    }
    if (file.type !== "application/pdf") {
      setErrMsg(messages.invalidFileTypeError);
      return;
    }
    setUploadFile(file);
  }

  /**
   * Submits the file for processing.
   * @returns the file processing response
   */
  async function submitFile() {
    setLoading(true);
    setModelAPIResponse("");
    setErrMsg("");

    if (!uploadFile) {
      setErrMsg(messages.emptyFileError);
      setLoading(false);
      return;
    }

    if (prompt.trim() === "") {
      setErrMsg(messages.emptyPromptError);
      setPrompt("");
      setLoading(false);
      return;
    }

    if (prompt.trim().length > 500) {
      setErrMsg(messages.promptLengthError);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    const promptFormatted = prompt.trim().replace(/\n/g, " ");
    formData.append("file", uploadFile);
    formData.append("prompt", promptFormatted);
    formData.append("userId", userId);

    try {
      const response = await fetch(endpoint + "/api/v1/file/prompt", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const message = await response.text();
        console.log("Model API response:", message);
        dispatch(updateUserApiCalls(apiCalls + 1));
        setLoading(false);

        // typing effect
        const typingEffect = async (text) => {
          for (let i = 0; i < text.length; i++) {
            setModelAPIResponse((prev) => prev + text[i]);
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
        };
        await typingEffect(message);
      } else {
        const data = await response.json();
        console.error("File upload failed", data);
        setErrMsg(data.message || messages.serverError);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setErrMsg(messages.serverError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout isLandingPage>
      <div id="uploadFileContainer">
        <div className="cardsGroup">
          <div className="cardContainer">
            <span>Welcome back!</span>
            <h1>{username}</h1>
            {getConsumptionStatus()}
          </div>

          <div className="cardContainer">
            <span>Your API Consumption</span>
            <h1>{apiCalls} / 20</h1>
            <div className="progressBar">
              <div
                className="progressFill"
                style={{
                  width: `${getConsumptionRate()}%`,
                  backgroundColor: getConsumptionColor(),
                }}
              ></div>
            </div>
          </div>
        </div>
        {errMsg && <AlertMessage msg={errMsg} type="error" />}

        {uploadFile ? (
          <>
            <div className="fileSubmitContainer">
              <h2>Ready to Submit Prompt?</h2>
            </div>
            <div className="fileInfoContainer">
              <div className="instructions">
                <div className="instructionHeading">
                  <img src="./media/pdf-logo.png" alt="PDF Logo" />
                  <h2>{uploadFile.name}</h2>
                </div>
                <p>
                  File uploaded successfully. Please enter your prompt below to
                  start processing the file.
                </p>
              </div>
              <div className="removeFileContainer">
                <input
                  type="button"
                  title="Remove file for submission"
                  onClick={() => {
                    setUploadFile(null);
                    setErrMsg("");
                    setPrompt("");
                    setModelAPIResponse("");
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
                Enter a prompt about the document:
              </label>
              <textarea
                placeholder="Please summarize the document."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setErrMsg("");
                }}
                rows={6}
              ></textarea>
              <Button
                title="Submit Prompt"
                onClick={submitFile}
                loading={loading}
                disabled={loading}
                text="Submit Prompt"
                customStyle={{ marginTop: "1rem" }}
              />
            </div>
            <div className="modelAPIResponseContainer">
              <h2>Model API Response</h2>
              <textarea
                id="modelAPIResponse"
                value={modelAPIResponse}
                readOnly
                rows={modelAPIResponseRows}
              ></textarea>
            </div>
          </>
        ) : (
          <>
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
