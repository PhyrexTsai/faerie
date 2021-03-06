CREATE TABLE IF NOT EXISTS Users (
	id text primary key,
	displayName text,
	createTimestamp timestamp with time zone
);

ALTER TABLE Users
  OWNER TO root;

CREATE TABLE IF NOT EXISTS Category (
	id serial primary key,
	name text,
	description text,
	thumbnail text,
	categoryUrl text,
	createTimestamp timestamp with time zone
);

ALTER TABLE Category
  OWNER TO root;

CREATE TABLE IF NOT EXISTS Rss (
	id serial primary key,
	categoryId integer,
	rssName text,
	rssUrl text,
	rssHtml text,
	thumbnail text,
	description text,
	createTimestamp timestamp with time zone,
	lastUpdateTimestamp timestamp with time zone
);

ALTER TABLE Rss
  OWNER TO root;

CREATE TABLE IF NOT EXISTS RssFeed (
	id serial primary key,
	rssId integer,
	rssFeedTitle text,
	rssFeedUrl text,
	releaseDate date,
	thumbnail text,
	rssFeedContent text,
	description text,
	createTimestamp timestamp with time zone
);

ALTER TABLE RssFeed
  OWNER TO root;

CREATE TABLE IF NOT EXISTS UserSubscription (
	id serial primary key,
	userId text,
	categoryId integer,
	status text, -- SUBSCRIBE, UNSUBSCRIBE, PENDING
	createTimestamp timestamp with time zone,
	lastUpdateTimestamp timestamp with time zone
);

ALTER TABLE UserSubscription
  OWNER TO root;

CREATE TABLE IF NOT EXISTS RssView (
	id serial primary key,
	userId integer,
	rssId integer,
	viewTimestamp timestamp with time zone
);

ALTER TABLE RssView
  OWNER TO root;

CREATE TABLE IF NOT EXISTS ViewCount (
	id serial primary key,
	categoryId integer,
	rssId integer,
	rssFeedId integer,
	count integer
);

ALTER TABLE ViewCount
  OWNER TO root;
