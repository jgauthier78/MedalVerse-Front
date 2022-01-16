# Introduction

MedalVerse se base sur la blockchain pour la représentation interne de ses structures, ces denières ne seraient peut-être pas toutes sous forme de contrat dans un projet en production, mais le temps et la praticité nous amènent à prendre ces raccourcis.

Structures Internes
MedalVerse


## Contrat Principal

Référençant les contrats ci-dessous, ayant un accès spécifique en création et accès aux données

```
MedalVerse{
[User] Users       // List of Users by address
[Author] Authors // Lis of registered Authors by address
[Event] Events   // List of sports Events

// Only For MedalVerse Owner
AddUser( address )
AddAuthors( address )

// Opened to Organizers
AddEvent( Organizer, Event )

// Opened to anyone:
getUserList( address)
getEventList(SportsType)
}
```

## User


Utilisateur de la plateforme, structure générique d’identification, contenant une icone permettant une représentation graphique. L’accès à la structure se fait par l’adresse.

```
User
{
   username,     // username unicity is handled by JS
   Icon,         // URL for displayin user in the UI
   userAddress,  // Registered user addr
   role          // Role in the DAPP (Event, Author, Etc)
}
createUser( nom utilisateur, URL, userAddress)
```


## Author

Un author est un utilisateur de la plateforme qui propose des NFTs via la marketPlace MedalVerse

```
Author is User
{
	[MP_Medal] AuthorOf
}
```

ou MP_Medal est une entrée de la marketPlace

 
## MP_Medal

```
MP_Medal is NFTMedal
{
    price,	// price to sell the NFT
    activ,	// should be displayed in the Store
    [User] BoughtBy, // Used by these authors    
}
```

## Organizer

est un User qui organise des évènements sportifs

```
Organizer is User
{
    [SportsCategory] sports // Running, swimming, etc..
    [SportEvent] organizedEvents // List of events
    [MP_Medal] listOfMedal // List of medals bought by organizer, used + available medals
}
```

## SportEvent


Un événement sportif organisé par un organisateur, auquel un Sportif vient s’inscrire

```
SportEvent
{
   startDate,
   endDate,
    activ,
    [SportCategory] sports,
    [SportsMan] participants
}
```

getListOfParticipants()
addParticipant( SportsMan )


## SportsMan

Un sportif est un utilisateur qui participe à des événements, et a une liste de sports de préférence.

```
SportsMan is User
{
    [SportsCategory] sports	// List of sports 
    [SportEvent] registerdTo 	// List of Events the sportsman is registered to
    [MedalNFT] Gallery     // List of Medals to show through the gallery
    [MedalNFT] NFTs   // List of NFT Medals owned by the SportsMan
}
```
