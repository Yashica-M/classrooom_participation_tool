import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/api/questions');
                setQuestions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const addQuestion = async (newQuestion) => {
        try {
            const response = await axios.post('/api/questions', newQuestion);
            setQuestions((prevQuestions) => [...prevQuestions, response.data]);
        } catch (err) {
            setError(err);
        }
    };

    const upvoteQuestion = async (questionId) => {
        try {
            await axios.post(`/api/questions/${questionId}/upvote`);
            setQuestions((prevQuestions) =>
                prevQuestions.map((question) =>
                    question.id === questionId ? { ...question, votes: question.votes + 1 } : question
                )
            );
        } catch (err) {
            setError(err);
        }
    };

    return (
        <QuestionContext.Provider value={{ questions, loading, error, addQuestion, upvoteQuestion }}>
            {children}
        </QuestionContext.Provider>
    );
};