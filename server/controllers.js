const bcrypt = require("bcrypt");
const pool = require("./dataBase/index");
const { endPool, startPool } = require("./dataBase/index");

//important query SELECT * FROM replies RIGHT JOIN accounts ON accounts.id = replies.accounts_id RIGHT JOIN tweets ON tweets.id = replies.tweets_id

//                ALL USER RELATED
async function getAllUsers(req, res) {
  const db = await startPool();
  const query = `SELECT * FROM accounts;`;
  try {
    const results = await db.query(query);
    res.send(results.rows);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}

async function getOneUser(req, res) {
  let { id } = req.body;
  const query = `SELECT * FROM accounts WHERE id = ${id}`;
  const db = await startPool();
  console.log("-----------------" + db);
  try {
    const results = await db.query(query);
    res.send(results.rows);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}

async function getOneUserByEmail(req, res) {
  const db = await startPool();
  let { email } = req.body;
  console.log(email);
  console.log(req.body);
  const query = `SELECT * FROM accounts WHERE email = '${email}'`;

  try {
    const results = await db.query(query);
    res.send(results.rows);
    pool.end();
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}

async function register(req, res) {
  const db = await startPool();
  let { first_name, last_name, email, password, username, bio, location } =
    req.body;

  bcrypt.hash(password, 10).then((hash) => {
    password = hash;
    db.query(
      `INSERT INTO accounts (first_name, last_name , email, password, username, bio, location) VALUES ('${first_name}','${last_name}','${email}','${password}','${username}','${bio}','${location}');`
    )
      .then(() => {
        res.status(200).send("Account created");
        endPool(db);
      })
      .catch((err) => {
        console.log(err);
        endPool(db);

        return res.status(400);
      });
  });
}

async function login(req, res) {
  const db = await startPool();
  let { email, password } = req.body;
  const queryForUser = `SELECT * FROM accounts WHERE email = '${email}';`;

  try {
    const results = await db.query(queryForUser);
    let user = results.rows[0];
    endPool(db);
    if (!user) {
      endPool(db);
      return res.send(false);
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      console.log("passwords dont match");
      endPool(db);
      return res.send(false);
    }

    res.json({
      user: user,
      status: true,
    });
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
  }
}

async function deleteUser(req, res) {
  const db = await startPool();
  const { id } = req.body;
  const query = `DELETE FROM accounts WHERE id = ${id};`;

  try {
    const results = await db.query(query);
    res.status(200).send(`Deleted account with id of ${id}`);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}

//                          ALL TWEET RELATED
async function createTweet(req, res) {
  const db = await startPool();
  const { tweet, id } = req.body;
  const query = `INSERT INTO tweets (content, accounts_id) VALUES ('${tweet}', ${id});`;
  try {
    const results = await db.query(query);
    res.status(200).send("Tweet was created succesfully");
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}

async function findAllTweetsFromOneUser(req, res) {
  const db = await startPool();
  const { id } = req.body;
  const query = `SELECT content, created_at FROM tweets WHERE accounts_id = ${id};`;

  try {
    const results = await db.query(query);
    res.status(200).send(results);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}



//                            Follow or Following status
async function findFollowers(req, res) {
  const db = await startPool();
  const { following } = req.body;
  const query = `SELECT * FROM relationship WHERE following = ${following};`;
  console.log()

  try {
    const results = await db.query(query);
    res.status(200).send(results);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}

async function findFollowing(req, res) {
  const db = await startPool();
  const { follower } = req.body;
  const query = `SELECT * FROM relationship WHERE follower = ${follower};`;

  try {
    const results = await db.query(query);
    res.status(200).send(results);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}

async function findAllRelationshipStatus(req,res){
  const db = await startPool();
  const {follower, following} = req.body;
  const query = `SELECT * FROM relationship WHERE follower = ${follower} or following = ${following};`;

  try{
   const results = await db.query(query);
   res.status(200).send(results);
   endPool(db);
  }catch(e){
    res.status(400).send(false);
    endPool(db);
  }
}

async function followAnotherUser(req, res) {
  const db = await startPool();
  const { follower, following } = req.body;
  const query = `INSERT INTO relationship (follower, following) VALUES (${follower}, ${following});`;

  try {
    const results = await db.query(query);
    res.status(200).send(true);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}

async function unFollowAnotherUser(req, res) {
  const db = await startPool();
  const { follower, following } = req.body;
  const query = `DELETE FROM relationship WHERE follower = ${follower} AND following = ${following};`;

  try {
    const result = await db.query(query);
    res.status(200).send(true);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}

async function checkFollowStatus(req, res) {
  const db = await startPool();
  const { follower, following } = req.body;
  const query = `SELECT * FROM relationship WHERE follower = ${follower} AND following = ${following};`;

  try {
    const results = await db.query(query);
    const followStatus = results.rows.length > 0
    res.status(200).send(followStatus)
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}
//                                  Likes Queries
async function likeATweet(req,res){
  const db = await startPool();
  const {accounts_id, tweets_id} = req.body;
  const query = `INSERT INTO likes (accounts_id, tweets_id) VALUES(${accounts_id}, ${tweets_id});`;

  try{
    result = await db.query(query);
    res.status(200).send(result);
    endPool(db);
  }catch(e){
    res.status(400).send(false);
    console.error(e.stack);
    endPool(db);
  }
}

async function removeLike(req,res){
  const db = await startPool();
  const {accounts_id, tweets_id} = req.body;
  const query = `DELETE FROM likes WHERE accounts_id = ${accounts_id} AND tweets_id = ${tweets_id};`;

  try{
    const result = await db.query(query);
    res.status(200).send(true);
    endPool(db);
  }catch(e){
    res.status(400).send(true);
    console.error(e.stack)
    endPool(db);
  }
}
//                                  Comments Queries
//                                  Retweet Queries
//                                  JOIN QUERIES
async function selectAllFollowersAndTheirAccounts(req,res){
  const db = await startPool();
  const {following} = req.body;
  const query = `SELECT * FROM relationship LEFT JOIN accounts ON relationship.follower = accounts.id WHERE following = ${following};`;

  try{
    const results = await  db.query(query);
    res.status(200).send(results);
    endPool(db);
  }catch(e){
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}

async function selectAllFollowingAndTheirAccounts(req,res){
  const db = await startPool();
  const {follower} = req.body;
  const query = `SELECT * FROM relationship LEFT JOIN accounts ON relationship.following = accounts.id WHERE follower = ${follower};`;

  try{
    const results = await  db.query(query);
    res.status(200).send(results);
    endPool(db);
  }catch(e){
    console.error(e.stack);
    res.status(400).send(false);
    endPool(db);
  }
}

async function findAllTweetsFromFollowing(req,res){
  const db = await startPool();
  const { id } = req.body;
  const queryToGetFollowingIds = `SELECT following FROM relationship WHERE follower = ${id};`
  
  try {
    const resultOfIds = await db.query(queryToGetFollowingIds);
    const idArr = resultOfIds.rows.map((followingObject)=> followingObject.following)
    const queryToGetAllTweets = `SELECT tweets.id , tweets.content , tweets.created_at, tweets.accounts_id, accounts.first_name, accounts.last_name , accounts.username FROM tweets LEFT JOIN accounts ON accounts.id = tweets.accounts_id WHERE accounts_id = ANY(ARRAY[${idArr}]);`;
    
    const resultsOfTweets = await db.query(queryToGetAllTweets);
    const tweetIDArr = resultsOfTweets.rows.map(tweetOBJ=> tweetOBJ.id)

    const queryForLikes = `SELECT * FROM likes WHERE tweets_id = ANY(ARRAY[${tweetIDArr}]);`;
    const resultsOfLikes = await db.query(queryForLikes);

    const finalResult = {
      tweets : resultsOfTweets.rows,
      likes : resultsOfLikes.rows
    }

    res.status(200).send(finalResult);
    endPool(db);
  } catch (e) {
    console.error(e.stack);
    res.status(400);
    endPool(db);
  }
}

module.exports = {
  getAllUsers,
  getOneUser,
  register,
  login,
  deleteUser,
  getOneUserByEmail,
  createTweet,
  findAllTweetsFromOneUser,
  followAnotherUser,
  unFollowAnotherUser,
  findFollowers,
  findFollowing,
  checkFollowStatus,
  findAllRelationshipStatus,
  selectAllFollowersAndTheirAccounts,
  selectAllFollowingAndTheirAccounts,
  findAllTweetsFromFollowing,
  likeATweet,
  removeLike,
};