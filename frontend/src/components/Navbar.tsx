import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user_context";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const userContext = useUser();

  const downloadExcelSpreadSheet = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/exportusers`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Users.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error while downloading excel spreadsheet: ", error);
    }
  };

  return (
    <div className="w-full flex justify-between items-center md:pr-10 md:pl-10 pl-8 pr-8 mt-6 text-white ">
      <div className="">
        <img
          src="/techxetra-text.svg"
          width={200}
          alt="Logo"
          className="max-sm:w-24 "
        />
      </div>
      <div className="w-fit  h-fit z-10 flex flex-row gap-2">
        <div className="px-2">
          <button
            type="button"
            className="bg-white text-black px-2 py-1 rounded-md font-originTech"
            onClick={downloadExcelSpreadSheet}
          >
            Export Users
          </button>
        </div>
        <div className="px-2">
          <button
            type="button"
            onClick={() => {
              if (userContext?.user) {
                navigate("/profile");
              } else {
                navigate("/login");
              }
            }}
          >
            <h1 className="font-originTech sm:text-2xl hover:text-transparent bg-clip-text bg-gradient-radial from-[#FD8444] to-[#7527ED] ">
              {userContext?.user ? `${userContext?.user?.firstName}` : "Login"}
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
