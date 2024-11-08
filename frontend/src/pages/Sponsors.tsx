import { ShootingStars } from "../../components/ShootingStars";
import { StarsBackground } from '../../components/StarBackground';

interface Brand {
	imageSrc: string;
	title: string;
}

const baseUrl = "https://api.techxetra.in";
// const baseUrl = "http://localhost:8000";

const brandsData: Brand[] = [
	{ imageSrc: `${baseUrl}/assets/krafton.webp`, title: "Mobile Gaming Partner" },
	{ imageSrc: `${baseUrl}/assets/mylearningcurve.jpeg`, title: "Career Guidance Partner" },
	{ imageSrc: `${baseUrl}/assets/ashima.jpg`, title: "Residency Partner" },
	{ imageSrc: `${baseUrl}/assets/unstop.png`, title: "Platform Partner" },
	{ imageSrc: `${baseUrl}/assets/linkedin.jpeg`, title: "Networking Partner" },
	{ imageSrc: `${baseUrl}/assets/eastmojo.png`, title: "Digital Media Partner" },
	{ imageSrc: `${baseUrl}/assets/jiosavan.png`, title: "Official Music Partner" },
	{ imageSrc: `${baseUrl}/assets/lipy.png`, title: "Chatbot Partner" },
	{ imageSrc: `${baseUrl}/assets/Beytech.png`, title: "Shuttle Partner" },
	{ imageSrc: `${baseUrl}/assets/nenews.jpeg`, title: "Television Media Partner" },
	{ imageSrc: `${baseUrl}/assets/krc.jpeg`, title: "Hospitality Partner" },
	{ imageSrc: `${baseUrl}/assets/dynaroof.png`, title: "Roofing Partner" },
	{ imageSrc: `${baseUrl}/assets/tezpurbuzz.png`, title: "Digital Media Partner" },
	{ imageSrc: `${baseUrl}/assets/CanaraBank.png`, title: "Banking Partner" },
	{ imageSrc: `${baseUrl}/assets/dynasolar.png`, title: "Energy Partner" },
	{ imageSrc: `${baseUrl}/assets/easemytrip.png`, title: "Official Travel Partner" },
	{ imageSrc: `${baseUrl}/assets/swaglok.jpg`, title: "Merchandise Partner" },
	{ imageSrc: `${baseUrl}/assets/xt.png`, title: "Hackathon Event Sponsor" },
	{ imageSrc: `${baseUrl}/assets/cubelelo.png`, title: "Rubiks Cube Event Sponsor" },
	{ imageSrc: `${baseUrl}/assets/cogneo.png`, title: "Code Class Event Sponsor" },
	{ imageSrc: `${baseUrl}/assets/SERVE14.png`, title: "Food Delivery Partner" },
	{ imageSrc: `${baseUrl}/assets/bento.webp`, title: "Cakery Partner" },
	{ imageSrc: `${baseUrl}/assets/ITC.jpg`, title: "Gifting Partner" },
	{ imageSrc: `${baseUrl}/assets/edona.jpeg`, title: "Beauty Partner" }
];

const Sponsors: React.FC = () => {
	return (
		<section className="bg-gradient-to-b from-[#1f021c] to-[#1f021c] relative overflow-x-hidden">
			<StarsBackground className="absolute" />
			<ShootingStars />

			<div className="container mx-auto mb-32">
				<h2 className="text-4xl md:text-7xl text-center mb-8 font-technoHideo font-semibold text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] my-28">
					Sponsors
				</h2>

				{/* Top two sponsors with larger size */}
				<div className="flex flex-col md:flex-row justify-evenly items-center gap-4 mb-10">
					<div className="flex flex-col items-center py-6 gap-2 w-[240px]">
						<h3 className="text-center font-bold text-white text-md">Title Sponsor</h3>
						<img
							src={`${baseUrl}/assets/oilindia.png`}
							alt={`Title Sponsor logo`}
							className="w-full rounded-lg shadow-lg shadow-orange-500/50"
						/>
					</div>
					<div className="flex flex-col items-center py-6 gap-2 w-[220px]">
						<h3 className="text-center font-bold text-white text-md">Platinum Sponsor</h3>
						<img
							src={`${baseUrl}/assets/sbi.png`}
							alt={`Platinum Sponsor logo`}
							className="w-full rounded-lg shadow-lg shadow-blue-500/50"
						/>
					</div>
				</div>

				{/* Grid layout for remaining sponsors */}
				<div className="mt-24 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 text-center gap-4 justify-center">
					{brandsData.map((brand, index) => (
						<div key={index} className="flex flex-col items-center py-4 gap-2 w-full transition-transform transform hover:scale-105 duration-300 ease-in-out">
							<h3 className="text-center font-bold text-white text-md">{brand.title}</h3>
							<img
								src={brand.imageSrc}
								alt={`${brand.title} logo`}
								className="w-[120px] h-auto rounded-lg shadow-md shadow-purple-500/50"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Sponsors;
