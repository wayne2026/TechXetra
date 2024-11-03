import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define the EventDetails type with all properties and default values
type EventDetails = {
    title: string;
    subTitle: string;
    description: string;
    rules: string[];
    category: string;
    participation: string;
    schoolOrCollege: string;
    schoolClass?: string;
    collegeClass?: string;
    maxGroup?: number;
    amount?: number;
    venue: string;
    eventDate?: string;
    deadline?: string;
};

const Update = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [formData, setFormData] = React.useState<EventDetails>({
        title: "",
        subTitle: "",
        description: "",
        category: "",
        participation: "",
        maxGroup: 0,
        amount: 0,
        venue: "",
        eventDate: "",
        deadline: "",
        rules: [""],
        schoolOrCollege: "",
        schoolClass: "",
        collegeClass: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRuleChange = (index: number, value: string) => {
        const updatedRules = [...formData.rules];
        updatedRules[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            rules: updatedRules,
        }));
    };

    const addRule = () => {
        setFormData((prevData) => ({
            ...prevData,
            rules: [...prevData.rules, ""],
        }));
    };

    const removeRule = (index: number) => {
        const updatedRules = formData.rules.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            rules: updatedRules,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    useEffect(() => {
        // setFormData({
        //     title: "Event Title",
        //     subTitle: "Event Subtitle",
        //     description: "Event Description",
        //     category: "TECHNICAL",
        //     participation: "SOLO",
        //     maxGroup: 5,
        //     amount: 100,
        //     venue: "Event Venue",
        //     eventDate: "2022-10-01T10:00",
        //     deadline: "2022-09-30T23:59",
        //     rules: ["Rule 1", "Rule 2"],
        //     schoolOrCollege: "BOTH",
        //     schoolClass: "ONE_TO_FOUR",
        //     collegeClass: "UG",
        // });
        const fetchEvent = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/events/byId/${id}`,
                    {
                        withCredentials: true,
                    }
                );
                setFormData(response.data.event);
            } catch (err) {
                console.log("Failed to fetch event data.", err);
            } 
        };

            fetchEvent();
    }, []); // Add empty array here
    

    return (
        <div className="container mt-24 mx-auto p-8 lg:max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-8 lg:p-12">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Update - {formData.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="subTitle" className="text-sm font-medium text-gray-700">SubTitle</label>
                        <input
                            type="text"
                            id="subTitle"
                            name="subTitle"
                            value={formData.subTitle}
                            onChange={handleChange}
                            placeholder="Enter subtitle"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-4">
                    {/* Rules Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Rules</label>
                        {formData.rules.map((rule, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder={`Enter rule ${index + 1}`}
                                    value={rule}
                                    onChange={(e) => handleRuleChange(index, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeRule(index)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {/* Button to add a new rule */}
                        <button
                            type="button"
                            onClick={addRule}
                            className="mt-2 bg-black text-white px-3 py-1 rounded-md"
                        >
                            Add Rule
                        </button>
                    </div>
                </div> 

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="" disabled>Select category</option>
                            <option value="TECHNICAL">Technical</option>
                            <option value="GENERAL">General</option>
                            <option value="CULTURAL">Cultural</option>
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label htmlFor="participation" className="text-sm font-medium text-gray-700">Participation</label>
                        <select
                            id="participation"
                            name="participation"
                            value={formData.participation}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="" disabled>Select participation type</option>
                            <option value="SOLO">Solo</option>
                            <option value="TEAM">Team</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>
                    </div>

                </div>

                <div className="flex flex-col space-y-4">
                    {/* School or College Selection */}
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="schoolOrCollege" className="text-sm font-medium text-gray-700">School or College</label>
                        <select
                            id="schoolOrCollege"
                            name="schoolOrCollege"
                            value={formData.schoolOrCollege}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="" disabled>Select option</option>
                            <option value="SCHOOL">School</option>
                            <option value="COLLEGE">College</option>
                            <option value="BOTH">Both</option>
                        </select>
                    </div>

                    {/* School Class Selection (Shown if 'SCHOOL' or 'BOTH' is selected) */}
                    {(formData.schoolOrCollege === 'SCHOOL' || formData.schoolOrCollege === 'BOTH') && (
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="schoolClass" className="text-sm font-medium text-gray-700">School Class</label>
                            <select
                                id="schoolClass"
                                name="schoolClass"
                                value={formData.schoolClass}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="" disabled>Select school class</option>
                                <option value="ONE_TO_FOUR">One to Four</option>
                                <option value="FIVE_TO_EIGHT">Five to Eight</option>
                                <option value="NINE_TO_TWELVE">Nine to Twelve</option>
                            </select>
                        </div>
                    )}

                    {/* College Class Selection (Shown if 'COLLEGE' or 'BOTH' is selected) */}
                    {(formData.schoolOrCollege === 'COLLEGE' || formData.schoolOrCollege === 'BOTH') && (
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="collegeClass" className="text-sm font-medium text-gray-700">College Class</label>
                            <select
                                id="collegeClass"
                                name="collegeClass"
                                value={formData.collegeClass}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="" disabled>Select college class</option>
                                <option value="UG">UG</option>
                                <option value="PG">PG</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="maxGroup" className="text-sm font-medium text-gray-700">Max Group Size</label>
                        <input
                            type="number"
                            id="maxGroup"
                            name="maxGroup"
                            value={formData.maxGroup}
                            onChange={handleChange}
                            placeholder="Enter max group size"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="venue" className="text-sm font-medium text-gray-700">Venue</label>
                        <input
                            type="text"
                            id="venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="Enter venue"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                </div>

                {/* Event Date and Time */}
                <div className="flex-1 flex flex-col">
                    <label htmlFor="eventDate" className="text-sm font-medium text-gray-700">Event Date and Time</label>
                    <input
                        type="datetime-local"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Registration Deadline Date and Time */}
                <div className="flex-1 flex flex-col">
                    <label htmlFor="deadline" className="text-sm font-medium text-gray-700">Registration Deadline</label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>


                <button
                    type="submit"
                    className="w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300"
                >
                    Update
                </button>
            </form>
        </div>
    </div>
    );
};

export default Update;
