CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS user_query (
	id UUID PRIMARY KEY,
	nonce UUID UNIQUE NOT NULL,
	received_at TIMESTAMP NOT NULL DEFAULT NOW(),
	name TEXT NOT NULL,
	email CITEXT NOT NULL,
	phone_number CHAR(11),
	web_development BOOLEAN NOT NULL,
	web_hosting BOOLEAN NOT NULL,
	message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service (
	title TEXT PRIMARY KEY,
	subtitle TEXT,
	backgroundColor CHAR(6) NOT NULL,
	isBackgroundDark BOOLEAN NOT NULL,
	content TEXT NOT NULL
);
