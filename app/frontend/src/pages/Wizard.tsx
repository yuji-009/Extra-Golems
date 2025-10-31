import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import WizardStep1 from "../components/wizard/Step1";
import WizardStep2 from "../components/wizard/Step2";
import WizardStep3 from "../components/wizard/Step3";
import WizardStep4 from "../components/wizard/Step4";

type Step = 1 | 2 | 3 | 4;

interface SelectedContent {
  items: boolean;
  armor: boolean;
  entities: boolean;
  blocks: boolean;
  recipes: boolean;
  enchantments: boolean;
}

export default function Wizard() {
  const navigate = useNavigate();
  const { project } = useProjectStore();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedContent, setSelectedContent] = useState<SelectedContent>({
    items: false,
    armor: false,
    entities: false,
    blocks: false,
    recipes: false,
    enchantments: false,
  });

  if (!project) {
    navigate("/");
    return null;
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSkipToGeneration = () => {
    setCurrentStep(4);
  };

  const handleExit = () => {
    navigate("/");
  };

  const countSelected = Object.values(selectedContent).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mod Creator</h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded ${
                  step <= currentStep ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {currentStep === 1 && <WizardStep1 />}
          {currentStep === 2 && (
            <WizardStep2
              selectedContent={selectedContent}
              onSelectionChange={setSelectedContent}
            />
          )}
          {currentStep === 3 && (
            <WizardStep3 selectedContent={selectedContent} />
          )}
          {currentStep === 4 && <WizardStep4 />}

          {/* Footer */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <button
              onClick={handleExit}
              className="text-gray-600 hover:text-gray-800 px-4 py-2"
            >
              Exit
            </button>

            <div className="flex gap-4">
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Previous
                </button>
              )}

              {currentStep < 3 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              )}

              {currentStep === 2 && (
                <button
                  onClick={handleSkipToGeneration}
                  className="px-6 py-2 text-gray-600 underline hover:text-gray-800"
                >
                  Skip to Generate
                </button>
              )}

              {currentStep === 3 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Review
                </button>
              )}

              {currentStep === 4 && (
                <button
                  onClick={() => navigate("/editor")}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Edit in Advanced Editor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
