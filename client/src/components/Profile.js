/* React */
import React from "react";

/* Translation */
import { useTranslation } from 'react-i18next';

import {useParams} from 'react-router-dom'

/* React - Bootstrap*/
import Container from "react-bootstrap/esm/Container";

function Profile()
{
  const { t } = useTranslation();
  const params = useParams();

  console.log( "Profile::params[\"userid\"]="+params["userid"] )

  return (
    <Container>
      <table className="table table-bordered">
      <tbody>
        <tr className='table-dark'>
          <td className='info'>
            {t("profilePage.title")}
          </td>
        </tr>
        <tr className='table-dark'>
          <td className='info'>
            {t("profilePage.subtitle", { connectedAccountAddr: params["userid"] }  )}
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
  )
}


export { Profile };