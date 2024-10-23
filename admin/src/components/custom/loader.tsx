import { Loader2 } from "lucide-react";

const Loader = () => {
    return (
        <div className='flex flex-col justify-center gap-8 items-center mt-8'> 
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
        </div>
    )
}

export default Loader;