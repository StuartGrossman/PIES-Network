///EXAMPLE TO FOLLOW!
//////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var updateBillRef = db.ref('firebase-queue/bill-queue/'); //state the refernce with good var name, make sure your url is not already being used!
var updateBillQueue = new Queue(updateBillRef,  function(data, progress, resolve, reject){
///// STATE THE RULES
  //UPDATE Bill QUEUE RULES
    // User must be authenticated
    // title must be at least 20 charecters no more than 80
    // discription must be at least 30 charecters no more than 500
    // body must be at least 100 charecters no more than 5000
  db.
  db.billRef().update(data.bill).than(function(){
    resolve("Bill Updated");
  });
})
