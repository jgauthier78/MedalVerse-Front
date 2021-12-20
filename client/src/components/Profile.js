/* React */
import React from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

/* React - Bootstrap*/
import Container from "react-bootstrap/esm/Container";

function Profile()
{
  const { t } = useTranslation();
return (
    <Container>
      <table className="table table-bordered">
      <tbody>
        <tr className='table-dark'>
          <td className='info'>
            {t("profilePage.title")}
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
  )
}


export { Profile };