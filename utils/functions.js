const handleServerError = (res, error) => {
    console.log(error);
    res.status(500).json({message: "Internal server error"});
};

export {handleServerError};