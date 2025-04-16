import { Card, Form, Image, ListGroupItem, Button } from "react-bootstrap";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import {Table} from "react-bootstrap";

function AnalysisPage({imageUrl, featureList, feature}){

    console.log(featureList, feature);

    return (
        <div>
            <h5>
                The Image here is preprocessed according to what features we are trying to extract. 
            </h5>
            <Card>
                {!imageUrl && <Alert>No Image Loaded, Go back and load an image!</Alert>}
                {imageUrl &&
                    <>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Card.Title>Original Image</Card.Title>
                                    <Image src={imageUrl} alt={imageUrl} style={{ maxWidth: 300, maxHeight: 300 }}/>
                                </Col>
                                <Col md={6}>
                                    <>
                                        <Card.Title>Preprocessed Image</Card.Title>
                                        <Card.Subtitle className="text-muted">The Preprocessed Image goes here...</Card.Subtitle>
                                    </>
                                </Col>
                            </Row>
                        </Card.Body>
                    </>
                }
                <Card.Footer className="mt-5">
                    <Card.Title>The Features Selected are: </Card.Title>
                    {featureList[feature] ? (
                        <Table className="mt-3">
                        <thead>
                            <tr>
                            <th>Feature</th>
                            <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(featureList[feature]).map(([key, value]) => (
                            <tr key={key}>
                                <td><strong>{key}</strong></td>
                                <td>{typeof value === "number" ? value.toFixed(3) : value}</td>
                            </tr>
                            ))}
                        </tbody>
                        </Table>
                    ) : (
                        <Alert variant="warning">No data available for this feature.</Alert>
                    )}
                </Card.Footer>
            </Card>
            

        </div>
    )
}

export default AnalysisPage;