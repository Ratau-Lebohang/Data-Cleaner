function Header({ currentStep, setCurrentStep }) {
  try {
    const steps = [
      { id: 'upload', label: 'Upload', icon: 'upload' },
      { id: 'profile', label: 'Clean', icon: 'settings' },
      { id: 'export', label: 'Export', icon: 'download' }
    ];

    return (
      <header className="bg-white border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"10px","color":"rgb(17, 24, 39)","backgroundColor":"#f5f4f4","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"flex","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"25px","color":"#1051ea","backgroundColor":"rgba(0, 0, 0, 0)","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-xl text-white icon-binoculars"></div>
              </div>
              <div>
                <h1 style={{"paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","marginTop":"0px","marginRight":"0px","marginBottom":"0px","marginLeft":"0px","fontSize":"24px","color":"rgb(17, 24, 39)","backgroundColor":"#ffffff","textAlign":"center","fontWeight":"700","objectFit":"fill","display":"block","position":"static","top":"auto","left":"auto","right":"auto","bottom":"auto"}} className="text-2xl font-bold text-[var(--text-primary)]">Data Cleaner</h1>
                <p className="text-sm text-[var(--text-secondary)]">Professional Data Cleaning Tool</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-1">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentStep === step.id 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--secondary-color)]'
                  }`}
                >
                  <div className={`icon-${step.icon} text-lg`}></div>
                  <span className="font-medium">{step.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}