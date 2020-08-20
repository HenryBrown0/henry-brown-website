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

CREATE TABLE IF NOT EXISTS repository (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	updated_at TIMESTAMP NOT NULL,
	is_archived BOOLEAN NOT NULL,
	background_color CHAR(6) NOT NULL,
	is_background_dark BOOLEAN NOT NULL,
	git_hub_url TEXT NOT NULL,
	read_me TEXT
);
