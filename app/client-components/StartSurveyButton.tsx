// app/client-components/StartSurveyButton.tsx
import { useRouter } from 'next/navigation';

const StartSurveyButton = () => {
  const router = useRouter(); // Hook for programmatic navigation

  // Function to handle clicking the button
  const handleStartSurvey = () => {
    router.push('/survey'); // Navigate to the survey page
  };

  return (
    <button
      className="btn btn-lg btn-primary"
      onClick={handleStartSurvey}
    >
      Start the Survey
    </button>
  );
};

export default StartSurveyButton;
