import { Card, Form, Button, Image } from "react-bootstrap";
import { useRef, useState } from "react";


function UploadPage({setFile}){
    const [preview, setPreview] = useState(null);


    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
          setFile(selected);
          
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(selected);
        }
    };
    
    

    return (
        <>
            <div>
                <h6>
                    Capture a clear image of a leaf on a white background.
                </h6>

                <div className="m-3">
                    <Form>
                        <Form.Label>Choose Image: </Form.Label>
                        <Form.Control 
                        type='file'
                        onChange={handleFileChange}
                        ></Form.Control>
                    </Form>
                </div>

                {preview && (
                    <div className="mt-3">
                        <h6>
                            Preview:
                        </h6>
                        <Image src={preview} alt={preview} style={{maxWidth:300 } } />
                    </div>
                )}

            </div>
        </>
    )
}


export default UploadPage;