import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>GDSC BLOG | 404</title>
                <meta name="description" content="This is the not found page of Google Developers Students Club" />
                <meta name="keywords" content="not found, react, blog, gdsc, google, tezpur" />
            </Helmet>

            <div className="flex flex-col bg-white justify-center items-center space-y-6 mt-16 pb-16">
                <img src="/404.svg" alt="404" className="h-84 w-auto" />
                <h1 className="text-4xl lg:text-4xl font-bold">Oops! Page Not Found.</h1>
                <p className="text-lg max-w-[80%] px-2 md:max-w-[70%] lg:max-w-[50%] text-center text-gray-500">The page you are looking for is not available or has been moved. Try a different page or go to homepage with the button below.</p>
                <button onClick={() => navigate("/")} className="text-md px-6 py-6">Go To Home</button>
            </div>
        </>
    )
}

export default NotFound;