import { Card, Form, Row , Alert, Image, Col, ListGroup, ListGroupItem, Button} from "react-bootstrap";
import { useState } from "react";


function classifyPage({file}){
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

    handleFileChange(file);



    return (
        <>
            <div>
                <h5>
                    This system uses a rule-based approach to classify leaves based on the extracted features. 
                </h5>
                <Card>
                {!file && <Alert>No Image Loaded, Go back and load an image!</Alert>}
                {file &&
                    <>
                        <Card.Subtitle className="text-muted">The classification rules analyze shape, color, and texture characteristics to determine the most likely leaf type.</Card.Subtitle>
                        <Card.Body>
                            <Row>
                                <Col md={6} >
                                    <Card.Title><b>Original Image</b></Card.Title>
                                    <Image src={preview} alt={preview} style={{ maxWidth: 300, maxHeight: 300 }}/>

                                </Col>
                                <Col md={6}>
                                    <Card.Title><b>Classification Rules</b></Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>🍃 Shape analysis (aspect ratio, circularity, solidity)</ListGroup.Item>
                                        <ListGroup.Item>🎨 Color distribution (hue, saturation, brightness)</ListGroup.Item>
                                        <ListGroup.Item>🧵 Texture patterns (contrast, homogeneity, entropy)</ListGroup.Item>
                                        <ListGroup.Item>🌿 Vein structure (density, orientation)</ListGroup.Item>
                                    </ListGroup>
                                </Col>                            
                            </Row>
                            <Row className="d-flex justify-content-center mt-5">
                                <Button className="m-5" variant="success">Classify Leaf</Button>
                            </Row>
                        </Card.Body>

                        <Card.Footer>
                            <Card.Subtitle className="the classified leaf is: "></Card.Subtitle>
                        </Card.Footer>
                        
                    </>
                }

                </Card>

                
            </div>
        </>
    )
}

export default classifyPage;