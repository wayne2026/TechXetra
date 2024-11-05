import { StarsBackground } from "../../components/StarBackground";
import { ShootingStars } from "../../components/ShootingStars";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "../context/user_context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
// import { paymentStatusEnum } from "../types/index";

interface UserRegisteredEvent {
  eventId: string;
  title: string;
  paymentRequired: boolean;
}

const paymentStatusEnum = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
} as const;

interface IPass {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  schoolOrCollege: string;
  institutionName: string;
  institutionClass: string;
  eventsRegistered: UserRegisteredEvent[];
  paymentRequired: boolean;
  payment?: {
    status: (typeof paymentStatusEnum)[keyof typeof paymentStatusEnum];
    transactionId: string;
    paymentImage: string;
    amount: number;
  };
  qrCodeUrl: string;
}

interface EventResponse {
  success: boolean;
  message: string;
  userEvents: {
    events: UserRegisteredEvent[];
  };
}

const Passes = () => {
  const navigate = useNavigate();
  const starsBG = useRef<HTMLDivElement>(null);

  const userContext = useUser();
  const location = useLocation();
  const id = userContext?.user?._id;
  const from =
    location.state?.from?.pathname + location.state?.from?.search || "/verify";
  const [events, setEvents] = useState<UserRegisteredEvent[] | null>(null);

  const [loadingPass, setLoadingPass] = useState<boolean>(false);
  const [loadingMakePass, setLoadingMakePass] = useState<boolean | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const [institutionName, setInstitutionName] = useState<string>("");
  const [institutionClass, setInstitutionClass] = useState<string>("");

  const [openPayment, setOpenPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [paymentFile, setPaymentFile] = useState<File>();
  const [hasPass, setHasPass] = useState<boolean | null>(null);
  const [passInfo, setPassInfo] = useState<IPass | null>(null);
  const [qrCodeURL, setQRCodeURL] = useState<string>("");

  const [passPayment, setPassPayment] = useState<boolean>(false);
  const [passAmount, setPassAmount] = useState<number | null>(null);

  // const Events: UserRegisteredEvent[] = [];

  const fetchEvents = useCallback(async () => {
    try {
      const { data }: { data: EventResponse } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/passes/getEvents/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      setEvents(data.userEvents.events);
    } catch (error) {
      console.error("Error getting all events: ", error);
    }
  }, [id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  const handleGetExistingPass = useCallback(async () => {
    setLoadingPass(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const getExistingPass = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/passes/get/${id}`,
        config
      );
      console.log("existing pass response: ", getExistingPass.data);
      if (getExistingPass.data.success === false) {
        toast.info(
          "You don't have an existing pass for TechXetra. Please click on generate to generate one."
        );
        setHasPass(false);
      } else {
        setHasPass(true);
        setPassInfo(getExistingPass.data.pass);
        setQRCodeURL(getExistingPass.data.pass.qrCodeURL);
      }
    } catch (error) {
      console.error("Error while generating pass for you: ", error);
    }
    // setPassGenerated(true);
    setLoadingPass(false);
  }, [id]);

  useEffect(() => {
    handleGetExistingPass();
  }, [handleGetExistingPass]);

  const handleGeneratePasses = async () => {
    setLoadingMakePass(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      console.log("events: ", events);
      const newPass = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/passes/generate/${id}`,
        {
          userId: id,
          firstName: userContext?.user?.firstName,
          lastName: userContext?.user?.lastName,
          email: userContext?.user?.email,
          phoneNumber: userContext?.user?.phoneNumber,
          schoolOrCollege: userContext?.user?.schoolOrCollege,
          institutionName: institutionName,
          institutionClass: institutionClass,
          eventsRegistered: events,
          paymentRequired: passPayment,
          payment: {
            status: paymentStatusEnum.PENDING,
            transactionId: "",
            paymentImage: "",
            amount: passAmount,
          },
        },
        config
      );
      console.log(
        `here is the new pass for the user with id ${id}: `,
        newPass.data
      );
      setPassInfo(newPass.data.newPass);
      setQRCodeURL(newPass.data.qrCode);
      setHasPass(true);
      toast.success(
        `New Pass generated successfully for ${userContext?.user?.firstName}`
      );
    } catch (error) {
      console.error("Error while generating pass for you: ", error);
      toast.error(
        `Error while generating pass for ${userContext?.user?.firstName}`
      );
    }
    setLoadingMakePass(false);
  };

  const handlePaymentSubmision = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!paymentId || !paymentFile) {
      toast.error("Please Provide both Payment Id and Payment File");
      return;
    }

    setPaymentLoading(true);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const formData = new FormData();
    formData.append("image", paymentFile);
    formData.append("transactionId", paymentId);

    try {
      if (id) {
        const { data }: { data: any } = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/passes/updatePassPayment/${id}`,
          formData,
          config
        );
        console.log(
          "Payment details for pass updated successfully, ",
          data.updatedPass
        );
        toast.success("Payment details for pass updated successfully");
        setPassInfo(data.updatedPassWithUpdatedQrCode);
        setQRCodeURL(data.updatedPassWithUpdatedQrCode.qrCodeUrl);
        setHasPass(true);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setPaymentLoading(false);
      setOpenPayment(false);
      setPaymentId("");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentFile(file);
    }
  };

  const handleIsSchool = useCallback(async () => {
    setLoadingPage(true);
    try {
      if (userContext?.user?.schoolOrCollege === "SCHOOL") {
        setInstitutionName(userContext.user.schoolName as string);
        setInstitutionClass(userContext.user.schoolClass as string);
        setPassAmount(50);
      } else {
        setInstitutionName(userContext?.user?.collegeName as string);
        setInstitutionClass(userContext?.user?.collegeClass as string);
        setPassAmount(200);
      }
    } catch (error) {
      console.error("Error while decoding isSchool: ", error);
    }
    setLoadingPage(false);
  }, [userContext]);

  const handleIsPaymentRequired = useCallback(async () => {
    try {
      if (events?.length === 0) {
        setPassPayment(true);
      } else {
        setPassPayment(false);
      }
    } catch (error) {
      console.error("Error while processing isPaymentRequired: ", error);
    }
  }, [events]);

  useEffect(() => {
    handleIsSchool();
    handleIsPaymentRequired();
  }, [handleIsSchool, handleIsPaymentRequired]);

  return (
    <div className="w-screen min-h-screen bg-black mx-auto border-2">
      <div ref={starsBG} className="w-full min-h-screen">
        <StarsBackground
          starDensity={0.0009}
          allStarsTwinkle
          twinkleProbability={0.9}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="absolute bg-gradient-to-b from-[#000000] via-[#220135] to-[#020b22]"
        />
        <ShootingStars />

        {loadingPage ? (
          "Please wait..."
        ) : hasPass && passInfo ? (
          <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
            <div className="w-full flex justify-center pb-2">
              <p className="text-white font-originTech">
                Here's your pass, {userContext?.user?.firstName}
              </p>
            </div>
            <div className="w-[45%] flex flex-col justify-center border-[1px] border-slate-400 rounded-md text-white py-[2rem]">
              <div className="w-full flex flex-row justify-end items-center pb-3 pr-4">
                <img
                  src={passInfo.qrCodeUrl}
                  className="w-28 h-28"
                  alt="QR Code"
                />
              </div>
              <div className="flex flex-row justify-start py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">Firstname:</div>
                <div className="basis-1/2">{passInfo.firstName}</div>
              </div>
              <div className="flex flex-row justify-start py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">Lastname:</div>
                <div className="basis-1/2 font-originTech">
                  {passInfo.lastName}
                </div>
              </div>
              <div className="flex flex-row justify-center py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">Email:</div>
                <div className="basis-1/2 font-originTech">
                  {passInfo.email}
                </div>
              </div>
              <div className="flex flex-row justify-center py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">School/College/University:</div>
                <div className="basis-1/2 font-originTech">
                  {passInfo.institutionName}
                </div>
              </div>
              <div className="flex flex-row justify-center py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">
                  School Standard/Uni Program:
                </div>
                <div className="basis-1/2 font-originTech">
                  {passInfo.institutionClass}
                </div>
              </div>
              <div className="flex flex-row justify-center py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">Contact number:</div>
                <div className="basis-1/2 font-originTech">
                  +91-{passInfo.phoneNumber}
                </div>
              </div>
              <div className="flex flex-row py-[0.5px] font-originTech">
                <div className="basis-1/2 pl-3">
                  <p className="">Events Registered:</p>
                </div>
                <div className="basis-1/2">
                  {passInfo.eventsRegistered.length > 0
                    ? passInfo.eventsRegistered.map((event, index) => (
                        <div className="" key={index}>
                          <div className="font-originTech">
                            {index + 1}. {event.title}
                          </div>
                        </div>
                      ))
                    : passInfo.schoolOrCollege === "SCHOOL"
                    ? "All events are free."
                    : "Not registered for any events"}
                </div>
              </div>
              {passInfo.eventsRegistered.length === 0 && (
                <>
                  <div className="flex flex-row justify-center font-originTech">
                    <div className="basis-1/2 pl-3">Payment Amount: </div>
                    <div className="basis-1/2">{passInfo.payment?.amount}</div>
                  </div>
                  <div className="flex flex-row justify-center font-originTech">
                    <div className="basis-1/2 pl-3">
                      Payment Transaction Id:
                    </div>
                    <div className="basis-1/2">
                      {passInfo.payment?.status === "VERIFIED" &&
                        passInfo.payment.transactionId}
                      {passInfo.payment?.status === "SUBMITTED" && (
                        <p className="">
                          {passInfo.payment.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row justify-center font-originTech">
                    <div className="basis-1/2 pl-3">Payment Status: </div>
                    <div className="basis-1/2">{passInfo.payment?.status}</div>
                  </div>
                </>
              )}
              {passInfo.eventsRegistered.length === 0 && (
                <div className="w-full pt-4 flex justify-center">
                  {passInfo.paymentRequired === true && (
                    <button
                      type="button"
                      className="bg-white text-black px-4 py-1 rounded-md hover:cursor-pointer font-originTech hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out"
                      onClick={() => {
                        setOpenPayment(true);
                      }}
                    >
                      {passInfo.schoolOrCollege === "SCHOOL"
                        ? "Buy Pass for 50 rs"
                        : "Buy pass for 200 rs"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="w-full flex flex-row justify-center pt-2">
              <button type="button" className="px-4 py-2 rounded-md hover:cursor-pointer text-purple-600 bg-white font-originTech hover:text-white hover:bg-purple-600 transition duration-200 ease-in-out">
                Download as a PDF
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full h-full flex flex-row pt-[2rem]">
              <div className="basis-1/2 text-white flex justify-center items-start">
                <div className="w-[85%] items-center border-[1px] border-white rounded-lg px-4 py-2">
                  <div className="w-full font-originTech text-[1.5rem]">
                    Note:
                  </div>
                  <div className="w-full font-lemonMilk pt-2">
                    1. If you are a school student, then it is mandatory for you
                    to buy a pass for 50 rs.
                  </div>
                  <div className="w-full font-lemonMilk py-2">
                    2. If you are a student from a college/university other than
                    Tezpur University and are registered for an event, then you
                    don't need to buy any pass, just click on 'Generate Passes'
                    to make one.
                  </div>
                  <div className="w-full font-lemonMilk pb-2">
                    3. If you are a student from a college/university other than
                    Tezpur University and are not registered for an event, then
                    you need to buy the pass for 200 rs.
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
                      <div className="w-full text-white pt-[2rem] pr-4">
                        {/* button for generating passes */}
                        <div className=" w-full flex justify-center pt-[1.5rem]">
                          <button
                            type="button"
                            className="bg-white text-black px-4 py-2 rounded-md hover:cursor-pointer font-originTech hover:bg-purple-600 hover:text-white transition duration-300 ease-in-out"
                            onClick={handleGeneratePasses}
                          >
                            {loadingMakePass
                              ? "Generating your pass..."
                              : "Generate Pass"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
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
                  // name="transactionId"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  className="text-md border px-2 py-2 rounded-md"
                  placeholder="Enter transaction Id"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="role" className="text-lg font-semibold">
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  // name="paymentImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-md border px-2 py-2 rounded-md"
                  placeholder="Upload screenschot here"
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
