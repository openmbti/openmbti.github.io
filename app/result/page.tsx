"use client";
// app/result/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ResultPage = () => {
    const [responses, setResponses] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadResponses = async () => {
            const responsesJSON = new URLSearchParams(window.location.search).get('responses');

            if (responsesJSON) {
                try {
                    const decoded = decodeURIComponent(responsesJSON);
                    const parsedResponses = JSON.parse(decoded);
                    console.log(parsedResponses);
                    setResponses(parsedResponses);
                } catch (error) {
                    console.error('Failed to parse responses:', error);
                }
            }
        };

        loadResponses();
    }, [router.asPath]);

    const calculateMBTI = (responses) => {
        const categoryCounts = {
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
            categoryCounts[value]++;
        }

        const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
        const dominantCategories = {};
        for (const pair of pairs) {
            const [category1, category2] = pair;
            if (categoryCounts[category1] > categoryCounts[category2]) {
                dominantCategories[category1] = true;
            } else {
                dominantCategories[category2] = true;
            }
        }

        let mostProbableMBTI = '';
        for (const pair of pairs) {
            const [category1, category2] = pair;
            if (dominantCategories[category1]) {
                mostProbableMBTI += category1;
            } else {
                mostProbableMBTI += category2;
            }
        }

        const categoryResults = pairs.map((pair) => {
            const [category1, category2] = pair;
            const count1 = categoryCounts[category1];
            const count2 = categoryCounts[category2];
            const total = count1 + count2;
            const percentage1 = (count1 / total) * 100;
            const percentage2 = (count2 / total) * 100;
            return { category1, category2, percentage1, percentage2 };
        });

        return { mostProbableMBTI, categoryResults };
    };

    const mbtiResult = calculateMBTI(responses);

    return (
        <div className="container mt-5">
            <h1>📋 Survey Responses</h1>
            {responses.length > 0 ? (
                <div>
                    <p className="mb-3" style={{ fontSize: '24px' }}>
                        Your most probable MBTI: <strong>{mbtiResult.mostProbableMBTI}</strong>
                    </p>
                    {mbtiResult.categoryResults.map((result) => (
                        <div key={result.category1}>
                            <p>
                                {result.category1}: {result.percentage1.toFixed(2)}%
                            </p>
                            <p>
                                {result.category2}: {result.percentage2.toFixed(2)}%
                            </p>
                            <p>---------------</p>
                        </div>
                    ))}
                    {responses.map((response, index) => (
                        <div key={index} className="mb-3">
                            <p className="fw-bold">{response.question}</p>
                            <p>Selected Option: {response.selectedOption}</p>
                            <p>Value: {response.value}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No responses to display</div>
            )}
        </div>
    );
};

export default ResultPage;
