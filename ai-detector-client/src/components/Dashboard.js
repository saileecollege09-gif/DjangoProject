import { useState } from 'react';
import { Upload, FileText, ImageIcon, LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const analyzeAI = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'text') {
        // Text analysis call
        response = await api.post('/api/detect-text/', { text });
      } else {
        // Image analysis call
        const formData = new FormData();
        formData.append('image', file);
        response = await api.post('/api/detect-image/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setResult(response.data); // Expecting { score: 80, label: "AI Generated" }
    } catch (error) {
      alert("Error processing your request.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="text-2xl font-black mb-12 flex items-center gap-2 text-blue-400">
          <ShieldAlert /> AI DETECTOR
        </div>
        <nav className="flex-1 space-y-2">
<button onClick={() => {setActiveTab('text'); setResult(null)}} className={`w-full flex items-center gap-3 p-3 rounded-xl ${activeTab === 'text' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <FileText size={20}/> Text Detection
          </button>
          <button onClick={() => {setActiveTab('photo'); setResult(null)}} className={`w-full flex items-center gap-3 p-3 rounded-xl ${activeTab==='photo' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <ImageIcon size={20}/> Photo Detection
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl mt-auto">
          <LogOut size={20}/> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">Check {activeTab === 'text' ? 'Content' : 'Images'}</h2>
          <p className="text-slate-500 mb-8">Upload your files to verify authenticity using AI algorithms.</p>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {activeTab === 'text' ? (
              <textarea 
                className="w-full h-64 p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                placeholder="Paste the text you want to check here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <div className="border-4 border-dashed border-gray-200 rounded-3xl p-16 text-center">
                <input type="file" id="upload" hidden onChange={(e) => setFile(e.target.files[0])} />
                <label htmlFor="upload" className="cursor-pointer">
                  <Upload className="mx-auto text-blue-500 mb-4" size={50} />
                  <p className="text-xl font-semibold text-slate-700">{file ? file.name : "Select an Image"}</p>
                  <p className="text-slate-400">Supported: JPG, PNG, WEBP</p>
                </label>
              </div>
            )}

            <button 
              onClick={analyzeAI}
              disabled={loading}
              className="mt-8 w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-gray-400 transition-all"
            >
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>

            {/* AI Results Display */}
            {result && (
              <div className={`mt-10 p-8 rounded-3xl border-2 ${result.score > 50 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">{result.label}</h3>
                  <span className="text-4xl font-black text-blue-600">{result.score}%</span>
                </div>
                <div className="w-full bg-white h-4 rounded-full overflow-hidden border">
                  <div className={`h-full ${result.score > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${result.score}%` }}></div>
                </div>
                <p className="mt-4 text-slate-600">The AI model is {result.score}% confident that this content is {result.label.toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

