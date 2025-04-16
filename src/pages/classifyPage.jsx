import { Card, Form, Row , Alert, Image, Col, ListGroup, ListGroupItem, Button} from "react-bootstrap";
import { useState } from "react";


function classifyPage({imageUrl, feature, prediction}){
    const [showClassification, setShowClassification] = useState(false);

    const flowerDescriptions = {
        "Bougainvillea": "A vibrant ornamental plant known for its papery, colorful bracts that surround tiny white flowers, often seen cascading over fences in tropical climates.",
        "Cleistocalyx_operculatus": "A dense shrub with glossy green leaves and small white flowers, traditionally used in herbal remedies and favored for its aromatic foliage.",
        "Cordyline_fruticosa": "An eye-catching tropical plant with striking, colorful leaves in shades of red, pink, and green, often used in landscaping and cultural ceremonies.",
        "Psidium_gauvaja": "Commonly known as guava, this plant bears fragrant white flowers and sweet, edible fruit, popular in both gardens and kitchens around the world.",
        "Psuderanthemum_carruthersii": "A low-growing shrub with bold, variegated foliage and purple-toned leaves, appreciated for its decorative appeal in shaded garden areas."
    };
    
    console.log(prediction[feature]);

    const onSubmit = () => {
        setShowClassification(true);  
        
    }

    return (
        <>
            <div>
                <h5>
                    This system uses a rule-based approach to classify leaves based on the extracted features. 
                </h5>
                <Card>
                {!imageUrl && <Alert>No Image Loaded, Go back and load an image!</Alert>}
                {imageUrl &&
                    <>
                        <Card.Subtitle className="text-muted">The classification rules analyze shape, color, and texture characteristics to determine the most likely leaf type.</Card.Subtitle>
                        <Card.Body>
                            <Row>
                                <Col md={6} >
                                    <Card.Title><b>Original Image</b></Card.Title>
                                    <Image src={imageUrl} alt={imageUrl} style={{ maxWidth: 300, maxHeight: 300 }}/>

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
                                <Button className="m-5" variant="success" onClick={onSubmit}>Classify Leaf</Button>
                            </Row>
                        </Card.Body>

                        {
                            showClassification && 
                            <>
                                <Card.Footer>
                                    <Card.Title className="mb-3">🌸 Classified Leaf: {prediction[feature]}</Card.Title>
                                    <Card className="text-center">
                                        <Card.Img 
                                            variant="top" 
                                            src={`src/assets/${prediction[feature]}.jpeg`} 
                                            alt={prediction[feature]} 
                                            style={{ maxHeight: '300px', objectFit: 'contain' }} 
                                        />
                                        <Card.Body>
                                            <Card.Title>{prediction[feature]}</Card.Title>
                                            <Card.Text>
                                                {flowerDescriptions[prediction[feature]] || "No description available for this flower."}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Card.Footer>
                            </>
                        }
                    </>
                }

                </Card>

                
            </div>
        </>
    )
}

export default classifyPage;