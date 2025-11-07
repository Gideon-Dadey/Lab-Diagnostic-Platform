import React, { useState, useRef, useEffect } from 'react';
import { X, Eraser, ClipboardList, TestTube2, ChevronRight, Clock, FlaskConical, CalendarDays, CheckCircle, Search, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const symptomCategories = {
  'General': ['Fever', 'Fatigue', 'Weight Loss', 'Weight Gain', 'Night Sweats', 'Chills', 'Weakness'],
  'Neurological': ['Headache', 'Dizziness', 'Fainting', 'Memory Loss', 'Tremors', 'Seizures', 'Numbness'],
  'Respiratory': ['Cough', 'Shortness of Breath', 'Chest Pain', 'Wheezing', 'Sneezing', 'Runny Nose', 'Sore Throat'],
  'Digestive': ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal Pain', 'Bloating', 'Heartburn'],
  'Musculoskeletal': ['Joint Pain', 'Back Pain', 'Neck Pain', 'Muscle Pain', 'Swelling', 'Stiffness', 'Limited Movement']
};

const allSymptoms = Object.values(symptomCategories).flat();

const medicalTermsPattern = /^[a-zA-Z\s,.-]+$/;
const irrelevantPatterns = [
  /\b(boy|girl|man|woman|school|run|play|game|food|water|drink|hello|hi)\b/i,
  /\d/,
  /[^\w\s,.-]/,
];

const AIRecommendation = () => {
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [details, setDetails] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const isMedicalContext = (text) => {
    if (!medicalTermsPattern.test(text)) return false;
    return !irrelevantPatterns.some(pattern => pattern.test(text));
  };

  const validateInputs = () => {
    if (selectedSymptoms.length === 0 && !details.trim()) {
      setError('Please select at least one symptom or provide additional details');
      return false;
    }

    if (details.trim() && !isMedicalContext(details)) {
      setError('Please enter medically relevant information only. Avoid numbers, symbols, or unrelated text.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSymptomClick = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      const newSymptoms = [...selectedSymptoms, symptom];
      setSelectedSymptoms(newSymptoms);
      setSymptomInput(newSymptoms.join(', '));
      setError('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    const updatedSymptoms = selectedSymptoms.filter(symptom => symptom !== symptomToRemove);
    setSelectedSymptoms(updatedSymptoms);
    setSymptomInput(updatedSymptoms.join(', '));
  };

  const clearAll = () => {
    setSymptomInput('');
    setSelectedSymptoms([]);
    setDetails('');
    setShowResults(false);
    setRecommendations([]);
    setLoading(false);
    setAnalysisText('');
    setError('');
    setSearchTerm('');
  };

  const getRecommendations = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setAnalysisText('Analyzing your symptoms with AI...');
    setShowResults(false);
    setRecommendations([]);

    try {
      const response = await axios.post('/api/get-recommendation/recommend-tests', {
        description: details,
        symptoms: selectedSymptoms
      });

      const data = response.data;
      
      if (data.recommendedTests?.length > 0 || data.recommendations?.length > 0) {
        const enhancedTests = (data.recommendedTests || data.recommendations).map(test => ({
          ...test,
          accuracy: test.accuracy || 'High (90-95%)',
          turnaround: test.turnaround || '1-3 business days',
          preparation: test.preparation || 'Fasting for 8-12 hours required',
          sample: test.sample || 'Blood sample'
        }));
        
        setRecommendations(enhancedTests);
        setShowResults(true);
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        setError('No specific tests recommended based on your symptoms. Please consult a healthcare provider.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.response?.data?.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
      setAnalysisText('');
    }
  };

  // Filter symptoms based on search and category
  const getFilteredSymptoms = () => {
    let symptoms = activeCategory === 'All' 
      ? allSymptoms 
      : symptomCategories[activeCategory] || [];
    
    if (searchTerm) {
      symptoms = symptoms.filter(symptom => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return symptoms;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Describe Your Symptoms
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select your symptoms from the options below or describe them manually. Our AI will analyze and recommend the most appropriate medical tests.
          </p>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Selected Symptoms
            </label>
            {selectedSymptoms.length > 0 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {selectedSymptoms.length} selected
              </span>
            )}
          </div>
          
          <div className="min-h-[120px] p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 transition-colors focus-within:border-primary focus-within:bg-primary/5">
            {selectedSymptoms.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-sm">Your symptoms will appear here as you select them...</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                  >
                    <span>{symptom}</span>
                    <button 
                      onClick={() => removeSymptom(symptom)} 
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      disabled={loading}
                      aria-label={`Remove ${symptom}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Common Symptoms
            </h3>
            
            {}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {}
            <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === 'All'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {Object.keys(symptomCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Grid */}
          <div className="space-y-4">
            {activeCategory === 'All' ? (
              Object.entries(symptomCategories).map(([category, symptoms]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {symptoms
                      .filter(symptom => 
                        !searchTerm || symptom.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((symptom) => (
                        <button
                          key={symptom}
                          onClick={() => handleSymptomClick(symptom)}
                          disabled={loading || selectedSymptoms.includes(symptom)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedSymptoms.includes(symptom)
                              ? 'bg-primary text-white shadow-md scale-95'
                              : 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary hover:shadow-sm border border-gray-200 hover:border-primary/30'
                          }`}
                        >
                          {symptom}
                        </button>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {getFilteredSymptoms().map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomClick(symptom)}
                    disabled={loading || selectedSymptoms.includes(symptom)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-primary text-white shadow-md scale-95'
                        : 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary hover:shadow-sm border border-gray-200 hover:border-primary/30'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            )}
            
            {getFilteredSymptoms().length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-500">
                <p>No symptoms found matching &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Additional Details <span className="text-xs font-normal text-gray-500">(Optional but Recommended)</span>
          </label>
          <textarea
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setError('');
            }}
            placeholder="Provide more details about your condition, duration, severity, any medications you're taking, etc..."
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none text-gray-800 bg-gray-50/50 transition-all placeholder-gray-400"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            More details help our AI provide more accurate recommendations
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-200 flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={clearAll}
            disabled={loading || (selectedSymptoms.length === 0 && !details.trim())}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium px-6 py-3 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
          >
            <Eraser className="w-5 h-5" />
            Clear All
          </button>
          <button
            onClick={getRecommendations}
            disabled={loading || (selectedSymptoms.length === 0 && !details.trim())}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              loading
                ? 'bg-gray-400'
                : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <ClipboardList className="w-3 h-3" />
                Get Recommendations
              </>
            )}
          </button>
        </div>

        {}
        {analysisText && (
          <div className="text-center py-8 mb-8">
            <div className="inline-flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">{analysisText}</p>
            </div>
          </div>
        )}

        {}
        {showResults && (
          <div id="results-section" className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TestTube2 className="w-6 h-6 text-primary" />
                </div>
                Recommended Medical Tests
              </h2>
              <span className="hidden sm:inline-block text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                {recommendations.length} {recommendations.length === 1 ? 'test' : 'tests'} found
              </span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {recommendations.map((test, index) => (
                <div 
                  key={index} 
                  className="group p-6 border-2 border-gray-200 rounded-xl bg-white hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {test.name || test.test}
                      </h3>
                      {test.code && (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Code: {test.code}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                      Test
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {test.description || test.reason}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Accuracy</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{test.accuracy}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Turnaround</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{test.turnaround}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preparation</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{test.preparation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FlaskConical className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sample</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{test.sample}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <Link
                to="/all-tests-package"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                View All Tests & Packages
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;