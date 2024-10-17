interface UserEvent {
	eventId: string;
	paymentId: string;
	physicalVerification: {
		status: boolean;
		verifierId?: string;
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
	college: string;
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