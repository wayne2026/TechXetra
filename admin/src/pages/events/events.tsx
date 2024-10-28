import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment-timezone';

interface FormData {
    eventDate: string;
    deadline: string;
    image: File | null;
    backgroundImage: File | null;
}

const EventsPage = () => {

    const [search] = useSearchParams();
    const id = search.get('id');
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        eventDate: "",
        deadline: "",
        image: null,
        backgroundImage: null
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
        const eventDateUTC = moment(formData.eventDate).utc().format();
        form.append('eventDate', eventDateUTC);
        const deadlineDateUTC = moment(formData.deadline).utc().format();
        form.append('deadline', deadlineDateUTC);
        if (formData.image) {
            form.append('image', formData.image);
        }
        if (formData.backgroundImage) {
            form.append('backgroundImage', formData.backgroundImage);
        }
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
                    />
                </div>

                <div>
                    <label htmlFor="backgroundImage">Event Background:</label>
                    <input
                        type="file"
                        id="backgroundImage"
                        name="backgroundImage"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default EventsPage;