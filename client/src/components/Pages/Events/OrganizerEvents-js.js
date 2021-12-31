const extractOrganizerEventsFromProfile = (organizerProfile) => {
     return extractOrganizerEventsFromUserOrganizations(organizerProfile.userOrganizations)
}
// Browse User Organizations, Organization events : return all events
const extractOrganizerEventsFromUserOrganizations = (userOrganizations) => {
    // Browse userOrganizations
    let events = userOrganizations.map( (organization /*, index, array*/) => {
        // Browse organization events
        let newEvents = organization.events.map( (event /*, index, array*/) => {
        // on rattache l'organisation à chaque event
        // event.organization=organization
        return event
        })
    return newEvents 
    })
    // Flatten returned events
    return events.flat()
 }

// Filter criteria
const eventFilterCriteria = (event) => { 
    return (
        event.activ // === true
        // && event.eventId > 1 // test
    )
}

// Filter events
const filterEvents = (events) => {
    return events.filter ( (event /*, index, array*/) => {
        //eventFilter(event)
        // console.log(event)
        return eventFilterCriteria(event)
    })
}

export { extractOrganizerEventsFromProfile, extractOrganizerEventsFromUserOrganizations, filterEvents };