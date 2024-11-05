import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import axios from "axios";
// import moment from 'moment-timezone';

const CreateEvent = () => {
    const [search] = useSearchParams();
    const id = search.get("id");

    const [formData, setFormData] = useState({
        title: "",
        subTitle: "",
        note: "",
        description: "",
        category: "",
        participation: "",
        maxGroup: "",
        isVisible: false,
        canRegister: false,
        externalRegistration: false,
        extrenalRegistrationLink: "",
        externalLink: "",
        registrationRequired: false,
        paymentRequired: false,
        amount: "",
        eventDate: "",
        venue: "",
        deadline: "",
        image: null as File | null,
        backgroundImage: null as File | null,
        rules: [""],
        schoolOrCollege: "",
        schoolClass: [""],
        collegeClass: [""],
        limit: "",
        registered: "",
    });

    const fetchEvent = async () => {
        try {
            const { data }: { data: EventDetailsResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/events/byId/${id}`, { withCredentials: true });
            setFormData({
                ...formData,
                ...data.event,
                schoolOrCollege: data.event.eligibility?.schoolOrCollege ?? "",
                schoolClass: data.event.eligibility?.schoolClass ?? [""],
                collegeClass: data.event.eligibility?.collegeClass ?? [""],
                maxGroup: data.event.maxGroup?.toString() ?? "",
                amount: data.event.amount?.toString() ?? "",
                limit: data.event.limit?.toString() ?? "",
                registered: data.event.registered?.toString() ?? "",
                image: null,
                backgroundImage: null,
                eventDate: data.event.eventDate ? new Date(data.event.eventDate).toISOString().slice(0, 16) : "",
                deadline: data.event.deadline ? new Date(data.event.deadline).toISOString().slice(0, 16) : "",
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        };

        const form = new FormData();
        form.append("title", formData.title);
        if (formData.subTitle) form.append("subTitle", formData.subTitle);
        if (formData.note) form.append("note", formData.note);
        form.append("description", formData.description);
        form.append("category", formData.category);
        form.append("participation", formData.participation);
        if (formData.maxGroup) form.append("maxGroup", formData.maxGroup);
        form.append("isVisible", JSON.stringify(formData.isVisible));
        form.append("canRegister", JSON.stringify(formData.canRegister));
        form.append("externalRegistration", JSON.stringify(formData.externalRegistration));
        if (formData.extrenalRegistrationLink) form.append("extrenalRegistrationLink", formData.extrenalRegistrationLink);
        if (formData.externalLink) form.append("externalLink", formData.externalLink);
        form.append("registrationRequired", JSON.stringify(formData.registrationRequired));
        form.append("paymentRequired", JSON.stringify(formData.paymentRequired));
        if (formData.amount) form.append("amount", formData.amount);
        if (formData.eventDate) {
            // console.log("eventDate", formData.eventDate);
            // const eventDateUTC = moment(formData.eventDate).utc().format();
            // console.log("eventDateUTC", eventDateUTC);
            form.append("eventDate", formData.eventDate);
        }
        if (formData.venue) form.append("venue", formData.venue);
        if (formData.deadline) {
            // const deadlineUTC = moment(formData.deadline).utc().format();
            form.append("deadline", formData.deadline);
        }
        if (formData.image) form.append("image", formData.image);
        if (formData.backgroundImage) form.append("event", formData.backgroundImage);
        formData.rules.forEach((rule, index) => form.append(`rules[${index}]`, rule));
        if (formData.schoolOrCollege) form.append("schoolOrCollege", formData.schoolOrCollege);
        if (formData.schoolClass.length > 1 || (formData.schoolClass.length === 1 && formData.schoolClass[0] !== "")) {
            formData.schoolClass.forEach((cls, index) => form.append(`schoolClass[${index}]`, cls));
        }
        if (formData.collegeClass.length > 1 || (formData.collegeClass.length === 1 && formData.collegeClass[0] !== "")) {
            formData.collegeClass.forEach((cls, index) => form.append(`collegeClass[${index}]`, cls));
        }
        if (formData.limit) form.append("limit", formData.limit);
        if (formData.registered) form.append("registered", formData.registered);
    
        try {
            if (id) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/events/byId/${id}`, form, config);
                toast.success("Event Updated Successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/events/new`, form, config);
                toast.success("Event Created Successfully");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };    

    const handleAddItem = (field: "rules" | "schoolClass" | "collegeClass") => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], ""],
        }));
    };
    
    const handleRemoveItem = (field: "rules" | "schoolClass" | "collegeClass", index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleItemChange = (field: "rules" | "schoolClass" | "collegeClass", value: string, index: number) => {
        setFormData((prev) => {
            const updatedField = [...prev[field]];
            updatedField[index] = value;
            return {
                ...prev,
                [field]: updatedField,
            };
        });
    };

    return (
        <div className="w-[90%] md:w-[60%] lg:w-[50%] mt-24 mb-12 bg-white py-6 px-4 md:px-12 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold py-6">{id ? "Edit" : "Create"} Event</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Title</Label>
                        <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter the event title" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Sub Title</Label>
                        <Input name="subTitle" value={formData.subTitle} onChange={handleInputChange} placeholder="Enter the event sub title" />
                    </div>
                </div>

                <div>
                    <Label className="block text-sm font-medium">Rules</Label>
                    {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Input
                                placeholder={`Enter rule ${index + 1}`}
                                value={rule}
                                onChange={(e) => handleItemChange("rules", e.target.value, index)}
                                className="flex-1"
                            />
                            <Button type="button" onClick={() => handleRemoveItem("rules", index)} className="bg-red-500 text-white" disabled={formData.rules.length === 1}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAddItem("rules")} className="mt-2">
                        Add Rule
                    </Button>
                </div>

                <div>
                    <Label className="block text-sm font-medium">Description</Label>
                    <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description" />
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 flex flex-row items-start space-x-2">
                        <Checkbox
                            checked={formData.isVisible}
                            onCheckedChange={() =>
                                setFormData((prev) => ({ ...prev, isVisible: !prev.isVisible }))
                            }
                        />
                        <Label className="block text-sm font-medium">Is Visible</Label>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-row items-start space-x-2">
                        <Checkbox
                            checked={formData.canRegister}
                            onCheckedChange={() =>
                                setFormData((prev) => ({ ...prev, canRegister: !prev.canRegister }))
                            }
                        />
                        <Label className="block text-sm font-medium">Can Register</Label>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 flex flex-row items-start space-x-2">
                        <Checkbox
                            checked={formData.externalRegistration}
                            onCheckedChange={() =>
                                setFormData((prev) => ({ ...prev, externalRegistration: !prev.externalRegistration }))
                            }
                        />
                        <Label className="block text-sm font-medium">External Registration</Label>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-row items-start space-x-2">
                        <Checkbox
                            checked={formData.registrationRequired}
                            onCheckedChange={() =>
                                setFormData((prev) => ({ ...prev, registrationRequired: !prev.registrationRequired }))
                            }
                        />
                        <Label className="block text-sm font-medium">Registration Required</Label>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2 flex flex-row items-start space-x-2">
                        <Checkbox
                            checked={formData.paymentRequired}
                            onCheckedChange={() =>
                                setFormData((prev) => ({ ...prev, paymentRequired: !prev.paymentRequired }))
                            }
                        />
                        <Label className="block text-sm font-medium">Payment Required</Label>
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Amount</Label>
                        <Input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="Enter the event registration amount" />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">External Registration Link</Label>
                        <Input name="extrenalRegistrationLink" value={formData.extrenalRegistrationLink} onChange={handleInputChange} placeholder="Enter External Registration Link" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">External Link</Label>
                        <Input name="externalLink" value={formData.externalLink} onChange={handleInputChange} placeholder="Enter External Link" />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Image</Label>
                        <Input name="image" type="file" accept="image/*" onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.files ? e.target.files[0] : null }))} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium">Background Image</label>
                        <Input name="backgroundImage" type="file" accept="image/*" onChange={(e) => setFormData((prev) => ({ ...prev, backgroundImage: e.target.files ? e.target.files[0] : null }))} />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Event Date</Label>
                        <input name="eventDate" type="datetime-local" value={formData.eventDate} onChange={handleInputChange} placeholder="Enter event date" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium">Event Deadline</label>
                        <input name="deadline" type="datetime-local" value={formData.deadline} onChange={handleInputChange} placeholder="Enter event deadline" />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Note</Label>
                        <Input name="note" value={formData.note} onChange={handleInputChange} placeholder="Enter any important note" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Category</Label>
                        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} value={formData.category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TECHNICAL">TECHNICAL</SelectItem>
                                <SelectItem value="GENERAL">GENERAL</SelectItem>
                                <SelectItem value="CULTURAL">CULTURAL</SelectItem>
                                <SelectItem value="SPORTS">SPORTS</SelectItem>
                                <SelectItem value="ESPORTS">ESPORTS</SelectItem>
                                <SelectItem value="MISCELLANEOUS">MISCELLANEOUS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Participation</Label>
                        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, participation: value }))} value={formData.participation}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose Participation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SOLO">SOLO</SelectItem>
                                <SelectItem value="TEAM">TEAM</SelectItem>
                                <SelectItem value="HYBRID">HYBRID</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Max Group</Label>
                        <Input name="maxGroup" type="number" value={formData.maxGroup} onChange={handleInputChange} placeholder="Enter the max group size" />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Venue</Label>
                        <Input name="venue" value={formData.venue} onChange={handleInputChange} placeholder="Enter event venue" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">School Or College</Label>
                        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, schoolOrCollege: value }))} value={formData.schoolOrCollege}>
                            <SelectTrigger>
                                <SelectValue placeholder="School Or College" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SCHOOL">SCHOOL</SelectItem>
                                <SelectItem value="COLLEGE">COLLEGE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">School Class</Label>
                        {formData.schoolClass.map((rule, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    placeholder="Enter ONE_TO_FOUR, FIVE_TO_EIGHT or NINE_TO_TWELVE"
                                    value={rule}
                                    onChange={(e) => handleItemChange("schoolClass", e.target.value, index)}
                                    className="flex-1"
                                />
                                <Button type="button" onClick={() => handleRemoveItem("schoolClass", index)} className="bg-red-500 text-white">
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => handleAddItem("schoolClass")} className="mt-2">
                            Add School Class
                        </Button>
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">College Class</Label>
                        {formData.collegeClass.map((rule, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    placeholder="Enter UG, PG, PHD or OTHERS"
                                    value={rule}
                                    onChange={(e) => handleItemChange("collegeClass", e.target.value, index)}
                                    className="flex-1"
                                />
                                <Button type="button" onClick={() => handleRemoveItem("collegeClass", index)} className="bg-red-500 text-white">
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => handleAddItem("collegeClass")} className="mt-2">
                            Add College Class
                        </Button>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Limit</Label>
                        <Input name="limit" type="number" value={formData.limit} onChange={handleInputChange} placeholder="Enter the event registration limit" />
                    </div>
                    <div className="w-full md:w-1/2">
                        <Label className="block text-sm font-medium">Registered</Label>
                        <Input name="registered" type="number" value={formData.registered} onChange={handleInputChange} placeholder="Enter the event registration starting count" />
                    </div>
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CreateEvent;