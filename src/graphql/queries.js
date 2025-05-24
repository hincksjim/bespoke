/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPayments = /* GraphQL */ `
  query ListPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getNotes = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getArtisanquote = /* GraphQL */ `
  query GetArtisanquote($id: ID!) {
    getArtisanquote(id: $id) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listArtisanquotes = /* GraphQL */ `
  query ListArtisanquotes(
    $filter: ModelArtisanquoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArtisanquotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Amountquoted
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      artisanID
      Position
      Firstname
      Surname
      mobile
      isactive
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listContacts = /* GraphQL */ `
  query ListContacts(
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        artisanID
        Position
        Firstname
        Surname
        mobile
        isactive
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const contactsByArtisanID = /* GraphQL */ `
  query ContactsByArtisanID(
    $artisanID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contactsByArtisanID(
      artisanID: $artisanID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        artisanID
        Position
        Firstname
        Surname
        mobile
        isactive
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getArtisan = /* GraphQL */ `
  query GetArtisan($id: ID!) {
    getArtisan(id: $id) {
      id
      Companyname
      Companyaddress
      Companypostcode
      isactive
      phone
      email
      interestedinMale
      interestedinfemale
      interestedinallgender
      interestedinrings
      interestedinnecklaces
      interestedinbraclets
      interestedinearrings
      interestedinchains
      interestedincufflinks
      interstedinaljewellrytypes
      agreedtoterms
      ipaddress
      Country
      Currency
      agreedtimestamp
      Contacts {
        items {
          id
          artisanID
          Position
          Firstname
          Surname
          mobile
          isactive
          email
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listArtisans = /* GraphQL */ `
  query ListArtisans(
    $filter: ModelArtisanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArtisans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Companyname
        Companyaddress
        Companypostcode
        isactive
        phone
        email
        interestedinMale
        interestedinfemale
        interestedinallgender
        interestedinrings
        interestedinnecklaces
        interestedinbraclets
        interestedinearrings
        interestedinchains
        interestedincufflinks
        interstedinaljewellrytypes
        agreedtoterms
        ipaddress
        Country
        Currency
        agreedtimestamp
        Contacts {
          items {
            id
            artisanID
            Position
            Firstname
            Surname
            mobile
            isactive
            email
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCreations = /* GraphQL */ `
  query GetCreations($id: ID!) {
    getCreations(id: $id) {
      id
      prompt
      costprompt
      gender
      jewellrytype
      material
      kwt
      stone
      grade
      Gemsource
      ringsize
      Style
      ringstyle
      gemsize
      cut
      url
      colour
      shape
      accepteddate
      ipaddress
      outstandingbalance
      requiredby
      Estimatecostfrom
      Estimatecostto
      lastupdate
      status
      submittedforquote
      submittedfororder
      termsaccepted
      amontquoted
      submitteddate
      clarity
      bandwidth
      Prompt_Strength
      Similarity_Strength
      seedurl
      Necklace_Length
      Bracelet_Length
      Secondary_Gemstone
      Earring_Fastening_Types
      Bracelet_Clasp_Types
      Ring_Band_Style
      Ring_Setting
      Necklace_Chain_Style
      Bracelet_Chain_Style
      Brooch_Fastening_Types
      Gem_Settings
      Necklace_Clasp
      clientID
      shared
      likes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCreations = /* GraphQL */ `
  query ListCreations(
    $filter: ModelCreationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCreations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prompt
        costprompt
        gender
        jewellrytype
        material
        kwt
        stone
        grade
        Gemsource
        ringsize
        Style
        ringstyle
        gemsize
        cut
        url
        colour
        shape
        accepteddate
        ipaddress
        outstandingbalance
        requiredby
        Estimatecostfrom
        Estimatecostto
        lastupdate
        status
        submittedforquote
        submittedfororder
        termsaccepted
        amontquoted
        submitteddate
        clarity
        bandwidth
        Prompt_Strength
        Similarity_Strength
        seedurl
        Necklace_Length
        Bracelet_Length
        Secondary_Gemstone
        Earring_Fastening_Types
        Bracelet_Clasp_Types
        Ring_Band_Style
        Ring_Setting
        Necklace_Chain_Style
        Bracelet_Chain_Style
        Brooch_Fastening_Types
        Gem_Settings
        Necklace_Clasp
        clientID
        shared
        likes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const creationsByClientID = /* GraphQL */ `
  query CreationsByClientID(
    $clientID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCreationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    creationsByClientID(
      clientID: $clientID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        prompt
        costprompt
        gender
        jewellrytype
        material
        kwt
        stone
        grade
        Gemsource
        ringsize
        Style
        ringstyle
        gemsize
        cut
        url
        colour
        shape
        accepteddate
        ipaddress
        outstandingbalance
        requiredby
        Estimatecostfrom
        Estimatecostto
        lastupdate
        status
        submittedforquote
        submittedfororder
        termsaccepted
        amontquoted
        submitteddate
        clarity
        bandwidth
        Prompt_Strength
        Similarity_Strength
        seedurl
        Necklace_Length
        Bracelet_Length
        Secondary_Gemstone
        Earring_Fastening_Types
        Bracelet_Clasp_Types
        Ring_Band_Style
        Ring_Setting
        Necklace_Chain_Style
        Bracelet_Chain_Style
        Brooch_Fastening_Types
        Gem_Settings
        Necklace_Clasp
        clientID
        shared
        likes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getClient = /* GraphQL */ `
  query GetClient($id: ID!) {
    getClient(id: $id) {
      id
      firstName
      lastName
      email
      mobile
      birthdate
      isactive
      Address1
      Address2
      City
      Postcode
      Housenumber
      updatedAt
      createdAt
      credits
      ipAddress
      Subscribed
      Role
      clientID {
        items {
          id
          prompt
          costprompt
          gender
          jewellrytype
          material
          kwt
          stone
          grade
          Gemsource
          ringsize
          Style
          ringstyle
          gemsize
          cut
          url
          colour
          shape
          accepteddate
          ipaddress
          outstandingbalance
          requiredby
          Estimatecostfrom
          Estimatecostto
          lastupdate
          status
          submittedforquote
          submittedfororder
          termsaccepted
          amontquoted
          submitteddate
          clarity
          bandwidth
          Prompt_Strength
          Similarity_Strength
          seedurl
          Necklace_Length
          Bracelet_Length
          Secondary_Gemstone
          Earring_Fastening_Types
          Bracelet_Clasp_Types
          Ring_Band_Style
          Ring_Setting
          Necklace_Chain_Style
          Bracelet_Chain_Style
          Brooch_Fastening_Types
          Gem_Settings
          Necklace_Clasp
          clientID
          shared
          likes
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      Country
      Currency
      IsArtisan
      Paywall
      __typename
    }
  }
`;
export const listClients = /* GraphQL */ `
  query ListClients(
    $filter: ModelClientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        email
        mobile
        birthdate
        isactive
        Address1
        Address2
        City
        Postcode
        Housenumber
        updatedAt
        createdAt
        credits
        ipAddress
        Subscribed
        Role
        clientID {
          items {
            id
            prompt
            costprompt
            gender
            jewellrytype
            material
            kwt
            stone
            grade
            Gemsource
            ringsize
            Style
            ringstyle
            gemsize
            cut
            url
            colour
            shape
            accepteddate
            ipaddress
            outstandingbalance
            requiredby
            Estimatecostfrom
            Estimatecostto
            lastupdate
            status
            submittedforquote
            submittedfororder
            termsaccepted
            amontquoted
            submitteddate
            clarity
            bandwidth
            Prompt_Strength
            Similarity_Strength
            seedurl
            Necklace_Length
            Bracelet_Length
            Secondary_Gemstone
            Earring_Fastening_Types
            Bracelet_Clasp_Types
            Ring_Band_Style
            Ring_Setting
            Necklace_Chain_Style
            Bracelet_Chain_Style
            Brooch_Fastening_Types
            Gem_Settings
            Necklace_Clasp
            clientID
            shared
            likes
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        Country
        Currency
        IsArtisan
        Paywall
        __typename
      }
      nextToken
      __typename
    }
  }
`;
