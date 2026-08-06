let html5QrCode;

function startScanner() {

    document.getElementById("scanMessage").innerHTML =
        "Starting camera...";


    html5QrCode = new Html5Qrcode("reader");


    const config = {
        fps: 10,
        qrbox: {
            width: 250,
            height: 250
        }
    };


    html5QrCode.start(

        {
            facingMode: "environment"
        },

        config,


        qrCodeMessage => {

            console.log("QR Code:", qrCodeMessage);


            document.getElementById("scanMessage").innerHTML =
            `
            <div class="student-info">
                <p><strong>QR Data:</strong> ${qrCodeMessage}</p>
            </div>
            `;


            // Stop scanner after successful scan
            stopScanner();


            // Send QR ID to Google Apps Script
            checkStudent(qrCodeMessage);

        },


        errorMessage => {

            // Ignore continuous scan errors

        }

    )

    .catch(err => {

        console.error(err);

        document.getElementById("scanMessage").innerHTML =
        `
        <div class="error">
        Camera error: ${err}
        </div>
        `;

    });

}



function stopScanner() {


    if(html5QrCode){

        html5QrCode.stop()

        .then(() => {

            html5QrCode.clear();

            console.log("Scanner stopped");

        })

        .catch(err => {

            console.log(err);

        });

    }

}




function checkStudent(studentID){


    const url =
    "YOUR_GOOGLE_SCRIPT_WEB_APP_URL?id="
    + encodeURIComponent(studentID);



    fetch(url)

    .then(response => response.json())

    .then(data => {


        console.log(data);


        if(data.found){


            document.getElementById("scanMessage").innerHTML =

            `
            <div class="student-info">

            <p><strong>Name:</strong> ${data.name}</p>

            <p><strong>ID:</strong> ${data.id}</p>

            <p class="success">
            Attendance Recorded
            </p>

            </div>
            `;


        }

        else {


            document.getElementById("scanMessage").innerHTML =

            `
            <div class="error">

            Student ID not found

            </div>
            `;


        }


    })


    .catch(error=>{

        console.error(error);

    });


}
