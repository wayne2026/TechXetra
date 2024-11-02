import { StarsBackground } from "../../components/StarBackground";
import { ShootingStars } from "../../components/ShootingStars";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/user_context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";

// interface IPass {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   institutionName: string;
//   institutionClass: string;
//   hasPass: boolean;
// }

const Passes = () => {
  const navigate = useNavigate();
  const starsBG = useRef<HTMLDivElement>(null);

  const userContext = useUser();
  const location = useLocation();
  const id = userContext?.user?._id;
  const from =
    location.state?.from?.pathname + location.state?.from?.search || "/verify";
  const [events, setEvents] = useState<UserEvent[] | null>(null);
  const [loadingPass, setLoadingPass] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [paymentFile, setPaymentFile] = useState<File>();
  let hasPass = userContext?.user?.pass.hasPass as boolean;
  // const [pass, setPass] = useState<IPass | null>(null);
  // const [passGenerated, setPassGenerated] = useState<boolean>(false);

  const fetchEvents = async () => {
    try {
      const { data }: { data: UserEventResponse } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/events`,
        {
          withCredentials: true,
        }
      );
      setEvents(data.user.events);
    } catch (error) {
      console.error("Error getting all events: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useGSAP(() => {
    gsap.from(starsBG.current, {
      opacity: 0,
      delay: 0.6,
      duration: 0.3,
    });
  }, [starsBG]);

  useEffect(() => {
    if (!userContext?.user?.isVerified) {
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userContext?.user, from, navigate]);

  const handleGeneratePasses = async () => {
    setLoadingPass(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const generatedPass = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/passes/generate/${id}`,
        config
      );
      console.log("Pass updated successfully: ", generatedPass);
      hasPass = true;
    } catch (error) {
      console.error("Error while generating pass for you: ", error);
    }
    // setPassGenerated(true);
    setLoadingPass(false);
  };

  const handlePaymentSubmision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentId || !paymentFile) {
        toast.error("Please provide both Payment ID and Payment file.");
        return;
    }

    setPaymentLoading(true);

    const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
    };

    const formData = new FormData();
    formData.append('image', paymentFile);
    formData.append("transactionId", paymentId);

    try {
        if (id) {
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/events/payment/${id}`, formData, config);
            setEvents(data.user.events);
            toast.success("Payment details successfully submitted");
        }
    } catch (error: any) {
        toast.error(error.response.data.message);
    } finally {
        setPaymentLoading(false);
        setOpenPayment(false);
        setPaymentId("");
    }
}

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
      setPaymentFile(file);
  }
};

  return (
    <div className="w-screen h-screen bg-black mx-auto border-2">
      <div ref={starsBG} className="w-full h-full">
        <StarsBackground
          starDensity={0.0009}
          allStarsTwinkle
          twinkleProbability={0.9}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="absolute bg-gradient-to-b from-[#000000] via-[#220135] to-[#020b22]"
        />
        <ShootingStars />

        <div className="relative w-full h-full flex flex-row pt-[2rem]">
          <div className="basis-1/2 text-white flex justify-center items-start">
            <div className="w-[85%] items-center border-[1px] border-white rounded-lg px-4 py-2">
              <div className="w-full font-originTech text-[1.5rem]">Note:</div>
              <div className="w-full font-lemonMilk pt-2">
                1. If you are a school student, then it is mandatory for you to
                buy a pass for 50 rs.
              </div>
              <div className="w-full font-lemonMilk py-2">
                2. If you are a student from a college/university other than
                Tezpur University and are registered for an event, then you
                don't need to buy any pass, just click on 'Generate Passes' to
                make one.
              </div>
              <div className="w-full font-lemonMilk pb-2">
                3. If you are a student from a college/university other than
                Tezpur University and are not registered for an event, then you
                need to buy the pass for 200 rs.
              </div>
            </div>
          </div>
          <div className="basis-1/2">
            {userContext?.user?.collegeName === "Tezpur University" ? (
              <p className="text-white">You don't need to buy passes</p>
            ) : (
              <>
                <div className="w-full h-full">
                  <div className="w-full text-white font-originTech">
                    <div className="w-full">
                      <span className="underline">Name</span>:{" "}
                      {userContext?.user?.firstName}
                    </div>
                    <div className="w-full">
                      <span className="underline">College/University</span>:{" "}
                      {userContext?.user?.collegeName}
                    </div>
                  </div>
                  {/* event information if participated */}
                  <div className="w-full text-white pt-[2rem] pr-4">
                    {/* <p className="text-white font-originTech pb-2">
                      Events Registered:
                    </p>
                    {events && events.length > 0 ? (
                      events.map((event, index) => (
                        <div
                          className="w-full border-[1px] border-slate-400 rounded-md px-4 py-2"
                          key={index}
                        >
                          <div className="">Event Id: {event.eventId._id}</div>
                          <div className="">
                            Event Payment status: {event.payment.status}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full">
                        <p className="">
                          You were not found to be participating in any event.
                        </p>
                        <p className="w-full">
                          Hence, you need to buy the pass for 200 rs.
                        </p>
                      </div>
                    )} */}
                    {/* button for generating passes */}
                    <div className=" w-full flex justify-center pt-[1.5rem]">
                      {!userContext?.user?.pass.hasPass ? (
                        <button
                          type="button"
                          className="bg-white text-black px-4 py-2 rounded-md hover:cursor-pointer font-originTech hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out"
                          onClick={handleGeneratePasses}
                        >
                          {loadingPass
                            ? "Generating your pass..."
                            : "Generate Pass"}
                        </button>
                      ) : (
                        <div className="text-white font-originTech">
                          Here's your pass, {userContext.user.firstName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-2 pr-4">
                    {userContext?.user && hasPass && (
                      <div className="w-full text-white border-[1px] rounded-md font-originTech px-3 py-2">
                        <div className="w-full">
                          <span className="underline">Name</span>:{" "}
                          {userContext.user.firstName}
                        </div>
                        <div className="w-full">
                          <span className="underline">College/University</span>:{" "}
                          {userContext.user.schoolOrCollege === "SCHOOL"
                            ? userContext.user.schoolName
                            : userContext.user.collegeName}
                        </div>
                        <div className="w-full">
                          <span className="underline">
                            Standard/Graduate Program:
                          </span>{" "}
                          {userContext.user.schoolOrCollege === "SCHOOL"
                            ? userContext.user.schoolClass
                            : userContext.user.collegeClass}
                        </div>
                        <div className="w-full">
                          <span className="underline">Phone Number:</span>
                          {userContext.user.phoneNumber}
                        </div>
                        <div className="w-full">
                          <span className="underline">Email:</span>{" "}
                          {userContext.user.email}
                        </div>
                        <div className="w-full py-2">
                          {events && events.length > 0 ? (
                            events.map((event, index) => (
                              <div className="pl-4 w-full pt-3" key={index}>
                                Event Number {index + 1}
                                <div className="w-full">
                                  {event.eventId._id}
                                </div>
                                <div className="w-full">
                                  {event.eventId.title}
                                </div>
                                <div className="w-full">
                                  {event.payment.status}
                                </div>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="w-full flex justify-center">
                                You have not registered for any events
                              </div>
                              <div className="w-full flex justify-center pt-2">
                                <button
                                  type="button"
                                  className="px-4 py-2 rounded-md bg-white text-black hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out"
                                  onClick={() => {
                                    setOpenPayment(true);
                                  }}
                                >
                                  Buy Pass
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {openPayment && (
        <div className="text-black fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[60%] lg:w-[40%]">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-semibold">
                Event Payment
              </h1>
              <button
                className="border-2 rounded-lg px-2 py-1 text-lg"
                onClick={() => setOpenPayment(false)}
              >
                <RxCross2 size={20} />
              </button>
            </div>
            <div className="text-center h-42 w-56">
              <img src="/upi.jpg" alt="upi" />
            </div>
            <form
              className="mt-8 flex flex-col justify-center space-y-2"
              onSubmit={handlePaymentSubmision}
            >
              <div className="flex flex-col gap-4">
                <label htmlFor="role" className="text-lg font-semibold">
                  Transaction Id
                </label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  className="text-md border px-2 py-2 rounded-md"
                  placeholder="Enter Name"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="role" className="text-lg font-semibold">
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-md border px-2 py-2 rounded-md"
                  placeholder="Enter Name"
                />
              </div>
              <button
                disabled={paymentLoading}
                type="submit"
                className="text-lg font-semibold bg-indigo-500 px-3 py-2 rounded-lg text-white"
              >
                {paymentLoading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passes;
