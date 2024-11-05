import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

const EventPage = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get('id');

    return (
        <div className="w-full md:w-[60%] mx-auto mt-24 mb-16 bg-white p-6 rounded-lg shadow-sm">
            {id}
            <Button onClick={() => navigate(`/events/create?id=${id}`)}>Edit Event</Button>
            hello
        </div>
    )
}

export default EventPage;