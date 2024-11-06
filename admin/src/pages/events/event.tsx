import Loader from "@/components/custom/loader";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment-timezone';

const EventPage = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get('id');
    const [event, setEvent] = useState<EventDetails | null>();
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

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

    const handleDeleteEvent = async () => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admins/events/byId/${id}`, { withCredentials: true });
            navigate(-1);
            toast.success(data?.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
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
                <p className="text-2xl font-semibold underline">Event Details</p>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(`/events/create?id=${id}`)}>Edit Event</Button>
                    <Button variant="destructive" onClick={() => setOpenDelete(true)}>Delete Event</Button>
                </div>
            </div>
            {openDelete && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                    <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to delete this event?</h2>
                        <div className="w-full mt-8 flex justify-between items-center gap-8">
                            <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={handleDeleteEvent}>
                                Yes, I am sure!!
                            </button>
                            <button className="w-1/2 px-3 py-2 border-2 text-black rounded-lg" onClick={() => setOpenDelete(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-6 flex flex-col justify-center items-start">
                <div className="p-4">
                    <p className="text-md font-medium">Event ID: {event?._id}</p>
                    <p className="text-md font-medium">Title: {event?.title}</p>
                    {event?.subTitle && <p className="text-md font-medium">Subtitle: {event.subTitle}</p>}
                    <p className="text-md font-medium">Description: {event?.description}</p>
                    <p className="text-md font-medium">Category: {event?.category}</p>
                    <p className="text-md font-medium">Participation: {event?.participation}</p>
                    {typeof event?.maxGroup !== 'undefined' && <p className="text-md font-medium">Max Group: {event.maxGroup}</p>}
                    <p className="text-md font-medium">Is Visible: {event?.isVisible ? "Yes" : "No"}</p>
                    <p className="text-md font-medium">Can Register: {event?.canRegister ? "Yes" : "No"}</p>
                    <p className="text-md font-medium">External Registration: {event?.externalRegistration ? "Yes" : "No"}</p>
                    {event?.extrenalRegistrationLink && <p className="text-md font-medium">External Registration Link: {event.extrenalRegistrationLink}</p>}
                    {event?.externalLink && <p className="text-md font-medium">External Link: {event.externalLink}</p>}
                    <p className="text-md font-medium">Registration Required: {event?.registrationRequired ? "Yes" : "No"}</p>
                    <p className="text-md font-medium">Payment Required: {event?.paymentRequired ? "Yes" : "No"}</p>
                    {typeof event?.amount !== 'undefined' && <p className="text-md font-medium">Amount: {event.amount}</p>}
                    <p className="text-md font-medium">Event Date: {event?.eventDate ? moment.utc(event.eventDate).format('DD/MM/yyyy hh:mm A') : "N/A"}</p>
                    {event?.venue && <p className="text-md font-medium">Venue: {event.venue}</p>}
                    <p className="text-md font-medium">Deadline: {event?.deadline ? moment.utc(event.deadline).format('DD/MM/yyyy hh:mm A') : "N/A"}</p>
                    {event?.image && <p className="text-md font-medium">Image: <Link to={event.image} className="underline" target="blank">{event.image}</Link></p>}
                    {event?.rules && event.rules.length > 0 && (
                        <div className="text-md font-medium">
                            <p>Rules:</p>
                            <ul className="list-disc pl-5">
                                {event.rules.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {event?.backgroundImage && <p className="text-md font-medium">Background Image: <Link to={event.backgroundImage} className="underline" target="blank">{event.backgroundImage}</Link></p>}
                    {event?.eligibility && (
                        <div className="text-md font-medium">
                            <p>Eligibility:</p>
                            {event.eligibility.schoolOrCollege && <p>School or College: {event.eligibility.schoolOrCollege}</p>}
                            {event.eligibility.collegeClass && event.eligibility.collegeClass.length > 0 && (
                                <div>
                                    <p>College Classes:</p>
                                    <ul className="list-disc pl-5">
                                        {event.eligibility.collegeClass.map((cls, index) => (
                                            <li key={index}>{cls}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {event.eligibility.schoolClass && event.eligibility.schoolClass.length > 0 && (
                                <div>
                                    <p>School Classes:</p>
                                    <ul className="list-disc pl-5">
                                        {event.eligibility.schoolClass.map((cls, index) => (
                                            <li key={index}>{cls}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {typeof event?.limit !== 'undefined' && <p className="text-md font-medium">Limit: {event.limit}</p>}
                    {typeof event?.registered !== 'undefined' && <p className="text-md font-medium">Registered: {event.registered}</p>}
                </div>
            </div>
        </div>
    )
}

export default EventPage;