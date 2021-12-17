/* React */
import React from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

/* React - Bootstrap*/
import Container from "react-bootstrap/esm/Container";

function Web3Loader()
{
  const { t } = useTranslation();
return (
    <Container>
      <table className="table table-bordered">
      <tbody>
        <tr className='table-info'>
          <td className='info'>
            {t("Web3.loading")}
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
  )
}


export { Web3Loader };