interface UserEventPopulatedData {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
}

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

interface UserInvite {
	eventId: {
		_id: string;
		title: string;
		eventDate: Date;
		venue: string;
	}
	userId: UserEventPopulatedData;
	status: string;
}

interface UserInviteResponse {
    success: boolean;
	user: {
		_id: string;
        invites: UserInvite[];
	}
}

interface Events {
	eventId: string;
	title: string;
	paymentRequired: boolean;
};

interface UserEventResponse {
	success: boolean;
	user: {
		_id: string;
        events: Events[];
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
	pass: {
		hasPass: boolean;
		isPaid: boolean;
	};
	events: UserEvent[] | [];
	googleId: string;
}

interface UserResponse {
    success: boolean;
    user: User;
    token: string;
}

interface EventDetails {
	_id: string;
    title: string;
    subTitle?: string;
	note?: string;
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
        schoolOrCollege: string;
        collegeClass?: string;
        schoolClass?: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

interface AllEventCarousel {
	_id: string;
    title: string;
    description: string;
    category: string;
    participation: string;
    backgroundImage?: string;
}

interface EventDetailsResponse {
	success: boolean;
	event: EventDetails;
}

interface AllEventDetailsResponse {
	success: boolean;
	events: AllEventCarousel[];
}

export const paymentStatusEnum = {
	PENDING: "PENDING",
	SUBMITTED: "SUBMITTED",
	VERIFIED: "VERIFIED",
} as const;