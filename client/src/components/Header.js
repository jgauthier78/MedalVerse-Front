/* React */
import React from "react";

/* Traduction */
import { useTranslation } from 'react-i18next';
// Changement de langue
import i18n from '../js/i18n';

/* React - Bootstrap*/
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

/* Icônes */
import { Flag, FlagFill } from 'react-bootstrap-icons';

const Toolbar = ( { owner, connectedAccountAddr } ) =>
{
  const { t } = useTranslation();
  const changeLanguage = (lng) =>
    {
      i18n.changeLanguage(lng);
    }

  return (

    <Table className="table table-dark table-sm-10">
      <thead className="table-dark">
        <tr>
          <th scope="col" className="text-left">
          <Button onClick={() => changeLanguage('fr-FR')} variant="primary" size="sm" > <FlagFill size={14} /> Fr </Button>
              <Button onClick={() => changeLanguage('en')} variant="danger" size="sm" > <Flag size={14} /> En </Button>
          </th>
          <th scope="col" className="text-left ">
          </th>
        </tr>
      </thead>
      <tbody >
        <tr>
          <td className="text-secondary">
            <p className={(connectedAccountAddr===owner?"text-warning":"text-info")+" fw-bold"}>{t("account.address")} <small>{connectedAccountAddr}</small></p>
          </td>
          <td className="text-secondary">
            <p className={"text-warning"+(connectedAccountAddr===owner?" fw-bold":"")}><small>{t("simpleStorageContract.owner")}</small> <small>{owner}</small></p>
          </td>
      </tr>

    </tbody>
  </Table>


  ); // render

} // Toolbar

export { Toolbar };