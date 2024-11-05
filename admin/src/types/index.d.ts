interface UserEvent {
	eventId: {
		_id: string;
		title: string;
		eventDate: Date;
		venue: string;
	}
    paymentRequired: boolean;
	eligible: boolean;
	isGroup: boolean;
    group?: {
		leader?: UserEventPopulatedData;
		members?: {
			status: string;
			user: UserEventPopulatedData;
		}[];
	}
	payment: {
		status: string;
		transactionId: string;
		paymentImage: string;
		amount: number;
		verifierId: UserEventPopulatedData;
	}
	physicalVerification: {
		status: boolean;
		verifierId: UserEventPopulatedData;
	}
}

interface User {
    _id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	avatar: string;
	role: string;
	account: string[];
	schoolOrCollege: string;
    schoolName?: string;
	collegeName?: string;
	collegeClass?: string;
	schoolClass?: string;
	phoneNumber: string;
	isVerified: boolean;
	isBlocked: boolean;
	events: UserEvent[] | [];
	googleId: string;
}

interface UserResponse {
    success: boolean;
    user: User;
    token: string;
}

interface AllUsersResponse {
    success: boolean;
    count: number;
    resultPerPage: number;
    filteredUsersCount: number;
    users: User[];
}

interface EventDetails {
	_id: string;
    title: string;
    subTitle?: string;
    description: string;
    category: string;
    participation: string;
    maxGroup?: number;
    isVisible: boolean;
    canRegister: boolean;
    externalRegistration: boolean;
    extrenalRegistrationLink?: string;
    externalLink?: string;
    registrationRequired: boolean;
    paymentRequired: boolean;
    amount?: number;
    eventDate: Date;
    venue?: string;
    deadline?: Date;
    image?: string;
    rules?: string[];
    backgroundImage?: string;
    eligibility?: {
        schoolOrCollege?: string;
        collegeClass?: string[];
        schoolClass?: string[];
    }
	limit?: number;
	registered?: number;
    createdAt: Date;
    updatedAt: Date;
}

interface EventDetailsResponse {
	success: boolean;
	event: EventDetails;
}

interface AllEventDetailsResponse {
	success: boolean;
	count: number;
	resultPerPage: number;
	events: EventDetails[];
	filteredEventsCount: number;
}