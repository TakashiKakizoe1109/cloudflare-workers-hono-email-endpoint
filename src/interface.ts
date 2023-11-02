export interface Env {
	[key: string]: any;
	API_TOKEN: string;
	API_END_POINT_MAILCHANNELS: string;
	DKIM_PRIVATE_KEY: string;
	MC_FROM_EMAIL: string;
	MC_FROM_NAME: string;
	MC_DKIM_DOMAIN: string;
	MC_DKIM_SELECTOR: string;
}

export interface EmailAddress {
	email: string;
	name?: string;
}

export interface Personalization {
	//to: [EmailAddress, ...EmailAddress[]];
	to: EmailAddress[];
	from?: EmailAddress;
	dkim_domain?: string;
	dkim_private_key?: string;
	dkim_selector?: string;
	reply_to?: EmailAddress;
	cc?: EmailAddress[];
	bcc?: EmailAddress[];
	subject?: string;
	headers?: Record<string, string>;
}

export interface ContentItem {
	type: string;
	value: string;
}

export interface MailSendBody {
	personalizations: [Personalization, ...Personalization[]];
	from: EmailAddress;
	reply_to?: EmailAddress;
	subject: string;
	content: [ContentItem, ...ContentItem[]];
	headers?: Record<string, string>;
}
export interface ForApiPersonalization {
	to: EmailAddress[];
	cc?: EmailAddress[];
	bcc?: EmailAddress[];
}

export interface ForApiContent {
	type: string;
	value: string;
}

export interface ForApiMailRequest {
	personalizations: ForApiPersonalization[];
	subject: string;
	content: ForApiContent[];
	from: EmailAddress;
	reply_to?: EmailAddress;
}