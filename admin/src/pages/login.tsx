import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>TechXetra Admin Pannel</CardTitle>
                <CardDescription>Only Admins are allowed here.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input placeholder="Enter your Email" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input placeholder="Enter your Password" />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                {/* <Button variant="outline">Cancel</Button> */}
                <Button>Login</Button>
            </CardFooter>
        </Card>
    )
}

export default LoginPage;