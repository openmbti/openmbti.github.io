'use client';

// app/home.page.tsx
import { useEffect, useState } from 'react';
import yaml from 'js-yaml';
import { useRouter } from 'next/navigation'; // Corrected import

type TestVersionInfo = {
  name: string;
  path: string;
};

const HomePage = () => {
  const [testVersions, setTestVersions] = useState<{ [key: string]: TestVersionInfo }>({});
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const loadTestVersions = async () => {
      const response = await fetch('/data/test_versions.yaml'); // Adjusted path to fetch test versions
      const text = await response.text();
      const data = yaml.load(text) as { [key: string]: TestVersionInfo };
      setTestVersions(data);
    };
    loadTestVersions();
  }, []);

  const handleVersionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(event.target.value);
  };

  const navigateToSurvey = () => {
    if (selectedVersion) {
      const path = `/survey?version=${selectedVersion}`; // Adjusted query parameter to version
      router.push(path);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-4">OpenMBTI</h1>
        <p className="mb-4">Discover more about your personality type with a quick survey.</p>
        <p className="mb-4">🌐🗣️👉📝</p>

        <div className="mb-3">
          <select onChange={handleVersionSelect} value={selectedVersion} className="form-select">
            <option value="">Select Test Version</option> {/* Updated text */}
            {Object.entries(testVersions).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={navigateToSurvey} className="btn btn-primary">
          Go 🡪
        </button>

        <div className="social-links mt-4">
          <a href="https://github.com/stancsz/open-mbti-survey" target="_blank" rel="noopener noreferrer" className="d-block mb-2">GitHub</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
