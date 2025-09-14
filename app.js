class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentStep, setCurrentStep] = React.useState('upload');
    const [rawData, setRawData] = React.useState(null);
    const [fileName, setFileName] = React.useState('');
    const [profileData, setProfileData] = React.useState(null);
    const [cleanedData, setCleanedData] = React.useState(null);
    const [cleaningLog, setCleaningLog] = React.useState(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [processingStage, setProcessingStage] = React.useState('');

    const handleFileUpload = async (data, name) => {
      setIsProcessing(true);
      setProcessingStage('Analyzing dataset...');
      
      setRawData(data);
      setFileName(name);
      
      setProcessingStage('Generating data profile...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const profile = generateDataProfile(data);
      setProfileData(profile);
      
      setIsProcessing(false);
      setCurrentStep('profile');
    };

    const handleCleaning = async (cleaningOptions) => {
      setIsProcessing(true);
      setProcessingStage('Cleaning data...');
      
      const result = await processDataCleaning(rawData, cleaningOptions);
      setCleanedData(result.cleanedData);
      setCleaningLog(result.log);
      
      setIsProcessing(false);
      setCurrentStep('export');
    };

    const renderCurrentStep = () => {
      if (isProcessing) {
        return <ProgressIndicator stage={processingStage} />;
      }
      
      switch (currentStep) {
        case 'upload':
          return <FileUpload onUpload={handleFileUpload} />;
        case 'profile':
          return (
            <div className="space-y-6">
              <DataProfile data={profileData} fileName={fileName} rawData={rawData} />
              <CleaningOptions 
                profileData={profileData} 
                rawData={rawData}
                onClean={handleCleaning}
              />
            </div>
          );
        case 'export':
          return (
            <ExportPanel 
              cleanedData={cleanedData}
              cleaningLog={cleaningLog}
              fileName={fileName}
              onBack={() => setCurrentStep('profile')}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header currentStep={currentStep} setCurrentStep={setCurrentStep} />
        
        <main style={{"paddingTop":"32px","paddingRight":"16px","paddingBottom":"32px","paddingLeft":"16px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"16px","color":"rgb(17, 24, 39)","backgroundColor":"#fafafa","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="max-w-6xl mx-auto px-4 py-8">
          {renderCurrentStep()}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);