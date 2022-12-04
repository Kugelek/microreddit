const fillDatabase = (db) => {
  db.query(`INSERT INTO comment (content, parent_comment_id, user_id, post_id) VALUES
  ('Lorem ipsum dolor', NULL, 1, 40),
  ('Class aptent taciti', NULL, 18, 67),
  ('Fusce ac turpis', NULL, 14, 78),
  ('Suspendisse in justo', NULL, 16, 71),
  ('Nulla facilisi.', 5, 6, 40),
  ('Sed pretium blandit', NULL, 6, 20),
  ('Duis sagittis ipsum', NULL, 6, 28),
  ('Proin ut ligula', NULL, 14, 24),
  ('Proin quam.', NULL, 13, 116),
  ('Ut ultrices ultrices', NULL, 14, 69);`);

  db.query(`INSERT INTO post_vote (vote, user_id, post_id) VALUES
(-1, 20, 26),
(1, 20, 5),
(1, 13, 11),
(1, 18, 40),
(1, 15, 24),
(1, 3, 26),
(-1, 9, 31),
(1, 17, 27),
(-1, 16, 39);`);

  db.query(`
INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id) VALUES
('lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. ', 'https://source.unsplash.com/random/200x200?sig=1', NULL, '2021-04-19T10:54:39', 1, 13),
('dolor sit', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. ', 'https://source.unsplash.com/random/200x200?sig=2', NULL, '2021-04-10T15:54:35', 2, 3),
('amet consectetur', 'Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. ', 'https://source.unsplash.com/random/200x200?sig=3', NULL, '2021-03-15T08:46:03', 3, 6),
('adipiscing elit', 'Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. ', 'https://source.unsplash.com/random/200x200?sig=4', NULL, '2021-04-21T20:23:55', 4, 6),
('Integer nec', 'Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. ', 'https://source.unsplash.com/random/200x200?sig=5', NULL, '2021-03-16T22:48:00', 5, 2),
('odio Praesent', 'Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer risus et tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. ', 'https://source.unsplash.com/random/200x200?sig=6', 'https://www.youtube.com/watch?v=_FrOQC-zEog', '2021-02-20T10:41:45', 6, 11);
('libero Sed', 'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. ', 'https://source.unsplash.com/random/200x200?sig=7', NULL, '2021-04-09T21:27:18', 7, 11),
('cursus ante', 'Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. ', 'https://source.unsplash.com/random/200x200?sig=8', NULL, '2021-03-16T09:35:11', 8, 20),
('dapibus diam', 'Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. ', 'https://source.unsplash.com/random/200x200?sig=9', NULL, '2021-05-10T05:12:28', 9, 16);
`);
  db.query(`INSERT INTO reddit_user (nickname, activation_guid, activation_expire_date, password, email) VALUES
('flutherhole', NULL, NULL, 'flutherhole', 'flutherhole@example.com'),
('freezetrace', NULL, NULL, 'freezetrace', 'freezetrace@example.com'),
('ahullcloser', NULL, NULL, 'ahullcloser', 'ahullcloser@example.com'),
('frayjackrabbit', NULL, NULL, 'frayjackrabbit', 'frayjackrabbit@example.com'),
('churchgoerchine', NULL, NULL, 'churchgoerchine', 'churchgoerchine@example.com'),
('shroudslastage', NULL, NULL, 'shroudslastage', 'shroudslastage@example.com'),
('jestannoyance', NULL, NULL, 'jestannoyance', 'jestannoyance@example.com'),
('neighvirtually', NULL, NULL, 'neighvirtually', 'neighvirtually@example.com'),
('absorbedpolice', NULL, NULL, 'absorbedpolice', 'absorbedpolice@example.com');`);
  db.query(`INSERT INTO role (role_name) VALUES ('moderator');
INSERT INTO role (role_name) VALUES ('administrator');
`);
  db.query(`INSERT INTO subreddit_moderator (user_id, subreddit_id) VALUES
(4, 1),
(5, 1),
(17, 10),
(2, 2),
(8, 3),
(9, 4),
(6, 5),
(7, 6),
(6, 7),
(20, 8),
(19, 9);
`);
  db.query(`
INSERT INTO subreddit_user (user_id, subreddit_id) VALUES
(1, 12),
(2, 12),
(1, 13),
(1, 18),
(1, 19),
(1, 2),
(1, 20),
(1, 3),
(1, 4),
(1, 5),
(10, 1),
(10, 10),
(10, 15),
(10, 16);`);

  db.query(`
INSERT INTO subreddit (name, description) VALUES
    ('bohemians', 'Quisque non diam in elit'),
    ('pottery', 'Nulla facilisi. Cras tincidunt mi'),
    ('veterinarians', 'Sed et eleifend neque. Maecenas'),
    ('cheese', 'Suspendisse aliquet massa libero, ac'),
    ('tigers', 'Pellentesque ac tortor ut risus'),
    ('death', 'Aliquam rutrum nulla sem, et'),
    ('jewelry', 'Morbi sed nisi elementum, laoreet'),
    ('earthquake', 'Nullam elementum sodales neque a'),
    ('volleyball', 'Sed mollis scelerisque nulla. Nulla'),
    ('journalism', 'Aenean ullamcorper ligula in sollicitudin');
`);

  db.query(`INSERT INTO user_role (user_id, role_id) VALUES
(4, 1),
(5, 1),
(17, 1),
(2, 1),
(8, 1),
(9, 1),
(6, 1),
(7, 1),
(6, 1),
(20, 1),
(19, 1),
(12, 2),
(13, 2);
`);
};

const fillTest = (db) => {
  db.query(`
  INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id) VALUES
  ('lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. ', 'https://source.unsplash.com/random/200x200?sig=1', NULL, '2021-04-19T10:54:39', 1, 13),
  ('dolor sit', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. ', 'https://source.unsplash.com/random/200x200?sig=2', NULL, '2021-04-10T15:54:35', 12, 28),
  ('amet consectetur', 'Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. ', 'https://source.unsplash.com/random/200x200?sig=3', NULL, '2021-03-15T08:46:03', 13, 6),
  ('adipiscing elit', 'Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. ', 'https://source.unsplash.com/random/200x200?sig=4', NULL, '2021-04-21T20:23:55', 28, 28),
  ('Integer nec', 'Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. ', 'https://source.unsplash.com/random/200x200?sig=5', NULL, '2021-03-16T22:48:00', 12, 28),
  ('odio Praesent', 'Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer risus et tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. ', 'https://source.unsplash.com/random/200x200?sig=6', 'https://www.youtube.com/watch?v=_FrOQC-zEog', '2021-02-20T10:41:45', 6, 11);
 `);
};
module.exports = {
  fillDatabase,
  // fillTest,
};

// db.query(`INSERT INTO user_role (user_id, role_id) VALUES
// (4, 1),
// (5, 1),
// (7, 1),
// (2, 1),
// (8, 1),
// (9, 1),
// (6, 1),
// (7, 1),
// (6, 1),
// `);
