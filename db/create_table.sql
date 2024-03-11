drop database if exists my_blog;
create database my_blog;
use my_blog;

-- CREATE TABLE-------------------------------------
CREATE TABLE status_tbl (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_title VARCHAR(50),
    status_value INT
);

CREATE TABLE importance_tbl (
    importance_id INT AUTO_INCREMENT PRIMARY KEY,
    importance_title VARCHAR(50),
    importance_value INT
);

CREATE TABLE hashtag_tbl (
    hashtag_id INT AUTO_INCREMENT PRIMARY KEY,
    hashtag_title VARCHAR(50),
    date_created datetime default current_timestamp,
    status_id INT
);



CREATE TABLE blog_tbl (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    blog_title VARCHAR(255),
    date_created datetime default current_timestamp,
    date_approval DATETIME,
    blog_thumbnail VARCHAR(255),
    blog_desc TEXT,
    blog_content TEXT,
    blog_view INT,
    blog_sumary TEXT,
    blog_duration VARCHAR(50),
    status_id INT,
    user_id INT
);

CREATE TABLE subject_tbl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    thumbnail VARCHAR(255),
    status_id INT
);

CREATE TABLE blog_subject_tbl (
    blog_id INT,
    subject_id INT
);

CREATE TABLE blog_hashtag_tbl (
    blog_id INT,
    hashtag_id INT,
    date_created datetime default current_timestamp
);

CREATE TABLE task_tbl (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT,
    answer TEXT,
    status_id INT,
    importance_id INT,
    blog_id INT
);

CREATE TABLE list_tbl (
    list_id INT AUTO_INCREMENT PRIMARY KEY,
    list_title VARCHAR(255),
    list_desc TEXT,
    status_id INT,
    user_id INT,
    thumbnail VARCHAR(255)
);

CREATE TABLE follow_list_tbl (
    user_id INT,
    list_id INT,
    date_created datetime default current_timestamp
);

CREATE TABLE list_hashtag_tbl (
    list_id INT,
    hashtag_id INT,
    date_created datetime default current_timestamp
);

CREATE TABLE list_blog_tbl (
    list_id INT,
    blog_id INT,
    position INT,
    date_created datetime default current_timestamp
);

CREATE TABLE note_tbl (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    status_id INT,
    date_created datetime default current_timestamp
);

CREATE TABLE noti_tbl (
    noti_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    title VARCHAR(50),
    link VARCHAR(50),
    date_created datetime default current_timestamp,
    status_id INT,
    from_user INT
);

CREATE TABLE noti_to_user_tbl (
    noti_id INT,
    user_id INT
);

CREATE TABLE user_tbl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birthday DATE,
    slogan VARCHAR(255),
    key_gpt VARCHAR(255),
    date_created datetime default current_timestamp,
    phone_number VARCHAR(50),
    status_id INT,
    setting_id INT,
    qr_code VARCHAR(255)
);

CREATE TABLE role_tbl (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(50)
);
CREATE TABLE user_role_tbl (
    user_id INT,
    role_id INT,
    date_created datetime default current_timestamp
);
CREATE TABLE follow_user_tbl (
    user_id INT,
    user_follow_id INT,
    date_created datetime default current_timestamp
);

CREATE TABLE hashtag_user_tbl (
    hashtag_id INT,
    user_id INT,
    date_created datetime default current_timestamp
);

CREATE TABLE comment_tbl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT,
    user_id INT,
    date_created datetime default current_timestamp,
    content TEXT,
    comment_id INT,
    status_id INT
);

CREATE TABLE account_tbl (
    user_id INT PRIMARY KEY,
    acc_username VARCHAR(50) UNIQUE,
    acc_password VARCHAR(100),
    acc_email VARCHAR(100),
    avarta VARCHAR(255),
    question_secret VARCHAR(255),
    answer_secret VARCHAR(255),
    token VARCHAR(50),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    twitter VARCHAR(255)
);

CREATE TABLE setting_tbl (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tile VARCHAR(50),
    background VARCHAR(50),
    font_size VARCHAR(50),
    is_light BOOLEAN,
    line_height VARCHAR(10),
    gpt_key VARCHAR(255)
);

-- ADD FOREIGN KEY-------------------------------------------------
alter table hashtag_tbl 
add foreign key(status_id) references status_tbl( status_id);

alter table blog_tbl
add foreign key( status_id) references status_tbl( status_id),
add foreign key( user_id) references user_tbl(id);

alter table subject_tbl
add foreign key(status_id) references status_tbl( status_id);

alter table blog_subject_tbl
add foreign key(blog_id) references blog_tbl(blog_id),
add foreign key(subject_id) references subject_tbl(id);

alter table blog_hashtag_tbl
add foreign key(blog_id) references blog_tbl(blog_id),
add foreign key(hashtag_id) references hashtag_tbl(hashtag_id);

alter table task_tbl
add foreign key(status_id) references status_tbl(status_id),
add foreign key(importance_id) references importance_tbl(importance_id),
add foreign key(blog_id) references blog_tbl(blog_id);

alter table list_tbl
add foreign key(status_id)  references status_tbl(status_id),
add foreign key( user_id) references user_tbl(id);

alter table follow_list_tbl
add foreign key(list_id)  references list_tbl(list_id),
add foreign key( user_id) references user_tbl(id);

alter table list_hashtag_tbl
add foreign key(list_id)  references list_tbl(list_id),
add foreign key(hashtag_id) references hashtag_tbl(hashtag_id);

alter table list_blog_tbl
add foreign key(list_id)  references list_tbl(list_id),
add foreign key(blog_id) references blog_tbl(blog_id);

alter table note_tbl
add foreign key(status_id) references status_tbl(status_id),
add foreign key(blog_id) references blog_tbl(blog_id), 
add foreign key(user_id) references user_tbl(id);

alter table noti_tbl
add foreign key(status_id) references status_tbl(status_id),
add foreign key(from_user) references user_tbl(id);

alter table noti_to_user_tbl
add foreign key(user_id) references user_tbl(id),
add foreign key(noti_id) references noti_tbl(noti_id);

alter table user_tbl
add foreign key(status_id) references status_tbl(status_id),
add foreign key(setting_id) references setting_tbl(id);

alter table follow_user_tbl
add foreign key(user_id) references user_tbl(id),
add foreign key(user_follow_id) references user_tbl(id);


alter table hashtag_user_tbl
add foreign key(user_id) references user_tbl(id),
add foreign key(hashtag_id) references hashtag_tbl(hashtag_id);

alter table comment_tbl
add foreign key(blog_id) references blog_tbl(blog_id),
add foreign key(status_id) references status_tbl(status_id),
add foreign key(comment_id) references comment_tbl(id),
add foreign key( user_id) references user_tbl(id);

alter table account_tbl 
add foreign key(user_id) references user_tbl(id);

alter table user_role_tbl
add foreign key(user_id) references user_tbl(id),
add foreign key(role_id) references role_tbl(role_id);


-- INSERT DATA--------------------------------------------
insert into status_tbl(status_title, status_value)
values
('lock', 1),
('unlock', 1),
('pending', 1),
('approved', 1),
('new', 1),
('old', 1),
('private', 0),
('public', 0),
('protected', 0),
('delete', 1);

insert into importance_tbl(importance_title, importance_value)
values 
('nomarl', 1),
('low', 1),
('height', 1),
('importance', 1);

insert into role_tbl(role_title)
values
('ROLE_MEMBER'),
('ROLE_ADMIN'),
('ROLE_USER');


