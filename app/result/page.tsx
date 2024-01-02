// app/result/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated import to use 'next/router' instead of 'next/navigation'

const ResultPage = () => {
    const [responses, setResponses] = useState([]); // State to hold the parsed responses
    const router = useRouter(); // Hook to access the router object

    useEffect(() => {
        const loadResponses = async () => {
            // Get the 'responses' query parameter from the URL
            const responsesJSON = new URLSearchParams(window.location.search).get('responses');
            
            if (responsesJSON) {
                try {
                    // Decode and parse the responses JSON
                    const decoded = decodeURIComponent(responsesJSON);
                    const parsedResponses = JSON.parse(decoded);
                    console.log(parsedResponses)
                    setResponses(parsedResponses); // Update state with the parsed responses
                } catch (error) {
                    console.error('Failed to parse responses:', error);
                }
            }
        };

        loadResponses(); // Call the async function to load and parse the responses
    }, [router.asPath]); // Dependency array to re-run the effect when the asPath changes

    const calculateCategorySums = (responses) => {
        const categorySums = {
            E: 0,
            I: 0,
            S: 0,
            N: 0,
            T: 0,
            F: 0,
            J: 0,
            P: 0,
        };
    
        for (const response of responses) {
            const { value } = response;
    
            // Increment the appropriate category based on the value
            if (value === 'E' || value === 'I') {
                categorySums[value]++;
            } else if (value === 'S' || value === 'N') {
                categorySums[value]++;
            } else if (value === 'T' || value === 'F') {
                categorySums[value]++;
            } else if (value === 'J' || value === 'P') {
                categorySums[value]++;
            }
        }
    
        const formattedSums = Object.entries(categorySums)
            .map(([category, sum]) => `${category}:${sum}`)
            .join(', ');
    
        return formattedSums;
    };

    const formattedSums = calculateCategorySums(responses);

    return (
        <div className="container mt-5">
            <h1>📋 Survey Responses</h1>
            {responses.length > 0 ? (
                <div>
                    {responses.map((response, index) => (
                        <div key={index} className="mb-3">
                            <p className="fw-bold">{response.question}</p>
                            <p>Selected Option: {response.selectedOption}</p>
                            <p>Value: {response.value}</p>
                        </div>
                    ))}
                    <p>Based on the survey, your MBTI is: {formattedSums}</p>
                </div>
            ) : (
                <div>No responses to display</div>
            )}
        </div>
    );
};

export default ResultPage;
