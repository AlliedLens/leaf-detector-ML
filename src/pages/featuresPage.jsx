import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { useState } from "react";

function FeaturesPage({imageUrl, setFeature, featureList}){

    console.log(featureList);

    const handleRadioClick = (e) => {
        setFeature(e.target.id);
    }
 
    return (
        <div>
            <h5>
                Select the features to extract from the image
            </h5>
            <Card>
                {!imageUrl && <Alert>No Image Loaded, Go back and load an image!</Alert>}
                {imageUrl &&
                    <>

                        <Card.Body>
                            <Row>
                                <Col md={8}>
                                    <Card.Title>Original Image</Card.Title>
                                    <Image src={imageUrl} alt={imageUrl} style={{ maxWidth: 300, maxHeight: 300 }}/>
                                </Col>
                                <Col md={4} className="d-flex flex-column align-items-center justify-content-center">                                
                                    <Form.Group className="mt-3 mr-3" controlId="feature-selector">
                                        <Form.Check 
                                            type='radio'
                                            id='shape'
                                            label='📐 Shape Features'
                                            className="mb-3"
                                            name='feature'
                                            onClick={handleRadioClick}
                                        />
                                        <Form.Check 
                                            type='radio'
                                            id='color'
                                            label='🖌️ Color Features'
                                            className="mb-3"
                                            name='feature'
                                            onClick={handleRadioClick}
                                        />
                                        <Form.Check 
                                            type='radio'
                                            id='texture'
                                            label='🧵 Texture Features'
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