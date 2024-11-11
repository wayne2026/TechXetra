import { Link } from "react-router-dom";

const baseUrl = "https://api.techxetra.in";
// const baseUrl = "http://localhost:8000";

const Krafton = () => {

    const datas = [
        {
            name: "BGMI",
            image: `${baseUrl}/sponsor/bgmi.png`,
            alt: 'bgmi',
            link: "https://www.instagram.com/p/DB7CrFtzK1L/",
            pool: "25k"
        },
        {
            name: "Road to Valor",
            image: `${baseUrl}/sponsor/rtv.png`,
            alt: 'rtv',
            link: "https://www.instagram.com/p/DB7JpWBTfk2/",
            pool: "5k"
        },
        {
            name: "Real Cricket",
            image: `${baseUrl}/sponsor/rc.png`,
            alt: 'rc',
            link: "https://www.instagram.com/p/DB7J2IPT4NW/",
            pool: "5k"
        },
        {
            name: "Bullet Echo",
            image: `${baseUrl}/sponsor/bullet.png`,
            alt: 'bullet',
            link: "https://www.instagram.com/p/DB7FNIjzSJx/",
            pool: "10k"
        }
    ]

    return (
        <div className="mt-0 min-h-screen bg-gradient-to-b from-[#1f021c] via-[#190341] to-[#22071b]">
            <div className="pt-12">
                <div className="flex justify-center items-center gap-6">
                    <img className="h-8 md:h-16" src={`${baseUrl}/assets/k2.jpg`} alt="krafton" />
                    <img className="h-12 md:h-24" src="/techxetra-text.svg" alt="TechXetra Logo" />
                </div>
                <h1 className="mt-4 text-2xl md:text-4xl text-center mb-4 font-technoHideo font-semibold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED]">Krafton India Presents</h1>
                <h2 className="text-center text-white font-originTech sm:text-5xl bg-clip-text">Mobile Gaming Tournament</h2>
                <div className="mt-16 pb-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 place-items-center items-center gap-4">
                    {datas.map((data, index) => (
                        <Link key={index} to={data.link} target="blank">
                            <div className="flex flex-col justify-center items-center space-y-2 text-white">
                                <div className="w-1/2">
                                    <img className="w-full mb-2" src={data.image} alt="bgmi" />
                                </div>
                                <p className="text-xl font-semibold">{data.name}</p>
                                <p className="text-lg font-semibold">Prize Pool: {data.pool}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Krafton;