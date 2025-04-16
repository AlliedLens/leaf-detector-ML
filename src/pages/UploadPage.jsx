import { Card, Form, Button, Image, Spinner } from "react-bootstrap";
import { useRef, useState } from "react";
import axios from "axios";



function UploadPage({imageUrl, setImageUrl, setPrediction}){
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    };
  
    const handleUpload = async (e) => {
      e.preventDefault();
      if (!selectedFile) return;
  
      setIsLoading(true);
      setStatus('');
  
      const formData = new FormData();
      formData.append('image', selectedFile);
  
      try {
        const response = await axios.post(
          'http://localhost:8000/uploadImage/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        setImageUrl(response.data.image_url);
        setPrediction(response.data.prediction);
        console.log(response.data.prediction)
  
        setStatus({
          variant: 'success',
          message: 'Image uploaded successfully!',
          imageUrl: response.data.image,
        });
      } catch (error) {
        setStatus({
          variant: 'danger',
          message: error.response?.data?.detail || 'Upload failed',
        });
      } finally {
        setIsLoading(false);
      }
    };


    return (
        <>
            <div>
                <h6>
                    Capture a clear image of a leaf on a white background.
                </h6>

                <div className="m-3">
                    <Form onSubmit={handleUpload}>
                        <Form.Label>Choose Image: </Form.Label>
                        <Form.Control 
                        type='file'
                        onChange={handleFileChange}
                        ></Form.Control>
                        { previewUrl && (
                            <div className="mt-3">
                                <Image src={previewUrl} alt={previewUrl} style={{maxWidth:300}} />
                            </div>
                        )}


                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!selectedFile || isLoading}
                            className="mt-4"
                            >
                            {isLoading ? (
                                <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Uploading...
                                </>
                            ) : (
                                'Upload Image'
                            )}
                        </Button>
                    </Form>
                </div>


            </div>
        </>
    )
}


export default UploadPage;