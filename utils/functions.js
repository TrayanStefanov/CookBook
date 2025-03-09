/*  Utility functions for the server.
    Currently only contains a generic function to handle server errors.  
    Note: Proper error handling needed.
*/
const handleServerError = (res, error) => {
    console.log(error);
    res.status(500).json({message: "Internal server error"});
};

export {handleServerError};