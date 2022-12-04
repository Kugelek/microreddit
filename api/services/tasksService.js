exports.getTasks = async (client, req, res) => {
  console.log("client", client);
  const todos = await client.query("select * from todoposts");
  return res.send(todos.rows);
};

exports.addTask = async (client, req, res) => {
  // const io = req.app.get("socketio");
  const id = await client.query(
    "insert into todoposts( content, isdone) values ($1, $2) RETURNING ID",
    [req.body.content, req.body.isDone]
  );

  const todoCandidate = await client.query(
    "select * from todoposts where id = $1",
    [id.rows[0].id]
  );
  //   io.emit("postAdded", todoCandidate.rows[0]);
  return res.send(todoCandidate.rows[0]);
};

exports.updateTask = async (client, req, res) => {
  console.log(req.params.id);
  await client.query("update todoposts set content = $1 where id = $2", [
    req.body.content,
    req.params.id,
  ]);
  const editedTodo = await client.query(
    "select * from todoposts where id = $1",
    [req.params.id]
  );
  //   io.emit("postEdited", editedTodo.rows[0]);
  return res.send(editedTodo.rows[0]);
};

// app.put("/todo/:id/state", async (req, res) => {
//   await client.query("update todoposts set isdone = $1 where id = $2", [
//     req.body.isDone,
//     req.params.id,
//   ]);
//   const editedTodo = await client.query(
//     "select * from todoposts where id = $1",
//     [req.params.id]
//   );
//   return res.send(editedTodo.rows[0]);
// });

exports.deleteTask = async (client, req, res) => {
  const deletedTodo = await client.query(
    "select * from todoposts where id = $1",
    [req.params.id]
  );
  if (!deletedTodo.rows[0]) return res.status(404).send("Brak zadania todo");

  await client.query("delete from todoposts where id = $1", [req.params.id]);
  //   io.emit("postDeleted", deletedTodo.rows[0]);
  return res.status(200).send("Usunieto");
};
