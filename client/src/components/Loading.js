/* React - Bootstrap*/
import { Container, Col, Row } from 'react-bootstrap';

/* Icônes */
import { Clock } from 'react-bootstrap-icons';

const Loading = ( /* {  } */ ) =>
{
   return (
    <Container fluid expand="lg">
      <Row style={{backgroundColor: 'rgba(53, 112, 238, 0.829)'}}>
        <Col xs lg="12" style={{ height: '90px'}}>
        Loading ... <Clock style={{verticalAlign: '-10%'}}/>
        </Col>
      </Row>
  </Container>


  ); // render
    
} // Toolbar

export default Loading ;