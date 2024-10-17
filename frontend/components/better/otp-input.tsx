import React, { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "react-toastify";

interface OtpInputProps {
    length?: number;
    onOtpSubmit?: (otp: string) => void;
    disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 4, onOtpSubmit = () => { }, disabled = true }) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleClick = (index: number) => {
        inputRefs.current[index]?.setSelectionRange(1, 1);

        if (index > 0 && !otp[index - 1]) {
            const emptyIndex = otp.indexOf("");
            if (emptyIndex !== -1) {
                inputRefs.current[emptyIndex]?.focus();
            }
        }
    };

    const handleSubmit = () => {
        const combinedOtp = otp.join("");
        if (combinedOtp.length === length) onOtpSubmit(combinedOtp)
        else toast.warning("Complete OTP");
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-8 gap-2">
                {otp.map((value, index) => {
                    return (
                        <input
                            key={index}
                            type="text"
                            ref={(input) => (inputRefs.current[index] = input)}
                            value={value}
                            onChange={(e) => handleChange(index, e)}
                            onClick={() => handleClick(index)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-10 m-1 border-2 border-black rounded-md text-center text-lg md:w-12 md:h-12 md:text-xl lg:w-14 lg:h-14 lg:text-2xl"
                        />
                    );
                })}
            </div>
            <button
                onClick={handleSubmit}
                disabled={disabled}
                type="button"
                className="text-white tracking-wide text-md font-medium px-6 py-3 capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
                Submit
            </button>
        </div>
    );
};

export default OtpInput;
