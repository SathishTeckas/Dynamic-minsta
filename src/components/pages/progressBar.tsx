import React from 'react';

interface ProgressBarProps {
    value: number; // Represents the total completion percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
    const steps = [
        { id: '1',  completed: value >= 20 },
        { id: '2',  completed: value >= 40 },
        { id: '3', completed: value >= 60 },
        { id: '4',  completed: value >= 80 },
        { id: '5', completed: value >= 100 },
    ];

    return (
        <div className="h-full w-full py-16">
            <div className="container mx-auto">
                <div className="w-11/12 lg:w-2/6 mx-auto">
                    <div className="bg-gray-200 h-1 flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className={`flex items-center ${index !== 0 ? 'justify-between' : ''}`}>
                                <div className={`h-6 w-6 rounded-full shadow flex items-center justify-center ${step.completed ? 'bg-indigo-700' : 'bg-white'}`}>
                                    {step.completed && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <path d="M5 12l5 5l10 -10" />
                                        </svg>
                                    )}
                                   
                                </div>
                                <span className="mt-9 mr-2 text-xs text-black block text-center">{`Level ${index + 1}`}</span>
                              
                              
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
