/* React */
import React from "react";

/* React - Bootstrap*/
import Container from "react-bootstrap/esm/Container";

/* Icônes */
import { Clock } from 'react-bootstrap-icons';

const Loading = ( /* {  } */ ) =>
{
   return (
    <Container>
      <table className="table table-bordered">
      <tbody>
        <tr className='table-info'>
          <td className='info'>
          Loading ... <Clock style={{verticalAlign: '-10%'}}/>
          </td>
        </tr>
      </tbody>
    </table>
  </Container>


  ); // render

} // Toolbar

export default Loading ;