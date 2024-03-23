export const resolver = {
  hello() {
    return "Hello World!";
  },
  signup: function (req, res) {
    console.log("User Data", req.body);
    return res.status(201).json({ status: "success" });
  },
  signin: function (req, res) {
    console.log("User Data", req.body);
    return res.status(200).json({ status: "success" });
  },
  addBook: function (req, res) {
    console.log("Book Data", req.body);
    return res.status(201).json({ status: "success" });
  },
  books: function (req, res) {
    return res.status(200).json({ status: "success", books: [] });
  },
  book: function (req, res) {
    return res.status(200).json({ status: "success", book: {} });
  },
  updateBook: function (req, res) {
    console.log("Book ID", req.body.id);
    return res.status(200).json({ status: "success" });
  },
  deleteBook: function (req, res) {
    console.log("Book ID", req.body.id);
    return res.status(204).json({ status: "success" });
  },
  users: function (req, res) {
    console.log("Users");
    return res.status(200).json({ status: "success", users: [] });
  },
};
