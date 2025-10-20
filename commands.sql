CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('russ ross', 'russrossblog.com', 'rus with Ross Russ');

insert into blogs (author, url, title, likes) values ('wendy windy', 'wendyblog.com', 'weather blogging', 1);
