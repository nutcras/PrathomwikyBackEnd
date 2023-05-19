-- Create the database
CREATE DATABASE prathomwiky;
 
-- Create the admin table
CREATE TABLE admin (
    adminId SERIAL PRIMARY KEY,
    adminName VARCHAR(100),
    adminSurname VARCHAR(100),
    adminEmail VARCHAR(100),
    adminPassword VARCHAR(250)
);

CREATE TABLE typeDetail (
    typeId SERIAL PRIMARY KEY,
    typeDesc VARCHAR(250)
);


-- Create the video table
CREATE TABLE video (
    videoId SERIAL PRIMARY KEY,
    videoName VARCHAR(250),
    videoLink TEXT,
    videoDesc TEXT,
    typeId INTEGER REFERENCES typeDetail(typeId),
    adminId INTEGER REFERENCES admin(adminId)
);

-- Create the tag table
CREATE TABLE tag (
    tagId SERIAL PRIMARY KEY,
    tagName VARCHAR(250),
    tagDetail VARCHAR(250)
);

-- Create the videoDetail table
CREATE TABLE videoDetail (
    vdId SERIAL PRIMARY KEY,
    videoId INTEGER REFERENCES video(videoId),
    tagId INTEGER REFERENCES tag(tagId)
);

-- Create the image table
CREATE TABLE image (
    imageId SERIAL PRIMARY KEY,
    imageLink TEXT,
    imageName VARCHAR(250),
    tagId INTEGER REFERENCES tag(tagId)
);


INSERT INTO typeDetail (typeId, typeDesc) VALUES ('1001','สื่อนวัตกรรมของชาวขุนยวน');
INSERT INTO typeDetail (typeId, typeDesc) VALUES ('2001','สื่อนวัตกรรมที่น่าสนใจในพื้นที่');