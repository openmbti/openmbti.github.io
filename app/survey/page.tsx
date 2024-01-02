// app/survey/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import yaml from 'js-yaml';

// TypeScript type definitions
type Option = {
  text: string;
  value: string;
};

type Question = {
  prompt: string;
  options: { [key: string]: Option };
};

type TestVersionInfo = {
  name: string;
  path: string;
};

const SurveyPage = () => {
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<{ [index: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const version = new URLSearchParams(window.location.search).get('version') || 'en';  // default to 'en' if no version is specified
  const router = useRouter();

  useEffect(() => {
    const loadTestVersions = async () => {
      const testVersionsResponse = await fetch('/data/test_versions.yaml');
      const testVersionsText = await testVersionsResponse.text();
      const testVersionsData = yaml.load(testVersionsText) as { [key: string]: TestVersionInfo };

      // Get the path for the selected version
      const versionPath = testVersionsData[version]?.path;

      if (versionPath) {
        const questionnaireResponse = await fetch(`/data/${versionPath}`);
        const questionnaireText = await questionnaireResponse.text();
        const questionnaireData = yaml.load(questionnaireText);

        let questions: Question[] = [];

        // Check if data is an array (Format 2) or an object (Format 1)
        if (Array.isArray(questionnaireData)) {
          // Format 2: List of questions directly
          questions = questionnaireData.map((item: any) => {
            const [prompt, options] = Object.entries(item)[0];
            return { prompt, options };
          });
        } else {
          // Format 1: Questions nested under categories
          for (const category of Object.values(questionnaireData)) {
            const categoryQuestions = Object.values(category).flat().map((item: any) => {
              const [prompt, options] = Object.entries(item)[0];
              return { prompt, options };
            });
            questions = [...questions, ...categoryQuestions];
          }
        }

        setSurveyQuestions(questions);
      } else {
        console.error('Version path not found!');
      }
      setLoading(false);
    };

    loadTestVersions();
  }, [version]);

  const handleSelection = (index: number, option: string) => {
    setResponses({
      ...responses,
      [index]: option,
    });
  };

  // Function to create a JSON object and navigate to another page
  const submitResponses = () => {
    const formattedResponses = Object.entries(responses).map(([questionIndex, optionKey]) => {
      const question = surveyQuestions[parseInt(questionIndex)];
      const option = question.options[optionKey];
      return {
        question: question.prompt,
        selectedOption: option.text,
        value: option.value
      };
    });
    const responsesJSON = JSON.stringify(formattedResponses);
    // console.log(responsesJSON)
    // Use a template string to include the responsesJSON directly in the path
    const path = `/result?responses=${encodeURIComponent(responsesJSON)}`;
    router.push(path);
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>🗒️ OpenMBTI</h1>
      <form>
        {surveyQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="fw-bold">{question.prompt}</p>
            {Object.entries(question.options).map(([key, option]) => (
              <div className="form-check" key={key}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${index}`}
                  id={`question-${index}-${key}`}
                  checked={responses[index] === key}
                  onChange={() => handleSelection(index, key)}
                />
                <label className="form-check-label" htmlFor={`question-${index}-${key}`}>
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        ))}

<button type="button" onClick={submitResponses} className="btn btn-primary mt-3">
          Print Responses
        </button>
      </form>
    </div>
  );
};

export default SurveyPage;
