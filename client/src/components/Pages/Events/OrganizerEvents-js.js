const extractOrganizerEventsFromProfile = (organizerProfile) => {
     return extractOrganizerEventsFromUserOrganizations(organizerProfile.userOrganizations)
}
// Browse User Organizations, Organization events : return all events
const extractOrganizerEventsFromUserOrganizations = (userOrganizations) =>
{
    if (Array.isArray(userOrganizations))
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
    return undefined
 }

// Filters criterias
const eventFilterCriteria_isValidEvent = (event) =>
{ 
    return (
        // event.activ // === true
        // && event.eventId > 1 // test
        true
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
const filterValidEvents = (events) =>
{
    if (Array.isArray(events))
    {
        return events.filter ( (event /*, index, array*/) => {
            // console.log(event)
            return eventFilterCriteria_isValidEvent(event)
        })
    }
    return undefined
}

// Filters current events
const filterCurrentEvents = (events) =>
{
    if (Array.isArray(events))
    {
        return events.filter ( (event /*, index, array*/) => {
            // console.log(event)
            return eventFilterCriteria_isValidEvent && eventFilterCriteria_CurrentEvents(event)
        })
    }
    return undefined
}

// Filters ended events
const filterEndedEvents = (events) =>
{
    if (Array.isArray(events))
    {
        return events.filter ( (event /*, index, array*/) => {
            // console.log(event)
            return eventFilterCriteria_isValidEvent && eventFilterCriteria_EndedEvents(event)
        })
    }
    return undefined
}

// Filters incoming events
const filterIncomingEvents = (events) =>
{
    if (Array.isArray(events))
    {
        return events.filter ( (event /*, index, array*/) => {
            // console.log(event)
            return eventFilterCriteria_isValidEvent && eventFilterCriteria_IncomingEvents(event)
        })
    }
    return undefined
}

// Sorting

const compareEventsDates = (event1, event2) =>
{
    return event1.startDate - event2.startDate;
}

const sortEventsByDate = (events) =>
{
    if (Array.isArray(events))
    {
        return events.sort(compareEventsDates)
    }
    return undefined
}


export { extractOrganizerEventsFromProfile, extractOrganizerEventsFromUserOrganizations, filterValidEvents, filterCurrentEvents, filterEndedEvents, filterIncomingEvents, sortEventsByDate };