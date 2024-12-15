import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer...");
    setIsCopied(false);

    try {
      const response = await axios({
        url: ``,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    } finally {
      setGeneratingAnswer(false);
    }
  }

  function copyToClipboard() {
    if (answer) {
      const codeMatch = answer.match(/```([\s\S]*?)```/);
      const textToCopy = codeMatch ? codeMatch[1].trim() : answer;

      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }

  return (
    <div className="bg-gray-900 h-screen flex flex-col justify-between">
      {/* Header Section */}
      <header className="p-6 text-center text-white shadow-md">
        <h1 className="text-5xl font-semibold">Shramik AI</h1>
        <p className="text-lg font-light mt-2">Your AI assistant at work</p>
      </header>

      {/* Output Section */}
      <div className="flex-grow overflow-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-white max-w-4xl mx-auto relative">
          <ReactMarkdown>{answer}</ReactMarkdown>
          {answer && (
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-blue-600 text-white py-1 px-4 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Input Section */}
      <form
        onSubmit={generateAnswer}
        className="bg-gray-800 p-6 border-t border-gray-700"
      >
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 max-w-4xl mx-auto">
          <textarea
            required
            className="flex-grow bg-gray-900 text-white rounded-lg p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] resize-none w-full"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
          ></textarea>
          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ${
              generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Generating..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
