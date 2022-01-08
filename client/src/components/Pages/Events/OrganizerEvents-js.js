const extractOrganizerEventsFromProfile = (organizerProfile) => {
     return extractOrganizerEventsFromUserOrganizations(organizerProfile.userOrganizations)
}
// Browse User Organizations, Organization events : return all events
const extractOrganizerEventsFromUserOrganizations = (userOrganizations) =>
{
    // Browse userOrganizations
    let events = userOrganizations.map( (organization /*, index, array*/) =>
    {
        // Browse organization events
        let newEvents = organization.events.map( (event /*, index, array*/) =>
        {
        // on rattache l'organisation à chaque event
        // event.organization=organization
        return event
        })
    return newEvents 
    })
    // Flatten returned events
    return events.flat()
 }

// Filters criterias
const eventFilterCriteria_Activ = (event) =>
{ 
    return (
        event.activ // === true
        // && event.eventId > 1 // test
    )
}

const eventFilterCriteria_CurrentEvents = (event) =>
{ 
    return (
        event.started // started
        &&
        ! event.ended // NOT ended
    )
}

const eventFilterCriteria_EndedEvents = (event) =>
{ 
    return (
        event.started // started
        &&
        event.ended // ended
    )
}

const eventFilterCriteria_IncomingEvents = (event) =>
{ 
    return (
        ! event.started // NOT started
        &&
        ! event.ended // NOT ended
        // && event.eventId > 1 // test
    )
}

// Events filters

// Basic filter, eliminates inactiv events
const filterActivEvents = (events) =>
{
    return events.filter ( (event /*, index, array*/) => {
        // console.log(event)
        return eventFilterCriteria_Activ(event)
    })
}

// Filters current events
const filterCurrentEvents = (events) =>
{
    return events.filter ( (event /*, index, array*/) => {
        // console.log(event)
        return eventFilterCriteria_CurrentEvents(event)
    })
}

// Filters ended events
const filterEndedEvents = (events) =>
{
    return events.filter ( (event /*, index, array*/) => {
        // console.log(event)
        return eventFilterCriteria_EndedEvents(event)
    })
}

// Filters incoming events
const filterIncomingEvents = (events) =>
{
    return events.filter ( (event /*, index, array*/) => {
        // console.log(event)
        return eventFilterCriteria_IncomingEvents(event)
    })
}

// Sorting

const compareEventsDates = (event1, event2) =>
{
    return event1.startDate - event2.startDate;
}

const sortEventsByDate = (events) =>
{
    return events.sort(compareEventsDates)
}


export { extractOrganizerEventsFromProfile, extractOrganizerEventsFromUserOrganizations, filterActivEvents, filterCurrentEvents, filterEndedEvents, filterIncomingEvents, sortEventsByDate };