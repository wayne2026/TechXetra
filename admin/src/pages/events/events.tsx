import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

interface FormData {
    subTitle: string;
    // externalRegistration: boolean;
    // extrenalRegistrationLink: string;
    // externalLink: string;
    eventDate: string;
    venue: string;
    rules: string[];
    deadline: string;
    image: File | null;
    schoolOrCollege: string;
    schoolClass: string;
    collegeClass: string;
}

const EventsPage = () => {

    const [search] = useSearchParams();
    const id = search.get('id');
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        subTitle: "in collaboration with GDGC Tezpur University",
        // externalRegistration: true,
        // extrenalRegistrationLink: "https://unstop.com/p/hack-tezpur-university-tezu-tezpur-1191456",
        // externalLink: "https://drive.google.com/file/d/1JTK1bLQrvt6ILMT-RIF1hg9mKoc1fAr8/view?usp=drivesdk",
        eventDate: "",
        venue: "Dean's Gallery",
        deadline: "",
        image: null,
        rules: [
            "Event Duration: 48-hour hackathon; daytime presence required.",
            "Accommodation: Provided; work from rooms outside scheduled venue hours.",
            "Problem Statements: Revealed in the first hour; develop based on theme/problem.",
            "Team Composition: 2-5 members; all must be registered and present during required hours.",
            "Development Rules: All work within event period; any tech stack allowed.",
            "Submission Requirements: Submit project on GitHub and provide a workable link (optional) and PPT.",
            "Presentation: Demo and present solution on the 3rd day, covering tech stack and approach."
        ],
        schoolOrCollege: "COLLEGE",
        schoolClass: "",
        collegeClass: "UG",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };
        
        const form = new FormData();
        form.append('subTitle', formData.subTitle);
        // form.append('externalRegistration', formData.externalRegistration ? 'true' : 'false');
        // form.append('extrenalRegistrationLink', formData.extrenalRegistrationLink);
        // form.append('externalLink', formData.externalLink);
        form.append('eventDate', formData.eventDate);
        form.append('venue', formData.venue);
        form.append('deadline', formData.deadline);
        if (formData.image) {
            form.append('image', formData.image);
        }
        form.append('rules', JSON.stringify(formData.rules));
        form.append('schoolOrCollege', formData.schoolOrCollege);
        if (formData.schoolOrCollege === "COLLEGE") {
            form.append('collegeClass', formData.collegeClass);
        } else {
            form.append('schoolClass', formData.schoolClass);
        }
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/events/byId/${id}`, formData, config);
            toast.success("Updated");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="mt-36">
            <Button onClick={() => navigate("/events/create")}>Create New Event</Button>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="eventDate">Event Date:</label>
                    <input
                        type="datetime-local"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="deadline">Event Deadline:</label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image">Event Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default EventsPage;