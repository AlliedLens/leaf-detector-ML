import { Card, Form, Row , Alert, Image, Col, ListGroup, ListGroupItem, Button} from "react-bootstrap";
import { useState } from "react";


function classifyPage({imageUrl, feature, prediction}){
    const [showClassification, setShowClassification] = useState(false);

    const flowerDescriptions = {
        "Bougainvillea": "Bougainvillea is widely cultivated across Tulunadu for its drought resistance and vibrant bracts. It is commonly used for fencing and decorative purposes in both rural and urban areas.",
        "Cleistocalyx_operculatus": "Known locally in parts of Tulunadu as a traditional medicinal plant, Cleistocalyx operculatus is used in folk remedies, particularly for oral health, and thrives in the region’s humid climate.",
        "Cordyline_fruticosa": "Cordyline fruticosa, often planted around Tulunadu homes and temples, is known for its colorful foliage and is used in local rituals and boundary plantings.",
        "Psidium_gauvaja": "Psidium guajava (guava) is commonly grown in Tulunadu home gardens for its edible fruit. It is also used in traditional medicine for treating digestive issues and skin ailments.",
        "Psuderanthemum_carruthersii": "This ornamental shrub is found in shaded gardens throughout Tulunadu, valued for its variegated purple-green foliage and ability to thrive in the region’s moist, shaded environments."
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