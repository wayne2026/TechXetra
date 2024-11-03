import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useSearchParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    title: z.string().min(2).max(50),
    subTitle: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    category: z.string().min(2).max(50),
    participation: z.string().min(2).max(50),
    maxGroup: z.string().min(2).max(50),
    // isVisible: z.boolean(),
    // canRegister: z.boolean(),
    // externalRegistration: z.boolean(),
    // extrenalRegistrationLink: z.string().url("Must be a valid URL").optional(),
    // externalLink: z.string().url("Must be a valid URL").optional(),
    // registrationRequired: z.boolean(),
    // paymentRequired: z.boolean(),
    amount: z.string().min(2).max(50),
    eventDate: z.string().refine(value => !isNaN(Date.parse(value)), { message: "Invalid date" }),
    venue: z.string().min(2).max(50),
    deadline: z.string().refine(value => !isNaN(Date.parse(value)), { message: "Invalid date" }),
    image: z
        .any()
        .refine((files) => files instanceof FileList && files.length > 0, {
            message: "File is required",
        })
        .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
            message: "File size must be less than 5MB",
        })
        .refine((files) => ['image/*'].includes(files[0]?.type), {
            message: "Only Image files are allowed",
        }),
    rules: z.array(z.string().min(1, "Rule can't be empty")).nonempty("Must have at least one rule"),
    backgroundImage: z
        .any()
        .refine((files) => files instanceof FileList && files.length > 0, {
            message: "File is required",
        })
        .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
            message: "File size must be less than 5MB",
        })
        .refine((files) => ['image/*'].includes(files[0]?.type), {
            message: "Only Image files are allowed",
        }),
    schoolOrCollege: z.string().min(2).max(50).optional(),
    collegeClass: z.string().min(2).max(50).optional(),
    schoolClass: z.string().min(2).max(50).optional(),
});

const CreateEventRec = () => {

    const [search] = useSearchParams();
    const id = search.get('id');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subTitle: "",
            description: "",
            category: "",
            participation: "",
            maxGroup: "",
            amount: "",
            venue: "",
            eventDate: "",
            deadline: "",
            rules: [""],
            schoolOrCollege: "",
            schoolClass: "",
            collegeClass: ""
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control, // Connect to the form's control
        name: "rules", // Field name must match the array in the schema
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <div className="w-[90%] md:w-[60%] lg:w-[50%] mt-24 mb-6 bg-white py-6 px-12 rounded-lg">
            <h1 className="text-3xl font-semibold py-6">{id ? "Edit" : "Create"} Event</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="w-full flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the event title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subTitle"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Sub Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the event sub title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2 space-x-2">
                        <FormLabel>Rules</FormLabel>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-2">
                                <FormField
                                    control={form.control}
                                    name={`rules.${index}`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder={`Enter rule ${index + 1}`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="bg-red-500 text-white"
                                    disabled={fields.length === 0} // Prevent removing the last rule
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        {/* Button to add a new rule */}
                        <Button
                            type="button"
                            onClick={() => append("")} // Append an empty string as a new rule
                            className="mt-2"
                        >
                            Add Rule
                        </Button>
                    </div>

                    {/* Description Field */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Brief description" {...field} />
                                    {/* <Input placeholder="Brief description" {...field} /> */}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="backgroundImage"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

               <div className="w-full flex items-center gap-4">
            {/* Event Date Field */}
            <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                            <Input
                                type="datetime-local"
                                placeholder="Enter event date"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Deadline Field */}
            <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                        <FormLabel>Event Deadline</FormLabel>
                        <FormControl>
                            <Input
                                type="datetime-local"
                                placeholder="Enter event deadline"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

                    <div className="w-full flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="participation"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Participation</FormLabel>
                                    <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose Participation" {...field} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SOLO">SOLO</SelectItem>
                                                <SelectItem value="TEAM">TEAM</SelectItem>
                                                <SelectItem value="HYBRID">HYBRID</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Category" {...field} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TECHNICAL">TECHNICAL</SelectItem>
                                                <SelectItem value="GENERAL">GENERAL</SelectItem>
                                                <SelectItem value="CULTURAL">CULTURAL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="schoolOrCollege"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>School or College</FormLabel>
                                    <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="School or College" {...field} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SCHOOL">SCHOOL</SelectItem>
                                                <SelectItem value="COLLEGE">COLLEGE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="schoolClass"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>School Class</FormLabel>
                                    <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="School Class" {...field} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ONE_TO_FOUR">ONE_TO_FOURL</SelectItem>
                                                <SelectItem value="FIVE_TO_EIGHT">FIVE_TO_EIGHT</SelectItem>
                                                <SelectItem value="NINE_TO_TWELVE">NINE_TO_TWELVE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="collegeClass"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormLabel>College Class</FormLabel>
                                    <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="College Class" {...field} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UG">UG</SelectItem>
                                                <SelectItem value="PG">PG</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Max Group Size Field */}
                    <FormField
                        control={form.control}
                        name="maxGroup"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Group Size</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter max group size" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Venue Field */}
                    <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Venue</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter event venue" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Payment Required */}
                    {/* <FormField
                        control={form.control}
                        name="paymentRequired"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Required</FormLabel>
                                <FormControl>
                                    <Input type="checkbox" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Amount (conditionally required based on paymentRequired) */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter amount" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateEventRec;