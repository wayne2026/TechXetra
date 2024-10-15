import Hero from "./Hero";

const Landing = ({ user }: { user: any }) => {
	return (
		<div className="w-full min-h-full">
			<div className="w-full max-h-full bg-gradient-to-b from-[#000000] via-[#14041d] to-[#11021a]">
				<Hero user={user} />
			</div>
		</div>
	);
};

export default Landing;
