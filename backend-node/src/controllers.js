exports.testApi = (req,res) =>{
    res.json({
        message: "Backend route working",
        status: "success"
    });
};

exports.backendUp = (req,res) => {
    res.json({
        message :"Backend Up",
        status: "success"
    })
}