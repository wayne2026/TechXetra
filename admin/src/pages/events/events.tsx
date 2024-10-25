import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment-timezone';

interface FormData {
    subTitle: string;
    isVisible: boolean;
    category: string;
    participation: string;
    externalRegistration: boolean;
    extrenalRegistrationLink: string;
    // externalLink: string;
    eventDate: string;
    venue: string;
    rules: string[];
    deadline: string;
    image: File | null;
    // schoolOrCollege: string;
    // schoolClass: string;
    // collegeClass: string;
}

const EventsPage = () => {

    const [search] = useSearchParams();
    const id = search.get('id');
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        subTitle: "in collaboration with GDGC Tezpur University",
        isVisible: true,
        category: "TECHNICAL",
        participation: "SOLO",
        externalRegistration: true,
        extrenalRegistrationLink: "https://unstop.com/competitions/frontend-frenzy-tezpur-university-tezu-tezpur-1196458",
        // externalLink: "https://drive.google.com/file/d/1JTK1bLQrvt6ILMT-RIF1hg9mKoc1fAr8/view?usp=drivesdk",
        eventDate: "",
        venue: "Dean's Gallery",
        deadline: "",
        image: null,
        rules: [
            "The competition lasts 4 hours; no time extensions will be provided.",
            "Submit your project on GitHub as a repository; late submissions won't be accepted.",
            "You may use external UI libraries and ChatGPT for design enhancement.",
            "Emphasis is on design and visual appeal; functionality is secondary.",
            "Platforms like Codepen and CodeSandbox are prohibited, with disqualification for violations.",
            "Only individual entries are allowed.",
            "Design three essential pages based on the theme provided at the start; bonus points for additional pages and full responsiveness.",
            "Based on creativity, responsiveness, UX, detail, and bonus pages."
        ],
        // schoolOrCollege: "COLLEGE",
        // schoolClass: "",
        // collegeClass: "UG",
    });

    // const eventDateUTC = formData.eventDate;
    // const localEventDate = moment.utc(eventDateUTC).local().format('YYYY-MM-DDTHH:mm');
    // setFormData({
    //     ...formData,
    //     eventDate: localEventDate,
    // });

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
        form.append('isVisible', formData.isVisible ? 'true' : 'false');
        form.append('category', formData.category);
        form.append('participation', formData.participation);
        form.append('externalRegistration', formData.externalRegistration ? 'true' : 'false');
        form.append('extrenalRegistrationLink', formData.extrenalRegistrationLink);
        // form.append('externalLink', formData.externalLink);
        const eventDateUTC = moment(formData.eventDate).utc().format();
        form.append('eventDate', eventDateUTC);
        form.append('venue', formData.venue);
        const deadlineDateUTC = moment(formData.deadline).utc().format();
        form.append('deadline', deadlineDateUTC);
        if (formData.image) {
            form.append('image', formData.image);
        }
        form.append('rules', JSON.stringify(formData.rules));
        // form.append('schoolOrCollege', formData.schoolOrCollege);
        // if (formData.schoolOrCollege === "COLLEGE") {
        //     form.append('collegeClass', formData.collegeClass);
        // } else {
        //     form.append('schoolClass', formData.schoolClass);
        // }
        try {
            if (id) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/events/byId/${id}`, formData, config);
                toast.success("Updated");
            } else {
                toast.info("Can fetch ID directly enter the link, don't edit")
            }
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