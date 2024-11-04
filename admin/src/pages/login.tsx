import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/context/user_context";

const formSchema = z.object({
    email: z.string().email().min(2).max(50),
    password: z.string().min(8).max(50),
});
const LoginPage = () => {

    const userContext = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname + location.state?.from?.search || "/users";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.password || !values.email) {
            toast.warning("All fields are required");
            return;
        }
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };
        const payload = {
            email: values.email,
            password: values.password,
        };
        try {
            const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/login`, payload, config);
            userContext?.setUser(data.user);
            toast.success("Logged In!");
            navigate(from, { replace: true });
        } catch (error: any) {
            userContext?.setUser(null);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="w-[90%] md:w-[60%] lg:w-[50%] mt-24 bg-white p-6 rounded-lg">
            <h1 className="text-3xl font-semibold py-6">Admin Login</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*********" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Login</Button>
                </form>
            </Form>
        </div>
    )
}

export default LoginPage;