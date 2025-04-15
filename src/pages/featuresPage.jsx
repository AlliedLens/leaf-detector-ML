import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { useState } from "react";

function FeaturesPage({file, setFile}){

    const [preview, setPreview] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);


    const handleFileChange = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRadioClick = (e) => {
        setSelectedFeature(e.target.value);

        console.log('sending feature data to backend');
    }

    handleFileChange(file);

    
    return (
        <div>
            <h5>
                Select the features to extract from the image
            </h5>
            <Card>
                {!file && <Alert>No Image Loaded, Go back and load an image!</Alert>}
                {file &&
                    <>

                        <Card.Body>
                            <Row>
                                <Col md={8}>
                                    <Card.Title>Original Image</Card.Title>
                                    <Image src={preview} alt={preview} style={{ maxWidth: 300, maxHeight: 300 }}/>
                                </Col>
                                <Col md={4} className="d-flex flex-column align-items-center justify-content-center">                                
                                    <Form.Group className="mt-3 mr-3" controlId="feature-selector">
                                        <Form.Check 
                                            type='radio'
                                            id='Shape Features'
                                            label='Shape features'
                                            className="mb-3"
                                            name='feature'
                                            onClick={handleRadioClick}
                                        />
                                        <Form.Check 
                                            type='radio'
                                            id='Color Features'
                                            label='Color features'
                                            className="mb-3"
                                            name='feature'
                                            onClick={handleRadioClick}
                                        />
                                        <Form.Check 
                                            type='radio'
                                            id='Texture Features'
                                            label='Texture features'
                                            className="mb-3"
                                            name='feature'
                                            onClick={handleRadioClick}
                                        />
                                    </Form.Group>

                                </Col>
                            </Row>
                        </Card.Body>
                    </>
                }
            </Card>
            

        </div>

    )
}

export default FeaturesPage;