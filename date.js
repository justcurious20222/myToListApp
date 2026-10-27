

const date = function () {
    const date = new Date();
    const options = {
      day : "numeric", 
      weekday : "long", 
      month : "long", 
      year : "numeric"
    }; 
    return   date.toLocaleDateString("en-GB", options); 
}
module.exports.getDate = date; 
