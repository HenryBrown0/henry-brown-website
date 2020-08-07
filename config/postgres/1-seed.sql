INSERT INTO user_query
	(id, nonce, name, email, phone_number, web_development, web_hosting, message)
VALUES
	('7bb77a04-8534-4306-8ca7-98b6482613cd', '80dd631d-2f29-480f-bee1-4f96345e075e', 'Bob', 'bob@email.com', '01234567890', true, false, 'A simple example message'),
	('e4f4cb75-5c4d-4a9d-bd4b-e46fc6e2cb85', '7594594f-48c6-487a-94db-3d292bcd8ee6', 'Geoff', 'feoff@snailmail.com', '09876543210', false, true, 'A slightly different message');

INSERT INTO service
	(title, subtitle, backgroundColor, isBackgroundDark, content)
VALUES
	('A amazing service', 'Great quality', '192a56', true, 'Some really cool content will be here.<br />HTML is supported here');

INSERT INTO repository
	(id, name, description, updated_at, is_archived, background_color, is_background_dark, git_hub_url, read_me)
VALUES
	('506ee7ce-c84e-4d78-9d40-3d23c9788952', 'An exciting project', 'A very simple description', '2020-01-14 21:40:54', false, '00a8ff', false, 'hello-world', 'Some really cool content will be here.<br />HTML is supported here');
