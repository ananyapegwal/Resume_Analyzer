import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const resume = e.target.files[0];
    if (resume) {
      setFile(resume);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a resume');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('https://resume-analyzer-2sa4.onrender.com/api/analyze', formData, {
        headers: {
          'Content-Type': 'application/pdf'
        }
      });
      setResult(res.data.message);
    } catch (err) {
      setError("Try again later! Error on server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh' }}>
      <h1 className='text-info fw-bold text-center mb-5 display-4'>🚀 Resume Analyzer</h1>

      <div className='card bg-dark text-white shadow-lg p-4 mx-auto text-center' style={{ maxWidth: '500px', borderRadius: '20px' }}>
        <label className='form-label fw-semibold fs-5 mb-3'>Upload Your Resume (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          className="form-control mb-3 bg-secondary text-white border-0"
          onChange={handleChange}
          style={{ maxWidth: '300px', margin: '0 auto', borderRadius: '10px' }}
        />
        <button
          className="btn btn-info w-100 fw-bold" style={{ maxWidth: '200px', margin: '0 auto', borderRadius: '10px' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error &&
        <div className='alert alert-danger mt-4 text-center mx-auto' style={{ maxWidth: '500px', borderRadius: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      }

      {result &&
        <div className='card bg-dark text-white shadow-lg p-4 mt-4 mx-auto' style={{ maxWidth: '800px', borderRadius: '20px' }}>
          <div className='text-info fw-bold mb-2'>🔍 Gemini-2.0-flash Analysis</div>
          <hr className='border-info' />
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      }
    </div>
  );
}

export default App;
