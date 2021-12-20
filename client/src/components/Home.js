/* React */
import React from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

/* React - Bootstrap*/
import Container from "react-bootstrap/esm/Container";

function Home()
{
  const { t } = useTranslation();
return (
    <Container>
      <table className="table table-bordered table-dark">
      <tbody>
        <tr className='table-dark'>
          <td className='info'>
            {t("homePage.welcome")}
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
  )
}


export { Home };