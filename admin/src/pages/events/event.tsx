import Loader from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const EventPage = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get('id');
    const [event, setEvent] = useState<EventDetails | null>();
    const [loading, setLoading] = useState(false);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            if (id) {
                const { data }: { data: EventDetailsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/byId/${id}`, { withCredentials: true });
                setEvent(data.event);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [id])

    return !id || loading ? (
        <Loader />
    ) : (
        <div className="w-full md:w-[60%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
                <p className="text-xl font-semibold">Event Details</p>
                <Button onClick={() => navigate(`/events/create?id=${id}`)}>Edit Event</Button>
            </div>
            <div className="mt-6 flex flex-col justify-center items-start">
                <p className="text-md font-medium">Event ID: {event?._id}</p>
                <p className="text-md font-medium">Title: {event?.title}</p>
            </div>
        </div>
    )
}

export default EventPage;