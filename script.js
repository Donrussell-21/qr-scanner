let html5QrCode = null;


const databaseURL = "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec";



function startScanner() {

    document.getElementById("status").innerHTML =
        "Starting camera...";


    html5QrCode = new Html5Qrcode("reader");


    html5QrCode.start(

        {
            facingMode: "environment"
        },

        {
            fps: 20,
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.0
        },


        function(decodedText) {


            console.log("Scanned ID:", decodedText);



            fetch(databaseURL + "?id=" + decodedText)


            .then(response => response.json())


            .then(student => {


                console.log(student);



                if(student.found){


                    document.getElementById("studentID").innerHTML =
                        student.id;


                    document.getElementById("studentName").innerHTML =
                        student.name;


                    document.getElementById("attendanceStatus").innerHTML =
                        "Present";


                    document.getElementById("scanTime").innerHTML =
                        new Date().toLocaleString();


                    document.getElementById("status").innerHTML =
                        "Attendance Recorded";


                }

                else{


                    document.getElementById("studentID").innerHTML =
                        decodedText;


                    document.getElementById("studentName").innerHTML =
                        "Student Not Found";


                    document.getElementById("attendanceStatus").innerHTML =
                        "Invalid";


                }


            })


            .catch(error => {


                console.log(error);


                document.getElementById("status").innerHTML =
                    "Database Connection Error";


            });



        }


    )

    .catch(error => {


        document.getElementById("status").innerHTML =
            "Camera Error";


    });


}



function stopScanner(){


    if(html5QrCode){


        html5QrCode.stop()

        .then(()=>{


            html5QrCode.clear();


            document.getElementById("status").innerHTML =
                "Scanner stopped";


        });


    }


}
