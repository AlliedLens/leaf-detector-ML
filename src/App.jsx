import { Component, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Card, Container, Form, Button,  ButtonGroup, ModalFooter } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';

import classifyPage from './pages/classifyPage'
import AnalysisPage from './pages/analysisPage'
import UploadPage from './pages/UploadPage'
import FeaturesPage from './pages/featuresPage'

function App() {
  const [pageCount, setPageCount] = useState(0);
  const [file, setFile] = useState(null);
  const [feature, setFeature] = useState(null);
  const [featureList, setFeatureList] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [imageUrl, setImageUrl] = useState();


  const pages = [
    {name : 'Upload', component:UploadPage},
    {name : 'Features', component:FeaturesPage},
    {name : 'Analysis', component:AnalysisPage},
    {name: 'Classify', component:classifyPage},
  ];

  const goNextPage = () => {
    setPageCount(Math.min(pageCount+1, pages.length - 1));
  }

  const goPrevPage = () =>{
    setPageCount(Math.max(pageCount-1, 0));
  }

  function goToPage (index){
    setPageCount(index);
  }

  const CurrPage = pages[pageCount].component;

  const pageButtons = pages.map((step, index)=>{
    // console.log(`${step.name}`);
    return (
      <Button key={step.name} variant= {(index == pageCount) ? 'secondary' : 'primary'} onClick={() => goToPage(index)} >
        {step.name}
      </Button>
    );
  });

  return (
    <Container className="mt-5" data-bs-theme="dark">
      <h1>🍃 Tulunadu Leaf Classification 🍃</h1>
      <Card>
        <Card.Header>
          <Card.Title>Tulunadu hosts diverse tropical and medicinal flora, enriched by its coastal and Western Ghats ecosystems.</Card.Title>
          <Card.Subtitle>Upload a leaf image, select features, preprocess, analyze, and classify. </Card.Subtitle>

          <ButtonGroup className='mt-5'>
            {pageButtons}
          </ButtonGroup>

        </Card.Header>

        <Card.Body>
          

          <CurrPage imageUrl={imageUrl} setImageUrl={setImageUrl}  
          prediction={prediction} setPrediction={setPrediction} 
          feature={feature} setFeature={setFeature}
          featureList={featureList} setFeatureList={setFeatureList}
          />


        </Card.Body>

        <Card.Footer>
          <ButtonGroup className='d-flex justify-space-around'>
            <Button onClick={()=>{goPrevPage()}}>⬅️</Button>
            <Button onClick={()=>{goNextPage()}}>➡️</Button>
          </ButtonGroup>
        </Card.Footer>

      </Card>

    </Container>
  )
}

export default App;
