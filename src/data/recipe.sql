CREATE TYPE difficulty AS ENUM ('Easy', 'Medium', 'Difficult');
CREATE TYPE role AS ENUM ('User', 'Admin');

CREATE TABLE IF NOT EXISTS users(
	id SERIAL NOT NULL PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now(),
	username TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	display_name TEXT,
	avatar_url TEXT,
	bio TEXT,
	role role DEFAULT 'User'
);

CREATE TABLE IF NOT EXISTS recipes (
	id SERIAL NOT NULL,
	name TEXT NOT NULL,
	ingredients TEXT[] NOT NULL,
	instructions TEXT[] NOT NULL,
	prepTimeMinutes INT NOT NULL CHECK (prepTimeMinutes >= 1),
	cookTimeMinutes INT CHECK (cookTimeMinutes >= 1),
	servings INT CHECK(servings >= 1),
	difficulty difficulty DEFAULT 'Easy',
	cuisine TEXT NOT NULL,
	caloriesPerServing INT,
	tags TEXT[] NOT NULL,
	userId INT REFERENCES users(id),
	image TEXT,
	rating NUMERIC(2,1) CHECK (rating BETWEEN 1 AND 5),
	reviewCount INT,
	mealType TEXT[] NOT NULL
);