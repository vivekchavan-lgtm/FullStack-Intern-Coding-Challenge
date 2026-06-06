// const authorize = (...roles) => {

//   return (req, res, next) => {

//     if (!roles.includes(req.user.role)) {

//       return res.status(403).json({
//         message: "Access Denied"
//       });

//     }

//     next();

//   };

// };


// module.exports = authorize;
const authorize = (role) => {
  return (req, res, next) => {

    console.log("Required Role:", role);
    console.log("User Role:", req.user.role);

    if (req.user.role !== role) {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    next();
  };
};

module.exports = authorize;