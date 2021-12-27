import { ROLES } from "../../utils/roles_CONSTS"
import { t } from "i18next";

const expandRoles = (role) => {
    let roles = [];
    if ( role & ROLES.ROLE_ORGANIZER ) {
        roles.push(ROLES.ROLE_ORGANIZER)
    }
    if ( role & ROLES.ROLE_ATHLETE ) {
        roles.push(ROLES.ROLE_ATHLETE)
    }
    if ( role & ROLES.ROLE_AUTHOR ) {
        roles.push(ROLES.ROLE_AUTHOR)
    }
    return roles
}

const roleName = (role /*, t*/) => {
    switch (role) {
        case ROLES.ROLE_ORGANIZER:
            return t("profileBandeau.roles.organizer");
        case ROLES.ROLE_ATHLETE:
            return t("profileBandeau.roles.athlete");
        case ROLES.ROLE_AUTHOR:
            return t("profileBandeau.roles.author");
        default:
            return "";
    }
}

const formatDisplayRoles = (roles) => {
    return roles.map( profil => roleName(profil) ).reduce( (r, a) => r.concat(a, ", "), [", "]).slice(1, -1)
}

const displayRoles = (role) => {
    return formatDisplayRoles( expandRoles(role) )
}


export {displayRoles};