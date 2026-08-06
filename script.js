let html5QrCode = null;


function startScanner() {

    document.getElementById("scanMessage").innerHTML =
    "Opening camera...";


    Html5Qrcode.getCameras()
    .then(cameras => {


        if (cameras && cameras.length) {


            // Select first available laptop camera
            let cameraId = cameras[0].id;


            html5QrCode = new Html5Qrcode("reader");


            html5QrCode.start(

                cameraId,

                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },


                qrCodeMessage => {


                    console.log("QR Result:", qrCodeMessage);


                    document.getElementById("scanMessage").innerHTML =

                    `
                    <div class="student-info">

                    <p><strong>QR Code:</strong> ${qrCodeMessage}</p>

                    </div>
                    `;


                    stopScanner();


                    // Send QR ID to Google Script
                    checkStudent(qrCodeMessage);


                },


                errorMessage => {

                    // Ignore scanning errors

                }


            );


        }

        else {


            document.getElementById("scanMessage").innerHTML =
            "No camera detected";


        }


    })


    .catch(err => {


        console.error(err);


        document.getElementById("scanMessage").innerHTML =

        `
        <div class="error">
        Camera Error: ${err}
        </div>
        `;


    });


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
