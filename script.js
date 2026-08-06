let html5QrCode = null;

const databaseURL = "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec";

function startScanner() {

    document.getElementById("status").innerHTML = "Starting camera...";

    if (html5QrCode === null) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(
        {
            facingMode: "environment"
        },
        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            }
        },

        // QR Scan Success
        function (decodedText) {

            document.getElementById("status").innerHTML = "Checking database...";

            fetch(databaseURL + "?id=" + encodeURIComponent(decodedText))

                .then(function(response){

                    if(!response.ok){
                        throw new Error("Server Error");
                    }

                    return response.json();

                })

                .then(function(student){

                    console.log(student);

                    if(student.found){

                        document.getElementById("studentID").innerHTML = student.id;
                        document.getElementById("studentName").innerHTML = student.name;
                        document.getElementById("studentGrade").innerHTML = student.grade;
                        document.getElementById("attendanceStatus").innerHTML = "Present";
                        document.getElementById("scanTime").innerHTML = new Date().toLocaleString();

                        document.getElementById("status").innerHTML = "Attendance Recorded Successfully";

                        document.getElementById("resultCard").style.display = "block";

                    }else{

                        document.getElementById("studentID").innerHTML = decodedText;
                        document.getElementById("studentName").innerHTML = "Student Not Found";
                        document.getElementById("studentGrade").innerHTML = "-";
                        document.getElementById("attendanceStatus").innerHTML = "Invalid";
                        document.getElementById("scanTime").innerHTML = "";

                        document.getElementById("status").innerHTML = "Student Not Found";

                        document.getElementById("resultCard").style.display = "block";

                    }

                })

                .catch(function(error){

                    console.error(error);

                    document.getElementById("status").innerHTML = "Database Connection Error";

                });

        },

        // Ignore scan errors
        function(errorMessage){
            // Ignore
        }

    ).catch(function(error){

        console.error(error);

        document.getElementById("status").innerHTML = "Camera Error";

    });

}

        },

        // Ignore scan errors
        function (errorMessage) {
            // console.log(errorMessage);
        }

    ).catch(function (error) {

        console.error(error);

        document.getElementById("status").innerHTML = "Camera Error";

    });

}

function stopScanner() {

    if (html5QrCode) {

        html5QrCode.stop()
            .then(function () {

                html5QrCode.clear();

                document.getElementById("status").innerHTML = "Scanner Stopped";

            })
            .catch(function (err) {

                console.log(err);

            });

    }

}
