$(document).ready(function () {
    const video = document.getElementById('videoInput');
    $( "#videoInput" ).hide();
    $( "#acceso" ).hide();
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models') 
    ]).then(start)

    function getLabels(){return ['Sebastian','Cris Holzer'];}
    function start() {
        var strea =navigator.getUserMedia(
            { 
                audio: false,video:{} 
            },
            stream => video.srcObject = stream,
            err => console.error(err)
        )

        recognizeFaces(strea);
    }
//evento click
    $("#login").click(function() {
        $( "#videoInput" ).show( 200 );
        $( "#login").hide();
    });

    async function recognizeFaces(strea) {
    
        const labeledDescriptors = await loadLabeledImages()
        const labels = getLabels();
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)
    
        video.addEventListener('play', async () => {
            
            const canvas = faceapi.createCanvasFromMedia(video)
    
            const displaySize = { width: video.width, height: video.height }
    
            setInterval(
                async () => 
                {
                    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
                    const resizedDetections = faceapi.resizeResults(detections, displaySize)
                    if(detections.length != 0)
                    {
                        const results = resizedDetections.map((d) => 
                        {
                            return faceMatcher.findBestMatch(d.descriptor)
                        }) 
                        results.forEach( (result, i) => 
                        {
                            const box = resizedDetections[i].detection.box
                            if(result.distance>0.5){
                            labels.forEach((text,i) =>
                                {
                                    if(text === result.label)
                                    {
                                        mensajeBienvenido(text,strea);return;
                                    }
                                }
                            )

                            }//porcentaje mayor a 50%
                        }) 
                    
                    }
                     
                }, 100)//fin setInterval
        })
    }

    function mensajeBienvenido(usuario,strea)
    {
        $( "#videoInput").hide();
        
        $( "#acceso").show( 200 );
        $( "span" ).text(function( index ) {
            return "Nombre del usuario: " + ( usuario );
          });
        video.srcObject=null;
          
         
    }

    function loadLabeledImages() {
        const labels = getLabels();// del disco
        return Promise.all(
            labels.map(async (label)=>{
                const descriptions = []
                for(let i=1; i<=2; i++) {
                    const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                    descriptions.push(detections.descriptor)
                }

                return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
        )
    }

});


