import { Card, Form, Image, ListGroupItem, Button } from "react-bootstrap";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

function AnalysisPage({file}){

    const [preview, setPreview] = useState(null);
    const [preproccessPreview, setPreprocessPreview] = useState(null);


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
        <div>
            <h5>
                The Image here is preprocessed according to what features we are trying to extract. 
            </h5>
            <Card>
                {!file && <Alert>No Image Loaded, Go back and load an image!</Alert>}
                {file &&
                    <>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Card.Title>Original Image</Card.Title>
                                    <Image src={preview} alt={preview} style={{ maxWidth: 300, maxHeight: 300 }}/>
                                </Col>
                                <Col md={6}>
                                    {preproccessPreview ? 
                                        <>
                                            <Card.Title>Preprocessed Image</Card.Title>
                                            <Image src={preview} alt={preview} style={{ maxWidth: 300, maxHeight: 300 }}/>
                                        </>
                                        :
                                        <>
                                            <Card.Title>Preprocessed Image</Card.Title>
                                            <Card.Subtitle className="text-muted">No Image has been preprocessed yet...</Card.Subtitle>
                                        </>
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </>
                }
                <Card.Footer className="mt-5">
                    <Card.Title>The Features Selected are: </Card.Title>
                </Card.Footer>


            </Card>
            

        </div>
    )
}

export default AnalysisPage;