let html5QrCode = null;


function startScanner() {

    function startScanner() {
    alert("Button works!");
}

function stopScanner() {
    alert("Stop works!");
}


function stopScanner(){


    if(html5QrCode){


        html5QrCode.stop()

        .then(()=>{


            html5QrCode.clear();


        })

        .catch(err=>{


            console.log(err);


        });


    }


}



function checkStudent(studentID){


    console.log("Student ID:", studentID);


    // temporary display only
    // connect Google Apps Script here later


}
