-- Adminer 4.8.1 PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) dump

\connect "prathomwiky";

DROP TABLE IF EXISTS "admin";
DROP SEQUENCE IF EXISTS admin_adminid_seq;
CREATE SEQUENCE admin_adminid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."admin" (
    "adminid" integer DEFAULT nextval('admin_adminid_seq') NOT NULL,
    "adminname" character varying(100),
    "adminsurname" character varying(100),
    "adminemail" character varying(100),
    "adminpassword" character varying(250),
    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminid")
) WITH (oids = false);

TRUNCATE "admin";

DROP TABLE IF EXISTS "image";
DROP SEQUENCE IF EXISTS image_imageid_seq;
CREATE SEQUENCE image_imageid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."image" (
    "imageid" integer DEFAULT nextval('image_imageid_seq') NOT NULL,
    "imagelink" text,
    "imagename" character varying(250),
    "tagid" integer,
    CONSTRAINT "image_pkey" PRIMARY KEY ("imageid")
) WITH (oids = false);

TRUNCATE "image";

DROP TABLE IF EXISTS "tag";
DROP SEQUENCE IF EXISTS tag_tagid_seq;
CREATE SEQUENCE tag_tagid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."tag" (
    "tagid" integer DEFAULT nextval('tag_tagid_seq') NOT NULL,
    "tagname" character varying(250),
    "tagdetail" character varying(250),
    CONSTRAINT "tag_pkey" PRIMARY KEY ("tagid")
) WITH (oids = false);

TRUNCATE "tag";

DROP TABLE IF EXISTS "typedetail";
DROP SEQUENCE IF EXISTS typedetail_typeid_seq;
CREATE SEQUENCE typedetail_typeid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."typedetail" (
    "typeid" integer DEFAULT nextval('typedetail_typeid_seq') NOT NULL,
    "typedesc" character varying(250),
    CONSTRAINT "typedetail_pkey" PRIMARY KEY ("typeid")
) WITH (oids = false);

TRUNCATE "typedetail";
INSERT INTO "typedetail" ("typeid", "typedesc") VALUES
(1001,	'สื่อนวัตกรรมของชาวขุนยวน'),
(2001,	'สื่อนวัตกรรมที่น่าสนใจในพื้นที่');

DROP TABLE IF EXISTS "video";
DROP SEQUENCE IF EXISTS video_videoid_seq;
CREATE SEQUENCE video_videoid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."video" (
    "videoid" integer DEFAULT nextval('video_videoid_seq') NOT NULL,
    "videoname" character varying(250),
    "videolink" text,
    "videodesc" text,
    "typeid" integer,
    "adminid" integer,
    CONSTRAINT "video_pkey" PRIMARY KEY ("videoid")
) WITH (oids = false);

TRUNCATE "video";

DROP TABLE IF EXISTS "videodetail";
DROP SEQUENCE IF EXISTS videodetail_vdid_seq;
CREATE SEQUENCE videodetail_vdid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."videodetail" (
    "vdid" integer DEFAULT nextval('videodetail_vdid_seq') NOT NULL,
    "videoid" integer,
    "tagid" integer,
    CONSTRAINT "videodetail_pkey" PRIMARY KEY ("vdid")
) WITH (oids = false);

TRUNCATE "videodetail";

ALTER TABLE ONLY "public"."image" ADD CONSTRAINT "image_tagid_fkey" FOREIGN KEY (tagid) REFERENCES tag(tagid) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."video" ADD CONSTRAINT "video_adminid_fkey" FOREIGN KEY (adminid) REFERENCES admin(adminid) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."video" ADD CONSTRAINT "video_typeid_fkey" FOREIGN KEY (typeid) REFERENCES typedetail(typeid) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."videodetail" ADD CONSTRAINT "videodetail_tagid_fkey" FOREIGN KEY (tagid) REFERENCES tag(tagid) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."videodetail" ADD CONSTRAINT "videodetail_videoid_fkey" FOREIGN KEY (videoid) REFERENCES video(videoid) NOT DEFERRABLE;

-- 2023-05-19 14:38:19.19584+00
