import React from 'react';
import QuestionList from '../components/questions/QuestionList';
import ConfusionMeter from '../components/confusion/ConfusionMeter';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Classroom Participation Tool</h1>
            <ConfusionMeter />
            <h2>Questions from Students</h2>
            <QuestionList />
        </div>
    );
};

export default Home;