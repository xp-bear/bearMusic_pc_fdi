CREATE DATABASE IF NOT EXISTS bear_music DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bear_music;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  psw VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  sex VARCHAR(20) DEFAULT 'female',
  birth DATE NULL,
  phone BIGINT NULL,
  `explain` TEXT NULL,
  img_url VARCHAR(500) DEFAULT 'https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/default_avatar.png',
  signature VARCHAR(255) DEFAULT '该用户很懒,没有写签名!',
  created_at DATETIME NOT NULL,
  INDEX idx_users_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS friends (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  friend_id INT UNSIGNED NOT NULL,
  state TINYINT NOT NULL DEFAULT 0,
  markname VARCHAR(100) NULL,
  time DATETIME NOT NULL,
  last_time DATETIME NOT NULL,
  INDEX idx_friends_user_friend (user_id, friend_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `groups` (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  img_url VARCHAR(500) NULL,
  notice TEXT NULL,
  time DATETIME NOT NULL,
  INDEX idx_groups_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS group_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  group_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NULL,
  tip INT NULL,
  shield TINYINT NULL,
  time DATETIME NOT NULL,
  last_time DATETIME NOT NULL,
  INDEX idx_group_users_group_user (group_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  friend_id INT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  types TINYINT NOT NULL DEFAULT 0,
  state TINYINT NOT NULL DEFAULT 1,
  time DATETIME NOT NULL,
  INDEX idx_messages_user_friend (user_id, friend_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
