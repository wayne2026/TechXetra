import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface UserRegisteredEvent {
  eventId: string;
  title: string;
  paymentRequired: boolean;
}

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
    status: string;
    transactionId: string;
    paymentImage: string;
    amount: number;
  };
  qrCodeUrl: string;
}

const Passes = () => {
  const urlParams = new URLSearchParams();
  const userId = Number(urlParams.get("userId"));

  const [userInfo, setUserInfo] = useState<IPass | null>(null);

  const getUserPassInformation = useCallback(async () => {
    try {
      const userData = await axios.get(
        `${import.meta.env.SERVER_URL}/passes/get/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log("user data is: ", userData);
      setUserInfo(userData.data.pass);
    } catch (error) {
      console.error("Error while fetching user pass information: ", error);
    }
  }, [userId]);

  useEffect(() => {
    getUserPassInformation();
  }, [getUserPassInformation]);

  return (
    <div className="text-black">
        <div className="">
            {userInfo?.email}
        </div>
    </div>
  )
};

export default Passes;
