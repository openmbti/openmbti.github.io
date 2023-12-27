'use client'

// app/page.tsx
import StartSurveyButton from './client-components/StartSurveyButton'; // Adjust the path based on your directory structure

const HomePage = () => {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-4">Welcome to the OpenMBTI Survey</h1>
        <p className="mb-4">Discover more about your personality type with a quick survey.</p>
        {/* Use the client-side navigation button */}
        <StartSurveyButton />

        <div className="social-links mt-4">
          <a href="https://github.com/stancsz/open-mbti-survey" target="_blank" rel="noopener noreferrer" className="d-block mb-2">GitHub Repo</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;